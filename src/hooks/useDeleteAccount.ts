import { useAuth } from '@/hooks/useAuth'
import { AppDispatch, deleteAccount } from '@/store'
import { useDispatch } from 'react-redux'
import { resetChatState, resetReactionButtons } from '../store/slices'

export const useDeleteAccount = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { accessToken } = useAuth()

  const doDeleteAccount = async () => {
    try {
      await dispatch(deleteAccount(String(accessToken)))
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    } finally {
      dispatch(resetChatState())
      dispatch(resetReactionButtons())
    }
  }

  return doDeleteAccount
}
