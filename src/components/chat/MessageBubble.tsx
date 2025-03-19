import { LogoRoundIcon } from '@/components/svg'
import { useAuth, useDirection, useScreenInfo } from '@/hooks'
import { AppDispatch, FeedbackClass, FeedbackRequest, Message, RootState, sendFeedback } from '@/store'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-native-markdown-display'
import { StyleSheet, View, Platform, ActivityIndicator } from 'react-native'
import { Avatar } from '@kolking/react-native-avatar'
import { useDispatch, useSelector } from 'react-redux'
import ReactionButtons from './ReactionButtons'
import StyledText from '../StyledText'

export type MessageBubbleProps = {
  threadId: string
  isSending: boolean
  displayActivity: boolean
  isOutgoing: boolean
  message: Message
  reactionsEnabled?: boolean
  width?: string | number
  isShare?: boolean
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  threadId,
  isSending,
  displayActivity,
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
    messageText: {
      fontFamily: 'Inter',
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
    avatarText: {
      fontWeight: 'bold',
      fontSize: 14,
      color: theme.textColor,
    },
  })

  const textStyle = isOutgoing ? styles.outgoingText : styles.incomingText
  const mdContent = message.content.replaceAll('`', '\\`').replace('<thinking>', '```').replace('</thinking>', '```')

  return (
    <View
      className={`mx-1 my-1 rounded flex flex-row flex-grow self-start ${isSmallScreen ? 'p-2 gap-2' : 'p-2.5 gap-4'}`}
      style={{ width: width || contentWidth }}
    >
      {isOutgoing ? (
        <View className='rounded px-5 py-2 w-8 h-8 items-center justify-center'>
          <Avatar
            size={34}
            name={`${user?.firstName} ${user?.lastName}`}
            color={theme.yellowColor}
            textStyle={styles.avatarText}
          />
        </View>
      ) : (
        <View className='rounded px-5 py-2 w-8 h-8 items-center justify-center'>
          {displayActivity ? (
            <ActivityIndicator size='small' color={theme.hoverColor} />
          ) : (
            <LogoRoundIcon width='32' height='32' fill={theme.iconFill} color={theme.buttonPrimaryBackground} />
          )}
        </View>
      )}
      <View className='flex-shrink w-full'>
        <StyledText className='text-base leading-5 font-semibold mb-3 mt-1.5' color='primary' textAlign='left'>
          {isOutgoing ? (isShare ? t('anonymous') : t('you')) : t('ansariChat')}
        </StyledText>
        <View className='flex-1 px-1'>
          <Markdown
            style={{
              body: [styles.messageText, textStyle],
              ...markdownStyles,
            }}
          >
            {mdContent}
          </Markdown>
        </View>
        {!isOutgoing && !isSending && reactionsEnabled && (
          <View className='flex flex-row' key={message.id}>
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

// Source: https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/styles.js
const markdownStyles = {
  // Headings
  heading1: {
    flexDirection: 'row',
    fontSize: 20,
    marginVertical: 5,
  },
  heading2: {
    flexDirection: 'row',
    fontSize: 18,
    lineHeight: 24,
  },
  heading3: {
    flexDirection: 'row',
    fontSize: 18,
    lineHeight: 24,
  },
  heading4: {
    flexDirection: 'row',
    fontSize: 16,
  },
  heading5: {
    flexDirection: 'row',
    fontSize: 13,
  },
  heading6: {
    flexDirection: 'row',
    fontSize: 11,
  },

  // Horizontal Rule
  hr: {
    backgroundColor: '#000000',
    height: 1,
  },

  // Emphasis
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  s: {
    textDecorationLine: 'line-through',
  },

  // Blockquotes
  blockquote: {
    backgroundColor: '#F5F5F533',
    borderColor: '#CCC',
    borderLeftWidth: 4,
    marginLeft: 5,
    paddingHorizontal: 5,
    marginVertical: 5,
    borderRadius: 10,
  },

  // Lists
  // eslint-disable-next-line camelcase
  bullet_list: {},
  // eslint-disable-next-line camelcase
  ordered_list: {},
  // eslint-disable-next-line camelcase
  list_item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  // @pseudo class, does not have a unique render rule
  // eslint-disable-next-line camelcase
  bullet_list_icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  // @pseudo class, does not have a unique render rule
  // eslint-disable-next-line camelcase
  bullet_list_content: {
    flex: 1,
  },
  // @pseudo class, does not have a unique render rule
  // eslint-disable-next-line camelcase
  ordered_list_icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  // @pseudo class, does not have a unique render rule
  // eslint-disable-next-line camelcase
  ordered_list_content: {
    flex: 1,
  },

  // Code
  // eslint-disable-next-line camelcase
  code_inline: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#F5F5F533',
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ['ios']: {
        fontFamily: 'Inter',
      },
      ['android']: {
        fontFamily: 'Inter',
      },
    }),
  },
  // eslint-disable-next-line camelcase
  code_block: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#F5F5F533',
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ['ios']: {
        fontFamily: 'Inter',
      },
      ['android']: {
        fontFamily: 'Inter',
      },
    }),
  },
  fence: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#F5F5F533',
    padding: 10,
    borderRadius: 4,
    ...Platform.select({
      ['ios']: {
        fontFamily: 'Inter',
      },
      ['android']: {
        fontFamily: 'Inter',
      },
    }),
  },

  // Tables
  table: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 3,
  },
  thead: {},
  tbody: {},
  th: {
    flex: 1,
    padding: 5,
  },
  tr: {
    borderBottomWidth: 1,
    borderColor: '#000000',
    flexDirection: 'row',
  },
  td: {
    flex: 1,
    padding: 5,
  },

  // Links
  link: {
    textDecorationLine: 'underline',
  },
  blocklink: {
    flex: 1,
    borderColor: '#000000',
    borderBottomWidth: 1,
  },

  // Images
  image: {
    flex: 1,
  },

  // Text Output
  text: {},
  textgroup: {},
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  hardbreak: {
    width: '100%',
    height: 1,
  },
  softbreak: {},

  // Believe these are never used but retained for completeness
  pre: {},
  inline: {},
  span: {},
}

export default MessageBubble
