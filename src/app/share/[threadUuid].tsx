import { ShareContainer } from '@/components'
import { useChat } from '@/hooks'
import { AppDispatch } from '@/store'
import { fetchSharedThread } from '@/store/actions'
import { Helpers } from '@/utils'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'
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

  return (
    <View className='flex-1 items-center justify-between w-full'>
      <ShareContainer />
    </View>
  )
}

export default ShareScreen
