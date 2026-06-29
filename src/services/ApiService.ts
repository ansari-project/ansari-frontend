import { fetch, FetchRequestInit } from 'expo/fetch'
import { TokenRefreshError } from '@/errors'
import { LoginRequest, LoginResponse, RefreshTokenResponse, RegisterRequest, RegisterResponse } from '@/types'
import StorageService from './StorageService'
import { FetchResponse } from 'expo/build/winter/fetch/FetchResponse'

interface CustomFetchOptions extends FetchRequestInit {
  skipRefresh?: boolean // Custom option to skip refresh logic
}

// Single-flight token refresh, shared across ALL ApiService instances.
//
// Every request flows through its own `new ApiService()` (see ChatService,
// chatActions and authActions), so this MUST live at module scope — an instance
// field would not dedupe concurrent 401s originating from different instances.
//
// The backend rotates the refresh token on every refresh, so without dedup the
// concurrent refreshes each present (and thereby invalidate) the same token:
// the first succeeds, the rest get 401 "Refresh token not found" and the app
// logs the user out. Holding a single in-flight promise makes all concurrent
// 401s await the one refresh and retry with its result. It is cleared once
// settled so the next expiry cycle starts a fresh refresh.
//
// The promise resolves to the refresh response itself (not just the token) so
// each awaiting caller can apply its OWN callback to the shared result, rather
// than only the caller that happened to start the refresh.
let refreshTokenPromise: Promise<RefreshTokenResponse> | null = null

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

  /**
   * Performs the actual token refresh network call and persists the new tokens.
   * Holds no caller-specific state (no auth callbacks) so it can be safely shared
   * by {@link refreshAccessTokenDeduped} across concurrent callers. Throws
   * {@link TokenRefreshError} on failure; callers decide how to react.
   */
  async refreshAccessToken(): Promise<RefreshTokenResponse> {
    const refreshToken = await this.storageService.getRefreshToken()
    const response = await fetch(`${this.baseURL}/users/refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      await this.storageService.removeTokens()

      throw new TokenRefreshError()
    }

    const data = (await response.json()) as RefreshTokenResponse

    if (data.status !== 'success') {
      throw new TokenRefreshError('Token refresh failed: ' + data.status)
    }

    await this.storageService.saveTokens(data.access_token, data.refresh_token)

    return data
  }

  /**
   * Single-flight wrapper around {@link refreshAccessToken}. Concurrent callers
   * share one in-flight refresh instead of each hitting /users/refresh_token,
   * which would invalidate the rotating refresh token for the others. Each
   * caller still applies its OWN callbacks to the shared result, so heterogeneous
   * callers (e.g. Redux dispatch vs. loadAuthState mutating locals) all update
   * their state — not just the caller that started the refresh.
   */
  async refreshAccessTokenDeduped(
    resetAuthCallback: () => void,
    refreshTokensCallback: (tokens: RefreshTokenResponse) => void,
  ): Promise<string> {
    if (!refreshTokenPromise) {
      refreshTokenPromise = this.refreshAccessToken().finally(() => {
        refreshTokenPromise = null
      })
    }

    try {
      const tokens = await refreshTokenPromise
      refreshTokensCallback(tokens)

      return tokens.access_token
    } catch (error) {
      resetAuthCallback()

      throw error
    }
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
      // Attempt to refresh the token (single-flight: concurrent 401s share one refresh)
      const newAccessToken = await this.refreshAccessTokenDeduped(resetAuthCallback, refreshTokensCallback)
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
      return response // You might choose to return the original 401 response or handle differently
    }
  }

  async logout(accessToken: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/users/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
}

export default ApiService
