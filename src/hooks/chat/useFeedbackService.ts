import fetchFeedbacksForLanguage, { FeedbacksByCategory } from '@endeavorpal/services/FeedbackService'
import { useEffect, useState } from 'react'

export const useFeedbackService = (language: string): FeedbacksByCategory => {
  const [feedbacks, setFeedbacks] = useState<FeedbacksByCategory>({} as FeedbacksByCategory)

  useEffect(() => {
    const fetchData = async () => {
      const fetchedFeedbacks = await fetchFeedbacksForLanguage(language)
      setFeedbacks(fetchedFeedbacks)
    }

    fetchData().catch(console.error)
  }, [language])

  return feedbacks
}
