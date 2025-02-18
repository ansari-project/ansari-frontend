import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { useScreenInfo } from '../hooks'

const LoadingScreen: React.FC = () => {
  const { width, height } = useScreenInfo()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      width,
      height,
    },
    image: {
      marginVertical: 'auto',
      height: 400,
      width: '100%',
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <ActivityIndicator size='small' color='#09786b' />
      </View>
    </View>
  )
}

export default LoadingScreen
