import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { LoginRequest, User } from 'types'
import AuthService from '../../services/authService'

// Define the structure of the payload returned on successful login
interface LoginSuccessPayload {
  status: string
  message: string
  token: string
  user: User
}

// Define the structure of the payload returned on login failure
interface LoginFailurePayload {
  message: string
}

export const login = createAsyncThunk<LoginSuccessPayload, LoginRequest, { rejectValue: LoginFailurePayload }>(
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

export const logout = createAction('auth/logout')
