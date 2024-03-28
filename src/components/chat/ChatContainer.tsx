import { LogoIcon, LogoTextIcon } from '@endeavorpal/assets'
import { useChat, useScreenInfo } from '@endeavorpal/hooks'
import { RootState } from '@endeavorpal/store'
import React, { useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import PromptList from '../prompts/PromptList'
import ChatInput from './ChatInput'
import MessageList, { MessageListRef } from './MessageList'

type ChatContainerProps = {
  isHome: boolean
}

const ChatContainer: React.FC<ChatContainerProps> = ({ isHome }) => {
  const navigate = useNavigate()
  const { isLoading, activeThread, inputText, setInputText, isSending, sendNewMessage, abortRequest } = useChat()
  const sideMenuWidth = useSelector((state: RootState) => state.sideMenu.width)
  const theme = useSelector((state: RootState) => state.theme.theme)

  // State to track the last known content height
  const messageListRef = React.useRef<MessageListRef>(null)
  const { contentWidth, isSmallScreen } = useScreenInfo(sideMenuWidth)

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
    logoContainer: {
      alignItems: 'center', // Center content horizontally
      paddingBottom: '20vh',
    },
  })

  return (
    <View style={[styles.chatContainer, { maxWidth: contentWidth }]}>
      {isHome ? (
        isLoading || activeThread?.messages ? (
          <MessageList ref={messageListRef} activeThread={activeThread} isLoading={isLoading} isSending={isSending} />
        ) : (
          <View style={{ width: contentWidth }}>
            <View style={styles.contentWrapper}>
              <View style={styles.logoContainer}>
                {!isSmallScreen && (
                  <View style={{ margin: 25 }}>
                    <LogoIcon fill={theme.iconFill} width={122} height={122} />
                  </View>
                )}
                <LogoTextIcon fill={theme.logoColor} />
              </View>
              <View style={[styles.promptContent, isSmallScreen && styles.promptSmallScreen]}>
                <PromptList onPromptSelect={handlePromptSelect} />
              </View>
            </View>
          </View>
        )
      ) : (
        <MessageList ref={messageListRef} activeThread={activeThread} isLoading={isLoading} isSending={isSending} />
      )}
      <View style={{ width: contentWidth }}>
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
