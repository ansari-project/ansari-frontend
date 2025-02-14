import { i18n } from '@/i18n'
import { RootState, initStore } from '@/store'
import { Slot } from 'expo-router'
import { EnhancedStore } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { LoadingScreen } from '@/components'
import { useFonts, Inter_400Regular } from '@expo-google-fonts/inter'

import '../index.css'

const AppLayout = () => {
  // Specify the type of the state to be either null or an EnhancedStore instance
  const [reduxStore, setReduxStore] = useState<EnhancedStore<RootState> | null>(null)
  let [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
  })

  useEffect(() => {
    document.dir = i18n.dir(i18n.language)
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
        <Slot />
      </Provider>
    </I18nextProvider>
  )
}

export default AppLayout
