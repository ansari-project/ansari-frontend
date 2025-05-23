// Import necessary modules and components
import { CheckIcon, CloseIcon } from '@/components/svg'
import { useChat, useDirection, useScreenInfo } from '@/hooks'
import { AppDispatch, RootState } from '@/store'
import { getShareThreadId } from '@/store/actions/chatActions'
import { createGeneralThemedStyles, GetEnv } from '@/utils'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, ScrollView, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Toast from '../Toast'
import MessageList from '../chat/MessageList'
import StyledText from '../StyledText'
import Clipboard from '@react-native-clipboard/clipboard'

// Define Props interface for SharePopup component
interface Props {
  visible: boolean
  onClose: () => void
}

// Define the SharePopup component
const SharePopup: React.FC<Props> = ({ visible, onClose }) => {
  // Localization hook
  const { t } = useTranslation()
  // Screen information hook
  const { isSmallScreen, width } = useScreenInfo()
  // Redux hooks
  const theme = useSelector((state: RootState) => state.theme.theme)
  const { activeThread } = useChat()
  const dispatch = useDispatch<AppDispatch>()
  // State variables
  const [isHover, setIsHover] = useState<number>(0)
  const [isCopying, setIsCopying] = useState<number>(0)
  const [toastVisible, setToastVisible] = useState<boolean>(false)
  // Direction hook
  const { isRTL } = useDirection()
  const generalStyle = createGeneralThemedStyles(theme, isRTL, isSmallScreen, width)
  // Get environment variable
  const shareURL = GetEnv('SHARE_URL')

  // Function to copy share URL to clipboard
  const copyShareURL = async () => {
    const threadId = activeThread?.id
    setIsCopying(1)
    const response = await dispatch(
      getShareThreadId({
        threadId: threadId!,
      }),
    ).unwrap()
    Clipboard.setString(`${shareURL}/share/${response?.share_id}`)
    setIsCopying(2)
    setTimeout(() => {
      setIsCopying(0)
      onClose()
      setToastVisible(true)
    }, 1000) // 1000 milliseconds = 1 second
  }

  return (
    <>
      <Modal animationType='fade' transparent={true} onRequestClose={() => onClose()} visible={visible}>
        <View
          className='flex-1 justify-center items-center px-6'
          style={{ backgroundColor: theme.splashBackgroundColor }}
        >
          <View
            className={`${isSmallScreen ? 'w-full' : 'w-[600px]'} h-[400px] rounded`}
            style={{
              backgroundColor: theme.popupBackgroundColor,
            }}
          >
            {/* Modal header */}
            <View
              className={`flex-row justify-between items-center w-full border-b ${isSmallScreen ? 'p-2' : 'p-4'}`}
              style={{ borderColor: theme.primaryColor }}
            >
              <StyledText className='text-xl font-bold'>{t('share.title')}</StyledText>
              <Pressable onPress={() => onClose()}>
                <CloseIcon hoverFill={theme.hoverColor} />
              </Pressable>
            </View>
            {/* Modal body */}
            <ScrollView className={`w-full ${isSmallScreen ? 'p-2' : 'p-4'}`} contentContainerClassName='items-center'>
              <StyledText className='font-bold text-sm leading-[21px] mb-4'>{t('share.message')}</StyledText>
              <View
                className=''
                style={{
                  borderColor: theme.primaryColor,
                  backgroundColor: theme.backgroundColorSecondary,
                }}
              >
                <MessageList
                  activeThread={activeThread}
                  isLoading={false}
                  isSending={false}
                  reactionsEnabled={false}
                  scrollToBottomEnabled={false}
                  width='100%'
                />
              </View>
            </ScrollView>
            {/* Modal footer */}
            <View className={`${isSmallScreen ? 'items-center' : 'items-end'} ${isSmallScreen ? 'p-2' : 'p-4'}`}>
              <Pressable
                className={`py-2 px-4 rounded ${isSmallScreen ? 'w-full' : ''}`}
                style={[generalStyle.buttonPrimary]}
                onPress={() => copyShareURL()}
                onMouseEnter={() => setIsHover(1)}
                onMouseLeave={() => setIsHover(-1)}
              >
                <StyledText className='text-center font-bold'>
                  {isCopying === 1 ? t('share.copyingLink') : isCopying === 2 ? t('share.copied') : t('share.copyLink')}
                </StyledText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* Toast component */}
      {toastVisible && (
        <Toast
          message={
            <View className='flex-row'>
              <CheckIcon fill={theme.iconFill} />
              <StyledText className={`font-bold text-sm leading-[21px] ${isRTL ? 'mr-2' : 'ml-2'}`}>
                {t('share.successCopy')}
              </StyledText>
            </View>
          }
          duration={3000}
          onDismiss={() => setToastVisible(false)}
          backgroundColor={theme.hoverColor}
        />
      )}
    </>
  )
}

export default SharePopup
