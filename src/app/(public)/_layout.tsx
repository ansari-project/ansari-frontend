import { useAuth, useScreenInfo } from '@/hooks'
import React from 'react'
import { KeyboardAvoidingView, Platform, View } from 'react-native'
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
      <KeyboardAvoidingView className='flex-1 w-full' behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
        <View className='flex-grow w-full items-center justify-between font-inter'>
          <View className='flex-1 w-full'>
            {isMobile && (
              <View className={`flex-row justify-end w-full items-center p-${isSmallScreen ? '2' : '4'}`}>
                <ActionButtons isTop={true} />
              </View>
            )}

            <View className='flex-1 flex-grow w-full'>
              <View className='flex-1 w-full'>
                <View
                  className={`flex-grow justify-center items-center w-full self-center font-inter ${isSmallScreen ? 'pb-1' : ''}`}
                >
                  <Slot />
                </View>
              </View>
              <Footer />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </RootImageBackground>
  )
}

export default PublicLayout
