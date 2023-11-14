import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './locales/ar.json'
import bs from './locales/bs.json'
import en from './locales/en.json'
import id from './locales/id.json'
import tur from './locales/tur.json'
import ur from './locales/ur.json'

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en',
  resources: {
    en: {
      translations: en,
    },
    ar: {
      translations: ar,
    },
    tur: {
      translations: tur,
    },
    ur: {
      translations: ur,
    },
    id: {
      translations: id,
    },
    bs: {
      translations: bs,
    },
  },
  ns: ['translations'],
  defaultNS: 'translations',
})

i18n.languages = ['en', 'ar', 'tur', 'ur', 'id', 'bs']
export default i18n
