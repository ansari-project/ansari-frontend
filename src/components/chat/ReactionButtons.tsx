import { CloseIcon, DislikeFilledIcon, DislikeIcon, LikeFilledIcon, LikeIcon } from '@endeavorpal/assets'
import { useDirection, useFeedbackHandler, useFeedbackService, useScreenInfo } from '@endeavorpal/hooks'
import { FeedbackClass, ReactionButtonsState } from '@endeavorpal/store'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useSelector } from 'react-redux'

export type FeedbackOption = {
  label: string
  value: string
}

export type ReactionButtonsProps = {
  threadId: string
  messageId: string
  // eslint-disable-next-line no-unused-vars
  onSendFeedback: (threadId: string, messageId: string, feedbackClass: FeedbackClass, comment: string) => void
}

const ReactionButtons: React.FC<ReactionButtonsProps> = ({ threadId, messageId, onSendFeedback }) => {
  const { actualPaddingHorizontal } = useScreenInfo()
  const {
    selectedFeedbackClass,
    modalVisible,
    selectedFeedbackOptions,
    additionalFeedback,
    setAdditionalFeedback,
    handleFeedbackSelection,
    handleFeedbackAction, // Unified function for submission and cancellation.
    toggleFeedbackOption,
  } = useFeedbackHandler(threadId, messageId, onSendFeedback)
  const { t, i18n } = useTranslation()
  const feedbacks = useFeedbackService(i18n.language)
  const { isRTL } = useDirection()
  const iconMargin = isRTL ? styles.iconMarginRight : styles.iconMarginLeft

  // Retrieve the currently selected icon for this message
  const selectedIcon = useSelector((state: { reactionButtons: ReactionButtonsState[] }) => {
    const reactionState = state.reactionButtons.find(
      (state) => state.threadId === threadId && state.messageId === messageId,
    )
    return reactionState?.selectedIcon || null
  })

  // Render a button for each feedback option
  const renderFeedbackOptions = () => {
    let feedbackOptions: FeedbackOption[] = []
    if (selectedFeedbackClass === FeedbackClass.ThumbsUp) {
      feedbackOptions = feedbacks.good || []
    }

    if (selectedFeedbackClass === FeedbackClass.ThumbsDown) {
      feedbackOptions = feedbacks.bad || []
    }

    return (
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        {feedbackOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[styles.optionButton, selectedFeedbackOptions.includes(option.value) && styles.optionButtonSelected]}
            onPress={() => toggleFeedbackOption(option.value)}
          >
            <Text
              style={selectedFeedbackOptions.includes(option.value) ? styles.optionTextSelected : styles.optionText}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    )
  }

  const feedbackSubmitDisabled = !additionalFeedback.length && !selectedFeedbackOptions.length

  return (
    <View style={styles.container}>
      <Pressable onPress={() => handleFeedbackSelection(FeedbackClass.ThumbsUp)} style={[styles.icon, iconMargin]}>
        {selectedIcon === FeedbackClass.ThumbsUp ? (
          <LikeFilledIcon width={24} height={24} />
        ) : (
          <LikeIcon width={24} height={24} />
        )}
      </Pressable>
      <Pressable onPress={() => handleFeedbackSelection(FeedbackClass.ThumbsDown)} style={[styles.icon, iconMargin]}>
        {selectedIcon === FeedbackClass.ThumbsDown ? (
          <DislikeFilledIcon width={24} height={24} />
        ) : (
          <DislikeIcon width={24} height={24} />
        )}
      </Pressable>
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => handleFeedbackAction(false)}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { paddingHorizontal: actualPaddingHorizontal }]}>
            <View style={{ flexDirection: 'row', width: '70%', height: 72, paddingVertical: 24, alignItems: 'center' }}>
              <View style={{ flex: 2, flexDirection: 'row', gap: 10 }}>
                <Text style={styles.titleText}>{t('whyDidYouChooseThisRating')}</Text>
                <Text>{t('optional')}</Text>
              </View>
              <Pressable
                style={{ flex: 1, alignItems: 'flex-end', borderBlockWidth: 0 }}
                onPress={() => handleFeedbackAction(false)}
              >
                <CloseIcon />
              </Pressable>
            </View>
            {renderFeedbackOptions()}
            <TextInput
              style={[
                styles.input,
                isRTL ? { marginLeft: 10, textAlign: 'right' } : { marginRight: 10, textAlign: 'left' },
              ]}
              onChangeText={setAdditionalFeedback}
              value={additionalFeedback}
              placeholder={t('additionalFeedbackPlaceholder')}
              multiline
            />
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, feedbackSubmitDisabled && styles.buttonDisabled]}
                onPress={() => handleFeedbackAction(true)}
                disabled={feedbackSubmitDisabled}
              >
                <Text style={styles.buttonText}>{t('submit')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

// Add your styles here
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  iconMarginLeft: {
    marginLeft: 8,
  },
  iconMarginRight: {
    marginRight: 8,
  },
  icon: {
    width: 20,
    height: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '100%',
    // maxWidth: '420px',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 35,
    alignItems: 'flex-start',
    boxShadowColor: '#000',
    boxShadowOffset: {
      width: 0,
      height: 2,
    },
    boxShadowOpacity: 0.25,
    boxShadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 4,
    padding: 10,
    paddingHorizontal: 15,
    marginVertical: 4,
    elevation: 2,
    backgroundColor: '#09786b',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '70%',
    minHeight: 100,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 4,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 8,
    marginVertical: 4,
    backgroundColor: 'white',
    alignSelf: 'flex-start', // Ensure buttons align to content start
  },
  optionButtonSelected: {
    borderColor: '#09786b', // Or any color that indicates selection
    backgroundColor: '#e8f4f8', // Light blue background to indicate selection
  },
  optionText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333', // Dark color for text
  },
  optionTextSelected: {
    color: '#09786b', // Color that indicates selection
    fontWeight: 'bold',
  },
  titleText: {
    fontWeight: 500,
    textAlign: 'center',
    color: '#161616',
  },
  // ... any additional styles you need ...
})

export default ReactionButtons
