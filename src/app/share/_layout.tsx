import { useScreenInfo } from '@/hooks'
import React from 'react'
import { View } from 'react-native'
import ActionButtons from '@/components/ActionButtons'
import Footer from '@/components/Footer'
import { Slot } from 'expo-router'
import RootImageBackground from '@/components/RootImageBackground'

/**
 * ShareLayout Component.
 * This component defines the layout for public pages.
 * It includes a header, main content area, and a footer.
 * @returns JSX element representing the ShareLayout component.
 */
export const ShareLayout = () => {
  const { isSmallScreen, isMobile } = useScreenInfo()

  return (
    <RootImageBackground>
      <View className='flex-1'>
        <View className='items-center'>
          <View className=''>
            {isMobile && (
              <View className={`flex-row justify-end items-center p-${isSmallScreen ? '2' : '4'}`}>
                <ActionButtons isTop={true} />
              </View>
            )}

            <View className='flex-1'>
              <View className={`flex-1 justify-center items-center ${isSmallScreen ? 'pb-1' : ''}`}>
                <Slot />
              </View>
            </View>
            <Footer />
          </View>
        </View>
      </View>
    </RootImageBackground>
  )
}

export default ShareLayout
