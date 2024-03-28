import { RootState } from '@endeavorpal/store'
import React, { useEffect, useState } from 'react'
import { Animated, Platform, StyleSheet, Text } from 'react-native'
import { useSelector } from 'react-redux'

interface ToastProps {
  message: string
  duration: number
  onDismiss: () => void
}

const Toast: React.FC<ToastProps> = ({ message, duration, onDismiss }) => {
  const [fadeAnim] = useState(new Animated.Value(0)) // Initial value for opacity: 0
  const theme = useSelector((state: RootState) => state.theme.theme)

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: Platform.OS !== 'web',
    }).start()

    // After the duration, fade out and call onDismiss
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      }).start(onDismiss)
    }, duration)

    return () => clearTimeout(timer)
  }, [fadeAnim, duration, onDismiss])

  const styles = StyleSheet.create({
    toast: {
      position: 'absolute',
      top: 30,
      left: '20%',
      right: '20%',
      backgroundColor: 'red',
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
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  )
}

export default Toast
