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

  /**
   * Handles both the submission and cancellation of feedback.
   * When a comment is not required, it can be invoked with an empty string.
   *
   * @param sendFeedback - Indicates whether to send the feedback or not.
   * @returns {void}
   */
  const handleFeedbackSubmit = useCallback(
    (sendFeedback: boolean) => {
      // Initialize feedbackComment as an empty string
      let feedbackComment = ''
      if (sendFeedback) {
        // If there is no selected feedback option
        if (selectedFeedbackOptions.length === 0) {
          // Use trimmed additionalFeedback as feedbackComment
          feedbackComment = additionalFeedback.trim()
        } else {
          // Use joined selectedFeedbackOptions as feedbackComment
          feedbackComment = selectedFeedbackOptions.join(', ')

          // If there is additional feedback, append it to feedbackComment with a ' - ' separator
          if (additionalFeedback) {
            feedbackComment += ` - ${additionalFeedback}`
          }
        }
      }
      // Call onSendFeedback with threadId, messageId, selectedFeedbackClass, and feedbackComment
      onSendFeedback(threadId, messageId, selectedFeedbackClass as FeedbackClass, feedbackComment)

      // Dispatch setReactionButton action
      dispatch(setReactionButton({ threadId, messageId, selectedIcon: selectedFeedbackClass }))

      // Update state variables
      setModalVisible(false)
      setSelectedFeedbackOptions([])
      setAdditionalFeedback('')
    },
    [threadId, messageId, selectedFeedbackClass, selectedFeedbackOptions, additionalFeedback, onSendFeedback, dispatch],
  )

  /**
   * Handles both the submission and cancellation of feedback.
   * When a comment is not required, it can be invoked with an empty string.
   *
   * @param feedbackClass: FeedbackClass - FeedbackClass Icon.
   * @returns {void}
   */
  const handleFeedbackAction = useCallback(
    (feedbackClass: FeedbackClass) => {
      // Call onSendFeedback with threadId, messageId, feedbackClass
      onSendFeedback(threadId, messageId, feedbackClass, '')
      // Dispatch setReactionButton action
      dispatch(setReactionButton({ threadId, messageId, selectedIcon: feedbackClass }))
      handleFeedbackSelection(feedbackClass)
    },
    [threadId, messageId, dispatch],
  )

  /**
   * Handles both the submission and cancellation of feedback.
   * When a comment is not required, it can be invoked with an empty string.
   *
   * @param feedbackClass: FeedbackClass - FeedbackClass Icon.
   * @returns {void}
   */
  const handleFeedbackCancel = useCallback(() => {
    // Update state variables
    setModalVisible(false)
    setSelectedFeedbackOptions([])
    setAdditionalFeedback('')
  }, [])

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
    handleFeedbackAction, // Unified function for submission and cancellation.
    handleFeedbackSubmit,
    handleFeedbackCancel,
    toggleFeedbackOption,
  }
}
