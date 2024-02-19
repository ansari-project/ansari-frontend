import {
  CheckIcon,
  CopyIcon,
  DislikeFilledIcon,
  DislikeIcon,
  LikeFilledIcon,
  LikeIcon,
  LogoIcon,
  UserIcon,
} from '@endeavorpal/assets'
import { useDirection } from '@endeavorpal/hooks'
import { Message } from '@endeavorpal/store'
import React, { useCallback, useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { Clipboard, Pressable, StyleSheet, Text, View } from 'react-native'
// import rehypeRaw from 'rehype-raw'

interface MessageBubbleProps {
  isOutgoing: boolean
  message: Message
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ isOutgoing, message }) => {
  const { isRTL } = useDirection()
  const [copySuccess, setCopySuccess] = useState<boolean>(false)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)

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

  const handleLikePress = useCallback(() => {
    console.log('Like!')
    setSelectedIcon('like')
  }, [setSelectedIcon])

  const handleDislikePress = useCallback(() => {
    console.log('Dislike!')
    setSelectedIcon('dislike')
  }, [setSelectedIcon])

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
        {!isOutgoing && (
          <View style={[styles.iconsWrapper]}>
            <Pressable onPress={copyMessage} style={(styles.icon, iconMargin)}>
              {copySuccess ? <CheckIcon width={20} height={20} /> : <CopyIcon width={20} height={20} />}
            </Pressable>
            <Pressable onPress={handleDislikePress} style={(styles.icon, iconMargin)}>
              {selectedIcon === 'dislike' ? (
                <DislikeFilledIcon width={20} height={20} />
              ) : (
                <DislikeIcon width={20} height={20} />
              )}
            </Pressable>
            <Pressable onPress={handleLikePress} style={(styles.icon, iconMargin)}>
              {selectedIcon === 'like' ? (
                <LikeFilledIcon width={20} height={20} />
              ) : (
                <LikeIcon width={20} height={20} />
              )}
            </Pressable>
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
