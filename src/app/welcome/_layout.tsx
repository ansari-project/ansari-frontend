import RootImageBackground from '@/components/RootImageBackground'
import { useAuth } from '@/hooks'
import { Redirect, Slot } from 'expo-router'
import React from 'react'
import { KeyboardAvoidingView, Platform, View } from 'react-native'

/**
 * WelcomeLayout Component.
 * This component defines the layout for public pages.
 * It includes a header, main content area, and a footer.
 * @returns JSX element representing the WelcomeLayout component.
 */
export const WelcomeLayout = () => {
  const { isAuthenticated, accessToken } = useAuth()

  if (isAuthenticated && accessToken) {
    return <Redirect href='/' />
  }

  return (
    <RootImageBackground>
      <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <View className='flex-grow'>
          <Slot />
        </View>
      </KeyboardAvoidingView>
    </RootImageBackground>
  )
}

export default WelcomeLayout
