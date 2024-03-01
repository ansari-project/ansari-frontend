export type Feedback = {
  id: string
  label: string
  value: string
}

// Define a type for the collection of feedbacks, categorized by type
export type FeedbacksByCategory = {
  good: Feedback[]
  bad: Feedback[]
  [key: string]: Feedback[]
}

// Define a type for the feedbacks organized by language
export type FeedbacksByLanguage = {
  [key: string]: FeedbacksByCategory // e.g., 'en': {good: [...], bad: [...]}, 'ar': {...}, etc.
}

// This function simulates fetching feedbacks based on the current language
const fetchFeedbacksForLanguage = async (language: string): Promise<FeedbacksByCategory> => {
  // Mock data structure for demonstration. Replace with your actual data source.
  const data: FeedbacksByLanguage = {
    ar: require('@endeavorpal/i18n/locales/ar/feedback.json'),
    bs: require('@endeavorpal/i18n/locales/bs/feedback.json'),
    en: require('@endeavorpal/i18n/locales/en/feedback.json'),
    fr: require('@endeavorpal/i18n/locales/fr/feedback.json'),
    id: require('@endeavorpal/i18n/locales/id/feedback.json'),
    tur: require('@endeavorpal/i18n/locales/tur/feedback.json'),
    ur: require('@endeavorpal/i18n/locales/ur/feedback.json'),
  }

  return data[language] || data.en // Default to English if language not found
}

export default fetchFeedbacksForLanguage
