import { useAuth, useScreenInfo } from '@/hooks'
import React from 'react'
import { View } from 'react-native'
import ActionButtons from '@/components/ActionButtons'
import Footer from '@/components/Footer'
import { Redirect, Slot } from 'expo-router'
import RootImageBackground from '@/components/RootImageBackground'

/**
 * PublicLayout Component.
 * This component defines the layout for public pages.
 * It includes a header, main content area, and a footer.
 * @returns JSX element representing the PublicLayout component.
 */
export const PublicLayout = () => {
  const { isAuthenticated, accessToken } = useAuth()
  // Hook to get screen information
  const { isSmallScreen, isMobile } = useScreenInfo()

  if (isAuthenticated && accessToken) {
    return <Redirect href='/' />
  }

  return (
    <RootImageBackground>
      <View className='flex-1'>
        {isMobile && (
          <View className={`flex-row justify-end items-center p-${isSmallScreen ? '2' : '4'}`}>
            <ActionButtons isTop={true} />
          </View>
        )}

        <View className='flex-1'>
          <View className={`flex-1 ${isSmallScreen ? 'pb-1' : ''}`}>
            <Slot />
          </View>
          <Footer />
        </View>
      </View>
    </RootImageBackground>
  )
}

export default PublicLayout
