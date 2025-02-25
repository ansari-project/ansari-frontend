import { TokenRefreshError } from '@/errors'
import { LoginRequest, LoginResponse, RefreshTokenResponse, RegisterRequest, RegisterResponse } from '@/types'
import StorageService from './StorageService'
import { refreshTokens } from '@/store'
import { resetAuth } from '@/store/slices/authSlice'
import { Dispatch, UnknownAction } from 'redux'

interface CustomFetchOptions extends RequestInit {
  skipRefresh?: boolean // Custom option to skip refresh logic
}

class ApiService {
  baseURL: string | undefined
  storageService: StorageService

  constructor() {
    this.baseURL = process.env.EXPO_PUBLIC_API_V2_URL
    this.storageService = new StorageService()
  }

  async getAccessTokenFromStorage(): Promise<string | null> {
    return await this.storageService.getAccessToken()
  }

  async getRefreshTokenFromStorage(): Promise<string | null> {
    return await this.storageService.getRefreshToken()
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${this.baseURL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Mobile-Ansari': 'ANSARI',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || error.error || error.message || 'Registration failed')
    }

    return await response.json()
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-mobile-ansari': 'ANSARI',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const res = (await response.json()) as LoginResponse
    if (!data.guest) {
      await this.storageService.saveTokens(res.access_token, res.refresh_token)
    }

    return res
  }

  async refreshAccessToken(dispatch?: Dispatch<UnknownAction>): Promise<string> {
    const refreshToken = await this.storageService.getRefreshToken()
    const response = await fetch(`${this.baseURL}/users/refresh_token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        'x-mobile-ansari': 'ANSARI',
      },
    })

    if (!response.ok) {
      await this.storageService.removeTokens()
      if (dispatch) dispatch(resetAuth())

      throw new TokenRefreshError()
    }

    const data = (await response.json()) as RefreshTokenResponse
    if (dispatch) {
      dispatch(refreshTokens(data))
    }
    if (data.status !== 'success') {
      if (dispatch) dispatch(resetAuth())
      throw new TokenRefreshError('Token refresh failed: ' + data.status)
    }

    return data.access_token
  }

  async fetchWithAuthRetry(
    url: string,
    options: CustomFetchOptions = {},
    dispatch?: Dispatch<UnknownAction>,
  ): Promise<Response> {
    const response = await fetch(url, options)

    // If not 401 or we've already tried refreshing the token, return the original response
    if (response.status !== 401 || options.skipRefresh) {
      return response
    }

    try {
      // Attempt to refresh the token
      const newAccessToken = await this.refreshAccessToken(dispatch)
      // Store the new token as needed, e.g., in localStorage or state management

      // Retry the original request with the new token
      const newOptions = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`, // Update with how your API expects the token
        },
        skipRefresh: true, // Prevent further refresh attempts
      }

      return fetch(url, newOptions) // Retry the fetch with the new token
    } catch (error) {
      // If token refresh fails, throw or handle as needed
      console.error('Refresh token failed:', error)
      return response // You might choose to return the original 403 response or handle differently
    }
  }

  async logout(accessToken: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/users/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-mobile-ansari': 'ANSARI',
      },
    })

    if (!response.ok) {
      // Handle HTTP errors
      console.error(`HTTP error! status: ${response.status}`)
    } else {
      // console.log(`Response is ${response}`)
    }

    await this.storageService.removeTokens()
  }
}

export default ApiService
