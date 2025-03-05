import { useAuth, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import { Redirect, Slot } from 'expo-router'
import React from 'react'
import { ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * WelcomeLayout Component.
 * This component defines the layout for public pages.
 * It includes a header, main content area, and a footer.
 * @returns JSX element representing the WelcomeLayout component.
 */
export const WelcomeLayout = () => {
  const { isAuthenticated, accessToken } = useAuth()
  // Hook to get screen information
  const { width, height } = useScreenInfo()

  if (isAuthenticated && accessToken) {
    return <Redirect href='/' />
  }

  return (
    <ImageBackground
      style={{ width, height }}
      className='bg-repeat bg-contain'
      source={require('@/assets/images/background.png')}
    >
      <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <View className='flex-grow'>
          <Slot />
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

export default WelcomeLayout
