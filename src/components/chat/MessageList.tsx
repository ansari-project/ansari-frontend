import { ScrollToBottomIcon } from '@/components/svg'
import { useScreenInfo } from '@/hooks'
import { Message, RootState, Thread, UserRole } from '@/store'
import { Helpers } from '@/utils'
import React, { forwardRef, useRef, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native'
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
  (
    { isLoading, activeThread, isSending, reactionsEnabled = true, scrollToBottomEnabled = true, width, isShare },
    ref,
  ) => {
    const scrollViewRef = useRef<ScrollView>(null)
    const [displayScrollButton, setDisplayScrollButton] = useState(false)
    const sideMenuWidth = useSelector((state: RootState) => state.sideMenu.width)
    const { isSmallScreen } = useScreenInfo(sideMenuWidth)
    const theme = useSelector((state: RootState) => state.theme.theme)

    if (isLoading) {
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

    return (
      <View className={'flex-1'}>
        {isSending && (
          <View className='items-center justify-center'>
            <ActivityIndicator size='small' color={theme.hoverColor} />
          </View>
        )}
        <ScrollView
          ref={scrollViewRef}
          className={`mb-${isSmallScreen ? '1' : '2'}`}
          scrollEventThrottle={250}
          onScroll={(event) => {
            if (isSending) return

            const scrollOffset = event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height
            setDisplayScrollButton(scrollOffset < event.nativeEvent.contentSize.height - 250)
          }}
          onContentSizeChange={(contentWidth: number, contentHeight: number) => {
            if (!isSending) return

            setDisplayScrollButton(true)
          }}
        >
          {filteredMessages.map((message: Message) => {
            const id = message.id || Helpers.generateUniqueId() + (isSending ? '-sending' : '')

            return (
              <MessageBubbleMemo
                key={id}
                isSending={isSending}
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
        {displayScrollButton && scrollToBottomEnabled && <ScrollToBottomButton />}
      </View>
    )
  },
)

MessageList.displayName = 'MessageList'
export default MessageList
