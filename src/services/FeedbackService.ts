import arFeedback from '@/i18n/locales/ar/feedback.json'
import bsFeedback from '@/i18n/locales/bs/feedback.json'
import enFeedback from '@/i18n/locales/en/feedback.json'
import frFeedback from '@/i18n/locales/fr/feedback.json'
import idFeedback from '@/i18n/locales/id/feedback.json'
import tmlFeedback from '@/i18n/locales/tml/feedback.json'
import turFeedback from '@/i18n/locales/tur/feedback.json'
import urFeedback from '@/i18n/locales/ur/feedback.json'

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
    ar: arFeedback,
    bs: bsFeedback,
    en: enFeedback,
    fr: frFeedback,
    id: idFeedback,
    tml: tmlFeedback,
    tur: turFeedback,
    ur: urFeedback,
  }

  return data[language] || data.en // Default to English if language not found
}

export default fetchFeedbacksForLanguage
