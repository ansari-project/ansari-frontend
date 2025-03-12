import { RefreshTokenResponse, User } from '@/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { guestLogin, login } from '../actions/authActions'
import ApiService from '@/services/ApiService'

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

      return state
    },
    resetAuth(state) {
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
        return newState
      })
      .addCase(login.rejected, (state, action) => {
        const newState = {
          ...initialAuthState,
          error: action.payload ? action.payload.message : 'Login failed',
        }
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
        return newState
      })
      .addCase(guestLogin.rejected, (state, action) => {
        const newState = {
          ...initialAuthState,
          error: action.payload ? action.payload.message : 'Guest login failed',
        }
        return newState
      })
      .addMatcher(
        (action) => action.type.startsWith('auth/logout'),
        (state) => {
          return initialAuthState
        },
      )
  },
})

export async function loadAuthState() {
  const createAuthState = (auth: AuthState) => {
    return { auth } as Partial<{
      auth: AuthState
    }>
  }

  const apiService = new ApiService()
  const baseURL = process.env.EXPO_PUBLIC_API_V2_URL
  let accessToken = await apiService.getAccessTokenFromStorage()
  let refreshToken = await apiService.getRefreshTokenFromStorage()

  if (!accessToken || !refreshToken) {
    return createAuthState(initialAuthState)
  }

  const userRes = await apiService.fetchWithAuthRetry(
    `${baseURL}/users/me`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    () => {
      accessToken = refreshToken = null
    },
    (tokens: RefreshTokenResponse) => {
      accessToken = tokens.access_token
      refreshToken = tokens.refresh_token
    },
  )

  if (!userRes.ok) {
    return createAuthState(initialAuthState)
  }

  const userDetails = await userRes.json()

  const userState = {
    ...initialAuthState,
    isAuthenticated: true,
    isGuest: false,
    accessToken: accessToken,
    refreshToken: refreshToken,
    user: {
      id: userDetails.user_id,
      firstName: userDetails.first_name,
      lastName: userDetails.last_name,
      email: userDetails.email,
    },
  }

  return createAuthState(userState)
}

/**
 * Actions for authSlice.
 * @remarks
 * This module contains actions for managing auth state.
 */
export const { refreshTokens, resetAuth } = authSlice.actions
export default authSlice.reducer
