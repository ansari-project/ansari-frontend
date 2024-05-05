import AuthService from '@endeavorpal/services/AuthService'
import { LoginRequest, RegisterRequest, RegisterResponse, User } from '@endeavorpal/types'
import { createAsyncThunk, createAction } from '@reduxjs/toolkit'
import { AuthState } from '../slices'
import { Helpers } from '@endeavorpal/utils'

// Define the structure of the payload returned on successful login
interface LoginSuccessPayload {
  guest: boolean
  status: string
  message: string
  token: string
  refreshToken?: string
  user: User
}

// Extend the existing types with the guest login payload
interface GuestLoginSuccessPayload {
  status: string
  message: string
  token: string
  refreshToken?: string
  user: User
}

// Define the structure of the payload returned on failure
interface FailurePayload {
  message: string
}

export const register = createAsyncThunk<RegisterResponse, RegisterRequest, { rejectValue: FailurePayload }>(
  'auth/register',
  async (registerData: RegisterRequest, { rejectWithValue }) => {
    try {
      const authService = new AuthService()
      const response = await authService.register(registerData)
      if (response.status === 'success') {
        return response as RegisterResponse
      } else {
        // This will be caught in the 'rejected' action
        return rejectWithValue({ message: response.message || 'Registration failed' })
      }
    } catch (error: unknown) {
      // This will be caught in the 'rejected' action
      const message = (error instanceof Error && error.message) || 'Registration failed'
      return rejectWithValue({ message: message })
    }
  },
)

export const login = createAsyncThunk<LoginSuccessPayload, LoginRequest, { rejectValue: FailurePayload }>(
  'auth/login',
  async (loginData: LoginRequest, { rejectWithValue }) => {
    try {
      const authService = new AuthService()
      const response = await authService.login(loginData)
      if (response.access_token) {
        const user: User = {
          firstName: response.first_name || '',
          lastName: response.last_name || '',
          email: loginData.email || '',
        }

        return {
          guest: loginData.guest || false,
          status: response.status || '',
          message: response.message || '',
          token: response.access_token,
          refreshToken: response.refresh_token,
          user,
        }
      } else {
        // This will be caught in the 'rejected' action
        return rejectWithValue({ message: response.message || 'Login failed' })
      }
    } catch (error) {
      // This will be caught in the 'rejected' action
      return rejectWithValue({ message: 'Login failed' })
    }
  },
)

export const logout = createAsyncThunk<void, string, { rejectValue: FailurePayload }>(
  'auth/logout',
  async (token: string, { rejectWithValue }) => {
    try {
      const authService = new AuthService()
      await authService.logout(token)
    } catch (error) {
      const message = (error instanceof Error && error.message) || 'Logout failed'
      return rejectWithValue({ message: message })
    }
  },
)

/**
 * Async thunk for guest login.
 * This function generates guest credentials, registers the guest, and logs them in.
 */
export const guestLogin = createAsyncThunk<GuestLoginSuccessPayload, undefined, { rejectValue: FailurePayload }>(
  'auth/guestLogin',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      // Generate guest credentials
      const { email, password } = Helpers.generateGuestCredentials()

      // Prepare registration and login data
      const registerRequest: RegisterRequest = {
        email: email,
        password: password,
        // eslint-disable-next-line camelcase
        first_name: 'Welcome',
        // eslint-disable-next-line camelcase
        last_name: 'Guest',
        // eslint-disable-next-line camelcase
        register_to_mail_list: false,
      }
      const loginData: LoginRequest = { email, password, guest: true }

      // Register the guest user
      const registerResponse = await dispatch(register(registerRequest)).unwrap()

      if (registerResponse.status === 'success') {
        // Upon successful registration, log the guest user in
        const loginResponse = await dispatch(login(loginData)).unwrap()

        return loginResponse
      } else {
        return rejectWithValue({ message: 'Guest registration failed' })
      }
    } catch (error) {
      // Handle errors for both registration and login
      const message = (error instanceof Error && error.message) || 'Guest login failed'
      return rejectWithValue({ message })
    }
  },
)

// Create a regular action for setting the auth state
export const setAuthState = createAction<AuthState>('auth/setAuthState')
