import { i18n } from '@/i18n'
import { RootState, initStore } from '@/store'
import { Slot } from 'expo-router'
import { EnhancedStore } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { LoadingScreen } from '@/components'

const App: React.FC = () => {
  // Specify the type of the state to be either null or an EnhancedStore instance
  const [reduxStore, setReduxStore] = useState<EnhancedStore<RootState> | null>(null)

  useEffect(() => {
    document.dir = i18n.dir(i18n.language)
    initStore().then((store) => {
      setReduxStore(store)
    })
  }, [])

  if (!reduxStore) {
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

export default App
