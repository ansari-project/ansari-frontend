import { FlagIcon, LanguageIcon } from '@endeavorpal/assets'
import { useDirection, useScreenInfo, useToggleInfoPopup } from '@endeavorpal/hooks'
import { GetEnv } from '@endeavorpal/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, Text, View } from 'react-native'
import IconSection from './IconSection'

const Welcome: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { isRTL } = useDirection()
  const { isSmallScreen } = useScreenInfo()

  const toggleInfoPopup = useToggleInfoPopup()

  const textStyles = isRTL ? { marginRight: 16, textAlign: 'right' } : { marginLeft: 16, textAlign: 'left' }

  return (
    <View style={[styles.container, isSmallScreen ? styles.fullWidth : styles.reducedWidth]}>
      <Text style={styles.text}>{t('gettingWrongSometimes')}</Text>
      <IconSection
        icon={<FlagIcon />}
        i18n={i18n}
        i18nKeyMobile='flaggingInstructions.mobile'
        i18nKeyDesktop='flaggingInstructions.desktop'
        isSmallScreen={isSmallScreen}
        textStyles={textStyles}
        transValues={{ email: GetEnv('FEEDBACK_EMAIL') }}
        onPress={isSmallScreen ? () => toggleInfoPopup(true) : () => Linking.openURL(GetEnv('FEEDBACK_MAIL_TO'))}
      />
      <IconSection
        icon={<LanguageIcon />}
        i18n={i18n}
        i18nKeyMobile='multilingualMessage.mobile'
        i18nKeyDesktop='multilingualMessage.desktop'
        isSmallScreen={isSmallScreen}
        textStyles={textStyles}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F280',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 10,
    alignItems: 'flex-start',
  },
  fullWidth: {
    width: '100%',
  },
  reducedWidth: {
    width: '100%',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16, // Replace gap with marginTop for React Native compatibility
  },
  text: {
    fontSize: 16,
    color: '#343434',
    fontFamily: 'Roboto',
    lineHeight: 24,
  },
  linkText: {
    fontSize: 16,
    textDecorationLine: 'underline',
    color: '#08786B',
    fontFamily: 'Roboto',
    lineHeight: 24,
  },
  // Add more styles if needed
})

export default Welcome
