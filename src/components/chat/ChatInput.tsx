import React, { useRef, useState } from 'react'
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
import { SendIcon, StopIcon } from '../../assets'
import { useDirection, useScreenInfo } from '../../hooks'

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
  const inputWidthRef = useRef(0)
  const inputHeightRef = useRef(0)
  const inputLengthRef = useRef(0)
  const { t } = useTranslation()

  const { isRTL } = useDirection()
  const { paddingHorizontal } = useScreenInfo()
  const sendButtonOpacityValue = value.length === 0 ? '0.3' : '1.0'

  const handleContentSizeChange = (event: TextInputContentSizeChangeEvent) => {
    if (Platform.OS === 'web') {
      inputWidthRef.current = event.nativeEvent.contentSize.width
      inputHeightRef.current = event.nativeEvent.contentSize.height
    } else {
      inputWidthRef.current = event.nativeEvent.contentSize.width * PixelRatio.get()
      inputHeightRef.current = event.nativeEvent.contentSize.height * PixelRatio.get()
    }

    inputHeightRef.current = inputHeightRef.current < 45 ? 45 : inputHeightRef.current
    if (value.length === 0) {
      inputWidthRef.current = paddingHorizontal
      inputHeightRef.current = 45
    } else {
      inputHeightRef.current = Math.min(inputHeightRef.current, 200)
    }
  }

  const handleChange = (text: string) => {
    if (text.length === 0) {
      inputLengthRef.current = 0
      inputHeightRef.current = 45 // Set a minimum height for the input
    } else if (text.length > inputLengthRef.current) {
      inputLengthRef.current = text.length
      inputHeightRef.current = Math.max(inputHeightRef.current, 45) // Set a minimum height for the input
    }

    if (onInputChange) {
      onInputChange(text)
    }
  }

  return (
    <View style={styles.inputContainer}>
      <TextInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={handleChange}
        onContentSizeChange={handleContentSizeChange}
        style={[
          styles.input,
          {
            ...(isRTL ? { marginLeft: 10, textAlign: 'right' } : { marginRight: 10, textAlign: 'left' }),
            width: inputWidthRef.current,
            height: inputHeightRef.current,
            borderColor: isFocused ? '#000' : '#ccc',
            outline: isFocused ? '#000' : '#ccc',
          },
        ]}
        value={value}
        placeholder={t('promptPlaceholder')}
        placeholderTextColor='#999'
        multiline={true}
        textAlignVertical='top'
        rows={1}
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
    alignItems: 'center',
    width: '100%',
    minWidth: 300,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
    minHeight: 45, // Provide a minimum height
    maxHeight: 200, // Maximum height before scrolling
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
