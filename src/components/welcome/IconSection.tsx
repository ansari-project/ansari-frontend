import { useToggleInfoPopup } from '@endeavorpal/hooks'
import { i18n } from 'i18next'
import React from 'react'
import { Trans } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'

interface IconSectionProps {
  icon: React.ReactNode
  i18n: i18n
  i18nKeyMobile: string
  i18nKeyDesktop: string
  isSmallScreen: boolean
  textStyles: object
  transValues?: object
  onPress?: () => void
}

const IconSection: React.FC<IconSectionProps> = ({
  icon,
  i18n,
  i18nKeyMobile,
  i18nKeyDesktop,
  isSmallScreen,
  textStyles,
  transValues,
  onPress,
}) => {
  const toggleInfoPopup = useToggleInfoPopup()

  return (
    <View style={styles.iconRow}>
      {icon}
      <Pressable onPress={onPress || (() => toggleInfoPopup(true))} style={{ flexShrink: 1 }}>
        <Text style={[styles.text, textStyles]}>
          <Trans
            i18n={i18n}
            parent={Text}
            i18nKey={isSmallScreen ? i18nKeyMobile : i18nKeyDesktop}
            components={{
              1: <Text style={styles.linkText} />,
            }}
            values={transValues}
          />
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
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
})

export default IconSection
