import { useEffect } from 'react'
import { useRouter } from 'expo-router'
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
  const router = useRouter()

  useEffect(() => {
    // Get the current path
    const currentPath = location.pathname
    // Conditional navigation based on the authentication status of the user and the current path
    if (isAuthenticated && accessToken) {
      if (currentPath !== pathIfAuthenticated) {
        router.push(pathIfAuthenticated)
      }
    } else {
      router.push(pathIfNotAuthenticated)
    }

    // Dependencies: The effect re-runs if any of these values change.
  }, [router, pathIfAuthenticated, pathIfNotAuthenticated, isAuthenticated, accessToken])
}

export default useRedirect
