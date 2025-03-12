import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import resources from './resources'

export const LANGUAGE_STORAGE_KEY = 'ac-language'

const deviceLanguage = getLocales()[0].languageCode

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage || 'en',
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

/**
 * Get the list of available languages with names and active status
 *
 * @param activeLanguage - Optional language code to mark as active
 * @param includeRTL - Whether to include right-to-left languages (default: true)
 * @returns Array of language objects with code, name, and isActive status
 */
export const getLanguages = (
  activeLanguage?: string,
  includeRTL = true,
): { code: string; name: string; isActive: boolean; isRTL?: boolean }[] => {
  const allLanguages = [
    { code: 'en', name: 'English', isActive: false },
    { code: 'ar', name: 'العربية', isActive: false, isRTL: true },
    { code: 'ur', name: 'اردو', isActive: false, isRTL: true },
    { code: 'tml', name: 'தமிழ்', isActive: false },
    { code: 'tur', name: 'Türkçe', isActive: false },
    { code: 'bs', name: 'Bosanski', isActive: false },
    { code: 'id', name: 'Bahasa Indonesia', isActive: false },
    { code: 'fr', name: 'Français', isActive: false },
  ]

  const languages = includeRTL ? allLanguages : allLanguages.filter((lang) => !lang.isRTL)

  if (activeLanguage) {
    return languages.map((lang) => ({
      ...lang,
      isActive: lang.code === activeLanguage,
    }))
  }

  return languages
}

/**
 * Stores the selected language preference and changes the application language.
 * Works across all platforms (Web, iOS, Android).
 *
 * @param language - The language code to switch to.
 * @returns A promise that resolves when the language has been changed and stored.
 */
export const setLanguage = async (language: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    await i18n.changeLanguage(language)

    if (Platform.OS === 'web') {
      document.dir = i18n.dir(language)
    }
  } catch (error) {
    console.error('Error storing language preference:', error)
  }
}

// Load the saved language preference from storage
AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
  .then((savedLanguage) => {
    if (savedLanguage && i18n.languages.includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage).then(() => {
        if (Platform.OS === 'web') {
          document.dir = i18n.dir(savedLanguage)
        }
      })
    }
  })
  .catch((error) => {
    console.error('Error loading saved language preference:', error)
  })

export default i18n
