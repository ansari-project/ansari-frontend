import { useAuth, useScreenInfo } from '@/hooks'
import React from 'react'
import { View } from 'react-native'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { MenuDrawer } from '@/components/menu'
import { Redirect, Slot } from 'expo-router'
import RootImageBackground from '@/components/RootImageBackground'
import { SafeAreaView } from 'react-native-safe-area-context'
import KeyboardHandler from '@/components/KeyboardHandler'

/**
 * AppLayout Component.
 * This component serves as the main layout for the application.
 * It includes the header, side menu, and main content area.
 */
export const AppLayout = () => {
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
          <View className='flex-1 overflow-y-auto'>
            <View className='flex-1'>
              <Header />
              <View className='flex-1'>
                <View className={'flex-grow justify-center items-center self-center'}>
                  <Slot />
                  {showFooter && <Footer />}
                  <KeyboardHandler />
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </MenuDrawer>
    </RootImageBackground>
  )
}

export default AppLayout
