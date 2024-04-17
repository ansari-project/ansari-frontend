import { useAuth, useScreenInfo } from '@endeavorpal/hooks'
import { RootState } from '@endeavorpal/store'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import ActionButtons from './ActionButtons'
import Subscription from './Subscription'
import TermsAndPrivacy from './TermsAndPrivacy'
import { NameContainer } from './menu'

const Footer: React.FC = () => {
  const { t } = useTranslation()
  const { isMobile, isSmallScreen } = useScreenInfo()
  const { isAuthenticated, isGuest } = useAuth()
  const displayName = !(isAuthenticated && isGuest && (isMobile || isSmallScreen))
  const theme = useSelector((state: RootState) => state.theme.theme)
  const isInputFullMode = useSelector((state: RootState) => state.input.fullMode)

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      zIndex: 10,
      paddingHorizontal: isSmallScreen ? 16 : 24,
      paddingVertical: isAuthenticated ? null : 16,
    },
    footerTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 6,
    },
    footerText: {
      fontSize: 12,
      lineHeight: 21,
      fontWight: 300,
      fontFamily: 'Inter',
      color: theme.textColor,
    },
  })

  if (isInputFullMode) {
    return null
  }

  return (
    <View style={styles.container}>
      {isAuthenticated && isGuest && (
        <View style={{ marginHorizontal: 10 }}>
          <NameContainer
            name={t('welcomeGuestText') as string}
            initial={t('welcomeGuest') as string}
            nameColor={theme.textColor}
            displayName={displayName}
          />
        </View>
      )}
      {(!isAuthenticated || isGuest) && !isMobile && <ActionButtons isTop={false} />}
      {isAuthenticated && (
        <View style={{ flex: 1 }}>
          <View style={styles.footerTextContainer}>
            <Text style={styles.footerText}>{t('authorizedFooterText')}</Text>
            <Subscription />
          </View>
        </View>
      )}
      {!isAuthenticated && <TermsAndPrivacy />}
    </View>
  )
}

export default Footer
