import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'
import resources from './resources'

const lng = getLocales()[0].languageCode

i18n.use(initReactI18next).init({
  resources,
  lng: lng || 'en',
  fallbackLng: 'en',
  debug: false,
  ns: ['common', 'login', 'register'], // defining namespaces
  defaultNS: 'common',
  interpolation: {
    escapeValue: false, // not needed for React as it escapes by default
  },
  react: {
    useSuspense: true, // if you choose to not use Suspense
  },
})

i18n.languages = ['ar', 'bs', 'en', 'fr', 'id', 'tml', 'tur', 'ur']

export default i18n
