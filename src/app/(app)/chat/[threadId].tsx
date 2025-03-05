import { ShareIcon } from '@/components/svg'
import { ChatContainer } from '@/components'
import SharePopup from '@/components/share/SharePopup'
import { useChat, useDirection, useScreenInfo } from '@/hooks'
import { AppDispatch, RootState, fetchThread, toggleSharePopup } from '@/store'
import getEnv from '@/utils/getEnv'
import React, { useEffect } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native'
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
  const { isRTL } = useDirection()
  const theme = useSelector((state: RootState) => state.theme.theme)
  const isSharePopupVisible = useSelector((state: RootState) => state.share.isOpen)
  const { isSmallScreen } = useScreenInfo()

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
  }, [])

  // Clean up the abort controller on unmount or when the component is no longer active
  useEffect(() => {
    return () => {
      abortRequest()
    }
  }, [])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className='flex-1 items-center justify-between w-full'
    >
      <ChatContainer isHome={false} />
      {getEnv('ENABLE_SHARE') && !isSmallScreen && (
        <View
          className={`absolute p-2 rounded ${isRTL ? 'left-6' : 'right-6'}`}
          style={{ backgroundColor: theme.popupBackgroundColor }}
        >
          <Pressable onPress={() => dispatch(toggleSharePopup(!isSharePopupVisible))}>
            <ShareIcon />
          </Pressable>
        </View>
      )}
      <SharePopup visible={isSharePopupVisible} onClose={() => dispatch(toggleSharePopup(!isSharePopupVisible))} />
    </KeyboardAvoidingView>
  )
}

export default ChatScreen
