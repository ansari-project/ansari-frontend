import { RootState } from '@/store'
import { createGeneralThemedStyles } from '@/utils'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

type ConfirmationDialogProps = {
  stacked?: boolean
  isSmallScreen?: boolean
  isRTL: boolean // Indicates if the layout direction is right-to-left
  visible: boolean // Controls the visibility of the modal
  onConfirm: () => void // Function to call when the confirm action is triggered
  onCancel: () => void // Function to call when the cancel action is triggered
  title?: string // Optional title text
  message: React.ReactNode // Message content, can be a string or a component for custom styling
}

/**
 * A dialog component to confirm or cancel an action, with support for RTL layouts.
 */
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  stacked = false,
  isSmallScreen = false,
  isRTL,
  visible,
  onConfirm,
  onCancel,
  title,
  message,
}) => {
  const { t } = useTranslation()
  const theme = useSelector((state: RootState) => state.theme.theme)
  const [isHover, setIsHover] = useState<number>(0)

  // Add your styles here
  const generalStyle = createGeneralThemedStyles(theme, isRTL, isSmallScreen)
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.splashBackgroundColor,
    },
    modalView: {
      margin: 20,
      backgroundColor: theme.popupBackgroundColor,
      borderRadius: 4,
      padding: 24,
      alignItems: 'center',
      maxWidth: isSmallScreen ? undefined : 448,
      width: isSmallScreen ? '90%' : '100%',
    },
    buttonContainer: {
      flexDirection: stacked ? 'column' : 'row',
      marginTop: 15,
      width: '100%',
      justifyContent: 'flex-end',
      gap: 12,
    },
    titleStyle: {
      color: theme.textColor,
      fontFamily: 'Inter',
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      paddingBottom: 25,
      borderBottomWidth: 1,
      borderColor: 'rgba(0,0,0,0.1)',
      width: '100%',
      textAlign: isRTL ? 'right' : 'left',
    },
    messageContainer: {
      color: theme.textColor,
      fontFamily: 'Inter',
      marginBottom: 20,
      width: '100%',
      textAlign: isRTL ? 'right' : 'left',
    },
  })

  return (
    <Modal visible={visible} transparent={true} animationType='fade' onRequestClose={onCancel}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {title && <Text style={styles.titleStyle}>{title}</Text>}
          <Text style={styles.messageContainer}>{message}</Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[
                generalStyle.buttonSecondary,
                isHover === 0 && generalStyle.buttonPrimary,
                generalStyle.smallButton,
              ]}
              onPress={onCancel}
              onMouseEnter={() => setIsHover(0)}
              onMouseLeave={() => setIsHover(-1)}
            >
              <Text style={[generalStyle.buttonSecondaryText, isHover === 0 && generalStyle.buttonPrimaryText]}>
                {t('cancel')}
              </Text>
            </Pressable>
            <Pressable
              style={[
                generalStyle.buttonSecondary,
                isHover === 1 && generalStyle.buttonPrimary,
                generalStyle.smallButton,
              ]}
              onPress={onConfirm}
              onMouseEnter={() => setIsHover(1)}
              onMouseLeave={() => setIsHover(-1)}
            >
              <Text style={[generalStyle.buttonSecondaryText, isHover === 1 && generalStyle.buttonPrimaryText]}>
                {t('delete')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ConfirmationDialog
