import { createBrowserHistory } from 'history'
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { i18n } from './i18n'
import { LoginScreen } from './screens'
import { AppLayout } from './components'

const history = createBrowserHistory()

const App: React.FC = () => {
  document.dir = i18n.dir(i18n.language)

  return (
    <I18nextProvider i18n={i18n}>
      <AppLayout>
        <Router history={history}>
          <Routes>
            <Route path='/login' element={<LoginScreen />} />
            {/* <Route path='/register' element={<RegisterScreen />} />
        <Route path='/chat' element={<ChatScreen />} />
        <Route path='/settings' element={<SettingsScreen />} />
        <Route path='/' element={<LoginScreen />} /> */}
          </Routes>
        </Router>
      </AppLayout>
    </I18nextProvider>
  )
}

export default App
