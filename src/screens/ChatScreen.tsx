import { BackgroundImage, ChatContainer } from '@endeavorpal/components'
import { useChat, useRedirect } from '@endeavorpal/hooks'
import { AppDispatch, fetchThread } from '@endeavorpal/store'
import React, { useEffect } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
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
    }
  }, [threadId, dispatch, navigate])

  // Clean up the abort controller on unmount or when the component is no longer active
  useEffect(() => {
    return () => {
      abortRequest()
    }
  }, [])

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <BackgroundImage />
      <ChatContainer isHome={false} />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    alignItems: 'center', // Ensure content is centered
    justifyContent: 'space-between', // Distributes children evenly
    marginTop: 5,
  },

  // Define additional styles if needed
})

export default ChatScreen
