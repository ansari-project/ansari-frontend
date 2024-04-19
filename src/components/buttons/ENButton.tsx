import { useDirection, useScreenInfo } from '@endeavorpal/hooks'
import { RootState } from '@endeavorpal/store'
import { createGeneralThemedStyles } from '@endeavorpal/utils'
import React, { useState } from 'react'
import { Pressable, Text, ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'

interface Props {
  text: string
  onClick: () => void
  submittingText?: string
  isSubmitting?: boolean
  buttonStyle?: ViewStyle
  buttonHoverStyle?: ViewStyle
  buttonTextStyle?: ViewStyle
  buttonHoverTextStyle?: ViewStyle
}

const ENButton: React.FC<Props> = ({
  text,
  submittingText,
  buttonStyle,
  buttonHoverStyle,
  buttonTextStyle,
  buttonHoverTextStyle,
  isSubmitting,
  onClick,
}) => {
  const { isSmallScreen } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)
  const [isHover, setIsHover] = useState<boolean>(false)
  const { isRTL } = useDirection()

  const generalStyle = createGeneralThemedStyles(theme, isRTL, isSmallScreen)

  return (
    <Pressable
      style={[
        buttonStyle || generalStyle.buttonPrimary,
        isHover && (buttonHoverStyle || generalStyle.buttonPrimaryHover),
        isSubmitting && generalStyle.buttonDisabled,
      ]}
      onPress={onClick}
      disabled={isSubmitting}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Text
        style={[
          buttonTextStyle || generalStyle.buttonPrimaryText,
          isHover && (buttonHoverTextStyle || generalStyle.buttonPrimaryTextHover),
          isSubmitting && generalStyle.buttonTextDisabled,
        ]}
      >
        {isSubmitting ? submittingText || text : text}
      </Text>
    </Pressable>
  )
}

export default ENButton
