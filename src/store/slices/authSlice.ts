import { User } from '@endeavorpal/types'
import { createSlice } from '@reduxjs/toolkit'
import { guestLogin, login } from '../actions/authActions'

export interface AuthState {
  loading: boolean
  isAuthenticated: boolean
  isGuest: boolean
  token: string | null
  user: User | null
  message: string | null
  status: string | null
  error: string | null
}

const initialState: AuthState = {
  loading: false,
  isAuthenticated: false, // Flag to indicate if the user is authenticated
  isGuest: false, // Flag to indicate if the current session is a guest session
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
    // ... other reducers ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isGuest = false // Ensure isGuest is set to false on regular login
        state.token = action.payload.token
        state.user = action.payload.user
        state.message = action.payload.message
        state.status = action.payload.status
        state.loading = false
        saveAuthState({ ...state })
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false
        state.isGuest = false // Ensure isGuest is reset even on failed login attempt
        state.user = null
        state.token = null
        state.message = null
        state.status = null
        state.loading = false
        // state.error = (action.payload as Error).message
        state.error = action.payload ? action.payload.message : 'Login failed'
        saveAuthState({ ...state })
      })
      .addCase(guestLogin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(guestLogin.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.isGuest = true // Set isGuest to true on successful guest login
        state.token = action.payload.token
        state.user = action.payload.user
        state.message = action.payload.message
        state.status = action.payload.status
        state.loading = false
        saveAuthState({ ...state })
      })
      .addCase(guestLogin.rejected, (state, action) => {
        state.isAuthenticated = false
        state.isGuest = false // Ensure isGuest is reset on failed guest login attempt
        state.loading = false
        state.error = action.payload ? action.payload.message : 'Guest login failed'
        saveAuthState({ ...state })
      })
      .addMatcher(
        (action) => action.type.startsWith('auth/logout'),
        (state) => {
          state.isAuthenticated = false
          state.user = null
          state.token = null
          state.message = null
          state.status = null
          state.loading = false
          state.error = null
          saveAuthState({ ...state })
        },
      )
  },
})

// Function to encode the authState data using Base64
function encodeBase64(authState: AuthState) {
  const jsonData = JSON.stringify(authState)
  const base64Data = btoa(jsonData)
  return base64Data
}

// Function to decode the Base64 encoded authState data
function decodeBase64(base64Data: string) {
  const jsonData = atob(base64Data)
  const authState = JSON.parse(jsonData)
  return authState
}

// Function to save the current state to the appropriate storage
function saveAuthState(state: AuthState) {
  const base64Data = encodeBase64(state)
  if (state.isGuest) {
    // For guest users, save the state to session storage
    sessionStorage.setItem('authStateG', base64Data)
  } else {
    // For regular users, save the state to local storage
    localStorage.setItem('authState', base64Data)
  }
}

// Function to load the state from storage
export function loadAuthState() {
  // Try to load from session storage first
  let base64Data = sessionStorage.getItem('authStateG')

  // If not found in session storage, try local storage
  if (!base64Data) {
    base64Data = localStorage.getItem('authState')
  }

  if (base64Data) {
    return decodeBase64(base64Data)
  }
  return initialState
}

// Helper to clear state from both storages
export const clearAuthState = () => {
  localStorage.removeItem('authState')
  sessionStorage.removeItem('authStateG')
}

export default authSlice.reducer
