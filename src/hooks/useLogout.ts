import { useAuth } from '@endeavorpal/hooks'
import { AppDispatch, clearAuthState, logout } from '@endeavorpal/store'
import { useDispatch } from 'react-redux'
import { resetChatState, resetReactionButtons } from '../store/slices'

export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { token } = useAuth()

  const doLogout = async () => {
    try {
      await dispatch(logout(String(token)))
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      dispatch(resetChatState())
      dispatch(resetReactionButtons())
      clearAuthState()
    }
  }

  return doLogout
}
