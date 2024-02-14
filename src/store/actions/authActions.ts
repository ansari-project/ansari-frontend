import { createAsyncThunk } from '@reduxjs/toolkit'
import { LoginRequest, RegisterRequest, RegisterResponse, User } from '../../types'
import AuthService from '../../services/authService'

// Define the structure of the payload returned on successful login
interface LoginSuccessPayload {
  status: string
  message: string
  token: string
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
      const response = await AuthService.register(registerData)
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
      const response = await AuthService.login(loginData)
      if (response.token) {
        const user: User = {
          firstName: response.first_name || '',
          lastName: response.last_name || '',
          email: loginData.email || '',
        }

        return {
          status: response.status || '',
          message: response.message || '',
          token: response.token,
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
      await AuthService.logout(token)
    } catch (error) {
      const message = (error instanceof Error && error.message) || 'Logout failed'
      return rejectWithValue({ message: message })
    }
  },
)
