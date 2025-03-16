import { useScreenInfo } from '@/hooks'
import React from 'react'
import { ScrollView, View } from 'react-native'
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
        {isMobile && (
          <View className={`flex-row justify-end items-center p-${isSmallScreen ? '2' : '4'}`}>
            <ActionButtons isTop={true} />
          </View>
        )}

        <ScrollView className='flex-1'>
          <Slot />
        </ScrollView>
        <Footer />
      </View>
    </RootImageBackground>
  )
}

export default ShareLayout
