import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { useScreenInfo } from '../hooks'

const LoadingScreen: React.FC = () => {
  const { width, height } = useScreenInfo()

  return (
    <View style={[styles.container, { width, height }]}>
      <View style={styles.image}>
        <ActivityIndicator size='small' color='#09786b' />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    marginVertical: 'auto',
    height: 400,
    width: '100%',
  },
})

export default LoadingScreen
