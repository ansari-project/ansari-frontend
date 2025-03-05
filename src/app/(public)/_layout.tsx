import { useAuth, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import React from 'react'
import { ImageBackground, KeyboardAvoidingView, Platform, View } from 'react-native'
import { useSelector } from 'react-redux'
import ActionButtons from '@/components/ActionButtons'
import Footer from '@/components/Footer'
import { Redirect, Slot } from 'expo-router'

/**
 * PublicLayout Component.
 * This component defines the layout for public pages.
 * It includes a header, main content area, and a footer.
 * @returns JSX element representing the PublicLayout component.
 */
export const PublicLayout = () => {
  const { isAuthenticated, accessToken } = useAuth()
  // Hook to get screen information
  const { isSmallScreen, isMobile, width, height } = useScreenInfo()
  // Redux hook to get theme data
  const theme = useSelector((state: RootState) => state.theme.theme)

  if (isAuthenticated && accessToken) {
    return <Redirect href='/' />
  }

  return (
    <ImageBackground
      style={{ width, height }}
      className='bg-repeat bg-contain'
      source={require('@/assets/images/background.png')}
    >
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
    </ImageBackground>
  )
}

export default PublicLayout
