import '../global.css'

import { i18n } from '@/i18n'
import { RootState, initStore } from '@/store'
import { Stack, useNavigationContainerRef } from 'expo-router'
import { EnhancedStore } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { MaintenanceScreen, LoadingScreen, AppUpdatePopup } from '@/components'
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
import ApiService from '@/services/ApiService'
import { AppVersionCheckResponse } from '@/types'
import * as Application from 'expo-application'

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
  const [appVersionStatus, setAppVersionStatus] = useState<AppVersionCheckResponse | null>(null)
  const [appUpdatePopupVisible, setAppUpdatePopupVisible] = useState(false)

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

  // Check app version
  useEffect(() => {
    async function checkAppVersion() {
      try {
        const apiService = new ApiService()

        // Get native app version and build version
        let appVersion = '1.0.0'
        let buildVersion = '1'

        const appMode = Platform.OS === 'ios' || Platform.OS === 'android'
        if (appMode) {
          appVersion = Application.nativeApplicationVersion!
          buildVersion = Application.nativeBuildVersion!
        }

        const appVersionCheckResults = await apiService.checkAppVersion(
          Platform.OS, // Pass Platform.OS directly (web, ios, android)
          appVersion,
          buildVersion,
        )

        setAppVersionStatus(appVersionCheckResults)
        setAppUpdatePopupVisible(
          appMode && (appVersionCheckResults.force_update_required || appVersionCheckResults.update_available),
        )
      } catch (error) {
        console.error('Failed to check app version:', error)
      }
    }

    checkAppVersion()
  }, [])

  if (!reduxStore || !fontsLoaded) {
    return <LoadingScreen />
  }

  // Maintenance mode check from API response
  if (appVersionStatus && appVersionStatus.maintenance_mode) {
    return <MaintenanceScreen />
  }

  let backgroundColor = getThemeStyle(colorScheme, 'backgroundColor')

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <I18nextProvider i18n={i18n}>
          <Provider store={reduxStore}>
            <RootContainer>
              {appVersionStatus && (
                <AppUpdatePopup
                  isForced={appVersionStatus.force_update_required}
                  visible={appUpdatePopupVisible}
                  onDismiss={appVersionStatus.force_update_required ? undefined : () => setAppUpdatePopupVisible(false)}
                />
              )}

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
