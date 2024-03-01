import { TokenRefreshError } from '@endeavorpal/errors'
import { loadAuthState } from '@endeavorpal/store'

// TypeScript types for better code understanding and safety
// eslint-disable-next-line no-undef
interface CustomFetchOptions extends RequestInit {
  skipRefresh?: boolean // Custom option to skip refresh logic
}

// Updated function to refresh token based on the provided API endpoint
async function refreshToken(): Promise<string> {
  const API_URL = process.env.REACT_APP_API_V2_URL
  const refreshTokenURL = `${API_URL}/users/refresh_token`
  const authState = loadAuthState()
  const expiredToken = authState.token

  const response = await fetch(refreshTokenURL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${expiredToken}`, // Uncomment if your API requires the expired token
    },
  })

  if (!response.ok) {
    throw new TokenRefreshError()
  }

  const data = await response.json()
  if (data.status !== 'success') {
    throw new TokenRefreshError('Token refresh failed: ' + data.detail)
  }
  return data.token // The API returns the token in a 'token' field
}

// The Fetch API Interceptor remains largely the same
export async function fetchWithAuthRetry(url: string, options: CustomFetchOptions = {}): Promise<Response> {
  const response = await fetch(url, options)

  // If not 403 or we've already tried refreshing the token, return the original response
  if (response.status !== 403 || options.skipRefresh) {
    return response
  }

  try {
    // Attempt to refresh the token
    const newToken = await refreshToken()
    // Store the new token as needed, e.g., in localStorage or state management

    // Retry the original request with the new token
    const newOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`, // Update with how your API expects the token
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
