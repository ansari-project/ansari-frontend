import { CheckIcon, CloseIcon, CopyIcon, DislikeIcon, LikeIcon } from '@endeavorpal/assets'
import { useDirection, useFeedbackHandler, useFeedbackService, useScreenInfo } from '@endeavorpal/hooks'
import { FeedbackClass, Message, ReactionButtonsState, RootState } from '@endeavorpal/store'
import { createGeneralThemedStyles } from '@endeavorpal/utils'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clipboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useSelector } from 'react-redux'

export type FeedbackOption = {
  label: string
  value: string
}

export type ReactionButtonsProps = {
  threadId: string
  messageId: string
  message: Message
  // eslint-disable-next-line no-unused-vars
  onSendFeedback: (threadId: string, messageId: string, feedbackClass: FeedbackClass, comment: string) => void
}

const ReactionButtons: React.FC<ReactionButtonsProps> = ({ threadId, messageId, message, onSendFeedback }) => {
  const {
    selectedFeedbackClass,
    modalVisible,
    selectedFeedbackOptions,
    additionalFeedback,
    setAdditionalFeedback,
    handleFeedbackAction, // Unified function for submission and cancellation.
    handleFeedbackSubmit,
    toggleFeedbackOption,
    handleFeedbackCancel,
  } = useFeedbackHandler(threadId, messageId, onSendFeedback)
  const { t, i18n } = useTranslation()
  const feedbacks = useFeedbackService(i18n.language)
  const { isRTL } = useDirection()
  const [copySuccess, setCopySuccess] = useState<boolean>(false)
  const theme = useSelector((state: RootState) => state.theme.theme)
  const [isHover, setIsHover] = useState<number>(0)
  const { isSmallScreen, width } = useScreenInfo()
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])

  const [inputRef] = useState(React.createRef<TextInput>())

  const copyMessage = useCallback(() => {
    Clipboard.setString(message.content)
    setCopySuccess(true)
  }, [message.content])

  useEffect(() => {
    if (copySuccess) {
      const timeoutId = setTimeout(() => {
        setCopySuccess(false)
      }, 1000) // Hide the CheckIcon after 1 second
      return () => clearTimeout(timeoutId)
    }
  }, [copySuccess])

  // Retrieve the currently selected icon for this message
  const selectedIcon = useSelector((state: { reactionButtons: ReactionButtonsState[] }) => {
    const reactionState = state.reactionButtons.find(
      (state) => state.threadId === threadId && state.messageId === messageId,
    )
    return reactionState?.selectedIcon || null
  })

  // Add your styles here
  const generalStyle = createGeneralThemedStyles(theme, isRTL, isSmallScreen, width)

  const styles = StyleSheet.create({
    mainContainer: {
      width: '100%',
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    reactionForm: {
      width: '100%',
      height: 0,
      marginTop: 24,
      visibility: 'hidden',
      transition: 'height 0.1s ease, visibility 0.1s ease',
    },
    input: {
      backgroundColor: theme.backgroundColorSecondary,
      width: '100%',
      outlineWidth: 0,
    },
    icon: {
      width: 20,
      height: 20,
      marginRight: isRTL ? 8 : 0,
      marginLeft: isRTL ? 0 : 8,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      width: '100%',
      paddingHorizontal: isSmallScreen ? 8 : 20,
      paddingVertical: 16,
      alignItems: 'flex-start',
      backgroundColor: theme.inputBackgroundColor,
      borderRadius: 4,
      color: theme.textColor,
    },
    modalTitle: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '100%',
    },
    titleText: {
      fontWeight: '500',
      color: theme.primaryColor,
      fontFamily: 'Inter',
    },
    closeButton: {
      borderWidth: 0,
      alignSelf: 'flex-start',
      marginLeft: isRTL ? null : 6,
      marginRight: isRTL ? 6 : null,
    },
    // ... any additional styles you need ...
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
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {feedbackOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              generalStyle.buttonSecondary,
              selectedFeedbackOptions.includes(option.value) && generalStyle.buttonPrimary,
              generalStyle.smallButton,
            ]}
            onPress={() => toggleFeedbackOption(option.value)}
          >
            <Text
              style={[
                generalStyle.buttonSecondaryText,
                selectedFeedbackOptions.includes(option.value) && generalStyle.buttonPrimaryText,
              ]}
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
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Pressable onPress={copyMessage} style={styles.icon}>
          {copySuccess ? (
            <CheckIcon fill={theme.hoverColor} />
          ) : (
            <CopyIcon fill={theme.iconFill} hoverFill={theme.hoverColor} />
          )}
        </Pressable>
        <Pressable
          onPress={() => {
            handleFeedbackAction(FeedbackClass.ThumbsUp)
            setEditing(true)
          }}
          style={styles.icon}
        >
          <LikeIcon
            fill={selectedIcon === FeedbackClass.ThumbsUp ? theme.hoverColor : theme.iconFill}
            hoverFill={theme.hoverColor}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            handleFeedbackAction(FeedbackClass.ThumbsDown)
            setEditing(true)
          }}
          style={styles.icon}
        >
          <DislikeIcon
            fill={selectedIcon === FeedbackClass.ThumbsDown ? theme.hoverColor : theme.iconFill}
            hoverFill={theme.hoverColor}
          />
        </Pressable>
      </View>
      {modalVisible && (
        <View style={[styles.reactionForm, modalVisible && { height: 'auto', visibility: 'visible' }]}>
          <View style={styles.modalView}>
            <View style={styles.modalTitle}>
              <View style={{ flex: 2, flexDirection: 'row', gap: 10 }}>
                <Text style={styles.titleText}>{t('whyDidYouChooseThisRating')}</Text>
                <Text style={{ color: theme.inputColor }}>{t('optional')}</Text>
              </View>
              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  handleFeedbackCancel()
                  setEditing(false)
                }}
              >
                <CloseIcon />
              </Pressable>
            </View>
            {renderFeedbackOptions()}
            <TextInput
              style={[generalStyle.input, styles.input]}
              onChangeText={setAdditionalFeedback}
              value={additionalFeedback}
              placeholder={t('additionalFeedbackPlaceholder')}
              multiline
              ref={inputRef}
            />
            <View style={styles.buttonContainer}>
              <Pressable
                style={[
                  generalStyle.buttonSecondary,
                  isHover === 10 && generalStyle.buttonPrimary,
                  generalStyle.smallButton,
                ]}
                onPress={() => handleFeedbackSubmit(true)}
                disabled={feedbackSubmitDisabled}
                onMouseEnter={() => setIsHover(10)}
                onMouseLeave={() => setIsHover(-1)}
              >
                <Text style={[generalStyle.buttonSecondaryText, isHover === 10 && generalStyle.buttonPrimaryText]}>
                  {t('submit')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default ReactionButtons
