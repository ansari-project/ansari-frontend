import React from 'react'
import { View, Text } from 'react-native'
import { LogoRoundIcon } from '@/components/svg'
import { useDirection } from '@/hooks'
import { Ionicons } from '@expo/vector-icons'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

type IconName = 'information' | 'chat' | 'check' | 'logo'

type WelcomeFeatureRowProps = {
  iconName: IconName
  text: string
}

const WelcomeFeatureRow: React.FC<WelcomeFeatureRowProps> = ({ iconName, text }) => {
  const { isRTL } = useDirection()
  const theme = useSelector((state: RootState) => state.theme.theme)
  // Define which text should be bold for each icon
  const boldTextMap = {
    information: 'Get Source-Based',
    chat: 'Save your chats',
    check: 'Quick and easy',
    logo: null // null means bold the entire text
  }

  const getIcon = (name: IconName) => {
    const iconProps = {
      width: 20,
      height: 20,
      fill: theme.darkGreenColor
    }

    switch (name) {
      case 'information':
        return <Ionicons name='book' size={20} color={theme.darkGreenColor} />
      case 'chat':
        return <Ionicons name='chatbox-ellipses' size={20} color={theme.darkGreenColor} />
      case 'check':
        return <Ionicons name='checkmark-circle' size={20} color={theme.darkGreenColor} />
      case 'logo':
        return <LogoRoundIcon {...iconProps} width={22} height={22} />
      default:
        return null
    }
  }

  const renderText = () => {
    const baseStyle = {
      textAlign: isRTL ? 'right' as const : 'left' as const
    }
    const boldStyle = {
      fontWeight: 'bold' as const,
      textAlign: isRTL ? 'right' as const : 'left' as const
    }
    const boldText = boldTextMap[iconName]

    // If logo icon, bold entire text
    if (boldText === null) {
      return <Text style={boldStyle}>{text}</Text>
    }

    // If text contains the bold part, split and style
    if (boldText && text.includes(boldText)) {
      const parts = text.split(boldText)
      return (
        <Text style={baseStyle}>
          {parts[0]}
          <Text style={boldStyle}>{boldText}</Text>
          {parts[1]}
        </Text>
      )
    }
    // Fallback: return normal text
    return <Text style={baseStyle}>{text}</Text>
  }

  return (
    <View className={`flex-row ${isRTL ? 'row-reverse' : ''} items-start w-full`}>
      <View className={`${isRTL ? 'ml-3' : 'mr-3'} w-6 h-6 items-center justify-center flex-shrink-0`}>
        {getIcon(iconName)}
      </View>
      <View className='flex-1'>
        {renderText()}
      </View>
    </View>
  )
}

export default WelcomeFeatureRow
