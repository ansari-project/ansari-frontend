import { LogoIcon, LogoTextIcon, CheckIcon, ChatIcon, LogoRoundIcon, InformationGreenIcon } from '@/components/svg'
import ActionButtons from '@/components/ActionButtons'
import StyledText from '@/components/StyledText'
import TermsAndPrivacy from '@/components/TermsAndPrivacy'
import { useDirection, useGuest, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import { createGeneralThemedStyles } from '@/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'
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

  const hexToRgba = (hex: string, alpha: number) => {
    const sanitized = hex.replace('#', '')
    const bigint = parseInt(sanitized, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return (
    <View className='flex-1' style={{ backgroundColor: '#FFFFFF' }}>
      <View className={`absolute top-6 w-full px-6 flex ${isRTL ? 'items-start' : 'items-end'}`}>
        <ActionButtons isTop={true} />
      </View>
      <View className='flex-1 w-full flex flex-col justify-center items-center p-6'>
        <View className='w-full max-w-[400px] items-center'>
          <View className='items-center mb-4'>
            <LogoIcon fill='#08786B' width={64} height={64} />
          </View>
          <View className='items-center mb-6'>
            <StyledText
              variant='h2'
              className='uppercase tracking-widest text-center'
              style={{ color: '#08786B' }}
            >
              {t('welcomeHeadingSmall', { defaultValue: t('greeting') })}
            </StyledText>
            <StyledText
              variant='h1'
              className='font-extrabold text-center'
              style={{ color: '#08786B' }}
            >
              {t('welcomeHeadingMain', { defaultValue: t('ansariChat') })}
            </StyledText>
          </View>

          <View className='w-full mb-6'>
            <View
              className='w-full rounded-2xl border p-4 shadow-md'
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#D9D9D9',
              }}
            >
              <StyledText textAlign='center' style={{ color: '#231414', fontStyle: 'italic' }}>
                {t('welcomeBlurb', {
                  defaultValue:
                    'Built by Muslims, trained with care - designed to guide with sources, not guesses.',
                })}
              </StyledText>
            </View>
          </View>

          <View className='w-full mb-8'>
            <View className={`flex-col ${isRTL ? 'items-end' : 'items-start'} gap-3`}>
              <View className={`flex-row ${isRTL ? 'flex-row-reverse' : ''} items-start`}>
                <InformationGreenIcon width={20} height={20} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
                <StyledText style={{ color: '#231414' }}>
                  {t('welcomeFeatureSourceBased', { defaultValue: 'Get Source-Based Guidance Anytime' })}
                </StyledText>
              </View>
              <View className={`flex-row ${isRTL ? 'flex-row-reverse' : ''} items-start`}>
                <ChatIcon width={20} height={20} fill='#08786B' className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
                <StyledText style={{ color: '#231414' }}>
                  {t('welcomeFeatureSaveChats', {
                    defaultValue: 'Save your chats and pick up where you left off.',
                  })}
                </StyledText>
              </View>
              <View className={`flex-row ${isRTL ? 'flex-row-reverse' : ''} items-start`}>
                <CheckIcon width={20} height={20} fill='#08786B' className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
                <StyledText style={{ color: '#231414' }}>
                  {t('welcomeFeatureQuickEasy', { defaultValue: 'Quick and easy registration' })}
                </StyledText>
              </View>
              <View className={`flex-row ${isRTL ? 'flex-row-reverse' : ''} items-start`}>
                <LogoRoundIcon width={20} height={20} fill='#08786B' className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
                <StyledText style={{ color: '#231414' }}>
                  {t('welcomeFeatureJoinToday', { defaultValue: 'Join Ansari today!' })}
                </StyledText>
              </View>
            </View>
          </View>
          <View className='w-full items-center'>
            <Pressable
              className='w-full rounded-2xl py-4 mb-3'
              style={{
                backgroundColor: '#08786B',
              }}
              onPress={() => router.push('/register')}
            >
              <StyledText style={{ color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
                {t('createAccount', { defaultValue: 'Create an account' })}
              </StyledText>
            </Pressable>
            <Pressable
              className='w-full rounded-2xl py-4 mb-3'
              style={{
                backgroundColor: 'rgba(8, 120, 107, 0.15)',
              }}
              onPress={() => router.push('/login')}
            >
              <StyledText style={{ color: '#231414', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
                {t('logInCta', { defaultValue: 'Log-in' })}
              </StyledText>
            </Pressable>
            <Pressable
              className='mt-1'
              accessibilityRole='link'
              accessibilityLabel={t('continueAsGuestLimited', { defaultValue: 'Continue as guest (limited access)' })}
              onPress={handleGuestLogin}
              disabled={guestLoading}
            >
              <StyledText
                className={`${guestLoading ? 'opacity-60' : ''}`}
                style={{ color: '#231414', textAlign: 'center', fontSize: 14 }}
              >
                {guestLoading
                  ? t('login:submitting')
                  : t('continueAsGuestLimited', { defaultValue: 'Continue as guest (limited access)' })}
              </StyledText>
            </Pressable>
          </View>
        </View>
      </View>
      <View className='absolute bottom-6 w-full items-center'>
        <TermsAndPrivacy marginLeft={0} />
      </View>
    </View>
  )
}

export default Welcome
