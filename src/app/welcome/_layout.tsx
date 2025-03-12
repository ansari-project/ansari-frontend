import RootImageBackground from '@/components/RootImageBackground'
import { useAuth } from '@/hooks'
import { Redirect, Slot } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

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
      <View className='flex-1'>
        <Slot />
      </View>
    </RootImageBackground>
  )
}

export default WelcomeLayout
