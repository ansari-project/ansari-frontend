import { SendIcon, StopIcon } from '@endeavorpal/assets'
import { useDirection, useScreenInfo } from '@endeavorpal/hooks'
import { RootState } from '@endeavorpal/store'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  KeyboardEvent,
  PixelRatio,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputContentSizeChangeEvent,
  View,
} from 'react-native'
import { useSelector } from 'react-redux'

interface ChatInputProps {
  value: string
  onSendPress: () => void
  // eslint-disable-next-line no-unused-vars
  onInputChange?: (text: string) => void
  isSending: boolean
  onCancelSend?: () => void
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onSendPress, onInputChange, isSending, onCancelSend }) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const inputHeightRef = useRef<number>(20)
  const inputLengthRef = useRef<number>(0)
  const chatInputRef = useRef<TextInput>(null)
  const [forceUpdate, setForceUpdate] = useState<number>(0) // Used to force update
  const { t } = useTranslation()
  const { isRTL } = useDirection()
  const { isMobile } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)

  const handleContentSizeChange = (event: TextInputContentSizeChangeEvent) => {
    if (value.length === 0) {
      inputHeightRef.current = 20
    } else if (Platform.OS === 'web') {
      inputHeightRef.current = event.nativeEvent.contentSize.height
    } else {
      inputHeightRef.current = event.nativeEvent.contentSize.height * PixelRatio.get()
    }

    if (chatInputRef.current) {
      chatInputRef.current.style.height = `${inputHeightRef.current}px` // Adjust the height directly
    }

    // Force a re-render in case the height adjustment doesn't take effect immediately
    setForceUpdate((prev) => prev + 1)
  }

  const handleChange = (text: string) => {
    if (text.length === 0) {
      inputLengthRef.current = 0
      inputHeightRef.current = 20 // Set a minimum height for the input
    } else if (text.length > inputLengthRef.current) {
      inputLengthRef.current = text.length
      inputHeightRef.current = Math.max(inputHeightRef.current, 20) // Set a minimum height for the input
    }

    if (chatInputRef.current) {
      chatInputRef.current.style.height = `${inputHeightRef.current}px` // Adjust the height directly
    }

    if (onInputChange) {
      onInputChange(text)
    }
  }

  // UseLayoutEffect to apply changes immediately after DOM updates
  useLayoutEffect(() => {
    if (chatInputRef.current) {
      // Initial height adjustment if necessary
      chatInputRef.current.style.height = `${inputHeightRef.current}px`
    }
  }, [forceUpdate])

  /**
   * Handles key press events for a text input, specifically invoking the send action on pressing the Enter key in non-mobile environments.
   *
   * @param event The key press event captured from the TextInput component.
   */
  const handleKeyPress = (event: KeyboardEvent): void => {
    // Check if the Enter key was pressed and prevent its default action.
    if (!isMobile && event.key === 'Enter') {
      event.preventDefault() // This might need adjustment based on the actual event type used.
      onSendPress() // Invoke the provided onSendPress callback.
    }
  }

  const focusInput = () => {
    if (chatInputRef.current) {
      chatInputRef.current.focus()
    }
  }

  const styles = StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      backgroundColor: theme.inputBackgroundColor,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: isSending || isFocused ? theme.hoverColor : theme.inputBackgroundColor,
    },
    input: {
      flex: 1,
      overflowY: 'hidden',
      borderRadius: 4,
      color: theme.textColor,
      fontSize: 14,
      lineHeight: 22,
    },
    buttonContainer: {
      height: '100%',
      justifyContent: 'end',
    },
    button: {
      justifyContent: 'center',
      padding: 4,
      borderRadius: 4,
      cursor: 'pointer',
      backgroundColor: isSending || (isFocused && value.length > 0) ? theme.hoverColor : theme.sendIconColor,
    },
  })

  return (
    <Pressable onPress={focusInput}>
      <View
        style={styles.inputContainer}
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
      >
        <TextInput
          ref={chatInputRef}
          onKeyPress={(event: KeyboardEvent) => handleKeyPress(event)}
          onChangeText={handleChange}
          onContentSizeChange={handleContentSizeChange}
          style={[
            styles.input,
            {
              ...(isRTL ? { marginLeft: 10, textAlign: 'right' } : { marginRight: 10, textAlign: 'left' }),
              maxHeight: '50vh',
              outlineWidth: 0,
            },
          ]}
          value={value}
          placeholder={t('promptPlaceholder')}
          placeholderTextColor={theme.primaryColor}
          multiline={true}
          textAlignVertical='top'
          rows={3}
        />
        <View style={styles.buttonContainer}>
          {isSending ? (
            <Pressable onPress={onCancelSend} style={[styles.button]} type='submit'>
              <View style={{ justifyContent: 'center' }}>
                <StopIcon fill={theme.iconFill} width={20} height={20} />
              </View>
            </Pressable>
          ) : (
            <Pressable onPress={onSendPress} style={[styles.button]} type='submit'>
              <View style={{ justifyContent: 'center' }}>
                <SendIcon fill={theme.iconFill} />
              </View>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  )
}

export default ChatInput
