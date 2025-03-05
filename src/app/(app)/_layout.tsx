import { LineIcon, RightArrowIcon } from '@/components/svg'
import { useAuth, useScreenInfo } from '@/hooks'
import { AppDispatch, RootState, toggleSideMenu } from '@/store'
import React from 'react'
import { Dimensions, ImageBackground, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { MenuDrawer } from '@/components/menu'
import { Redirect, Slot } from 'expo-router'

/**
 * AppLayout Component.
 * This component serves as the main layout for the application.
 * It includes the header, side menu, and main content area.
 */
export const AppLayout = () => {
  // Hook to get screen information
  const { isSmallScreen, isMobile } = useScreenInfo()
  // Redux hook to get side menu state
  const { isOpen: isSideMenuOpened } = useSelector((state: RootState) => state.sideMenu)
  // Hook to check authentication status
  const { isAuthenticated, isGuest, accessToken } = useAuth()

  // Redux dispatcher
  const dispatch = useDispatch<AppDispatch>()

  const showFooter = true

  // Get the height of the window
  const { width, height } = Dimensions.get('window')

  // Function to toggle the side menu
  const togglePopup = () => {
    dispatch(toggleSideMenu(!isSideMenuOpened))
  }

  if (!isAuthenticated || !accessToken) {
    return <Redirect href='/welcome' />
  }

  return (
    <ImageBackground
      style={{ width, height }}
      className='bg-repeat bg-contain'
      source={require('@/assets/images/background.png')}
    >
      <MenuDrawer>
        <KeyboardAvoidingView
          className='flex-1 overflow-y-auto'
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          enabled
        >
          <View className='flex-1'>
            <Header />
            <View className='flex-1'>
              {isAuthenticated && !isGuest && !isMobile && (
                <View className={`mt-auto mb-auto ${isSideMenuOpened ? 'mx-2' : 'mx-4'}`}>
                  <Pressable onPress={togglePopup}>{isSideMenuOpened ? <LineIcon /> : <RightArrowIcon />}</Pressable>
                </View>
              )}
              <View className={`flex-grow justify-center items-center self-center ${isSmallScreen ? 'pb-1' : ''}`}>
                <Slot />
                {showFooter && <Footer />}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </MenuDrawer>
    </ImageBackground>
  )
}

export default AppLayout
