import { useDirection, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import React from 'react'
import { Text, TextProps } from 'react-native'
import { useSelector } from 'react-redux'

interface StyledTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'button'
  color?: string
  textAlign?: 'left' | 'center' | 'right'
}

export const StyledText: React.FC<StyledTextProps> = ({
  children,
  variant = 'body',
  color = 'text',
  textAlign,
  style,
  className = '',
  ...props
}) => {
  const { isSmallScreen } = useScreenInfo()
  const { isRTL } = useDirection()
  const theme = useSelector((state: RootState) => state.theme.theme)

  const getTextAlign = () => {
    if (textAlign) return textAlign

    return isSmallScreen ? 'center' : isRTL ? 'right' : 'left'
  }

  const getColor = () => {
    switch (color) {
      case 'primary':
        return theme.primaryColor
      case 'link':
        return theme.linkColor
      case 'primaryButton':
        return theme.buttonPrimaryColor
      case 'secondaryButton':
        return theme.buttonSecondaryColor
      case 'text':
        return theme.textColor
      case 'yellow':
        return theme.yellowColor
      default:
        return theme.textColor
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'h1':
        return `${isSmallScreen ? 'text-[28px] leading-[32px]' : 'text-[42px] leading-[50px]'}`
      case 'h2':
        return 'font-semibold text-[24px] leading-[29px]'
      case 'h3':
        return 'font-semibold text-[20px] leading-[22px]'
      default:
        return ''
    }
  }

  return (
    <Text
      className={`font-inter ${getVariantClasses()} ${className}`}
      style={[
        {
          fontFamily: 'Inter',
          textAlign: getTextAlign(),
          color: getColor(),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  )
}

export default StyledText
