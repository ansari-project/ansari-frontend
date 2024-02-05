import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { EndeavorFancySVG } from '../../assets'
import { useScreenSize } from '../../hooks'

interface PromptCardProps {
  title: string
  subtitle: string
  Icon: typeof EndeavorFancySVG
  onPress: () => void
}

const PromptCard: React.FC<PromptCardProps> = ({ title, subtitle, Icon, onPress }) => {
  const [isPressed, setIsPressed] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const { isSmallScreen } = useScreenSize()
  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardContainer,
        { width: isSmallScreen ? '100%' : '30%' },
        pressed && styles.cardContainerPressed,
        isHovered && { backgroundColor: '#FFF' },
      ]}
      onPress={() => {
        onPress()
        setIsPressed(true)
        setTimeout(() => setIsPressed(false), 300) // Reset the color after 300ms
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <View style={styles.cardIcon}>
        <Icon fill={isPressed || isHovered ? '#F29B00' : ''} />
      </View>
      <View>
        <Text style={[styles.cardTitle, isPressed && styles.cardTitlePressed, isHovered && { color: '#F29B00' }]}>
          {title}
        </Text>
        <Text style={[styles.cardSubtitle, isPressed && styles.cardSubtitlePressed, isHovered && { color: '#F29B00' }]}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    display: 'flex',
    height: 68,
    padding: 16,
    gap: 24,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexShrink: 0,
    borderRadius: 4,
    backgroundColor: '#FFF',
    boxShadowColor: '#000',
    boxShadowOffset: {
      width: 0,
      height: 2,
    },
    boxShadowOpacity: 0.25,
    boxShadowRadius: 3.84,
    elevation: 5,
  },
  cardContainerPressed: {
    backgroundColor: '#FFF', // Maintain the same background color
  },
  cardIcon: {
    // width: 32,
    // height: 32,
    // marginRight: 4,
  },
  cardTitle: {
    color: '#343434',
    fontSize: 14,
    fontWeight: '600',
  },
  cardTitlePressed: {
    color: '#F29B00',
  },
  cardSubtitle: {
    color: '#343434',
    fontSize: 14,
    fontWeight: '400',
  },
  cardSubtitlePressed: {
    color: '#F29B00',
  },
})

export default PromptCard
