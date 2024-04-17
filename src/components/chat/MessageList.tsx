import { ScrollToBottomIcon } from '@endeavorpal/assets'
import { useScreenInfo, useScrollManagement } from '@endeavorpal/hooks'
import { Message, RootState, Thread, UserRole } from '@endeavorpal/store'
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
import { useSelector } from 'react-redux'
import MessageBubble, { MessageBubbleProps } from './MessageBubble'

// Memoize MessageBubble to avoid unnecessary re-renders
const areEqual = (prevProps: MessageBubbleProps, nextProps: MessageBubbleProps) =>
  prevProps.isOutgoing === nextProps.isOutgoing &&
  prevProps.isSending === nextProps.isSending &&
  prevProps.message.id === nextProps.message.id &&
  prevProps.message.timestamp === nextProps.message.timestamp

const MessageBubbleMemo = React.memo(MessageBubble, areEqual)

interface MessageListProps {
  activeThread: Thread | null
  isLoading: boolean
  isSending: boolean
  scrollToBottomEnabled?: boolean
  reactionsEnabled?: boolean
  width?: string | number
  isShare?: boolean
}

export interface MessageListRef {
  scrollToBottom: () => void
}

/**
 * MessageList component renders a list of chat messages efficiently.
 * It includes performance optimizations such as memoization and dynamic
 * scroll-to-bottom functionality. It also handles loading states and
 * provides a smooth user experience across web and mobile platforms using React Native Web.
 */

const MessageList = forwardRef<MessageListRef, MessageListProps>(
  ({ activeThread, isSending, reactionsEnabled = true, scrollToBottomEnabled = true, width, isShare }, ref) => {
    const flatListRef = useRef<FlatList<Message>>(null)
    const { isScrolledUp, handleScroll, scrollToBottom } = useScrollManagement(50)
    // State to track the last known content height to determine when to auto-scroll
    const [lastContentHeight, setLastContentHeight] = useState<number>(0)
    const sideMenuWidth = useSelector((state: RootState) => state.sideMenu.width)
    const { width: dynamicWidth, isSmallScreen } = useScreenInfo(sideMenuWidth)
    const theme = useSelector((state: RootState) => state.theme.theme)

    // Expose scrollToBottom method to parent components
    useImperativeHandle(ref, () => ({
      scrollToBottom: () => flatListRef.current?.scrollToEnd({ animated: true }),
    }))

    // Render individual message item
    const renderMessage: ListRenderItem<Message> = useCallback(
      ({ item }: { item: Message }) => {
        const id = item.id || Helpers.generateUniqueId() + (isSending ? '-sending' : '')
        // Use Memoized version of MessageBubble for performance optimization
        return (
          <MessageBubbleMemo
            key={id}
            isSending={isSending}
            isOutgoing={item.role === UserRole.User}
            message={item}
            threadId={String(activeThread?.id)}
            reactionsEnabled={reactionsEnabled}
            width={width}
            isShare={isShare}
          />
        )
      },
      [activeThread?.id, isSending],
    )

    // Key extractor for FlatList items
    const keyExtractor = useCallback((item: Message) => item.id?.toString() || Helpers.generateUniqueId(), [])

    // Handle content size change to auto-scroll
    const handleContentSizeChange = useCallback(
      (contentWidth: number, contentHeight: number) => {
        if (contentHeight !== lastContentHeight) {
          setLastContentHeight(contentHeight)
          if (!isScrolledUp && !isShare && scrollToBottomEnabled) {
            scrollToBottom()
            // Auto-scroll only if we are not marked as scrolled up
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        }
      },
      [lastContentHeight, isScrolledUp, scrollToBottom, isShare, scrollToBottomEnabled],
    )

    const scrollToBottomPosition = dynamicWidth / 2 - 22 // 22 is the half of the width of the button
    // Scroll to Bottom Button component
    const ScrollToBottomButton = () => (
      <Pressable
        style={[styles.scrollToBottomButton, { right: scrollToBottomPosition }]}
        onPress={() => {
          flatListRef.current?.scrollToEnd({ animated: false })
          scrollToBottom()
        }}
      >
        <ScrollToBottomIcon name='Scroll to Bottom' width={24} height={24} />
      </Pressable>
    )

    // Auto-scroll to bottom on certain conditions
    useEffect(() => {
      if (!isScrolledUp && flatListRef.current && !isShare && scrollToBottomEnabled) {
        // Use a slight delay to ensure the list has updated
        flatListRef.current?.scrollToEnd({ animated: false })
      }
    }, [activeThread?.messages, isScrolledUp, isShare, scrollToBottomEnabled])

    const styles = StyleSheet.create({
      scrollToBottomButton: {
        position: 'absolute', // Position the button over the chat
        bottom: 70, // 50 pixels from the bottom edge of the screen
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.iconFill,
        backgroundColor: theme.sendIconColor,
        borderRadius: 15, // Rounded corners
      },
      flatList: {
        width: '100%',
        marginHorizontal: 'auto',
        height: '50vh',
        marginBottom: isSmallScreen ? '4px' : '8px',
      },
    })

    return (
      <>
        <FlatList
          style={styles.flatList}
          ref={flatListRef}
          data={activeThread?.messages || []}
          extraData={activeThread}
          renderItem={renderMessage}
          keyExtractor={keyExtractor}
          scrollEventThrottle={16}
          ListFooterComponent={isSending && <ActivityIndicator size='small' color={theme.hoverColor} />}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => handleScroll(event)}
          onContentSizeChange={handleContentSizeChange}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={5}
        />
        {isScrolledUp && scrollToBottomEnabled && <ScrollToBottomButton />}
      </>
    )
  },
)

MessageList.displayName = 'MessageList'
export default MessageList
