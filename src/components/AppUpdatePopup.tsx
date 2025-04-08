import React, { useCallback } from 'react'
import { Text, View, Linking, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useDirection } from '@/hooks/useDirection'
import { useScreenInfo } from '@/hooks/useScreenInfo'
import ConfirmationDialog from './ConfirmationDialog'

interface AppUpdatePopupProps {
  isForced: boolean
  visible: boolean
  onDismiss?: () => void
}

const AppUpdatePopup: React.FC<AppUpdatePopupProps> = ({ isForced, visible, onDismiss }) => {
  const { t } = useTranslation()
  const { isRTL } = useDirection()
  const { isSmallScreen } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)

  const openPlayStore = useCallback(async (packageName: string) => {
    try {
      await Linking.openURL(`market://details?id=${packageName}`)
    } catch (error) {
      console.error('Error opening Play Store:', error)
      await Linking.openURL(`https://play.google.com/store/apps/details?id=${packageName}`)
    }
  }, [])

  const openAppStore = useCallback(async (appId: string) => {
    try {
      await Linking.openURL(`itms-apps://itunes.apple.com/app/id${appId}`)
    } catch (error) {
      console.error('Error opening App Store:', error)
      await Linking.openURL(`https://apps.apple.com/app/id${appId}`)
    }
  }, [])

  const handleUpdate = useCallback(() => {
    if (Platform.OS === 'android') {
      openPlayStore('chat.ansari.app')
    }
    if (Platform.OS === 'ios') {
      openAppStore('6743072108')
    }
  }, [openAppStore, openPlayStore])

  const UpdateMessage = (
    <View>
      <Text
        className={`text-lg mb-2 font-bold ${isRTL ? 'text-right' : 'text-left'}`}
        style={{ color: theme.textColor }}
      >
        {isForced ? t('common:updateRequired') : t('common:updateAvailable')}
      </Text>
      <Text className={`${isRTL ? 'text-right' : 'text-left'}`} style={{ color: theme.textColor }}>
        {isForced ? t('common:updateRequiredDescription') : t('common:updateAvailableDescription')}
      </Text>
    </View>
  )

  return (
    <ConfirmationDialog
      isRTL={isRTL}
      isSmallScreen={isSmallScreen}
      visible={visible}
      onConfirm={handleUpdate}
      onCancel={onDismiss || (() => {})}
      message={UpdateMessage}
      confirmButtonText={t('common:updateNow')}
      cancelButtonText={t('common:updateLater')}
      canCancel={!isForced}
      confirmIsPrimary={true}
      stacked={false}
    />
  )
}

export default AppUpdatePopup
