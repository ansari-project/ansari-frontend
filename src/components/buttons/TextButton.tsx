import StyledText from '@/components/StyledText'
import { useDirection, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import { createGeneralThemedStyles } from '@/utils'
import React from 'react'
import { Pressable, ViewStyle, TextStyle } from 'react-native'
import { useSelector } from 'react-redux'

type TextButtonProps = {
  title: string
  onPress: () => void
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  style?: ViewStyle
  textStyle?: TextStyle
  accessibilityRole?: 'button' | 'link'
  accessibilityLabel?: string
  testID?: string
}

const TextButton: React.FC<TextButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  loadingText,
  style,
  textStyle,
  accessibilityRole = 'button',
  accessibilityLabel,
  testID,
}) => {
  const { isSmallScreen, width } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)
  const { isRTL } = useDirection()

  const generalStyle = createGeneralThemedStyles(theme, isRTL, isSmallScreen, width)
  const isDisabled = disabled || loading

  return (
    <Pressable
      className={`mt-1 ${isDisabled ? 'opacity-60' : ''}`}
      style={style}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel || title}
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      testID={testID}
    >
      <StyledText
        style={[
          {
            color: theme.textColor,
            textAlign: isRTL ? 'right' : 'center',
            fontSize: 14,
          },
          isDisabled && generalStyle.buttonTextDisabled,
          textStyle,
        ]}
      >
        {loading ? (loadingText || title) : title}
      </StyledText>
    </Pressable>
  )
}

export default TextButton
