import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

// TODO: Not compatible with the Metro Bundler
// Function to load the locale files
// const loadLocaleFiles = (locale: string) => ({
//   common: require(`./locales/${locale}/common.json`),
//   login: require(`./locales/${locale}/login.json`),
//   register: require(`./locales/${locale}/register.json`),
// })

const arFiles = () => ({
  common: require('./locales/ar/common.json'),
  login: require('./locales/ar/login.json'),
  register: require('./locales/ar/register.json'),
})

const bsFiles = () => ({
  common: require('./locales/bs/common.json'),
  login: require('./locales/bs/login.json'),
  register: require('./locales/bs/register.json'),
})

const enFiles = () => ({
  common: require('./locales/en/common.json'),
  login: require('./locales/en/login.json'),
  register: require('./locales/en/register.json'),
})

const frFiles = () => ({
  common: require('./locales/fr/common.json'),
  login: require('./locales/fr/login.json'),
  register: require('./locales/fr/register.json'),
})

const idFiles = () => ({
  common: require('./locales/id/common.json'),
  login: require('./locales/id/login.json'),
  register: require('./locales/id/register.json'),
})

const tmlFiles = () => ({
  common: require('./locales/tml/common.json'),
  login: require('./locales/tml/login.json'),
  register: require('./locales/tml/register.json'),
})

const turFiles = () => ({
  common: require('./locales/tur/common.json'),
  login: require('./locales/tur/login.json'),
  register: require('./locales/tur/register.json'),
})

const urFiles = () => ({
  common: require('./locales/ur/common.json'),
  login: require('./locales/ur/login.json'),
  register: require('./locales/ur/register.json'),
})

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: arFiles(),
      bs: bsFiles(),
      en: enFiles(),
      fr: frFiles(),
      id: idFiles(),
      tml: tmlFiles(),
      tur: turFiles(),
      ur: urFiles(),
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

i18n.languages = ['ar', 'bs', 'en', 'fr', 'id', 'tml', 'tur', 'ur']

export default i18n
