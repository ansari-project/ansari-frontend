import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { backgroundImage } from '../assets'
import { useScreenSize } from '../hooks'

const BackgroundImage: React.FC = () => {
  const { isMobile } = useScreenSize()
  return (
    <>
      <Image
        source={backgroundImage}
        style={{
          ...StyleSheet.absoluteFillObject,
          ...{ opacity: 0.8 },
          ...(isMobile && { backgroundSize: 'cover' }),
        }}
      />
      <View style={[styles.backgroundImage, isMobile && styles.backgroundImageCover]} />
    </>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${backgroundImage})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.8,
  },
  backgroundImageCover: {
    backgroundSize: '100vh 100vw',
  },
})

export default BackgroundImage
