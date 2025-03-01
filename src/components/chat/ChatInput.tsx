import { CollapseIcon, ExpandIcon, SendIcon, StopIcon } from '@/components/svg'
import { useDirection, useScreenInfo } from '@/hooks'
import { AppDispatch, RootState, tootleInputFullMode } from '@/store'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  KeyboardEvent,
  NativeSyntheticEvent,
  PixelRatio,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputContentSizeChangeEventData,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

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
  const chatInputRef = useRef<TextInput>(null)
  const [chatInputHeight, setChatInputHeight] = useState<number>(22)

  const [showExpandCollapseIcon, setShowExpandCollapseIcon] = useState<boolean>(false)
  const isInputFullMode = useSelector((state: RootState) => state.input.fullMode)
  const { t } = useTranslation()
  const { isRTL } = useDirection()
  const { width, height, isMobile, isSmallScreen } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)
  const dispatch = useDispatch<AppDispatch>()

  const handleContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    if (value.length === 0) {
      setChatInputHeight(22)
    } else if (Platform.OS === 'web') {
      setChatInputHeight(event.nativeEvent.contentSize.height)
    } else {
      setChatInputHeight(event.nativeEvent.contentSize.height * PixelRatio.get())
    }
  }

  const handleChange = (text: string) => {
    if (text.length === 0) {
      setChatInputHeight(22)
      dispatch(tootleInputFullMode(false))
    }

    if (isMobile || isSmallScreen) {
      if (chatInputHeight > 60) {
        setShowExpandCollapseIcon(true)
      } else {
        setShowExpandCollapseIcon(false)
      }
    }

    if (onInputChange) {
      onInputChange(text)
    }
  }

  /**
   * Handles key press events for a text input, specifically invoking the send action on pressing the Enter key in non-mobile environments.
   *
   * @param event The key press event captured from the TextInput component.
   */
  const handleKeyPress = (event: KeyboardEvent): void => {
    // Check if the Enter key was pressed and prevent its default action.
    if (!isMobile && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() // This might need adjustment based on the actual event type used.
      submit() // Invoke the provided onSendPress callback.
    }
  }

  const submit = () => {
    dispatch(tootleInputFullMode(false))
    onSendPress()
  }

  const focusInput = () => {
    if (chatInputRef.current) {
      chatInputRef.current.focus()
    }
  }

  const updateInputFullMode = () => {
    focusInput()
    dispatch(tootleInputFullMode(!isInputFullMode))
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
    inputContainerFullScreen: {
      position: 'fixed',
      bottom: 0,
      height: height,
      width: width,
      borderWidth: 0,
    },
    input: {
      flex: 1,
      borderRadius: 4,
      color: theme.textColor,
      fontSize: 14,
      lineHeight: 22,
      marginLeft: isRTL ? 10 : null,
      marginRight: isRTL ? null : 10,
      textAlign: isRTL ? 'right' : 'left',
      outlineWidth: 0,
      overflowY: 'auto',
      height: isInputFullMode ? '100%' : null,
      maxHeight: isInputFullMode ? '100%' : isSmallScreen ? '20vh' : '30vh',
    },
    buttonContainer: {
      height: '100%',
      justifyContent: showExpandCollapseIcon ? 'space-between' : 'flex-end',
    },
    button: {
      justifyContent: 'center',
      padding: 4,
      borderRadius: 4,
      cursor: 'pointer',
      backgroundColor: isSending || (isFocused && value.length > 0) ? theme.hoverColor : theme.sendIconColor,
    },
    iconContainer: {
      justifyContent: 'center',
    },
  })

  return (
    <Pressable onPress={focusInput}>
      <View
        style={[styles.inputContainer, isInputFullMode && styles.inputContainerFullScreen]}
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
      >
        <TextInput
          ref={chatInputRef}
          onKeyPress={(event: KeyboardEvent) => handleKeyPress(event)}
          onChangeText={handleChange}
          onContentSizeChange={handleContentSizeChange}
          style={[styles.input, { height: chatInputHeight }]}
          value={value}
          placeholder={t('promptPlaceholder')}
          placeholderTextColor={theme.primaryColor}
          multiline={true}
          textAlignVertical='top'
          rows={1}
        />
        <View style={styles.buttonContainer}>
          {showExpandCollapseIcon && (
            <Pressable onPress={updateInputFullMode} type='submit'>
              <View style={styles.iconContainer}>
                {isInputFullMode ? (
                  <CollapseIcon fill={theme.iconFill} width={24} height={24} />
                ) : (
                  <ExpandIcon fill={theme.iconFill} width={24} height={24} />
                )}
              </View>
            </Pressable>
          )}
          {isSending ? (
            <Pressable onPress={onCancelSend} style={[styles.button]} type='submit'>
              <View style={styles.iconContainer}>
                <StopIcon fill={theme.iconFill} width={20} height={20} />
              </View>
            </Pressable>
          ) : (
            <Pressable onPress={submit} style={[styles.button]} type='submit'>
              <View style={styles.iconContainer}>
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
