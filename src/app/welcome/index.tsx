import { LogoIcon, LogoTextIcon } from '@/components/svg'
import ActionButtons from '@/components/ActionButtons'
import StyledText from '@/components/StyledText'
import TermsAndPrivacy from '@/components/TermsAndPrivacy'
import { useDirection, useGuest, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import { createGeneralThemedStyles } from '@/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useRouter } from 'expo-router'

const Welcome: React.FC = () => {
  const router = useRouter()
  const { t } = useTranslation()

  const { guestLoading, handleGuestLogin } = useGuest()
  const { isRTL } = useDirection()
  const { isSmallScreen, width } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)
  const generalStyle = createGeneralThemedStyles(theme, isRTL, isSmallScreen, width)

  return (
    <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View className={`flex-1 w-full flex ${isSmallScreen ? 'flex-col' : 'flex-row'} justify-center items-center`}>
        <View className={`${isSmallScreen ? 'w-full h-auto' : 'w-[70%] h-full'} justify-between p-6`}>
          <View className={`${isSmallScreen ? 'flex-col' : 'flex-row'} items-center ${isSmallScreen ? 'mb-6' : ''}`}>
            <LogoIcon fill={theme.iconFill} width={52} height={52} />
            <LogoTextIcon
              fill={theme.logoColor}
              width={81}
              className={`${isRTL || isSmallScreen ? '' : 'ml-2'} ${isRTL && !isSmallScreen ? 'mr-2' : ''}`}
            />
          </View>
          <View>
            <StyledText variant='h1' className='font-normal' color={theme.textColor}>
              {t('greeting')}
            </StyledText>
            <StyledText variant='h1' className='font-bold' color='yellow'>
              {t('ansariChat')}
            </StyledText>
          </View>
          <View>{!isSmallScreen && <ActionButtons isTop={false} />}</View>
        </View>
        <View
          className={`${isSmallScreen ? 'w-full h-auto' : 'w-[30%] h-full my-auto'} justify-center items-center p-6 ${
            isSmallScreen ? 'bg-transparent' : ''
          }`}
          style={{
            backgroundColor: isSmallScreen ? undefined : theme.backgroundColor,
          }}
        >
          <View className='w-full items-center px-[10%]'>
            <StyledText variant='h2' className='font-semibold mb-4'>
              {t('getStarted')}
            </StyledText>
            <Pressable
              style={[generalStyle.buttonPrimary, generalStyle.fullWidth]}
              onPress={() => router.push('/login')}
            >
              <StyledText style={generalStyle.buttonPrimaryText}>{t('login')}</StyledText>
            </Pressable>
            <Pressable
              className='border'
              style={[
                generalStyle.buttonPrimary,
                generalStyle.fullWidth,
                {
                  backgroundColor: theme.popupBackgroundColor,
                  borderColor: theme.buttonSecondaryBorderColor,
                },
              ]}
              onPress={() => router.push('/register')}
            >
              <StyledText style={generalStyle.buttonSecondaryText}>{t('register')}</StyledText>
            </Pressable>
            <Pressable
              style={[
                generalStyle.buttonSecondary,
                generalStyle.fullWidth,
                guestLoading && generalStyle.buttonDisabled,
              ]}
              onPress={handleGuestLogin}
              disabled={guestLoading}
            >
              <StyledText style={[generalStyle.buttonSecondaryText, guestLoading && generalStyle.buttonTextDisabled]}>
                {guestLoading ? t('login:submitting') : t('login:guestLogin')}
              </StyledText>
            </Pressable>
          </View>
        </View>
        <View className='absolute bottom-6'>
          <TermsAndPrivacy marginLeft={0} />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default Welcome
