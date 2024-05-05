import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'

/**
 * A custom React hook that manages navigation based on user authentication status.
 * It leverages the useAuthStatus hook to determine if a user is authenticated and
 * redirects to the appropriate route.
 *
 * @param pathIfAuthenticated The URL path to redirect to if the user is authenticated.
 * @param pathIfNotAuthenticated The URL path to redirect to if the user is not authenticated.
 */
export const useRedirect = (pathIfAuthenticated: string, pathIfNotAuthenticated: string): void => {
  // Retrieve the current authentication status
  const { isAuthenticated, accessToken } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Get the current path
    const currentPath = location.pathname
    // Conditional navigation based on the authentication status of the user and the current path
    if (isAuthenticated && accessToken) {
      if (currentPath !== pathIfAuthenticated) {
        navigate(pathIfAuthenticated)
      }
    } else {
      navigate(pathIfNotAuthenticated)
    }

    // Dependencies: The effect re-runs if any of these values change.
  }, [navigate, pathIfAuthenticated, pathIfNotAuthenticated, isAuthenticated, accessToken])
}

export default useRedirect
