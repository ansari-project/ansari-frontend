import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { BackgroundImage, ChatInput, MessageBubble } from '../components'
import { addMessage, createThread, fetchThread } from '../store/actions/chatActions'
import { AppDispatch, RootState } from '../store/store'
import { Message, UserRole } from '../store/types/chatTypes'
import { useRedirect } from '../hooks'

const ChatScreen: React.FC = () => {
  useRedirect('/chat', '/login')
  const [inputText, setInputText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const flatListRef = useRef<FlatList>(null)
  const activeThread = useSelector((state: RootState) => state.chat.activeThread)
  const previousActiveThreadRef = useRef<RootState['chat']['activeThread'] | null>(null)
  const isLoading = useSelector((state: RootState) => state.chat.loading)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [userScrolledUp, setUserScrolledUp] = useState(false)

  useEffect(() => {
    if (!activeThread?.id && !previousActiveThreadRef.current?.id) {
      dispatch(fetchThread('45'))
    }
    if (
      !isSending &&
      (activeThread?.id !== previousActiveThreadRef.current?.id ||
        activeThread?.messages.length !== previousActiveThreadRef.current?.messages.length)
    ) {
      dispatch(fetchThread(String(activeThread?.id)))
    }

    previousActiveThreadRef.current = activeThread
  }, [isSending, activeThread, dispatch])

  useEffect(() => {
    if (flatListRef.current && activeThread?.messages) {
      flatListRef.current.scrollToEnd({ animated: false })
    }
  }, [activeThread?.messages])

  const cancelSend = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsSending(false)
    }
  }, [])

  const handleSendPress = async () => {
    if (!activeThread?.id) {
      await dispatch(createThread())
    }
    if (inputText.trim().length > 0 && activeThread?.id && !isSending) {
      setIsSending(true)
      abortControllerRef.current = new AbortController()

      try {
        console.log('chat screen/handleSendPress ---> calling addMessage', {
          threadId: activeThread.id,
          content: inputText,
          signal: abortControllerRef.current.signal,
        })
        const actionResult = await dispatch(
          addMessage({
            threadId: activeThread.id,
            content: inputText,
            signal: abortControllerRef.current.signal,
          }),
        )
        console.log(
          'chat screen/handleSendPress ---> addMessage.fulfilled.match(actionResult) ---> ',
          addMessage.fulfilled.match(actionResult),
        )
        if (addMessage.fulfilled.match(actionResult)) {
          setInputText('')
          flatListRef.current?.scrollToEnd({ animated: true })
          setUserScrolledUp(false)
        }
      } catch (error) {
        console.error('Message send was cancelled or failed', error)
      } finally {
        setIsSending(false)
        abortControllerRef.current = null
      }
    }
  }

  const renderItem = ({ item }: { item: Message }) => (
    <MessageBubble isOutgoing={item.role === UserRole.User} message={item} />
  )

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
    if (contentOffset?.y === 0 && layoutMeasurement.height + contentOffset?.y === contentSize.height) {
      setUserScrolledUp(false)
    } else if (contentOffset?.y > 0) {
      setUserScrolledUp(true)
    }
  }, [])

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <BackgroundImage />
      <FlatList
        ref={flatListRef}
        data={activeThread?.messages}
        renderItem={renderItem}
        onContentSizeChange={() => {
          if (isSending || !userScrolledUp) {
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        }}
        onLayout={handleScroll}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListFooterComponent={isLoading || isSending ? <ActivityIndicator size='large' color='#da2c1f' /> : null}
        extraData={activeThread}
      />
      <ChatInput
        value={inputText}
        onSendPress={handleSendPress}
        onInputChange={setInputText}
        onCancelSend={isSending ? cancelSend : undefined}
        isSending={isSending}
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    gap: 0,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch', // This centers the children along the cross axis (vertically)
    backgroundColor: '#F2F2F2',
    color: 'black',
    fontFamily: 'Roboto',
    paddingLeft: 112,
    paddingRight: 112,
    paddingTop: 56,
  },
  // Define additional styles if needed
})

export default ChatScreen
