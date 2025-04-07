import { RootState } from '@/store'
import { createGeneralThemedStyles } from '@/utils'
import React from 'react'
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
  confirmButtonText?: string // Optional custom text for the confirm button
  cancelButtonText?: string // Optional custom text for the cancel button
  canCancel?: boolean // Controls whether the cancel button is shown, defaults to true
  confirmIsPrimary?: boolean // Controls whether the confirm button is styled as primary, defaults to false
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
  confirmButtonText,
  cancelButtonText,
  canCancel = true,
  confirmIsPrimary = false,
}) => {
  const { t } = useTranslation()
  const theme = useSelector((state: RootState) => state.theme.theme)

  // Add your styles here
  const generalStyle = createGeneralThemedStyles(theme, isRTL, isSmallScreen)

  return (
    <Modal visible={visible} transparent={true} animationType='fade' onRequestClose={canCancel ? onCancel : undefined}>
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
            {canCancel && (
              <Pressable
                style={[
                  !confirmIsPrimary ? generalStyle.buttonPrimary : generalStyle.buttonSecondary,
                  generalStyle.smallButton,
                ]}
                onPress={onCancel}
              >
                <Text style={!confirmIsPrimary ? generalStyle.buttonPrimaryText : generalStyle.buttonSecondaryText}>
                  {cancelButtonText || t('cancel')}
                </Text>
              </Pressable>
            )}
            <Pressable
              style={[
                confirmIsPrimary ? generalStyle.buttonPrimary : generalStyle.buttonSecondary,
                generalStyle.smallButton,
              ]}
              onPress={onConfirm}
            >
              <Text style={confirmIsPrimary ? generalStyle.buttonPrimaryText : generalStyle.buttonSecondaryText}>
                {confirmButtonText || t('delete')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ConfirmationDialog
