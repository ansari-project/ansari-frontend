import { useAuth, useScreenInfo } from '@/hooks'
import React from 'react'
import { KeyboardAvoidingView, Platform, View } from 'react-native'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { MenuDrawer } from '@/components/menu'
import { Redirect, Slot } from 'expo-router'
import RootImageBackground from '@/components/RootImageBackground'
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * AppLayout Component.
 * This component serves as the main layout for the application.
 * It includes the header, side menu, and main content area.
 */
export const AppLayout = () => {
  // Hook to get screen information
  const { isSmallScreen } = useScreenInfo()
  // Redux hook to get side menu state
  // Hook to check authentication status
  const { isAuthenticated, accessToken } = useAuth()

  const showFooter = true

  if (!isAuthenticated || !accessToken) {
    return <Redirect href='/welcome' />
  }

  return (
    <RootImageBackground>
      <MenuDrawer>
        <SafeAreaView className='flex-1'>
          <KeyboardAvoidingView
            className='flex-1 overflow-y-auto'
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            enabled
          >
            <View className='flex-1'>
              <Header />
              <View className='flex-1'>
                <View className={`flex-grow justify-center items-center self-center ${isSmallScreen ? 'pb-1' : ''}`}>
                  <Slot />
                  {showFooter && <Footer />}
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </MenuDrawer>
    </RootImageBackground>
  )
}

export default AppLayout
