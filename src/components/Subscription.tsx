import { useAuth } from '@/hooks'
import { RootState } from '@/store'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Linking, Pressable, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * Subscription Component
 *
 * This component is used to render a subscription link with internationalized text.
 * It uses the `Trans` component from `react-i18next` for language translation, ensuring
 * the component text changes according to the currently selected language.
 */
const Subscription: React.FC = () => {
  // Hook from react-i18next to access i18n instance
  // The i18n instance provides the current language information and translation functionality.
  // When the language changes, the useTranslation hook in the component will force this component to re-render itself.
  const { i18n } = useTranslation()
  const theme = useSelector((state: RootState) => state.theme.theme)
  const { isAuthenticated, isGuest } = useAuth()

  // Allow the component to render only when the user is not authenticated or is a guest
  if (isAuthenticated && !isGuest) {
    return null
  }

  return (
    // Wrap the Pressable component in a View component to allow styling the container
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
      }}
    >
      <Pressable
        style={{ flexShrink: 1 }}
        onPress={() => {
          // Open the subscription URL in a new tab on web, and in the system browser on native
          if (typeof window !== 'undefined' && 'open' in window) {
            window.open(process.env.EXPO_PUBLIC_SUBSCRIBE_URL, '_blank')
          } else {
            Linking.openURL(process.env.EXPO_PUBLIC_SUBSCRIBE_URL)
          }
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color: theme.textColor,
            fontFamily: 'Inter',
          }}
        >
          {/* The `Trans` component from `react-i18next` is used to render translated text.
              - `components` prop allows embedding React components within the translated text.
              - In this case, a span element with green color and underline is used for part of the text.
              - `i18nKey` is the key in the translation files that holds the text to be translated. */}
          <Trans
            components={{ 1: <Text style={{ color: theme.linkColor, textDecorationLine: 'underline' }} /> }}
            i18nKey='subscribe'
            i18n={i18n}
          />
        </Text>
      </Pressable>
    </View>
  )
}

export default Subscription
