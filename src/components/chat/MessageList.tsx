import { ScrollToBottomIcon } from '@/components/svg'
import { useScreenInfo } from '@/hooks'
import { Message, RootState, Thread, UserRole } from '@/store'
import { Helpers } from '@/utils'
import React, { forwardRef, useRef, useState } from 'react'
import { ActivityIndicator, Platform, Pressable, ScrollView, View } from 'react-native'
import { useSelector } from 'react-redux'
import MessageBubble, { MessageBubbleProps } from './MessageBubble'
import { useLocalSearchParams } from 'expo-router'

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
  (
    { isLoading, activeThread, isSending, reactionsEnabled = true, scrollToBottomEnabled = true, width, isShare },
    ref,
  ) => {
    const scrollViewRef = useRef<ScrollView>(null)
    const [displayScrollButton, setDisplayScrollButton] = useState(false)
    const sideMenuWidth = useSelector((state: RootState) => state.sideMenu.width)
    const { isSmallScreen, height } = useScreenInfo(sideMenuWidth)
    const theme = useSelector((state: RootState) => state.theme.theme)
    const { threadId } = useLocalSearchParams<{ threadId: string }>()

    const validThread = activeThread && activeThread.id === threadId
    if (isLoading && !isSending && !validThread) {
      return (
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color={theme.hoverColor} />
        </View>
      )
    }
    // Scroll to Bottom Button component
    const ScrollToBottomButton = () => (
      <View className='absolute bottom-[25px] items-center justify-center w-full'>
        <Pressable
          className='rounded-[15px] p-[10px]'
          style={{
            backgroundColor: theme.sendIconColor,
          }}
          onPress={() => {
            setDisplayScrollButton(false)
            scrollViewRef.current?.scrollToEnd()
          }}
        >
          <ScrollToBottomIcon
            name='Scroll to Bottom'
            width={24}
            height={24}
            fill={theme.iconFill}
            hoverFill={theme.hoverColor}
          />
        </Pressable>
      </View>
    )

    const filteredMessages = (activeThread?.messages || []).filter((message) => typeof message.content === 'string')
    const lastAssistantMessageIndex = filteredMessages.findLastIndex((message) => message.role === UserRole.Assistant)

    return (
      <View className='flex-1'>
        <ScrollView
          ref={scrollViewRef}
          className={`mb-${isSmallScreen ? '1' : '2'}`}
          scrollEventThrottle={50}
          onScroll={(event) => {
            const { contentOffset, layoutMeasurement } = event.nativeEvent
            // 250 accounts for the height of the fixed header + chat input + footer note
            const isAtBottom = contentOffset.y >= event.nativeEvent.contentSize.height - layoutMeasurement.height - 250

            setDisplayScrollButton(!isAtBottom)
          }}
          onContentSizeChange={(contentWidth: number, contentHeight: number) => {
            if (isSending) return

            // Display the scroll button if the content height is greater than the screen height
            // excluding the average height of the fixed header + footer.
            setDisplayScrollButton(contentHeight > height - 100)
          }}
        >
          {filteredMessages.map((message: Message, index) => {
            const id = message.id || Helpers.generateUniqueId() + (isSending ? '-sending' : '')

            return (
              <MessageBubbleMemo
                key={id}
                isSending={isSending}
                displayActivity={isSending && lastAssistantMessageIndex === index}
                isOutgoing={message.role === UserRole.User}
                message={message}
                threadId={String(activeThread?.id)}
                reactionsEnabled={reactionsEnabled}
                width={width}
                isShare={isShare}
              />
            )
          })}
        </ScrollView>
        {Platform.OS !== 'web' && displayScrollButton && scrollToBottomEnabled && <ScrollToBottomButton />}
      </View>
    )
  },
)

MessageList.displayName = 'MessageList'
export default MessageList
