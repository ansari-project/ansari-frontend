import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

// Function to load the locale files
const loadLocaleFiles = (locale: string) => ({
  common: require(`./locales/${locale}/common.json`),
  login: require(`./locales/${locale}/login.json`),
  register: require(`./locales/${locale}/register.json`),
})

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: loadLocaleFiles('ar'),
      bs: loadLocaleFiles('bs'),
      en: loadLocaleFiles('en'),
      fr: loadLocaleFiles('fr'),
      id: loadLocaleFiles('id'),
      tur: loadLocaleFiles('tur'),
      ur: loadLocaleFiles('ur'),
    },
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
    detection: {
      order: ['localStorage', 'navigator'], // Detection order
      caches: ['localStorage'], // Where to cache the user language preference
      lookupLocalStorage: 'i18nextLng', // Key in localStorage
    },
  })

i18n.languages = ['ar', 'bs', 'en', 'fr', 'id', 'tur', 'ur']

export default i18n
