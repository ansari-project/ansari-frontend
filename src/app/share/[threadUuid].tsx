import { ShareContainer } from '@/components'
import { useChat, useDirection } from '@/hooks'
import { AppDispatch, RootState } from '@/store'
import { fetchSharedThread } from '@/store/actions'
import { Helpers } from '@/utils'
import React, { useEffect } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useLocalSearchParams } from 'expo-router'

/**
 * Displays a chat interface allowing users to send and view messages within a thread.
 * Handles thread creation and message sending with real-time updates.
 */
const ShareScreen: React.FC = () => {
  const { threadUuid } = useLocalSearchParams<{ threadUuid?: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { abortRequest } = useChat()
  const router = useRouter()
  const { isRTL } = useDirection()
  const theme = useSelector((state: RootState) => state.theme.theme)

  // Fetches thread details on threadId change
  useEffect(() => {
    if (threadUuid && Helpers.isValidateUUID(threadUuid)) {
      dispatch(fetchSharedThread(threadUuid))
        .unwrap()
        .catch(() => {
          router.push('/404')
        })
    } else {
      router.push('/404')
    }
  }, [threadUuid, dispatch, router])

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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ShareContainer />
    </KeyboardAvoidingView>
  )
}

export default ShareScreen
