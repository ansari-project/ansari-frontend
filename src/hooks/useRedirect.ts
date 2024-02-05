import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './useAuth'

/**
 * A custom React hook that manages navigation based on user authentication status.
 * It leverages the useAuthStatus hook to determine if a user is authenticated and
 * redirects to the appropriate route.
 *
 * @param pathIfAuthenticated The URL path to redirect to if the user is authenticated.
 * @param pathIfNotAuthenticated The URL path to redirect to if the user is not authenticated.
 */
export const useRedirect = (pathIfAuthenticated: string, pathIfNotAuthenticated: string) => {
  // Retrieve the current authentication status
  const { isAuthenticated, token } = useAuth()

  // Hook for programmatically navigating to different routes
  const navigate = useNavigate()

  useEffect(() => {
    // Conditional navigation based on the authentication status of the user
    navigate(isAuthenticated && token ? pathIfAuthenticated : pathIfNotAuthenticated)

    // Dependencies: The effect re-runs if any of these values change.
  }, [isAuthenticated, navigate, pathIfAuthenticated, pathIfNotAuthenticated])
}

export default useRedirect
