import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, ListRenderItem, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useChat } from '../../hooks'
import { RootState } from '../../store/store'
import { Message, UserRole } from '../../store/types/chatTypes'
import ChatInput from './ChatInput'
import MessageBubble from './MessageBubble'

type ChatContainerProps = {
  isHome: boolean
  children?: React.ReactNode
}

const ChatContainer: React.FC<ChatContainerProps> = ({ isHome, children }) => {
  const navigate = useNavigate()
  const isLoading = useSelector((state: RootState) => state.chat.loading)
  const [inputText, setInputText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const flatListRef = useRef<FlatList<Message>>(null)
  const { abortRequest, activeThread, sendNewMessage } = useChat()

  const handleSendPress = useCallback(async () => {
    if (!inputText.trim() || isSending) return
    try {
      setIsSending(true)
      const { threadId } = await sendNewMessage(inputText, activeThread?.id)
      setInputText('')
      setIsSending(false)
      if (isHome && threadId) {
        navigate(`/chat/${threadId}`) // Navigate to the chat screen with the new thread ID
      }
    } catch (error) {
      console.warn(`Error sending message: ${error}`)
    } finally {
      setIsSending(false)
    }
  }, [inputText, isSending, activeThread?.id, isHome, sendNewMessage, navigate])

  const handleCancelSend = useCallback(() => {
    abortRequest()
    setIsSending(false)
  }, [])

  // Clean up the abort controller on unmount or when the component is no longer active
  useEffect(() => {
    return () => {
      handleCancelSend()
    }
  }, [])

  const renderMessage: ListRenderItem<Message> = useCallback(
    ({ item }: { item: Message }) => <MessageBubble isOutgoing={item.role === UserRole.User} message={item} />,
    [],
  )

  const handleScroll = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y
    const contentHeight = event.nativeEvent.contentSize.height
    const viewHeight = event.nativeEvent.layoutMeasurement.height

    // Check if we are close to the bottom of the list
    setIsAtBottom(offsetY + viewHeight >= contentHeight - 20) // Adjust threshold as needed
  }, [])

  const handleContentSizeChange = useCallback(() => {
    if (isAtBottom) {
      flatListRef.current?.scrollToEnd({ animated: true })
    }
  }, [isAtBottom, flatListRef])

  useEffect(() => {
    if (isAtBottom) {
      flatListRef.current?.scrollToEnd({ animated: true })
    }
  }, [activeThread?.messages, isAtBottom, flatListRef])

  return (
    <View style={[styles.chatContainer]}>
      {isHome ? (
        isSending || activeThread?.messages ? (
          <FlatList
            style={{ height: '100%' }}
            ref={flatListRef}
            data={activeThread?.messages}
            renderItem={renderMessage}
            keyExtractor={(item: Message, index: string) => item.id || index}
            scrollEventThrottle={16}
            ListFooterComponent={isLoading ? <ActivityIndicator size='large' color='#da2c1f' /> : null}
            extraData={activeThread}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
            onScroll={handleScroll}
            onContentSizeChange={handleContentSizeChange}
          />
        ) : (
          children
        )
      ) : (
        <>
          <FlatList
            style={{ height: '100%' }}
            ref={flatListRef}
            data={activeThread?.messages}
            renderItem={renderMessage}
            keyExtractor={(item: Message, index: string) => item.id || index}
            scrollEventThrottle={16}
            ListFooterComponent={isLoading ? <ActivityIndicator size='large' color='#da2c1f' /> : null}
            extraData={activeThread}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
            onScroll={handleScroll}
            onContentSizeChange={handleContentSizeChange}
          />
          {children}
        </>
      )}

      <ChatInput
        value={inputText}
        onInputChange={setInputText}
        onSendPress={handleSendPress}
        isSending={isSending}
        onCancelSend={handleCancelSend}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    width: '100%',
  },
})

export default ChatContainer
