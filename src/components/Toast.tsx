import { RootState } from '@endeavorpal/store'
import React, { useEffect, useState } from 'react'
import { Animated, Platform, StyleSheet, Text } from 'react-native'
import { useSelector } from 'react-redux'

interface ToastProps {
  message: string | React.ReactNode
  duration: number
  backgroundColor?: string
  onDismiss: () => void
}

const Toast: React.FC<ToastProps> = ({ message, duration, onDismiss, backgroundColor }) => {
  const [fadeAnim] = useState(new Animated.Value(0)) // Initial value for opacity: 0
  const theme = useSelector((state: RootState) => state.theme.theme)

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

  const styles = StyleSheet.create({
    toast: {
      position: 'fixed',
      top: 8,
      left: '20%',
      right: '20%',
      backgroundColor: color,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      zIndex: 1000,
    },
    text: {
      color: theme.textColor,
      fontSize: 20,
      fontWeight: 500,
    },
  })

  return (
    <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
      {typeof message === 'string' ? <Text style={styles.text}>{message}</Text> : message}
    </Animated.View>
  )
}

export default Toast
