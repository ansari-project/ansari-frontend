import { CollapseIcon, ExpandIcon, SendIcon, StopIcon } from '@/components/svg'
import { useDirection, useScreenInfo } from '@/hooks'
import { AppDispatch, RootState, tootleInputFullMode } from '@/store'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Keyboard,
  KeyboardEvent,
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputContentSizeChangeEventData,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

interface ChatInputProps {
  value: string
  onSendPress: () => void
  onInputChange?: (text: string) => void
  isSending: boolean
  onCancelSend?: () => void
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onSendPress, onInputChange, isSending, onCancelSend }) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const chatInputRef = useRef<TextInput>(null)
  const [showExpandCollapseIcon, setShowExpandCollapseIcon] = useState<boolean>(false)
  const isInputFullMode = useSelector((state: RootState) => state.input.fullMode)
  const { t } = useTranslation()
  const { isRTL } = useDirection()
  const { isMobile, isSmallScreen } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)
  const dispatch = useDispatch<AppDispatch>()

  const handleContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    if (isMobile || isSmallScreen) {
      setShowExpandCollapseIcon(event.nativeEvent.contentSize.height > 70)
    }
  }

  const handleChange = (text: string) => {
    if (text.length === 0) {
      dispatch(tootleInputFullMode(false))
    }

    if (onInputChange) {
      onInputChange(text)
    }
  }

  const handleKeyPress = (event: KeyboardEvent): void => {
    if (!isMobile && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  const submit = () => {
    Keyboard.dismiss()
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

  return (
    <Pressable onPress={focusInput}>
      <View
        className={`flex-row justify-start items-stretch rounded p-4 px-5 ${
          isInputFullMode ? 'fixed bottom-0 h-full border-0' : ''
        }`}
        style={{
          backgroundColor: theme.inputBackgroundColor,
          borderWidth: 1,
          borderColor: isSending || isFocused ? theme.hoverColor : theme.inputBackgroundColor,
        }}
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
      >
        <TextInput
          ref={chatInputRef}
          onKeyPress={(event: KeyboardEvent) => handleKeyPress(event)}
          onChangeText={handleChange}
          onContentSizeChange={handleContentSizeChange}
          className={`flex-1 rounded text-base ${isRTL ? 'ml-2.5 text-right' : 'mr-2.5 text-left'}`}
          style={{
            color: theme.textColor,
            outlineWidth: 0,
            overflowY: 'auto',
            height: isInputFullMode ? '100%' : 'auto',
            maxHeight: isInputFullMode ? '100%' : isSmallScreen ? 100 : 300,
          }}
          value={value}
          placeholder={t('promptPlaceholder')}
          placeholderTextColor={theme.primaryColor}
          multiline={true}
          textAlignVertical='top'
          numberOfLines={3}
        />
        <View className={`flex-col ${showExpandCollapseIcon ? 'justify-between' : 'justify-center'}`}>
          {showExpandCollapseIcon && (
            <Pressable onPress={updateInputFullMode} type='submit'>
              <View className='justify-center'>
                {isInputFullMode ? (
                  <CollapseIcon fill={theme.iconFill} width={24} height={24} />
                ) : (
                  <ExpandIcon fill={theme.iconFill} width={24} height={24} />
                )}
              </View>
            </Pressable>
          )}
          {isSending ? (
            <Pressable
              onPress={onCancelSend}
              className='justify-center p-1 rounded cursor-pointer'
              style={{
                backgroundColor: isSending || (isFocused && value.length > 0) ? theme.hoverColor : theme.sendIconColor,
              }}
              type='submit'
            >
              <View className='justify-center'>
                <StopIcon fill={theme.iconFill} width={20} height={20} />
              </View>
            </Pressable>
          ) : (
            <Pressable
              onPress={submit}
              className='justify-center p-1 rounded cursor-pointer'
              style={{
                backgroundColor: isSending || (isFocused && value.length > 0) ? theme.hoverColor : theme.sendIconColor,
              }}
              type='submit'
            >
              <View className='justify-center'>
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
