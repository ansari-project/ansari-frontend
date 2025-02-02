// useGuest.ts
// Hook for handling guest user login within a React / React Native application.

import { AppDispatch, guestLogin } from '@/store'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'expo-router'

/**
 * A custom hook for handling guest login functionality.
 *
 * It provides state and functions necessary to perform a guest login, track the loading state,
 * and handle any potential errors during the login process.
 */
export const useGuest = () => {
  // Redux dispatch function for dispatching actions.
  const dispatch = useDispatch<AppDispatch>()
  // Navigation hook to programmatically navigate between routes.
  const router = useRouter()

  // State to track whether the guest login process is loading.
  const [guestLoading, setGuestLoading] = useState<boolean>(false)
  // State to track any errors that may occur during the guest login process.
  const [guestLoginError, setGuestLoginError] = useState<Error | null>(null)

  /**
   * Handles the guest login process.
   *
   * It dispatches the guestLogin action, handles successful login by navigating to the homepage,
   * and handles any errors by setting the guestLoginError state.
   */
  const handleGuestLogin = async () => {
    try {
      setGuestLoading(true)
      setGuestLoginError(null)
      // Dispatching the guestLogin action and waiting for it to complete.
      await dispatch(guestLogin()).unwrap()
      // On success, navigate to the homepage and reset loading state.
      router.push('/')
    } catch (error) {
      console.error('Error logging in as guest:', error)
      // On failure, set error state and log the error.
      setGuestLoginError(error as Error)
    } finally {
      // Reset loading state regardless of success or failure.
      setGuestLoading(false)
    }
  }

  // Exposing the guest login state and control functions.
  return { guestLoading, handleGuestLogin, guestLoginError }
}
