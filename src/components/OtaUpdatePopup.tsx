import React, { useCallback } from 'react'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useDirection } from '@/hooks/useDirection'
import { useScreenInfo } from '@/hooks/useScreenInfo'
import ConfirmationDialog from './ConfirmationDialog'

interface OtaUpdatePopupProps {
  visible: boolean
  isCritical: boolean
  onUpdate: () => void
  onDismiss: () => void
}

const OtaUpdatePopup: React.FC<OtaUpdatePopupProps> = ({ visible, isCritical, onUpdate, onDismiss }) => {
  const { t } = useTranslation()
  const { isRTL } = useDirection()
  const { isSmallScreen } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)

  const handleUpdate = useCallback(() => {
    onUpdate()
  }, [onUpdate])

  const UpdateMessage = (
    <View>
      <Text
        className={`text-lg mb-2 font-bold ${isRTL ? 'text-right' : 'text-left'}`}
        style={{ color: theme.textColor }}
      >
        {t('common:otaUpdateAvailable')}
      </Text>
      <Text className={`${isRTL ? 'text-right' : 'text-left'}`} style={{ color: theme.textColor }}>
        {t('common:otaUpdateDescription')}
      </Text>
    </View>
  )

  return (
    <ConfirmationDialog
      isRTL={isRTL}
      isSmallScreen={isSmallScreen}
      visible={visible}
      onConfirm={handleUpdate}
      onCancel={onDismiss}
      message={UpdateMessage}
      confirmButtonText={t('common:updateNow')}
      cancelButtonText={t('common:updateLater')}
      canCancel={!isCritical}
      confirmIsPrimary={true}
      stacked={false}
    />
  )
}

export default OtaUpdatePopup
