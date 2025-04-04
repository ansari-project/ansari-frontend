import '../global.css'

import { i18n } from '@/i18n'
import { RootState, initStore } from '@/store'
import { Stack, useNavigationContainerRef } from 'expo-router'
import { EnhancedStore } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { MaintenanceScreen, LoadingScreen } from '@/components'
// eslint-disable-next-line camelcase
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter'
import RootContainer from '@/components/RootContainer'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as Sentry from '@sentry/react-native'
import { captureConsoleIntegration } from '@sentry/core'
import { isRunningInExpoGo } from 'expo'
import { Platform, StatusBar, useColorScheme } from 'react-native'
import { getThemeStyle } from '@/utils'
import { KeyboardProvider } from 'react-native-keyboard-controller'

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
})

let replayIntegration
if (Platform.OS === 'web') {
  replayIntegration = Sentry.browserReplayIntegration({
    maskAllText: true,
    blockAllMedia: false,
  })
} else {
  replayIntegration = Sentry.mobileReplayIntegration({
    maskAllText: true,
    maskAllImages: false,
    maskAllVectors: false,
  })
}

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: false,
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT,
  enabled: !__DEV__,
  // In staging, capture all transactions for better debugging
  // In production, sample 20% of transactions to balance insights with performance
  tracesSampleRate: process.env.EXPO_PUBLIC_ENVIRONMENT === 'production' ? 0.2 : 1.0,
  // Keep profilesSampleRate in sync with tracesSampleRate since profiles are tied to transactions
  profilesSampleRate: process.env.EXPO_PUBLIC_ENVIRONMENT === 'production' ? 0.2 : 1.0,
  replaysSessionSampleRate: process.env.EXPO_PUBLIC_ENVIRONMENT === 'production' ? 0.2 : 1.0,
  replaysOnErrorSampleRate: 1.0,
  integrations: [replayIntegration, navigationIntegration, captureConsoleIntegration({ levels: ['error'] })],
  enableNativeFramesTracking: !isRunningInExpoGo(), // Tracks slow and frozen frames in the application
  ignoreErrors: ['Token refresh failed', 'getRectForRef', 'Cannot manually set color scheme'],
})

const RootLayout = () => {
  // Capture the NavigationContainer ref and register it with the integration
  const ref = useNavigationContainerRef()
  const colorScheme = useColorScheme()

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref)
    }
  }, [ref])

  // Specify the type of the state to be either null or an EnhancedStore instance
  const [reduxStore, setReduxStore] = useState<EnhancedStore<RootState> | null>(null)
  let [fontsLoaded] = useFonts({
    // eslint-disable-next-line camelcase
    Inter: Inter_400Regular,
  })

  useEffect(() => {
    initStore().then((store) => {
      setReduxStore(store)
    })
  }, [])

  if (!reduxStore || !fontsLoaded) {
    return <LoadingScreen />
  }

  if (process.env.EXPO_PUBLIC_MAINTENANCE_MODE === 'true') {
    return <MaintenanceScreen />
  }

  let backgroundColor = getThemeStyle(colorScheme, 'backgroundColor')

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <I18nextProvider i18n={i18n}>
          <Provider store={reduxStore}>
            <RootContainer>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: backgroundColor },
                }}
              />
              <StatusBar backgroundColor={backgroundColor} />
            </RootContainer>
          </Provider>
        </I18nextProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  )
}

export default Sentry.wrap(RootLayout)
