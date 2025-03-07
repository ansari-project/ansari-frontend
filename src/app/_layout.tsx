import '../global.css'

import { i18n } from '@/i18n'
import { RootState, initStore } from '@/store'
import { Slot, useNavigationContainerRef } from 'expo-router'
import { EnhancedStore } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { LoadingScreen } from '@/components'
// eslint-disable-next-line camelcase
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter'
import RootContainer from '@/components/RootContainer'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as Sentry from '@sentry/react-native'
import { captureConsoleIntegration } from '@sentry/core'
import { isRunningInExpoGo } from 'expo'

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
})

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: false,
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT,
  // In development, capture all transactions for better debugging
  // In production, sample 20% of transactions to balance insights with performance
  tracesSampleRate: process.env.EXPO_PUBLIC_ENVIRONMENT === 'production' ? 0.2 : 1.0,
  // Keep profilesSampleRate in sync with tracesSampleRate since profiles are tied to transactions
  profilesSampleRate: process.env.EXPO_PUBLIC_ENVIRONMENT === 'production' ? 0.2 : 1.0,
  integrations: [
    // Pass integration
    navigationIntegration,
    captureConsoleIntegration({ levels: ['error'] }),
  ],
  enableNativeFramesTracking: !isRunningInExpoGo(), // Tracks slow and frozen frames in the application
})

const RootLayout = () => {
  // Capture the NavigationContainer ref and register it with the integration
  const ref = useNavigationContainerRef()

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

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <Provider store={reduxStore}>
          <RootContainer>
            <Slot />
          </RootContainer>
        </Provider>
      </I18nextProvider>
    </SafeAreaProvider>
  )
}

export default Sentry.wrap(RootLayout)
