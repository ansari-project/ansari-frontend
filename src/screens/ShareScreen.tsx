import { ShareContainer } from '@endeavorpal/components'
import { useChat, useDirection } from '@endeavorpal/hooks'
import { AppDispatch, RootState } from '@endeavorpal/store'
import { fetchSharedThread } from '@endeavorpal/store/actions'
import { Helpers } from '@endeavorpal/utils'
import React, { useEffect } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

/**
 * Displays a chat interface allowing users to send and view messages within a thread.
 * Handles thread creation and message sending with real-time updates.
 */
const ShareScreen: React.FC = () => {
  const { threadUuid } = useParams<{ threadUuid?: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { abortRequest } = useChat()
  const navigate = useNavigate()
  const { isRTL } = useDirection()
  const theme = useSelector((state: RootState) => state.theme.theme)

  // Fetches thread details on threadId change
  useEffect(() => {
    if (threadUuid && Helpers.isValidateUUID(threadUuid)) {
      dispatch(fetchSharedThread(threadUuid))
        .unwrap()
        .catch(() => {
          navigate('/404')
        })
    } else {
      navigate('/404')
    }
  }, [threadUuid, dispatch, navigate])

  // Clean up the abort controller on unmount or when the component is no longer active
  useEffect(() => {
    return () => {
      abortRequest()
    }
  }, [])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center', // Ensure content is centered
      justifyContent: 'space-between', // Distributes children evenly
      width: '100%',
    },
    shareIcon: {
      position: 'absolute',
      left: isRTL ? 24 : 'auto',
      right: isRTL ? 'auto' : 24,
      padding: 8,
      borderRadius: 4,
      backgroundColor: theme.popupBackgroundColor,
    },
  })

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ShareContainer />
    </KeyboardAvoidingView>
  )
}

export default ShareScreen
