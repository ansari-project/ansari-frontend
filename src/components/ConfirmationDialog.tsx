import { RootState } from '@/store'
import { createGeneralThemedStyles } from '@/utils'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, Text, View } from 'react-native'
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

  return (
    <Modal visible={visible} transparent={true} animationType='fade' onRequestClose={onCancel}>
      <View className='flex-1 justify-center items-center' style={{ backgroundColor: theme.splashBackgroundColor }}>
        <View
          className={`m-5 rounded p-6 items-center ${isSmallScreen ? 'w-[90%]' : 'w-full max-w-[448px]'}`}
          style={{ backgroundColor: theme.popupBackgroundColor }}
        >
          {title && (
            <Text
              className={`text-xl font-bold mb-[10px] pb-[25px] w-full border-b border-black/10 font-['Inter'] ${
                isRTL ? 'text-right' : 'text-left'
              }`}
              style={{ color: theme.textColor }}
            >
              {title}
            </Text>
          )}
          <Text
            className={`mb-5 w-full font-['Inter'] ${isRTL ? 'text-right' : 'text-left'}`}
            style={{ color: theme.textColor }}
          >
            {message}
          </Text>
          <View className={`mt-[15px] w-full justify-end gap-3 ${stacked ? 'flex-col' : 'flex-row'}`}>
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
