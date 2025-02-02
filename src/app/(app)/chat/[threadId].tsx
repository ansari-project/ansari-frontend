import { ShareIcon } from '@/assets'
import { ChatContainer } from '@/components'
import SharePopup from '@/components/share/SharePopup'
import { useChat, useDirection, useRedirect, useScreenInfo } from '@/hooks'
import { AppDispatch, RootState, fetchThread, toggleSharePopup } from '@/store'
import getEnv from '@/utils/getEnv'
import React, { useEffect } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useLocalSearchParams } from 'expo-router'

/**
 * Displays a chat interface allowing users to send and view messages within a thread.
 * Handles thread creation and message sending with real-time updates.
 */
const ChatScreen: React.FC = () => {
  const router = useRouter()
  const { threadId } = useLocalSearchParams<{ threadId?: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { abortRequest } = useChat()
  const navigate = useRouter()
  const { isRTL } = useDirection()
  const theme = useSelector((state: RootState) => state.theme.theme)
  const isSharePopupVisible = useSelector((state: RootState) => state.share.isOpen)
  const { isSmallScreen } = useScreenInfo()

  useRedirect(`/chat/${threadId}`, '/login')

  // Fetches thread details on threadId change
  useEffect(() => {
    if (threadId) {
      dispatch(fetchThread(threadId))
        .unwrap()
        .catch((error) => {
          console.error(error)
          router.push({ pathname: '/', params: { errorMsg: error.message || 'An unknown error occurred.' } })
        })
    } else {
      router.push({ pathname: '/', params: { errorMsg: 'Please provide a valid threadId.' } })
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
      {getEnv('ENABLE_SHARE') && !isSmallScreen && (
        <View style={styles.shareIcon}>
          <Pressable
            onPress={() => {
              dispatch(toggleSharePopup(!isSharePopupVisible))
            }}
          >
            <ShareIcon />
          </Pressable>
        </View>
      )}
      <SharePopup visible={isSharePopupVisible} onClose={() => dispatch(toggleSharePopup(!isSharePopupVisible))} />
    </KeyboardAvoidingView>
  )
}

export default ChatScreen
