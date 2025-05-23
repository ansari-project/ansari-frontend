/* eslint-disable camelcase */
import { fetch, FetchRequestInit } from 'expo/fetch'
import { TokenRefreshError } from '@/errors'
import { LoginRequest, LoginResponse, RefreshTokenResponse, RegisterRequest, RegisterResponse } from '@/types'
import StorageService from './StorageService'
import { FetchResponse } from 'expo/build/winter/fetch/FetchResponse'

interface CustomFetchOptions extends FetchRequestInit {
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
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || error.error || error.message || 'Login failed')
    }

    const res = (await response.json()) as LoginResponse
    if (!data.guest) {
      await this.storageService.saveTokens(res.access_token, res.refresh_token)
    }

    return res
  }

  async refreshAccessToken(
    resetAuthCallback: () => void,
    refreshTokensCallback: (tokens: RefreshTokenResponse) => void,
  ): Promise<string> {
    const refreshToken = await this.storageService.getRefreshToken()
    const response = await fetch(`${this.baseURL}/users/refresh_token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      await this.storageService.removeTokens()
      resetAuthCallback()

      throw new TokenRefreshError()
    }

    const data = (await response.json()) as RefreshTokenResponse

    if (data.status !== 'success') {
      resetAuthCallback()
      throw new TokenRefreshError('Token refresh failed: ' + data.status)
    }

    await this.storageService.saveTokens(data.access_token, data.refresh_token)
    refreshTokensCallback(data)

    return data.access_token
  }

  async fetchWithAuthRetry(
    url: string,
    options: CustomFetchOptions = {},
    resetAuthCallback: () => void,
    refreshTokensCallback: (tokens: RefreshTokenResponse) => void,
  ): Promise<FetchResponse> {
    const response = await fetch(url, options)
    // If not 401 or we've already tried refreshing the token, return the original response
    if (response.status !== 401 || options.skipRefresh) {
      return response
    }

    try {
      // Attempt to refresh the token
      const newAccessToken = await this.refreshAccessToken(resetAuthCallback, refreshTokensCallback)
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
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      // Handle HTTP errors
      console.error(`HTTP error! status: ${response.status}`)
    } else {
      // console.log(`Response is ${response}`)
    }

    await this.storageService.removeTokens()
  }

  async deleteAccount(accessToken: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/users/me`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      // Handle HTTP errors
      console.error(`HTTP error! status: ${response.status}`)
      throw new Error('Failed to delete account')
    }

    await this.storageService.removeTokens()
  }

  async checkAppVersion(
    platform: string,
    applicationVersion: string,
    buildVersion: string,
  ): Promise<{
    maintenance_mode: boolean
    update_available: boolean
    force_update_required: boolean
  }> {
    try {
      const response = await fetch(`${this.baseURL}/app-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          native_application_version: applicationVersion,
          native_build_version: buildVersion,
          platform: platform,
        }),
      })

      if (!response.ok) {
        console.error(`App version check failed with status: ${response.status}`)
        // Return default values if the check fails
        return {
          maintenance_mode: false,
          update_available: false,
          force_update_required: false,
        }
      }

      return await response.json()
    } catch (error) {
      console.error('App version check error:', error)
      // Return default values on error
      return {
        maintenance_mode: false,
        update_available: false,
        force_update_required: false,
      }
    }
  }
}

export default ApiService
