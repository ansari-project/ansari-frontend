import { EndeavorFancySVG } from '@endeavorpal/assets' // Ensure correct import path
import { useDirection, useScreenInfo } from '@endeavorpal/hooks'
import React from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'

interface PromptCardProps {
  title: string
  subtitle: string
  Icon: typeof EndeavorFancySVG
  onPress: () => void
  stacked?: boolean
}

const PromptCard: React.FC<PromptCardProps> = ({ title, subtitle, Icon, onPress, stacked }) => {
  const [isPressed, setIsPressed] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const { isSmallScreen } = useScreenInfo()
  const { isRTL } = useDirection()

  const cardContainerStyles = [
    styles.cardContainer,
    { width: isSmallScreen ? '100%' : stacked ? '100%' : '33%' },
    (isPressed || isHovered) && styles.cardContainerPressedHovered,
  ]

  const cardIconStyle = isRTL
    ? { marginLeft: 16 }
    : {
        marginRight: 16,
      }

  return (
    <Pressable
      style={cardContainerStyles}
      onPress={() => {
        onPress()
        setIsPressed(true)
        setTimeout(() => setIsPressed(false), 300) // Reset the color after 300ms
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <View style={cardIconStyle}>
        <Icon fill={isPressed || isHovered ? '#F29B00' : ''} />
      </View>
      <View style={styles.textContent}>
        <Text style={[styles.cardTitle, (isPressed || isHovered) && styles.cardTitlePressedHovered]}>{title}</Text>
        <Text style={[styles.cardSubtitle, (isPressed || isHovered) && styles.cardSubtitlePressedHovered]}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16, // Adjust spacing between cards
    borderRadius: 4,
    backgroundColor: '#ffffff80',
    // Apply elevation for Android shadow
    elevation: 5,
    // Apply shadow for iOS
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  cardContainerPressedHovered: {
    backgroundColor: '#ffffff80', // Maintain the same background color
  },
  textContent: {
    flex: 1, // Ensure text content takes the remaining space
  },
  cardTitle: {
    color: '#343434',
    fontSize: 14,
    fontWeight: '600',
  },
  cardTitlePressedHovered: {
    color: '#F29B00',
  },
  cardSubtitle: {
    color: '#343434',
    fontSize: 14,
    fontWeight: '400',
  },
  cardSubtitlePressedHovered: {
    color: '#F29B00',
  },
})

export default PromptCard
