import StyledText from '@/components/StyledText'
import React, { useCallback } from 'react'
import { Linking, Platform, View } from 'react-native'

const NEW_APP_URL = 'https://askansari.ai'
const SHUTDOWN_DATE = 'November 3, 2026'
const BANNER_TEXT_COLOR = '#1a1a1a'

/**
 * DeprecationBanner Component.
 * Displays a persistent notice at the top of the authenticated app that this
 * version is being retired, with a link to the new version of Ansari.
 */
const DeprecationBanner: React.FC = () => {
  const openNewVersion = useCallback((): void => {
    if (Platform.OS === 'web') {
      window.location.href = NEW_APP_URL
    } else {
      Linking.openURL(NEW_APP_URL)
    }
  }, [])

  return (
    <View className='w-full px-4 py-3 items-center' style={{ backgroundColor: '#E5B94E' }}>
      <StyledText variant='body' textAlign='center' style={{ color: BANNER_TEXT_COLOR }}>
        This version of Ansari will no longer be available after {SHUTDOWN_DATE}.{' '}
        <StyledText
          variant='body'
          className='font-bold'
          style={{ color: BANNER_TEXT_COLOR, textDecorationLine: 'underline' }}
          onPress={openNewVersion}
        >
          Move to the new version
        </StyledText>
      </StyledText>
    </View>
  )
}

export default DeprecationBanner
