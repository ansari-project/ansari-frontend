import { useChat, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { useRouter } from 'expo-router'
import ENButton from '../buttons/ENButton'
import MessageList, { MessageListRef } from './MessageList'
import StyledText from '../StyledText'

const ShareContainer: React.FC = () => {
  const { activeThread } = useChat()
  const sideMenuWidth = useSelector((state: RootState) => state.sideMenu.width)
  const theme = useSelector((state: RootState) => state.theme.theme)
  const { t } = useTranslation()
  const router = useRouter()

  // State to track the last known content height
  const messageListRef = React.useRef<MessageListRef>(null)
  const { contentWidth } = useScreenInfo(sideMenuWidth)

  const startChat = () => {
    router.push('/')
  }

  // Clean up the abort controller on unmount or when the component is no longer active
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollToBottom()
    }
  }, [])

  return (
    <View className='flex flex-1 w-full justify-end' style={{ maxWidth: contentWidth }}>
      <View
        className='w-full mx-auto mb-4 border-b'
        style={{
          width: contentWidth,
          borderColor: theme.primaryColor,
        }}
      >
        <StyledText className='text-2xl leading-12' color='text'>
          {activeThread?.name || t('newChat')}
        </StyledText>
      </View>
      <View className='flex-1 w-full items-center justify-center'>
        <MessageList
          activeThread={activeThread}
          isLoading={false}
          isSending={false}
          reactionsEnabled={false}
          isShare={true}
        />
      </View>
      <View className='max-w-[320px] mx-auto'>
        <ENButton text={t('share.getStart')} onClick={startChat} />
      </View>
    </View>
  )
}

export default ShareContainer
