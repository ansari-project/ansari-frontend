import { CloseIcon, InfoIcon } from '@/components/svg'
import { useAuth, useDirection, useLogout, useScreenInfo, useToggleInfoPopup } from '@/hooks'
import { RootState } from '@/store'
import { createGeneralThemedStyles, GetEnv } from '@/utils'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Linking, Modal, Pressable, SafeAreaView, Text, View, StyleSheet, Platform, ScrollView } from 'react-native'
import * as Application from 'expo-application'
import { useSelector } from 'react-redux'
import { useRouter } from 'expo-router'
import Subscription from './Subscription'
import StyledText from './StyledText'

const InfoPopup: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { isSmallScreen, width } = useScreenInfo()
  const { isRTL } = useDirection()
  const isInfoPopupOpen = useSelector((state: RootState) => state.informationPopup.isOpen)
  const theme = useSelector((state: RootState) => state.theme.theme)
  const { isAuthenticated, isGuest } = useAuth()
  const toggleInfoPopup = useToggleInfoPopup()

  const togglePopup = () => {
    toggleInfoPopup(!isInfoPopupOpen)
  }

  const router = useRouter()
  const doLogout = useLogout()

  const register = async () => {
    if (isGuest) {
      // kill the current guest session
      await doLogout()
      // Direct to the registration screen
      router.push('/register')
    }
  }

  const generalStyle = createGeneralThemedStyles(theme, isRTL, isSmallScreen, width)
  const styles = StyleSheet.create({
    text: {
      width: '100%',
      color: theme.textColor,
      fontSize: 16,
      lineHeight: 24,
      textAlign: isRTL ? 'right' : 'left',
      marginBottom: 15,
      fontFamily: 'Inter',
    },
    textWithMargin: {
      marginBottom: 30,
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.textColor,
      fontFamily: 'Inter',
    },
    linkText: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      textDecorationLine: 'none',
      color: theme.linkColor,
    },
  })

  const guestMessage = () => {
    return (
      <Text className='flex-wrap' style={styles.text}>
        <Trans
          i18n={i18n}
          i18nKey='guestWelcomeMessage'
          values={{ email: GetEnv('FEEDBACK_EMAIL') }}
          components={{
            1: <Text style={styles.linkText} onPress={() => Linking.openURL(GetEnv('COMPREHENSIVE_GUIDE_URL'))} />,
            2: <Text style={styles.linkText} onPress={() => Linking.openURL(GetEnv('FEEDBACK_MAIL_TO'))} />,
            3: <Text style={styles.linkText} onPress={() => register()} />,
            4: <Text style={styles.linkText} onPress={() => Linking.openURL(GetEnv('SUBSCRIBE_URL'))} />,
          }}
        />
      </Text>
    )
  }

  const authenticatedMessage = () => {
    return (
      <Text className='' style={[styles.text, styles.textWithMargin]}>
        <Trans
          i18n={i18n}
          i18nKey='welcomeMessage'
          values={{ email: GetEnv('FEEDBACK_EMAIL') }}
          components={{
            1: <Text style={styles.linkText} onPress={() => Linking.openURL(GetEnv('COMPREHENSIVE_GUIDE_URL'))} />,
            2: <Text style={styles.linkText} onPress={() => Linking.openURL(GetEnv('FEEDBACK_MAIL_TO'))} />,
          }}
        />
      </Text>
    )
  }

  return (
    <View className=''>
      <Pressable onPress={() => togglePopup()} className='p-2 justify-center items-center rounded elevation-2'>
        <InfoIcon stroke={theme.iconFill} hoverStroke={theme.hoverColor} />
      </Pressable>

      <Modal animationType='fade' transparent={true} visible={isInfoPopupOpen}>
        <SafeAreaView className={`flex-1 justify-center items-end bg-[${theme.splashBackgroundColor}]`}>
          <View
            className={'h-full relative w-full max-w-[420px] rounded-none px-[5px] elevation-5'}
            style={{ backgroundColor: theme.popupBackgroundColor }}
          >
            <View className='flex-row w-full px-6 py-4 justify-between items-center gap-2 inline-flex'>
              <Text style={styles.titleText}>{t('welcomeMessageTitle')}</Text>
              <Pressable onPress={() => togglePopup()} className='p-2 border-0' hitSlop={8}>
                <CloseIcon fill={theme.primaryColor} hoverFill={theme.hoverColor} className='border-0' />
              </Pressable>
            </View>
            <ScrollView
              className={`my-${isSmallScreen ? '3' : '5'} mx-${isSmallScreen ? '2' : '3'} rounded-none p-[10px] elevation-5 gap-${isSmallScreen ? '2' : '4'}`}
            >
              {isAuthenticated && isGuest && guestMessage()}
              {isAuthenticated && !isGuest && authenticatedMessage()}

              <View className='items-center mt-auto'>{isSmallScreen && !isGuest && <Subscription />}</View>
            </ScrollView>
            <View className='w-full p-4 flex-col justify-center gap-4 items-center'>
              <Pressable style={generalStyle.buttonSecondary} onPress={() => togglePopup()}>
                <Text style={generalStyle.buttonSecondaryText}>{t('common:close')}</Text>
              </Pressable>
              {Platform.OS !== 'web' && (
                <StyledText textAlign='center' color='text' className='font-bold'>
                  Ansari Chat {Application.nativeApplicationVersion}
                </StyledText>
              )}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  )
}

export default InfoPopup
