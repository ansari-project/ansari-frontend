// Importing necessary types and functions from the project's dependencies.
import { ReactionButtonsProps } from '@endeavorpal/components/chat/ReactionButtons'
import { AppDispatch, FeedbackClass, setReactionButton } from '@endeavorpal/store'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

// Defining the useFeedbackHandler hook which manages feedback interactions.
export const useFeedbackHandler = (
  threadId: string,
  messageId: string,
  onSendFeedback: ReactionButtonsProps['onSendFeedback'],
) => {
  const dispatch = useDispatch<AppDispatch>()
  const [selectedFeedbackClass, setSelectedFeedbackClass] = useState<FeedbackClass | null>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [selectedFeedbackOptions, setSelectedFeedbackOptions] = useState<string[]>([])
  const [additionalFeedback, setAdditionalFeedback] = useState<string>('')

  // Handles the selection of a feedback type, opening the modal for additional input.
  const handleFeedbackSelection = useCallback((feedbackClass: FeedbackClass) => {
    setSelectedFeedbackClass(feedbackClass)
    setModalVisible(true)
  }, [])

  // Handles both the submission and cancellation of feedback.
  // When a comment is not required, it can be invoked with an empty string.
  const handleFeedbackAction = useCallback(
    (sendFeedback: boolean) => {
      const feedbackComment = sendFeedback
        ? selectedFeedbackOptions.join(', ') + (additionalFeedback ? ` - ${additionalFeedback}` : '')
        : ''
      onSendFeedback(threadId, messageId, selectedFeedbackClass as FeedbackClass, feedbackComment)
      dispatch(setReactionButton({ threadId, messageId, selectedIcon: selectedFeedbackClass }))
      setModalVisible(false)
      setSelectedFeedbackOptions([])
      setAdditionalFeedback('')
    },
    [threadId, messageId, selectedFeedbackClass, selectedFeedbackOptions, additionalFeedback, onSendFeedback, dispatch],
  )

  // Toggles the selection of a feedback option, adding or removing it from the list.
  const toggleFeedbackOption = useCallback((option: string) => {
    setSelectedFeedbackOptions((prevSelected) =>
      prevSelected.includes(option) ? prevSelected.filter((o) => o !== option) : [...prevSelected, option],
    )
  }, [])

  // Exposing the hook's functionalities and state variables for external use.
  return {
    selectedFeedbackClass,
    modalVisible,
    selectedFeedbackOptions,
    additionalFeedback,
    setAdditionalFeedback,
    handleFeedbackSelection,
    handleFeedbackAction, // Unified function for submission and cancellation.
    toggleFeedbackOption,
  }
}
