import { CheckIcon, CopyIcon, LogoIcon, UserIcon } from '@endeavorpal/assets'
import { useDirection } from '@endeavorpal/hooks'
import { AppDispatch, FeedbackClass, FeedbackRequest, Message, sendFeedback } from '@endeavorpal/store'
import React, { useCallback, useEffect, useState } from 'react'
import Markdown from 'react-markdown' // import rehypeRaw from 'rehype-raw'
import { Clipboard, Pressable, StyleSheet, Text, View } from 'react-native'
import { useDispatch } from 'react-redux'

import ReactionButtons from './ReactionButtons'

export type MessageBubbleProps = {
  threadId: string
  isSending: boolean
  isOutgoing: boolean
  message: Message
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ threadId, isSending, isOutgoing, message }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { isRTL } = useDirection()
  const [copySuccess, setCopySuccess] = useState<boolean>(false)

  const messageStyle = isOutgoing ? styles.outgoingMessage : styles.incomingMessage
  const textStyle = isOutgoing ? styles.outgoingText : styles.incomingText
  const textAlign = isRTL ? 'right' : 'left'
  const iconMargin = isRTL ? styles.iconMarginRight : styles.iconMarginLeft

  const copyMessage = useCallback(() => {
    Clipboard.setString(message.content)
    setCopySuccess(true)
  }, [message.content])

  useEffect(() => {
    if (copySuccess) {
      const timeoutId = setTimeout(() => {
        setCopySuccess(false)
      }, 1000) // Hide the CheckIcon after 1 second
      return () => clearTimeout(timeoutId)
    }
  }, [copySuccess])

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

  return (
    <View style={[styles.messageBubble, messageStyle]}>
      {/* <Markdown components={{ p: Text }} rehypePlugins={[rehypeRaw]}> */}
      {isOutgoing ? (
        <View style={[styles.avatar, styles.outgoingAvatar]}>
          <UserIcon />
        </View>
      ) : (
        <View style={[styles.avatar, styles.incomingAvatar]}>
          <LogoIcon width='32' height='32' />
        </View>
      )}
      <View style={{ flexShrink: 1 }}>
        <View style={styles.contentWrapper}>
          <Markdown
            components={{
              p: (props) => <Text style={[styles.messageText, textStyle, { textAlign }]}>{props.children}</Text>,
            }}
          >
            {message.content}
          </Markdown>
        </View>
        {!isOutgoing && !isSending && (
          <View style={[styles.iconsWrapper]} key={message.id}>
            <Pressable onPress={copyMessage} style={(styles.icon, iconMargin)}>
              {copySuccess ? <CheckIcon width={20} height={20} /> : <CopyIcon width={20} height={20} />}
            </Pressable>
            <ReactionButtons threadId={threadId} messageId={message.id} onSendFeedback={handelOnSendFeedback} />
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  messageBubble: {
    width: '100%',
    padding: 10,
    marginVertical: 4,
    borderRadius: 4,
    gap: 16,
  },
  contentWrapper: {
    flex: 1,
  },
  iconsWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  iconMarginLeft: {
    marginLeft: 8,
  },
  iconMarginRight: {
    marginRight: 8,
  },
  icon: {
    width: 20,
    height: 20,
  },
  outgoingMessage: {
    backgroundColor: '#f2f9ff', // A light green background for outgoing messages
    alignItems: 'center',
    alignSelf: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
  },
  incomingMessage: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    backgroundColor: '#fff', // White background for incoming messages
    alignSelf: 'flex-start',
  },
  avatar: {
    borderRadius: 4,
    padding: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outgoingAvatar: {
    backgroundColor: '#f29b02',
  },
  incomingAvatar: {
    backgroundColor: '#fff',
  },
  messageText: {
    fontFamily: 'Roboto',
  },
  outgoingText: {
    color: '#09786b',
    fontWeight: 'bold',
  },
  incomingText: {
    fontWeight: 500,
    paddingBottom: 16,
    alignSelf: 'flex-start',
  },
})

export default MessageBubble
