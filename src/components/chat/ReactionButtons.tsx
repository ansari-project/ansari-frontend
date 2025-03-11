import { CheckIcon, CloseIcon, CopyIcon, DislikeIcon, LikeIcon } from '@/components/svg'
import { useDirection, useFeedbackHandler, useFeedbackService, useScreenInfo } from '@/hooks'
import { FeedbackClass, Message, ReactionButtonsState, RootState } from '@/store'
import { createGeneralThemedStyles } from '@/utils'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, Text, TextInput, View } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
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
      <View className='flex-row flex-wrap'>
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
    <View className='w-full'>
      <View className='flex flex-row w-full'>
        <Pressable onPress={copyMessage} className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`}>
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
          className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`}
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
          className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`}
        >
          <DislikeIcon
            fill={selectedIcon === FeedbackClass.ThumbsDown ? theme.hoverColor : theme.iconFill}
            hoverFill={theme.hoverColor}
          />
        </Pressable>
      </View>
      {modalVisible && (
        <View className={`w-full h-0 mt-6 ${modalVisible ? 'h-auto' : ''}`}>
          <View
            className='w-full px-2 sm:px-5 py-4 items-start rounded'
            style={{ backgroundColor: theme.inputBackgroundColor }}
          >
            <View className='flex-row w-full items-center'>
              <View className='flex-2 flex-row gap-2.5'>
                <Text style={[{ color: theme.primaryColor, fontFamily: 'Inter', fontWeight: '500' }]}>
                  {t('whyDidYouChooseThisRating')}
                </Text>
                <Text style={{ color: theme.inputColor }}>{t('optional')}</Text>
              </View>
              <Pressable
                className={`border-0 self-start ${isRTL ? 'mr-1.5' : 'ml-1.5'}`}
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
              ref={inputRef}
              className='w-full outline-0'
              style={[generalStyle.input, { backgroundColor: theme.backgroundColorSecondary }]}
              value={additionalFeedback}
              onChangeText={setAdditionalFeedback}
              placeholder={t('additionalFeedbackPlaceholder')}
              placeholderTextColor={theme.inputColor}
              multiline
            />
            <View className='flex-row justify-end w-full'>
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
