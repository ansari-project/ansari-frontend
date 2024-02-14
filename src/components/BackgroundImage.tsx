import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { backgroundImage } from '../assets' // Ensure this import points to the correct file
import { useScreenInfo } from '../hooks'

const BackgroundImage: React.FC = () => {
  const { isSmallScreen } = useScreenInfo()

  return (
    <View style={styles.container}>
      <Image
        source={backgroundImage}
        resizeMode={isSmallScreen ? 'cover' : 'contain'} // 'cover' for mobile, 'contain' for larger screens
        style={styles.backgroundImage}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // This ensures the container fills the entire parent
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject, // This makes the image fill the container
    opacity: 0.8, // Set the desired opacity
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
})

export default BackgroundImage
