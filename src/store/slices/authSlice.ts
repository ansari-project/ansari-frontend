import { createSlice } from '@reduxjs/toolkit'
import { Error, User } from 'types'
import { login, logout } from '../actions/authActions'

interface AuthState {
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
        state.token = action.payload.token
        state.user = action.payload.user
        state.message = action.payload.message
        state.status = action.payload.status
        state.loading = false
        saveAuthStateToLocalStorage(state)
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.message = null
        state.status = null
        state.loading = false
        state.error = (action.payload as Error).message
        saveAuthStateToLocalStorage(state)
      })
      .addCase(logout, () => {
        // Reset state to initial state on logout
        saveAuthStateToLocalStorage(initialState)
        return initialState
      })
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

// Function to save the current state to local storage
function saveAuthStateToLocalStorage(state: AuthState) {
  const base64Data = encodeBase64(state)
  localStorage.setItem('authState', base64Data)
}

// Function to load the state from local storage
export function loadAuthStateFromLocalStorage() {
  const base64Data = localStorage.getItem('authState')
  if (base64Data) {
    const authState = decodeBase64(base64Data)
    return authState
  }
  return initialState
}

export default authSlice.reducer
