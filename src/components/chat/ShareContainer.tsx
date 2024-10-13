import { useChat, useScreenInfo } from '@endeavorpal/hooks'
import { RootState } from '@endeavorpal/store'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import ENButton from '../buttons/ENButton'
import MessageList, { MessageListRef } from './MessageList'

const ShareContainer: React.FC = () => {
  const { activeThread } = useChat()
  const sideMenuWidth = useSelector((state: RootState) => state.sideMenu.width)
  const theme = useSelector((state: RootState) => state.theme.theme)
  const { t } = useTranslation()
  const navigate = useNavigate()

  // State to track the last known content height
  const messageListRef = React.useRef<MessageListRef>(null)
  const { contentWidth } = useScreenInfo(sideMenuWidth)
  const startChat = () => {
    navigate('/')
  }

  // Clean up the abort controller on unmount or when the component is no longer active
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollToBottom()
    }
  }, [])

  const styles = StyleSheet.create({
    shareContainer: {
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
      paddingTop: '5vh',
      paddingBottom: '20vh',
    },
    threadTitle: {
      fontSize: 24,
      lineHeight: 48,
      color: theme.textColor,
    },
    header: {
      width: contentWidth,
      marginHorizontal: 'auto',
      borderBottomWidth: 1,
      borderColor: theme.primaryColor,
      marginBottom: 16,
    },
    button: {
      maxWidth: 320,
      marginHorizontal: 'auto',
    },
  })

  return (
    <View style={[styles.shareContainer, { maxWidth: contentWidth }]}>
      <View style={styles.header}>
        <Text style={styles.threadTitle}>{activeThread?.name || t('newChat')}</Text>
      </View>
      <MessageList
        activeThread={activeThread}
        isLoading={false}
        isSending={false}
        reactionsEnabled={false}
        isShare={true}
      />
      <View style={styles.button}>
        <ENButton text={t('share.getStart')} onClick={startChat} />
      </View>
    </View>
  )
}

export default ShareContainer
