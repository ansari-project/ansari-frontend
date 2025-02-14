import { LogoRoundIcon } from '@/components/svg'
import { useAuth, useDirection, useScreenInfo } from '@/hooks'
import { AppDispatch, FeedbackClass, FeedbackRequest, Message, RootState, sendFeedback } from '@/store'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-native-markdown-display'
import { StyleSheet, Text, View } from 'react-native'
import UserAvatar from 'react-native-user-avatar'
import { useDispatch, useSelector } from 'react-redux'
import ReactionButtons from './ReactionButtons'

export type MessageBubbleProps = {
  threadId: string
  isSending: boolean
  isOutgoing: boolean
  message: Message
  reactionsEnabled?: boolean
  width?: string | number
  isShare?: boolean
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  threadId,
  isSending,
  isOutgoing,
  message,
  reactionsEnabled,
  width,
  isShare,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { isRTL } = useDirection()
  const { isSmallScreen, contentWidth } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)
  const { t } = useTranslation()
  const { user } = useAuth()

  const handelOnSendFeedback = useCallback(
    (threadId: string, messageId: string, feedbackClass: FeedbackClass, comment: string) => {
      const feedbackRequest: FeedbackRequest = {
        threadId,
        messageId,
        feedbackClass,
        comment,
      }
      dispatch(sendFeedback({ feedbackRequest }))
    },
    [],
  )

  const styles = StyleSheet.create({
    messageBubble: {
      width: width || contentWidth,
      padding: isSmallScreen ? 8 : 10,
      marginVertical: 4,
      marginHorizontal: 'auto',
      borderRadius: 4,
      gap: isSmallScreen ? 8 : 16,
      display: 'flex',
      flexDirection: 'row',
      flexGrow: 1,
      alignSelf: 'flex-start',
    },
    senderName: {
      fontWeight: 600,
      fontSize: 16,
      lineHeight: 20,
      marginBottom: 16,
      marginTop: 6,
      color: theme.primaryColor,
    },
    contentWrapper: {
      flex: 1,
      color: theme.primaryColor,
    },
    iconsWrapper: {
      display: 'flex',
      flexDirection: 'row',
    },
    avatar: {
      borderRadius: 4,
      padding: 16,
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    messageText: {
      fontFamily: 'Inter',
      lineHeight: 21,
      textAlign: isRTL ? 'right' : 'left',
    },
    outgoingText: {
      color: theme.primaryColor,
      fontWeight: 600,
    },
    incomingText: {
      color: theme.primaryColor,
      fontWeight: 500,
      paddingBottom: 16,
      alignSelf: 'flex-start',
    },
  })

  const textStyle = isOutgoing ? styles.outgoingText : styles.incomingText

  return (
    <View style={styles.messageBubble}>
      {/* <Markdown components={{ p: Text }} rehypePlugins={[rehypeRaw]}> */}
      {isOutgoing ? (
        <View style={styles.avatar}>
          <UserAvatar
            size={34}
            name={`${user?.firstName} ${user?.lastName}`}
            textColor={theme.textColor}
            bgColor={theme.yellowColor}
            textStyle={{ fontWeight: 'bold', fontSize: 14 }}
          />
        </View>
      ) : (
        <View style={styles.avatar}>
          <LogoRoundIcon width='32' height='32' fill={theme.iconFill} color={theme.buttonPrimaryBackground} />
        </View>
      )}
      <View style={{ flexShrink: 1, width: '100%' }}>
        <Text style={styles.senderName}>{isOutgoing ? (isShare ? t('anonymous') : t('you')) : t('ansariChat')}</Text>
        <View style={styles.contentWrapper}>
          <Markdown
            style={{
              body: [styles.messageText, textStyle],
            }}
          >
            {message.content}
          </Markdown>
        </View>
        {!isOutgoing && !isSending && reactionsEnabled && (
          <View style={[styles.iconsWrapper]} key={message.id}>
            <ReactionButtons
              threadId={threadId}
              messageId={message.id}
              message={message}
              onSendFeedback={handelOnSendFeedback}
            />
          </View>
        )}
      </View>
    </View>
  )
}

export default MessageBubble
