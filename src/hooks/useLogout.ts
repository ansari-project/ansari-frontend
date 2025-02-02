import { useAuth } from '@/hooks'
import { AppDispatch, clearAuthState, logout } from '@/store'
import { useDispatch } from 'react-redux'
import { resetChatState, resetReactionButtons } from '../store/slices'

export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { accessToken } = useAuth()

  const doLogout = async () => {
    try {
      await dispatch(logout(String(accessToken)))
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
