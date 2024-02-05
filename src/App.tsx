import { createBrowserHistory } from 'history'
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components'
import { i18n } from './i18n'
import { ChatScreen, HomeScreen, LoginScreen } from './screens'
import store from './store/store'

const history = createBrowserHistory()

const App: React.FC = () => {
  document.dir = i18n.dir(i18n.language)

  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <AppLayout>
          <Router history={history}>
            <Routes>
              <Route path='/login' element={<LoginScreen />} />
              <Route path='/' element={<HomeScreen />} />
              <Route path='/chat' element={<ChatScreen />} />
              {/* <Route path='/register' element={<RegisterScreen />} />
        <Route path='/chat' element={<ChatScreen />} />
        <Route path='/settings' element={<SettingsScreen />} />
        <Route path='/' element={<LoginScreen />} /> */}
            </Routes>
          </Router>
        </AppLayout>
      </Provider>
    </I18nextProvider>
  )
}

export default App
