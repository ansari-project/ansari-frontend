// useAuth.ts
// This custom hook provides a convenient way to access authentication-related data
// (such as the current user, authentication status, and token) from the Redux store.

import { useSelector } from 'react-redux'
import { RootState } from '@endeavorpal/store'

/**
 * A hook that abstracts the Redux state access for authentication.
 * It uses the useSelector hook from React-Redux to extract auth-related data.
 *
 * @returns An object containing isAuthenticated, token, and user information.
 */
export const useAuth = () => {
  // Access the relevant part of the Redux state
  const authState = useSelector((state: RootState) => state.auth)

  // Return the necessary parts of the auth state
  return {
    isAuthenticated: authState.isAuthenticated, // Indicates if the user is currently authenticated
    token: authState.token, // The JWT token for authenticated requests
    user: authState.user, // The user's details
  }
}
