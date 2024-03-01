import { CryptoService } from '@endeavorpal/services'
import { Error, User } from '@endeavorpal/types'
import { createSlice } from '@reduxjs/toolkit'
import { login, setAuthState } from '../actions/authActions'

export interface AuthState {
  loading: boolean
  isAuthenticated: boolean
  token: string | null
  user: User | null
  message: string | null
  status: string | null
  error: string | null
}

const initialState: AuthState = {
  loading: false,
  isAuthenticated: false, // Flag to indicate if the user is authenticated
  token: null, // Token for authentication, null when not authenticated
  user: null, // User information, null when not authenticated
  message: null,
  status: null,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated
      state.token = action.payload.token
      state.user = action.payload.user
      state.message = action.payload.message
      state.status = action.payload.status
      state.error = action.payload.error
    },
    // ... other reducers ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        return { ...state, loading: true, error: null }
      })
      .addCase(login.fulfilled, (state, action) => {
        const newState = {
          ...state,
          isAuthenticated: true,
          token: action.payload.token,
          user: action.payload.user,
          message: action.payload.message,
          status: action.payload.status,
          loading: false,
        }
        saveAuthStateToLocalStorage({ ...newState })
        return newState
      })
      .addCase(login.rejected, (state, action) => {
        const newState = {
          ...state,
          isAuthenticated: false,
          user: null,
          token: null,
          message: null,
          status: null,
          loading: false,
          error: (action.payload as Error).message,
        }
        saveAuthStateToLocalStorage(newState)
        return newState
      })
      .addCase(setAuthState, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated
        state.token = action.payload.token
        state.user = action.payload.user
        state.message = action.payload.message
        state.status = action.payload.status
        state.error = action.payload.error
      })
      .addMatcher(
        (action) => action.type.startsWith('auth/logout'),
        () => {
          const newState = {
            ...initialState,
            loading: false, // Preserve any other state properties you don't want to reset
          }
          saveAuthStateToLocalStorage(newState)
          return newState
        },
      )
  },
})

// Function to save the current state to local storage securely
function saveAuthStateToLocalStorage(state: AuthState) {
  CryptoService.encryptData(state)
    .then((encryptedData) => {
      const encryptedDataArray = Array.from(new Uint8Array(encryptedData)) // Convert Uint8Array to array
      const encryptedDataString = String.fromCharCode.apply(null, encryptedDataArray) // Convert array to string
      localStorage.setItem('authState', encryptedDataString)
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
      const encryptedData = localStorage.getItem('authState')
      if (!encryptedData) {
        resolve(initialState)
      } else {
        try {
          const encryptedDataArray = Array.from(encryptedData).map((char) => char.charCodeAt(0)) // Convert string to array of char codes
          const encryptedDataBuffer = new Uint8Array(encryptedDataArray).buffer // Convert array to ArrayBuffer
          const authState = await CryptoService.decryptData(encryptedDataBuffer) // Wait for the Promise to resolve
          resolve(authState as AuthState) // Explicitly cast the resolved value as AuthState
        } catch (error) {
          console.error('Error decrypting data:', error)
          resolve(initialState)
        }
      }
    })()
  })

  return { auth: await loadedAuthState } as Partial<{
    auth: AuthState
  }>
}

export const clearAuthStateFromLocalStorage = () => {
  localStorage.removeItem('authState')
}

export default authSlice.reducer
