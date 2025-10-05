import { LogoIcon } from '@/components/svg'
import ActionButtons from '@/components/ActionButtons'
import StyledText from '@/components/StyledText'
import { ENButton, WelcomeFeatureRow, WelcomeFooter } from '@/components'
import { useDirection, useGuest, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import { createGeneralThemedStyles } from '@/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'

const Welcome: React.FC = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()

  const { guestLoading, handleGuestLogin } = useGuest()
  const { isRTL } = useDirection()
  const { isSmallScreen, width } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)
  const generalStyle = createGeneralThemedStyles(theme, isRTL, isSmallScreen, width)


  return (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)']}
      locations={[0, 0.6, 1]}
      style={{ flex: 1 }}
    >
      <View
        className={`absolute w-full px-6 flex ${isRTL ? 'items-start' : 'items-end'} z-50`}
        style={{ top: Math.max(insets.top, 24) + 12 }}
      >
        <ActionButtons isTop={true} />
      </View>
      <View className='flex-1 w-full flex flex-col justify-center items-center p-6'>
        <View className='w-full max-w-[400px] items-center'>
          <View className='items-center mb-4'>
            <LogoIcon fill={theme.darkGreenColor} width={64} height={64} />
          </View>
          <View className='items-center mb-6'>
            <StyledText
              variant='h3'
              textAlign='center'
              className='uppercase tracking-widest'
              style={{ color: theme.darkGreenColor, marginBottom: 6, fontFamily: 'Exo2' }}
            >
              {t('welcomeHeadingSmall', { defaultValue: t('greeting') })}
            </StyledText>
            <StyledText
              variant='h1'
              textAlign='center'
              style={{ color: theme.darkGreenColor, width: 500, fontFamily: 'Exo2-Bold' }}
            >
              {t('welcomeHeadingMain', { defaultValue: t('ansariChat') })}
            </StyledText>
          </View>


          <View
            className='rounded-[16px] p-4 mb-[34px]'
            style={{
              borderWidth: 1,
              borderColor: theme.darkGreenColor,
            }}
          >
            <View
              style={{
                width: 230,
              }}
            >
              <Text
                className='text-[16px] leading-[24px] text-center'
                style={{
                  color: '#000000',
                  fontStyle: 'italic',
                  fontFamily: 'Exo2-Bold-Italic',
                }}
              >
                {t('welcomeBlurb', {
                  defaultValue:
                    'Built by Muslims, trained with care - designed to guide with sources, not guesses.',
                })}
              </Text>
            </View>
          </View>

          <View className='w-full mb-8'>
            <View className={`flex-col ${isRTL ? 'items-end' : 'items-start'} gap-3`}>
              <WelcomeFeatureRow
                iconName="information"
                text={t('welcomeFeatureSourceBased', { defaultValue: 'Get Source-Based Guidance Anytime' })}
              />
              <WelcomeFeatureRow
                iconName="chat"
                text={t('welcomeFeatureSaveChats', {
                  defaultValue: 'Save your chats and pick up where you left off.',
                })}
              />
              <WelcomeFeatureRow
                iconName="check"
                text={t('welcomeFeatureQuickEasy', { defaultValue: 'Quick and easy registration' })}
              />
              <WelcomeFeatureRow
                iconName="logo"
                text={t('welcomeFeatureJoinToday', { defaultValue: 'Join Ansari today!' })}
              />
            </View>
          </View>
          <View className='w-full items-center'>
            <ENButton
              text={t('createAccount', { defaultValue: 'Create an account' })}
              onClick={() => router.push('/register')}
              isSubmitting={false}
              buttonStyle={{
                marginBottom: 12,
                borderRadius: 16,
                width: '100%',
                paddingVertical: 20,
                backgroundColor: theme.darkGreenColor,
                alignItems: 'center',
              }}
              buttonTextStyle={{
                fontSize: 20,
                color: '#FFFFFF',
              }}
            />
            <ENButton
              text={t('logInCta', { defaultValue: 'Log-in' })}
              onClick={() => router.push('/login')}
              isSubmitting={false}
              buttonStyle={{
                ...generalStyle.buttonSecondary,
                marginBottom: 12,
                borderRadius: 16,
                width: '100%',
                paddingVertical: 20,
                backgroundColor: 'rgba(22,160,133, 0.4)',
                alignItems: 'center',
                borderWidth: 0,

              }}
              buttonTextStyle={{
                color: '#000000',
                fontSize: 20,
              }}
            />
            <ENButton
              text={t('continueAsGuestLimited', { defaultValue: 'Continue as guest (limited access)' })}
              submittingText={t('login:submitting')}
              onClick={handleGuestLogin}
              isSubmitting={guestLoading}
              buttonStyle={{
                backgroundColor: 'transparent',
                marginTop: 4,
              }}
              buttonTextStyle={{
                color: '#000000',
                fontSize: 14,
                textAlign: 'center',
              }}
            />
          </View>
        </View>
      </View>
      <WelcomeFooter />
    </LinearGradient>
  )
}

export default Welcome
