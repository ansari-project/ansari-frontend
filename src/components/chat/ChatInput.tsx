import { SendIcon, StopIcon } from '@endeavorpal/assets'
import { useDirection } from '@endeavorpal/hooks'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  PixelRatio,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputContentSizeChangeEvent,
  View,
} from 'react-native'

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
  const inputHeightRef = useRef<number>(45)
  const inputLengthRef = useRef<number>(0)
  const chatInputRef = useRef<TextInput>(null)
  const [forceUpdate, setForceUpdate] = useState<number>(0) // Used to force update
  const { t } = useTranslation()

  const { isRTL } = useDirection()
  const sendButtonOpacityValue = value.length === 0 ? '0.3' : '1.0'

  const handleContentSizeChange = (event: TextInputContentSizeChangeEvent) => {
    if (value.length === 0) {
      inputHeightRef.current = 45
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
      inputHeightRef.current = 45 // Set a minimum height for the input
    } else if (text.length > inputLengthRef.current) {
      inputLengthRef.current = text.length
      inputHeightRef.current = Math.max(inputHeightRef.current, 45) // Set a minimum height for the input
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

  return (
    <View style={styles.inputContainer}>
      <TextInput
        ref={chatInputRef}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={handleChange}
        onContentSizeChange={handleContentSizeChange}
        style={[
          styles.input,
          {
            ...(isRTL ? { marginLeft: 10, textAlign: 'right' } : { marginRight: 10, textAlign: 'left' }),
            maxHeight: '50vh',
            height: 'auto',
            borderColor: isFocused ? '#000' : '#ccc',
            outline: isFocused ? '#000' : '#ccc',
          },
        ]}
        value={value}
        placeholder={t('promptPlaceholder')}
        placeholderTextColor='#999'
        multiline={true}
        textAlignVertical='top'
        rows={3}
      />
      {isSending ? (
        <Pressable onPress={onCancelSend} style={[styles.button]} type='submit'>
          <View style={{ justifyContent: 'center' }}>
            <StopIcon fill='#fff' />
          </View>
        </Pressable>
      ) : (
        <Pressable onPress={onSendPress} style={[styles.button, { opacity: sendButtonOpacityValue }]} type='submit'>
          <View style={{ justifyContent: 'center' }}>
            <SendIcon fill='#fff' />
          </View>
        </Pressable>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    alignItems: 'end',
    width: '100%',
  },
  input: {
    flex: 1,
    scrollbarWidth: 0.01,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
    minHeight: 45, // Provide a minimum height
  },
  button: {
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    cursor: 'pointer',
    height: 45,
    backgroundColor: '#09786b',
  },
})

export default ChatInput
