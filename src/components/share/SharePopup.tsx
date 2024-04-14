// Import necessary modules and components
import { CheckIcon, CloseIcon } from '@endeavorpal/assets'
import { useChat, useDirection, useScreenInfo } from '@endeavorpal/hooks'
import { AppDispatch, RootState } from '@endeavorpal/store'
import { getShareThreadUUID } from '@endeavorpal/store/actions/chatActions'
import { GetEnv, createGeneralThemedStyles } from '@endeavorpal/utils'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clipboard, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Toast from '../Toast'
import MessageList from '../chat/MessageList'

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
  const { isSmallScreen } = useScreenInfo()
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
  // Get environment variable
  const shareURL = GetEnv('SHARE_URL')

  // Function to copy share URL to clipboard
  const copyShareURL = async () => {
    const threadId = activeThread?.id
    setIsCopying(1)
    const response = await dispatch(
      getShareThreadUUID({
        threadId: threadId!,
      }),
    ).unwrap()
    Clipboard.setString(`${shareURL}/share/${response?.share_uuid}`)
    setIsCopying(2)
    setTimeout(() => {
      setIsCopying(0)
      onClose()
      setToastVisible(true)
    }, 1000) // 1000 milliseconds = 1 second
  }

  // Create general styles
  const generalStyle = createGeneralThemedStyles(theme, isRTL, isSmallScreen)
  // Create component styles
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
      backgroundColor: theme.splashBackgroundColor,
      fontFamily: 'Inter',
    },
    modalView: {
      width: isSmallScreen ? '100%' : 600,
      minHeight: 400,
      backgroundColor: theme.popupBackgroundColor,
      borderRadius: 4,
      overflowY: isSmallScreen ? 'scroll' : null,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: theme.primaryColor,
      width: '100%',
      padding: isSmallScreen ? 8 : 16,
    },
    modalBody: {
      alignContent: 'center',
      alignItems: 'center',
      width: '100%',
      padding: isSmallScreen ? 8 : 16,
    },
    modelFooter: {
      alignItems: isSmallScreen ? 'center' : 'flex-end',
      padding: isSmallScreen ? 8 : 16,
      paddingTop: 0,
    },
    title: {
      color: theme.textColor,
      fontSize: 20,
      fontWeight: 'bold',
      alignItems: 'center',
      fontFamily: 'Inter',
    },
    textStyle: {
      color: theme.textColor,
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: 21,
      marginBottom: 16,
      fontFamily: 'Inter',
    },
    successMessage: {
      color: theme.textColor,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: 21,
      marginLeft: isRTL ? null : 8,
      marginRight: isRTL ? 8 : null,
    },
    chatBox: {
      width: '100%',
      borderWist: 1,
      boarderColor: theme.primaryColor,
      backgroundColor: theme.backgroundColorSecondary,
      overflow: 'visible',
    },
  })

  // Render the component
  return (
    <>
      <Modal
        animationType='fade' // Animates the modal appearance
        transparent={true} // Makes the modal appear over the background
        onRequestClose={() => onClose()} // Handles the hardware back button on Android
        visible={visible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* Modal header */}
            <View style={styles.modalHeader}>
              <Text style={styles.title}>{t('share.title')}</Text>
              <Pressable onPress={() => onClose()}>
                <CloseIcon hoverFill={theme.hoverColor} />
              </Pressable>
            </View>
            {/* Modal body */}
            <View style={styles.modalBody}>
              <Text style={styles.textStyle}>{t('share.message')}</Text>
              <View style={styles.chatBox}>
                {/* Message list component */}
                <MessageList
                  activeThread={activeThread}
                  isLoading={false}
                  isSending={false}
                  reactionsEnabled={false}
                  scrollToBottomEnabled={false}
                  width='100%'
                />
              </View>
            </View>
            {/* Modal footer */}
            <View style={styles.modelFooter}>
              <Pressable
                style={[
                  generalStyle.buttonPrimary,
                  isHover === 1 && generalStyle.buttonPrimaryHover,
                  generalStyle.smallButton,
                  isSmallScreen ? generalStyle.fullWidth : null,
                ]}
                onPress={() => copyShareURL()}
                onMouseEnter={() => setIsHover(1)}
                onMouseLeave={() => setIsHover(-1)}
              >
                <Text style={[generalStyle.buttonPrimaryText, isHover === 1 && generalStyle.buttonPrimaryTextHover]}>
                  {isCopying === 1 ? t('share.copyingLink') : isCopying === 2 ? t('share.copied') : t('share.copyLink')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* Toast component */}
      {toastVisible && (
        <Toast
          message={
            <View style={{ flexDirection: 'row' }}>
              <CheckIcon fill={theme.iconFill} />
              <Text style={styles.successMessage}>{t('share.successCopy')}</Text>
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
