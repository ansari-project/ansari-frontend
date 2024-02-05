import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

const ChatLoader: React.FC = () => {
  const rotation = useSharedValue(0) // Initial value for rotation: 0

  useEffect(() => {
    // Loop the animation indefinitely
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1, // Repeat indefinitely
      false, // Do not reverse
    )
  }, [])

  //   const animatedStyle = useAnimatedStyle(() => {
  //     return {
  //       transform: [{ rotate: `${rotation.value}deg` }],
  //     }
  //   }, []) // Pass an empty dependency array if there are no dependencies

  const opacity = useSharedValue(0)

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true)
  }, [])

  const animatedOpacity = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  }, [])

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.spinner, animatedOpacity]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 40,
    height: 40,
    backgroundColor: 'red',
    borderRadius: 20, // Make it round
  },
})

export default ChatLoader
