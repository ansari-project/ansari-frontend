import React from 'react'
import { useKeyboardHandler } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

const LOG_KEYBOARD_EVENTS = false

const useGradualAnimation = () => {
  const height = useSharedValue(0)
  const progress = useSharedValue(0)

  useKeyboardHandler(
    {
      onStart: (event) => {
        'worklet'
        if (LOG_KEYBOARD_EVENTS) console.log('[KeyboardHandler] onStart', event)
      },
      onMove: (event) => {
        'worklet'
        if (LOG_KEYBOARD_EVENTS) console.log('[KeyboardHandler] onMove', event)
        height.value = event.height
        progress.value = event.progress
      },
      onEnd: (event) => {
        'worklet'
        if (LOG_KEYBOARD_EVENTS) console.log('[KeyboardHandler] onEnd', event)
        progress.value = event.progress
        height.value = event.height
      },
    },
    [],
  )

  return { height, progress }
}

const KeyboardHandler: React.FC = () => {
  const { height, progress } = useGradualAnimation()

  const animatedStyle = useAnimatedStyle(() => {
    return {
      // Use height as-is, but fallback to 0 if progress indicates keyboard is hidden
      height: progress.value === 0 ? 0 : height.value,
    }
  })

  return <Animated.View style={animatedStyle} />
}

export default KeyboardHandler
