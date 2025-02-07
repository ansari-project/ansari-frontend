import { LogoIcon, LogoTextIcon } from '@/components/svg'
import ActionButtons from '@/components/ActionButtons'
import TermsAndPrivacy from '@/components/TermsAndPrivacy'
import { useDirection, useGuest, useRedirect, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import { createGeneralThemedStyles } from '@/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useRouter } from 'expo-router'

const Welcome: React.FC = () => {
  const router = useRouter()
  const urlParams = new URLSearchParams(location.search)
  useRedirect('/', '/welcome' + (urlParams.size ? `?${urlParams.toString()}` : ''))
  const { t } = useTranslation()
  const navigate = useRouter()

  const { guestLoading, handleGuestLogin } = useGuest()
  const { isRTL } = useDirection()
  const { isSmallScreen, width, height } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)

  const containerHeight = isSmallScreen ? height - 70 : height
  // Styles
  const generalStyle = createGeneralThemedStyles(theme, isRTL, isSmallScreen, width)
  const styles = StyleSheet.create({
    container: {
      flex: isSmallScreen ? null : 1,
      color: theme.primaryColor,
      width: '100%',
      display: 'flex',
      flexDirection: isSmallScreen ? 'column' : 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: containerHeight,
    },
    left: {
      width: isSmallScreen ? '100%' : '70%',
      height: isSmallScreen ? 'auto' : '100%',
      justifyContent: 'space-between',
      padding: 24,
    },
    logo: {
      flexDirection: isSmallScreen ? 'column' : 'row',
      alignItems: 'center',
      marginBottom: isSmallScreen ? 24 : null,
    },
    logoText: {
      marginLeft: isRTL || isSmallScreen ? 'initial' : 8,
      marginRight: isRTL && !isSmallScreen ? 8 : 'initial',
    },
    right: {
      width: isSmallScreen ? '100%' : '30%',
      height: isSmallScreen ? 'auto' : '100%',
      backgroundColor: isSmallScreen ? 'transparent' : theme.backgroundColor,
      marginVertical: isSmallScreen ? null : 'auto',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    rightBody: { width: '100%', alignItems: 'center', paddingHorizontal: '10%' },
    rightFooter: { position: isSmallScreen ? 'fixed' : 'absolute', bottom: 24 },
    rightTitle: {
      fontSize: 24,
      lineHeight: 29,
      fontWeight: 600,
      fontFamily: 'Inter',
      color: theme.textColor,
      marginBottom: 16,
    },
    leftGreeting: {
      fontSize: isSmallScreen ? 18 : 42,
      lineHeight: isSmallScreen ? 21 : 50,
      textAlign: isSmallScreen ? 'center' : isRTL ? 'right' : 'left',
      fontWeight: 400,
      fontFamily: 'Inter',
      color: theme.textColor,
    },
    leftTitle: {
      fontSize: isSmallScreen ? 18 : 42,
      lineHeight: isSmallScreen ? 21 : 50,
      textAlign: isSmallScreen ? 'center' : isRTL ? 'right' : 'left',
      fontWeight: 700,
      fontFamily: 'Inter',
      color: theme.yellowColor,
    },
    register: { backgroundColor: theme.popupBackgroundColor },
  })

  return (
    <>
      <KeyboardAvoidingView
        style={[styles.container, isSmallScreen && { width }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.left}>
          <View style={styles.logo}>
            <LogoIcon fill={theme.iconFill} width={52} height={52} />

            <LogoTextIcon fill={theme.logoColor} width={81} style={styles.logoText} />
          </View>
          <View style={styles.content}>
            <Text style={styles.leftGreeting}>{t('greeting')}</Text>
            <Text style={styles.leftTitle}>{t('ansariChat')}</Text>
          </View>
          <View>{!isSmallScreen && <ActionButtons isTop={false} />}</View>
        </View>
        <View style={styles.right}>
          <View style={styles.rightBody}>
            <Text style={styles.rightTitle}>{t('getStarted')}</Text>
            <Pressable style={[generalStyle.buttonPrimary, generalStyle.fullWidth]} onPress={() => navigate('/login')}>
              <Text style={generalStyle.buttonPrimaryText}>{t('login')}</Text>
            </Pressable>
            <Pressable
              style={[generalStyle.buttonSecondary, generalStyle.fullWidth, styles.register]}
              onPress={() => router.push('/register')}
            >
              <Text style={generalStyle.buttonSecondaryText}>{t('register')}</Text>
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
              <Text style={[generalStyle.buttonSecondaryText, guestLoading && generalStyle.buttonTextDisabled]}>
                {guestLoading ? t('login:submitting') : t('login:guestLogin')}
              </Text>
            </Pressable>
          </View>
          <View style={styles.rightFooter}>
            <TermsAndPrivacy marginLeft={0} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  )
}

export default Welcome
