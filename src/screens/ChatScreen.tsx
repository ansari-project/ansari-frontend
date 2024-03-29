import { ShareIcon } from '@endeavorpal/assets'
import { ChatContainer } from '@endeavorpal/components'
import { useChat, useDirection, useRedirect } from '@endeavorpal/hooks'
import { AppDispatch, RootState, fetchThread } from '@endeavorpal/store'
import getEnv from '@endeavorpal/utils/getEnv'
import React, { useEffect } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

/**
 * Displays a chat interface allowing users to send and view messages within a thread.
 * Handles thread creation and message sending with real-time updates.
 */
const ChatScreen: React.FC = () => {
  const { threadId } = useParams<{ threadId?: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { abortRequest } = useChat()
  const navigate = useNavigate()
  const { isRTL } = useDirection()
  const theme = useSelector((state: RootState) => state.theme.theme)

  useRedirect(`/chat/${threadId}`, '/login')

  // Fetches thread details on threadId change
  useEffect(() => {
    if (threadId) {
      dispatch(fetchThread(threadId))
        .unwrap()
        .catch((error) => {
          console.error(error)
          navigate('/', { state: { errorMsg: error.message || 'An unknown error occurred.' } })
        })
    } else {
      navigate('/', { state: { errorMsg: 'Please provide a valid threadId.' } })
    }
  }, [threadId, dispatch, navigate])

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
      <ChatContainer isHome={false} />
      {getEnv('ENABLE_SHARE') && (
        <View style={styles.shareIcon}>
          <ShareIcon />
        </View>
      )}
    </KeyboardAvoidingView>
  )
}

export default ChatScreen
