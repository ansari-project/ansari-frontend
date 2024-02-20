import { ScrollToBottomIcon } from '@endeavorpal/assets'
import { useChat, useScreenInfo } from '@endeavorpal/hooks'
import { Message, RootState, UserRole } from '@endeavorpal/store'
import { Helpers } from '@endeavorpal/utils'
import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, ListRenderItem, Pressable, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ChatInput from './ChatInput'
import MessageBubble from './MessageBubble'

type ChatContainerProps = {
  isHome: boolean
  children?: React.ReactNode
}

const ChatContainer: React.FC<ChatContainerProps> = ({ isHome, children }) => {
  const navigate = useNavigate()
  const isLoading = useSelector((state: RootState) => state.chat.loading)
  const [inputText, setInputText] = useState<string>('')
  const [isSending, setIsSending] = useState<boolean>(false)
  const [isScrolledUp, setIsScrolledUp] = useState(false)
  const flatListRef = useRef<FlatList<Message>>(null)
  const { abortRequest, activeThread, sendNewMessage } = useChat()
  // State to track the last known content height
  const [lastContentHeight, setLastContentHeight] = useState<number>(0)

  const areEqual = (prevProps, nextProps) => {
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.isOutgoing === nextProps.isOutgoing &&
      prevProps.message.timestamp === nextProps.message.timestamp
    )
  }

  const MessageBubbleMemo = React.memo(MessageBubble, areEqual)

  const handleSendPress = useCallback(async () => {
    if (!inputText.trim() || isSending) return
    try {
      setIsSending(true)
      setInputText('')
      const { threadId } = await sendNewMessage(inputText, activeThread?.id)
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

  // Create a debounced version of the setIsScrolledUp updater
  // Adjust the 250ms delay as needed for your use case
  const handleScrollDebounced = useCallback(
    debounce((isScrolledUp: boolean) => {
      setIsScrolledUp(isScrolledUp)
    }, 100),
    [],
  )

  // Clean up the abort controller on unmount or when the component is no longer active
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: false })
    }
    return () => {
      handleCancelSend()
      handleScrollDebounced.cancel()
    }
  }, [])

  const renderMessage = useCallback<ListRenderItem<Message>>(
    ({ item }: { item: Message }) => {
      const id = item.id || Helpers.generateUniqueId()
      return <MessageBubbleMemo key={id} isOutgoing={item.role === UserRole.User} message={item} />
    },
    [Helpers],
  )

  const handleScroll = useCallback(
    (event) => {
      const offsetY = event.nativeEvent.contentOffset.y
      const contentHeight = event.nativeEvent.contentSize.height
      const viewHeight = event.nativeEvent.layoutMeasurement.height

      // Use a threshold to determine if the user is "close enough" to the bottom to auto-scroll.
      // This can help account for minor discrepancies in scroll position calculations.
      const isAtBottomThreshold = 50 // Adjust as necessary for your UI
      const closeToBottom = contentHeight - offsetY - viewHeight < isAtBottomThreshold

      // Use the debounced function to update `isScrolledUp`.
      // This prevents rapid state updates during scroll events.
      handleScrollDebounced(!closeToBottom)
    },
    [handleScrollDebounced],
  )

  const handleContentSizeChange = useCallback(
    (contentWidth: number, contentHeight: number) => {
      if (contentHeight !== lastContentHeight) {
        // Update the last known content height to the current height
        setLastContentHeight(contentHeight)

        if (!isScrolledUp) {
          // Auto-scroll only if we are not marked as scrolled up
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      }
    },
    [lastContentHeight, isScrolledUp],
  )

  useEffect(() => {
    if (!isScrolledUp && flatListRef.current) {
      // Use a slight delay to ensure the list has updated
      flatListRef.current?.scrollToEnd({ animated: false })
    }
  }, [activeThread?.messages, isScrolledUp])

  const { actualPaddingHorizontal, contentWidth } = useScreenInfo()

  return (
    <View style={[styles.chatContainer]}>
      {isHome ? (
        isLoading || activeThread?.messages ? (
          <>
            <FlatList
              style={{ height: '50vh', paddingHorizontal: actualPaddingHorizontal }}
              ref={flatListRef}
              inverted={false}
              data={activeThread?.messages}
              renderItem={renderMessage}
              keyExtractor={(item: Message, index: string) => item.id?.toString() || index.toString()}
              scrollEventThrottle={16}
              ListFooterComponent={isLoading ? <ActivityIndicator size='large' color='#09786b' /> : null}
              extraData={activeThread}
              showsVerticalScrollIndicator={false}
              scrollEnabled={true}
              onScroll={handleScroll}
              onContentSizeChange={handleContentSizeChange}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              windowSize={5}
            />
            {isScrolledUp && (
              <Pressable
                style={styles.scrollToBottomButtonContainer}
                onPress={() => {
                  flatListRef.current?.scrollToEnd({ animated: false })
                  setIsScrolledUp(false)
                }}
              >
                <ScrollToBottomIcon name='Scroll to Bottom' width={24} height={24} />
              </Pressable>
            )}
          </>
        ) : (
          <View style={{ marginHorizontal: actualPaddingHorizontal, width: contentWidth }}>{children}</View>
        )
      ) : (
        <>
          <FlatList
            style={{ height: '50vh', paddingHorizontal: actualPaddingHorizontal }}
            ref={flatListRef}
            inverted={false}
            data={activeThread?.messages}
            renderItem={renderMessage}
            keyExtractor={(item: Message, index: string) => item.id?.toString() || index.toString()}
            scrollEventThrottle={16}
            ListFooterComponent={isSending && !isLoading ? <ActivityIndicator size='small' color='#09786b' /> : null}
            extraData={activeThread}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            onScroll={handleScroll}
            onContentSizeChange={handleContentSizeChange}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={5}
          />
          {isScrolledUp && (
            <Pressable
              style={styles.scrollToBottomButtonContainer}
              onPress={() => {
                flatListRef.current?.scrollToEnd({ animated: false })
                setIsScrolledUp(false)
              }}
            >
              <ScrollToBottomIcon name='Scroll to Bottom' width={24} height={24} />
            </Pressable>
          )}
        </>
      )}
      <View style={{ marginHorizontal: actualPaddingHorizontal, width: contentWidth }}>
        <ChatInput
          value={inputText}
          onInputChange={setInputText}
          onSendPress={handleSendPress}
          isSending={isSending}
          onCancelSend={handleCancelSend}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'end',
  },
  scrollToBottomButtonContainer: {
    position: 'absolute', // Position the button over the chat
    right: '50vw', // 10 pixels from the right edge of the screen
    bottom: 70, // 50 pixels from the bottom edge of the screen
    padding: 10,
    color: '#fff',
    backgroundColor: '#09786b', // Light grey background for the button
    borderRadius: 15, // Rounded corners
    elevation: 3, // Shadow for Android
    boxShadowOffset: { width: 1, height: 1 }, // Shadow for iOS
    boxShadowColor: '#333',
    boxShadowOpacity: 0.3,
    boxShadowRadius: 2,
  },
})

export default ChatContainer
