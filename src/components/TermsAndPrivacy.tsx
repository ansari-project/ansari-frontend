import { useDirection, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import getEnv from '@/utils/getEnv'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

type Props = {
  marginLeft?: number | string
}

const TermsAndPrivacy: React.FC<Props> = ({ marginLeft = -40 }) => {
  const { t } = useTranslation()
  const { isRTL } = useDirection()
  const { isMobile } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)

  const styles = StyleSheet.create({
    terms: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      marginLeft: isMobile ? (isRTL ? marginLeft : 0) : isRTL ? 0 : marginLeft,
    },
    footerText: {
      fontSize: 12,
      lineHeight: 21,
      fontWeight: 300,
      fontFamily: 'Inter',
      color: theme.textColor,
    },
    pressableContainer: {
      paddingHorizontal: 8,
    },
  })

  return (
    <View style={styles.terms}>
      <Pressable
        style={styles.pressableContainer}
        onPress={() => {
          // Open the subscription URL in a new tab on web, and in the system browser on native
          if (typeof window !== 'undefined' && 'open' in window) {
            window.open(getEnv('TERMS_URL'), '_blank')
          } else {
            Linking.openURL(getEnv('TERMS_URL'))
          }
        }}
      >
        <Text style={styles.footerText}>{t('termOfUse')}</Text>
      </Pressable>
      <Text style={styles.footerText}>|</Text>
      <Pressable
        style={styles.pressableContainer}
        onPress={() => {
          // Open the subscription URL in a new tab on web, and in the system browser on native
          if (typeof window !== 'undefined' && 'open' in window) {
            window.open(getEnv('PRIVACY_URL'), '_blank')
          } else {
            Linking.openURL(getEnv('PRIVACY_URL'))
          }
        }}
      >
        <Text style={styles.footerText}>{t('privacyPolicy')}</Text>
      </Pressable>
    </View>
  )
}

export default TermsAndPrivacy
