import { ReactNativeSvg } from '@/components/svg'
import { useDirection, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

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

  const styles = StyleSheet.create({
    card: {
      flex: 1,
      flexDirection: 'row',
      padding: 16,
      borderRadius: 4,
      backgroundColor: theme.popupBackgroundColor,
      borderColor: theme.popupBackgroundColor,
      borderWidth: 1,
      marginHorizontal: isMiddle && !isSmallScreen ? 16 : 0,
      marginBottom: isSmallScreen ? 16 : 'initial',
    },
    cardPressedHovered: {
      backgroundColor: theme.promptBackgroundHoverColor,
      borderWidth: 1,
      borderColor: theme.hoverColor,
      borderRadius: 4,
    },
    textContent: {
      flex: 1, // Ensure text content takes the remaining space
    },
    cardTitle: {
      color: theme.textColor,
      fontSize: 14,
      lineHeight: 21,
      fontWeight: 700,
      fontFamily: 'Inter',
    },
    cardTitlePressedHovered: {
      color: theme.hoverColor,
    },
    cardSubtitle: {
      color: theme.textColor,
      fontSize: 14,
      lineHeight: 21,
      fontWeight: 400,
      fontFamily: 'Inter',
    },
    cardSubtitlePressedHovered: {
      color: theme.hoverColor,
    },
    cardIcon: {
      marginLeft: isRTL ? 16 : 'auto',
      marginRight: isRTL ? 'auto' : 16,
    },
  })

  return (
    <Pressable
      style={[styles.card, (isPressed || isHovered) && styles.cardPressedHovered]}
      onPress={() => {
        onPress()
        setIsPressed(true)
        setTimeout(() => setIsPressed(false), 300) // Reset the color after 300ms
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <View style={styles.textContent}>
        <Text style={[styles.cardTitle, (isPressed || isHovered) && styles.cardTitlePressedHovered]}>{title}</Text>
        <Text style={[styles.cardSubtitle, (isPressed || isHovered) && styles.cardSubtitlePressedHovered]}>
          {subtitle}
        </Text>
      </View>
      <View style={styles.cardIcon}>
        <Icon fill={isPressed || isHovered ? theme.hoverColor : undefined} />
      </View>
    </Pressable>
  )
}

export default PromptCard
