import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import i18n from './i18n'
import HomePage from './pages/HomePage'
import store from './store/store'

function App() {
  i18n.changeLanguage(localStorage.getItem('language') || 'en')
  document.dir = i18n.dir(i18n.language)

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <HomePage />
      </I18nextProvider>
    </Provider>
  )
}

export default App
