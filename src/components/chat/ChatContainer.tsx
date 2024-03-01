import { useChat, useScreenInfo } from '@endeavorpal/hooks'
import React, { useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useNavigate } from 'react-router-dom'
import PromptList from '../prompts/PromptList'
import Welcome from '../welcome/Welcome'
import ChatInput from './ChatInput'
import MessageList, { MessageListRef } from './MessageList'

type ChatContainerProps = {
  isHome: boolean
}

const ChatContainer: React.FC<ChatContainerProps> = ({ isHome }) => {
  const navigate = useNavigate()
  const { isLoading, activeThread, inputText, setInputText, isSending, sendNewMessage, abortRequest } = useChat()
  // State to track the last known content height

  const messageListRef = React.useRef<MessageListRef>(null)

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
        navigate(`/chat/${result.threadId}`) // Navigate to the chat screen with the new thread ID
      }
    },
    [inputText, isSending, activeThread?.id, isHome, sendNewMessage, navigate],
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

  const { actualPaddingHorizontal, contentWidth, isSmallScreen } = useScreenInfo()

  return (
    <View style={[styles.chatContainer]}>
      {isHome ? (
        isLoading || activeThread?.messages ? (
          <MessageList
            ref={messageListRef}
            activeThread={activeThread}
            isLoading={isLoading}
            isSending={isSending}
            actualPaddingHorizontal={actualPaddingHorizontal}
          />
        ) : (
          <View style={{ marginHorizontal: actualPaddingHorizontal, width: contentWidth }}>
            <View style={styles.contentWrapper}>
              <Welcome />
              <View style={[styles.promptContent, isSmallScreen ? styles.promptSmallScreen : styles.promptLargeScreen]}>
                <PromptList onPromptSelect={handlePromptSelect} />
              </View>
            </View>
          </View>
        )
      ) : (
        <MessageList
          ref={messageListRef}
          activeThread={activeThread}
          isLoading={isLoading}
          isSending={isSending}
          actualPaddingHorizontal={actualPaddingHorizontal}
        />
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
  contentWrapper: {
    width: '100%', // Use full width for smaller screens
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    flex: 1,
  },
  promptContent: {
    width: '100%', // Ensure it uses the full width of its container
    alignItems: 'flex-start', // Center items for consistency
  },
  promptSmallScreen: {
    alignItems: 'stretch',
  },
  promptLargeScreen: {
    // alignItems: 'stretch',
  },
})

export default ChatContainer
