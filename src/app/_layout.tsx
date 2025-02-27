import { i18n } from '@/i18n'
import { RootState, initStore } from '@/store'
import { Slot } from 'expo-router'
import { EnhancedStore } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { LoadingScreen } from '@/components'
// eslint-disable-next-line camelcase
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter'

import '../global.css'
import RootContainer from '@/components/RootContainer'

const AppLayout = () => {
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
    <I18nextProvider i18n={i18n}>
      <Provider store={reduxStore}>
        <RootContainer>
          <Slot />
        </RootContainer>
      </Provider>
    </I18nextProvider>
  )
}

export default AppLayout
