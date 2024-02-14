import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { i18n } from './i18n'
import store from './store/store'
// For web
import { ApplicationRoutes } from './utils/'
// For native
// import { NativeRoutes } from './utils/routes/webRoutes'

const App: React.FC = () => {
  document.dir = i18n.dir(i18n.language)

  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        {/* Use webRoutes for web and nativeRoutes for native */}
        <ApplicationRoutes.WebRoutes />
        {/* <NativeRoutes /> */}
      </Provider>
    </I18nextProvider>
  )
}

export default App
