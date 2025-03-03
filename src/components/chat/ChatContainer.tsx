import { LogoIcon, LogoTextIcon } from '@/components/svg'
import { useChat, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import React, { useCallback, useEffect } from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { useRouter } from 'expo-router'
import PromptList from '../prompts/PromptList'
import ChatInput from './ChatInput'
import MessageList, { MessageListRef } from './MessageList'

type ChatContainerProps = {
  isHome: boolean
}

const ChatContainer: React.FC<ChatContainerProps> = ({ isHome }) => {
  const router = useRouter()
  const { isLoading, activeThread, inputText, setInputText, isSending, sendNewMessage, abortRequest } = useChat()
  const sideMenuWidth = useSelector((state: RootState) => state.sideMenu.width)
  const theme = useSelector((state: RootState) => state.theme.theme)
  const isInputFullMode = useSelector((state: RootState) => state.input.fullMode)

  // State to track the last known content height
  const messageListRef = React.useRef<MessageListRef>(null)
  const { width, contentWidth, isSmallScreen } = useScreenInfo(sideMenuWidth)

  const handleSendPress = useCallback(
    async (prompt?: string) => {
      const promptToPass = typeof prompt === 'string' ? prompt : inputText
      if (!promptToPass.trim() || isSending) return

      const result = await sendNewMessage(promptToPass, activeThread?.id)
      if (result.error) {
        console.error('Message sending error:', result.error)
        // Handle error (e.g., show a toast notification)
      }
      if (isHome && result.threadId) {
        router.push(`/chat/${result.threadId}`) // Navigate to the chat screen with the new thread ID
      }
    },
    [inputText, isSending, activeThread?.id, isHome, sendNewMessage, router],
  )

  const handleCancelSend = useCallback(() => {
    abortRequest()
  }, [])

  // Clean up the abort controller on unmount or when the component is no longer active
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollToBottom()
    }
    return () => {
      handleCancelSend()
    }
  }, [])

  const handlePromptSelect = (description: string) => {
    setInputText(description)
    // handleSendPress(description)
  }

  return (
    <View className='flex-1 justify-end'>
      {isHome ? (
        isLoading || activeThread?.messages ? (
          <MessageList ref={messageListRef} activeThread={activeThread} isLoading={isLoading} isSending={isSending} />
        ) : (
          <View
            className='flex-grow'
            style={{
              width: isInputFullMode ? width : contentWidth,
              marginHorizontal: isInputFullMode ? undefined : 'auto',
            }}
          >
            <View className='items-center justify-end flex-1'>
              <View className='items-center pt-[40px] pb-[150px]'>
                {!isSmallScreen && (
                  <View className='m-6'>
                    <LogoIcon fill={theme.iconFill} width={122} height={122} />
                  </View>
                )}
                <LogoTextIcon fill={theme.logoColor} />
              </View>
              <View className={`w-full ${isSmallScreen ? 'items-stretch' : 'items-start'}`}>
                <PromptList onPromptSelect={handlePromptSelect} />
              </View>
            </View>
          </View>
        )
      ) : (
        <MessageList ref={messageListRef} activeThread={activeThread} isLoading={isLoading} isSending={isSending} />
      )}
      <View
        style={{
          width: isInputFullMode ? width : contentWidth,
          marginHorizontal: isInputFullMode ? undefined : 'auto',
        }}
      >
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

export default ChatContainer
