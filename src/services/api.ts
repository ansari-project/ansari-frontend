import { TokenRefreshError } from '@/errors'
import { loadAuthState, refreshTokens } from '@/store'
import { resetAuth } from '@/store/slices/authSlice'
import { RefreshTokenResponse } from '@/types'
import { Dispatch, UnknownAction } from 'redux'

// TypeScript types for better code understanding and safety
// eslint-disable-next-line no-undef
interface CustomFetchOptions extends RequestInit {
  skipRefresh?: boolean // Custom option to skip refresh logic
}

// Updated function to refresh token based on the provided API endpoint, and return new access token
async function refreshToken(dispatch: Dispatch<UnknownAction>): Promise<string> {
  const API_URL = process.env.EXPO_PUBLIC_API_V2_URL
  const refreshTokenURL = `${API_URL}/users/refresh_token`
  const authState = await loadAuthState()
  const refreshToken = authState.auth?.refreshToken

  const response = await fetch(refreshTokenURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Mobile-Ansari': 'ANSARI',
      Authorization: `Bearer ${refreshToken}`, // Uncomment if your API requires the expired token
    },
  })

  if (!response.ok) {
    dispatch(resetAuth())
    throw new TokenRefreshError()
  }

  const data = (await response.json()) as RefreshTokenResponse
  if (dispatch) {
    dispatch(refreshTokens(data))
  }
  if (data.status !== 'success') {
    dispatch(resetAuth())
    throw new TokenRefreshError('Token refresh failed: ' + data.status)
  }
  return data.access_token
}

// The Fetch API Interceptor remains largely the same
export async function fetchWithAuthRetry(
  url: string,
  options: CustomFetchOptions = {},
  dispatch: Dispatch<UnknownAction>,
): Promise<Response> {
  const response = await fetch(url, options)

  // If not 401 or we've already tried refreshing the token, return the original response
  if (response.status !== 401 || options.skipRefresh) {
    return response
  }

  try {
    // Attempt to refresh the token
    const newAccessToken = await refreshToken(dispatch)
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

// Usage example:
// fetchWithAuthRetry('https://api.example.com/protected-resource')
//   .then((response) => {
//     if (!response.ok) {
//       console.error('Request failed after retry:', response.statusText)
//       // Handle failure
//     } else {
//       console.log('Request succeeded after token refresh')
//       // Process successful response
//     }
//   })
//   .catch((error) => console.error('Network or token refresh error:', error))
