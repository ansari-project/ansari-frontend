import { CloseIcon, InfoIcon } from '@/components/svg'
import { useAuth, useDirection, useLogout, useScreenInfo, useToggleInfoPopup } from '@/hooks'
import { RootState } from '@/store'
import { GetEnv } from '@/utils'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useRouter } from 'expo-router'
import Subscription from './Subscription'

const InfoPopup: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { isSmallScreen } = useScreenInfo()
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

  const styles = StyleSheet.create({
    button: {
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      elevation: 2,
    },
    toggleButton: {
      borderWidth: 0,
      padding: 8,
      elevation: 2,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-end',
      backgroundColor: theme.splashBackgroundColor,
      fontFamily: 'Inter',
    },
    modalView: {
      height: '100%',
      position: 'relative',
      width: '100%',
      maxWidth: 420,
      backgroundColor: theme.popupBackgroundColor,
      borderRadius: 0,
      paddingHorizontal: 5,
      alignItems: 'center',
      elevation: 5,
    },
    modalContent: {
      marginVertical: isSmallScreen ? 12 : 20,
      marginHorizontal: isSmallScreen ? 8 : 12,
      borderRadius: 0,
      padding: 10,
      alignItems: 'flex-start',
      elevation: 5,
      gap: isSmallScreen ? 8 : 16,
      flexGrow: 1, // make the modalContent view expand and fill the available space
    },
    text: {
      width: '100%',
      color: theme.textColor,
      fontSize: 16,
      lineHeight: 24,
      textAlign: isRTL ? 'right' : 'left',
      marginBottom: 15,
      fontFamily: 'Inter',
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.textColor,
      fontFamily: 'Inter',
    },
    infoContainer: {
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: 24,
      paddingVertical: 16,
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
      display: 'inline-flex',
    },
    bottomContainer: {
      alignItems: 'center',
      marginTop: 'auto', // push the bottomContent to the bottom of the modalContent view
    },
  })

  const guestMessage = () => {
    return (
      <Text style={styles.text}>
        <Trans
          i18n={i18n}
          i18nKey='guestWelcomeMessage'
          values={{ email: GetEnv('FEEDBACK_EMAIL') }}
          components={{
            1: (
              <Text
                style={{ textDecorationLine: 'none', color: theme.linkColor }}
                onPress={() => Linking.openURL(GetEnv('COMPREHENSIVE_GUIDE_URL'))}
              />
            ),
            2: (
              <Text
                style={{ textDecorationLine: 'none', color: theme.linkColor }}
                onPress={() => Linking.openURL(GetEnv('FEEDBACK_MAIL_TO'))}
              />
            ),
            3: <Text style={{ textDecorationLine: 'none', color: theme.linkColor }} onPress={() => register()} />,
            4: (
              <Text
                style={{ textDecorationLine: 'none', color: theme.linkColor }}
                onPress={() => Linking.openURL(GetEnv('SUBSCRIBE_URL'))}
              />
            ),
          }}
        />
      </Text>
    )
  }

  const authenticatedMessage = () => {
    return (
      <Text style={[styles.text, { marginBottom: 30 }]}>
        <Trans
          i18n={i18n}
          i18nKey='welcomeMessage'
          values={{ email: GetEnv('FEEDBACK_EMAIL') }}
          components={{
            1: (
              <Text
                style={{ textDecorationLine: 'none', color: theme.linkColor }}
                onPress={() => Linking.openURL(GetEnv('COMPREHENSIVE_GUIDE_URL'))}
              />
            ),
            2: (
              <Text
                style={{ textDecorationLine: 'none', color: theme.linkColor }}
                onPress={() => Linking.openURL(GetEnv('FEEDBACK_MAIL_TO'))}
              />
            ),
          }}
        />
      </Text>
    )
  }

  return (
    <>
      <Pressable onPress={() => togglePopup()} style={styles.button}>
        <InfoIcon stroke={theme.iconFill} hoverStroke={theme.hoverColor} />
      </Pressable>

      <Modal animationType='fade' transparent={true} visible={isInfoPopupOpen}>
        <View style={styles.container}>
          <View style={styles.modalView}>
            <View style={styles.infoContainer}>
              <Text style={styles.titleText}>{t('welcomeMessageTitle')}</Text>
              <Pressable onPress={() => togglePopup()} style={styles.toggleButton} hitSlop={8}>
                <CloseIcon fill={theme.primaryColor} hoverFill={theme.hoverColor} style={{ borderWidth: 0 }} />
              </Pressable>
            </View>
            <View style={styles.modalContent}>
              {isAuthenticated && isGuest && guestMessage()}
              {isAuthenticated && !isGuest && authenticatedMessage()}

              <View style={styles.bottomContainer}>{isSmallScreen && !isGuest && <Subscription />}</View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default InfoPopup
