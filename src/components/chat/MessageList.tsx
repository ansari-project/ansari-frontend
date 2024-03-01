import { ScrollToBottomIcon } from '@endeavorpal/assets'
import { useScrollManagement } from '@endeavorpal/hooks'
import { Message, Thread, UserRole } from '@endeavorpal/store'
import { Helpers } from '@endeavorpal/utils'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
} from 'react-native'
import MessageBubble, { MessageBubbleProps } from './MessageBubble'

interface MessageListProps {
  activeThread: Thread | null
  isLoading: boolean
  isSending: boolean
  actualPaddingHorizontal: number
}

export interface MessageListRef {
  scrollToBottom: () => void
}

/**
 * Renders a list of chat messages with performance optimizations.
 * Supports dynamic scroll to bottom and displays loading indicators.
 */

const MessageList = forwardRef<MessageListRef, MessageListProps>((props, ref) => {
  const { activeThread, isLoading, isSending, actualPaddingHorizontal } = props
  const flatListRef = useRef<FlatList<Message>>(null)
  const { isScrolledUp, handleScroll, scrollToBottom } = useScrollManagement(50)
  // State to track the last known content height to determine when to auto-scroll
  const [lastContentHeight, setLastContentHeight] = useState<number>(0)

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      flatListRef.current?.scrollToEnd({ animated: true })
    },
  }))

  const renderMessage: ListRenderItem<Message> = useCallback(
    ({ item }: { item: Message }) => {
      // prevProps.isSending === nextProps.isSending &&

      const areEqual = (prevProps: MessageBubbleProps, nextProps: MessageBubbleProps) =>
        prevProps.message.id === nextProps.message.id &&
        prevProps.isOutgoing === nextProps.isOutgoing &&
        prevProps.message.timestamp === nextProps.message.timestamp
      const MessageBubbleMemo = React.memo(MessageBubble, areEqual)
      const id = item.id || Helpers.generateUniqueId() + (isSending ? '-sending' : '')
      return (
        <MessageBubbleMemo
          key={id}
          isSending={isSending}
          isOutgoing={item.role === UserRole.User}
          message={item}
          threadId={String(activeThread?.id)}
        />
      )
    },
    [activeThread],
  )

  const keyExtractor = useCallback((item: Message) => item.id?.toString() || Helpers.generateUniqueId(), [])

  const handleContentSizeChange = useCallback(
    (contentWidth: number, contentHeight: number) => {
      if (contentHeight !== lastContentHeight) {
        setLastContentHeight(contentHeight)
        if (!isScrolledUp) {
          scrollToBottom()
          // Auto-scroll only if we are not marked as scrolled up
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      }
    },
    [lastContentHeight, isScrolledUp, scrollToBottom],
  )

  const ScrollToBottomButton = () => (
    <Pressable
      style={styles.scrollToBottomButton}
      onPress={() => {
        flatListRef.current?.scrollToEnd({ animated: false })
        scrollToBottom()
      }}
    >
      <ScrollToBottomIcon name='Scroll to Bottom' width={24} height={24} />
    </Pressable>
  )

  useEffect(() => {
    if (!isScrolledUp && flatListRef.current) {
      // Use a slight delay to ensure the list has updated
      flatListRef.current?.scrollToEnd({ animated: false })
    }
  }, [activeThread?.messages, isScrolledUp])

  return (
    <>
      <FlatList
        style={{ height: '50vh', paddingHorizontal: actualPaddingHorizontal }}
        ref={flatListRef}
        data={activeThread?.messages || []}
        extraData={activeThread}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
        scrollEventThrottle={16}
        ListFooterComponent={isSending && !isLoading ? <ActivityIndicator size='small' color='#09786b' /> : null}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => handleScroll(event)}
        onContentSizeChange={handleContentSizeChange}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
      {isScrolledUp && <ScrollToBottomButton />}
    </>
  )
})

const styles = StyleSheet.create({
  scrollToBottomButton: {
    position: 'absolute', // Position the button over the chat
    right: '50vw', // 10 pixels from the right edge of the screen
    bottom: 70, // 50 pixels from the bottom edge of the screen
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
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

MessageList.displayName = 'MessageList'
export default MessageList
