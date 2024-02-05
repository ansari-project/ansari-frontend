import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Message } from '../../store/types/chatTypes'
import Markdown from 'react-markdown'
import { UserIcon, LogoIcon } from '../../assets'
// import rehypeRaw from 'rehype-raw'

interface MessageBubbleProps {
  isOutgoing: boolean
  message: Message
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ isOutgoing, message }) => {
  // console.log('MessageBubble -->', isOutgoing, message)
  const messageStyle = isOutgoing ? styles.outgoingMessage : styles.incomingMessage
  const textStyle = isOutgoing ? styles.outgoingText : styles.incomingText

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
        <Markdown components={{ p: (props) => <Text style={[styles.messageText, textStyle]}>{props.children}</Text> }}>
          {message.content}
        </Markdown>
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
  outgoingMessage: {
    backgroundColor: '#f2f9ff', // A light green background for outgoing messages
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
