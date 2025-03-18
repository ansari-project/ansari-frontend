import { useDirection, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import { createGeneralThemedStyles } from '@/utils'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import StyledText from '@/components/StyledText'
import { LogoIcon } from '@/components/svg'
import ConfirmationDialog from '@/components/ConfirmationDialog'
import { useDeleteAccount } from '@/hooks/useDeleteAccount'

const DeleteAccountScreen: React.FC = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { isRTL } = useDirection()
  const { isSmallScreen, width } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)
  const doDeleteAccount = useDeleteAccount()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const generalStyle = createGeneralThemedStyles(theme, isRTL, isSmallScreen, width)

  const handleDeleteAccount = async () => {
    setShowConfirmation(false)
    setIsLoading(true)
    setError(null)

    try {
      await doDeleteAccount()
      router.push('/welcome')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Failed to delete account')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={generalStyle.formContainer}>
      <View style={generalStyle.form}>
        <View className='items-center py-2'>
          <LogoIcon fill={theme.iconFill} width={52} height={52} />
        </View>
        <StyledText variant='h2' color='primary' className='mb-6' textAlign='center'>
          {t('deleteAccount')}
        </StyledText>

        <StyledText className='mb-8 text-center'>{t('deleteAccountMessage')}</StyledText>

        {error && <Text style={generalStyle.errorText}>{error}</Text>}

        <Pressable
          style={[generalStyle.buttonPrimary, isLoading && generalStyle.buttonDisabled]}
          onPress={() => setShowConfirmation(true)}
          disabled={isLoading}
        >
          <Text style={generalStyle.buttonPrimaryText}>{isLoading ? 'Processing...' : t('deleteAccount')}</Text>
        </Pressable>

        <Pressable className='mt-4' onPress={() => router.back()}>
          <StyledText style={generalStyle.link}>{t('cancel')}</StyledText>
        </Pressable>
      </View>

      <ConfirmationDialog
        visible={showConfirmation}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowConfirmation(false)}
        title={t('deleteAccountTitle')}
        message={t('deleteAccountMessage')}
        isRTL={isRTL}
        isSmallScreen={isSmallScreen}
        confirmButtonText={t('deleteAccountConfirm')}
      />
    </View>
  )
}

export default DeleteAccountScreen
