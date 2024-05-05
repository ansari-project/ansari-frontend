import { CryptoService } from '@endeavorpal/services'
import { RefreshTokenResponse, User } from '@endeavorpal/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { guestLogin, login } from '../actions/authActions'

export interface AuthState {
  loading: boolean
  isAuthenticated: boolean
  isGuest: boolean
  accessToken: string | null
  refreshToken?: string | null
  user: User | null
  message: string | null
  status: string | null
  error: string | null
}

const initialAuthState: AuthState = {
  loading: false,
  isAuthenticated: false, // Flag to indicate if the user is authenticated
  isGuest: false, // Flag to indicate if the current session is a guest session
  accessToken: null, // Token for authentication, null when not authenticated
  refreshToken: null, // RefreshToken for authentication, null when not authenticated
  user: null, // User information, null when not authenticated
  message: null,
  status: null,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setAuthState: (state, action) => {
      const newState = {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        user: action.payload.user,
        message: action.payload.message,
        status: action.payload.status,
        error: action.payload.error,
      }
      return newState
    },
    /**
     * Refresh user token state.
     * @param state - The current chat state.
     * @param action - The Redux action containing the payload of type refreshTokenResponse.
     */
    refreshTokens(state, action: PayloadAction<RefreshTokenResponse>) {
      state.accessToken = action.payload.access_token
      state.refreshToken = action.payload.refresh_token
      saveAuthState({ ...state })

      return state
    },
    resetAuth(state) {
      saveAuthState({ ...initialAuthState }, state.isGuest)
      return initialAuthState
    },
    // ... other reducers ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        const newState = {
          ...state,
          loading: true,
          error: null,
        }
        return newState
      })
      .addCase(login.fulfilled, (state, action) => {
        const newState = {
          ...state,
          isAuthenticated: true,
          isGuest: action.payload.guest || false, // Ensure isGuest is set to false on regular login
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
          user: action.payload.user,
          message: action.payload.message,
          status: action.payload.status,
        }
        saveAuthState({ ...newState }, newState.isGuest)
        return newState
      })
      .addCase(login.rejected, (state, action) => {
        const newState = {
          ...initialAuthState,
          error: action.payload ? action.payload.message : 'Login failed',
        }
        saveAuthState({ ...newState }, false)
        return newState
      })
      .addCase(guestLogin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(guestLogin.fulfilled, (state, action) => {
        const newState = {
          ...state,
          isAuthenticated: true,
          isGuest: true, // Set isGuest to true on successful guest login
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
          user: action.payload.user,
          message: action.payload.message,
          status: action.payload.status,
        }
        saveAuthState({ ...newState }, true)
        return newState
      })
      .addCase(guestLogin.rejected, (state, action) => {
        const newState = {
          ...initialAuthState,
          error: action.payload ? action.payload.message : 'Guest login failed',
        }
        saveAuthState({ ...newState }, true)
        return newState
      })
      .addMatcher(
        (action) => action.type.startsWith('auth/logout'),
        (state) => {
          saveAuthState({ ...initialAuthState }, state.isGuest)
          return initialAuthState
        },
      )
  },
})

// Function to save the current state to local storage securely
function saveAuthState(state: AuthState, isGuest: boolean = false) {
  const stateAsString = JSON.stringify(state)

  CryptoService.encryptData(stateAsString)
    .then((encryptedData) => {
      const encryptedDataArray = Array.from(new Uint8Array(encryptedData)) // Convert Uint8Array to array
      const encryptedDataString = String.fromCharCode.apply(null, encryptedDataArray) // Convert array to string

      if (isGuest) {
        sessionStorage.setItem('auG', encryptedDataString)
      } else {
        localStorage.setItem('au', encryptedDataString)
      }
    })
    .catch((error) => {
      console.error('Error encrypting data:', error)
    })
}

// Function to load the state from local storage securely
export async function loadAuthState() {
  const loadedAuthState = new Promise<AuthState>((resolve) => {
    // eslint-disable-next-line no-extra-semi
    ;(async () => {
      let encryptedData = sessionStorage.getItem('auG')
      if (!encryptedData) {
        encryptedData = localStorage.getItem('au')
      }
      if (!encryptedData) {
        resolve(initialAuthState)
      } else {
        try {
          const encryptedDataArray = Array.from(encryptedData).map((char) => char.charCodeAt(0)) // Convert string to array of char codes
          const encryptedDataBuffer = new Uint8Array(encryptedDataArray).buffer // Convert array to ArrayBuffer
          const authState = await CryptoService.decryptData(encryptedDataBuffer) // Wait for the Promise to resolve

          resolve(authState as AuthState) // Explicitly cast the resolved value as AuthState
        } catch (error) {
          console.error('Error decrypting data:', error)
          resolve(initialAuthState)
        }
      }
    })()
  })

  return { auth: await loadedAuthState } as Partial<{
    auth: AuthState
  }>
}

// Helper to clear state from both storages
export const clearAuthState = () => {
  localStorage.removeItem('au')
  sessionStorage.removeItem('auG')
}

/**
 * Actions for authSlice.
 * @remarks
 * This module contains actions for managing auth state.
 */
export const { refreshTokens, resetAuth } = authSlice.actions
export default authSlice.reducer
