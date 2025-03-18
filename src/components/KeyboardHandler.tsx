import React from 'react'
import { useKeyboardHandler } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

const PADDING_BOTTOM = 0

const useGradualAnimation = () => {
  const height = useSharedValue(PADDING_BOTTOM)

  useKeyboardHandler(
    {
      onMove: (event) => {
        'worklet'
        height.value = Math.max(event.height, PADDING_BOTTOM)
      },
    },
    [],
  )

  return { height }
}

const KeyboardHandler: React.FC = () => {
  const { height } = useGradualAnimation()

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: Math.abs(height.value),
      marginBottom: height.value > 0 ? 0 : PADDING_BOTTOM,
      width: 'auto',
    }
  })

  return <Animated.View style={animatedStyle}></Animated.View>
}

export default KeyboardHandler
