import { useScreenInfo } from '@/hooks'
import React, { useEffect, useState } from 'react'
import { Animated, Platform } from 'react-native'
import StyledText from './StyledText'

interface ToastProps {
  message: string | React.ReactNode
  duration: number
  backgroundColor?: string
  onDismiss: () => void
}

const Toast: React.FC<ToastProps> = ({ message, duration, onDismiss, backgroundColor }) => {
  const [fadeAnim] = useState(new Animated.Value(0)) // Initial value for opacity: 0
  const { isSmallScreen } = useScreenInfo()

  const color = backgroundColor ?? 'red'

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: Platform.OS !== 'web',
    }).start()

    // After the duration, fade out and call onDismiss
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: Platform.OS !== 'web',
      }).start(onDismiss)
    }, duration)

    return () => clearTimeout(timer)
  }, [fadeAnim, duration, onDismiss])

  return (
    <Animated.View
      className={`fixed top-2 ${isSmallScreen ? 'left-[5%] right-[5%]' : 'left-[20%] right-[20%]'} p-2.5 rounded items-center z-[1000]`}
      style={[{ backgroundColor: color, opacity: fadeAnim }]}
    >
      {typeof message === 'string' ? <StyledText className='text-xl font-medium'>{message}</StyledText> : message}
    </Animated.View>
  )
}

export default Toast
