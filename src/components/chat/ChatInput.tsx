import { CloseIcon, CollapseIcon, ExpandIcon, ImageIcon, SendIcon, StopIcon } from '@/components/svg'
import { useDirection, useScreenInfo } from '@/hooks'
import { AppDispatch, RootState, tootleInputFullMode } from '@/store'
import { ImageTooLargeError, MAX_IMAGES_PER_MESSAGE, PendingImage, pickImages } from '@/utils/imageAttachments'
import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Image,
  KeyboardEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInput,
  TextInputContentSizeChangeEventData,
  View,
} from 'react-native'
import { KeyboardController } from 'react-native-keyboard-controller'
import { useDispatch, useSelector } from 'react-redux'

interface ChatInputProps {
  value: string
  onSendPress: () => void
  onInputChange?: (text: string) => void
  isSending: boolean
  onCancelSend?: () => void
  images?: PendingImage[]
  onImagesChange?: (images: PendingImage[]) => void
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onSendPress,
  onInputChange,
  isSending,
  onCancelSend,
  images = [],
  onImagesChange,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [imageError, setImageError] = useState<string | null>(null)
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
    KeyboardController.dismiss()
    dispatch(tootleInputFullMode(false))
    onSendPress()
  }

  const focusInput = () => {
    if (chatInputRef.current) {
      chatInputRef.current.focus()
    }
  }

  const handleAttachPress = useCallback(async () => {
    if (!onImagesChange) return

    setImageError(null)
    try {
      const picked = await pickImages(MAX_IMAGES_PER_MESSAGE - images.length)
      if (picked.length > 0) {
        onImagesChange([...images, ...picked])
      }
    } catch (error) {
      console.error('Failed to attach image:', error)
      setImageError(error instanceof ImageTooLargeError ? t('imageTooLarge') : t('imageAttachFailed'))
    }
  }, [images, onImagesChange, t])

  const handleRemoveImage = useCallback(
    (index: number) => {
      onImagesChange?.(images.filter((_, i) => i !== index))
    },
    [images, onImagesChange],
  )

  const canAttachImages = !!onImagesChange && !isSending && images.length < MAX_IMAGES_PER_MESSAGE
  const hasContent = value.length > 0 || images.length > 0

  const updateInputFullMode = () => {
    focusInput()
    dispatch(tootleInputFullMode(!isInputFullMode))
  }

  return (
    <Pressable onPress={focusInput}>
      <View
        className={`flex-col rounded p-4 px-5 ${isInputFullMode ? 'fixed bottom-0 h-full border-0' : ''}`}
        style={{
          backgroundColor: theme.inputBackgroundColor,
          borderWidth: 1,
          borderColor: isSending || isFocused ? theme.hoverColor : theme.inputBackgroundColor,
        }}
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
      >
        {images.length > 0 && (
          <View className='flex-row flex-wrap gap-2 mb-3'>
            {images.map((image, index) => (
              <View key={`${index}-${image.uri.length}`} className='relative'>
                <Image source={{ uri: image.uri }} className='w-16 h-16 rounded' resizeMode='cover' />
                <Pressable
                  onPress={() => handleRemoveImage(index)}
                  accessibilityLabel={t('removeImage')}
                  className='absolute -top-2 -right-2 rounded-full p-1'
                  style={{ backgroundColor: theme.hoverColor }}
                >
                  <CloseIcon fill={theme.iconFill} width={12} height={12} />
                </Pressable>
              </View>
            ))}
          </View>
        )}
        {imageError && (
          <Text className='text-sm mb-2' style={{ color: 'red' }}>
            {imageError}
          </Text>
        )}
        <View className={`flex-row justify-start items-stretch ${isInputFullMode ? 'flex-1' : ''}`}>
          {onImagesChange && (
            <Pressable
              onPress={handleAttachPress}
              disabled={!canAttachImages}
              accessibilityLabel={t('attachImage')}
              className={`justify-center ${isRTL ? 'ml-2.5' : 'mr-2.5'}`}
              style={{ opacity: canAttachImages ? 1 : 0.4 }}
            >
              <ImageIcon fill={theme.iconFill} width={22} height={22} />
            </Pressable>
          )}
          <TextInput
            ref={chatInputRef}
            nativeID='chat-input'
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
                  backgroundColor: isSending || (isFocused && hasContent) ? theme.hoverColor : theme.sendIconColor,
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
                  backgroundColor: isSending || (isFocused && hasContent) ? theme.hoverColor : theme.sendIconColor,
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
      </View>
    </Pressable>
  )
}

export default ChatInput
