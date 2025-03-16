import { ReactNativeSvg } from '@/components/svg'
import { useDirection, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import React from 'react'
import { Pressable, View } from 'react-native'
import { useSelector } from 'react-redux'
import StyledText from '@/components/StyledText'

interface Props {
  title: string
  subtitle: string
  Icon: typeof ReactNativeSvg
  onPress: () => void
  isMiddle: boolean
}

const PromptCard: React.FC<Props> = ({ title, subtitle, Icon, onPress, isMiddle }: Props) => {
  const [isPressed, setIsPressed] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const { isSmallScreen } = useScreenInfo()
  const { isRTL } = useDirection()
  const theme = useSelector((state: RootState) => state.theme.theme)

  const isActive = isPressed || isHovered

  return (
    <Pressable
      className={`flex-1 flex-row p-4 rounded ${isSmallScreen ? 'mb-4' : ''} ${isMiddle && !isSmallScreen ? 'mx-4' : ''}`}
      style={[
        {
          backgroundColor: isActive ? theme.promptBackgroundHoverColor : theme.popupBackgroundColor,
          borderWidth: 1,
          borderColor: isActive ? theme.hoverColor : theme.popupBackgroundColor,
        },
      ]}
      onPress={() => {
        onPress()
        setIsPressed(true)
        setTimeout(() => setIsPressed(false), 300) // Reset the color after 300ms
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <View className='flex-1'>
        <StyledText
          className='text-sm leading-[21px] font-bold'
          textAlign='left'
          style={{ color: isActive ? theme.hoverColor : theme.textColor }}
        >
          {title}
        </StyledText>
        <StyledText
          textAlign='left'
          className='text-sm leading-[21px] font-normal'
          style={{ color: isActive ? theme.hoverColor : theme.textColor }}
        >
          {subtitle}
        </StyledText>
      </View>
      <View className={`${isRTL ? 'ml-4 mr-auto' : 'ml-auto mr-4'}`}>
        <Icon fill={isActive ? theme.hoverColor : undefined} />
      </View>
    </Pressable>
  )
}

export default PromptCard
