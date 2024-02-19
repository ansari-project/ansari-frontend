import { i18n } from '@endeavorpal/i18n'
import { store } from '@endeavorpal/store'
import { ApplicationRoutes } from '@endeavorpal/utils/'
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'

const App: React.FC = () => {
  document.dir = i18n.dir(i18n.language)

  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        {/* Use webRoutes for web and nativeRoutes for native */}
        <ApplicationRoutes.WebRoutes />
        {/* <ApplicationRoutes.NativeRoutes /> */}
      </Provider>
    </I18nextProvider>
  )
}

export default App
