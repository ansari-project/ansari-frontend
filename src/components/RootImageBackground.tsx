import React from 'react'
import { ImageBackground, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface RootImageBackgroundProps {
  children: React.ReactNode
  className?: string
}

const RootImageBackground: React.FC<RootImageBackgroundProps> = ({ children, className }) => {
  const insets = useSafeAreaInsets()

  return (
    <ImageBackground source={require('@/assets/images/background.png')} className={`flex-1 ${className}`}>
      <View className="flex-1" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        {children}
      </View>
    </ImageBackground>
  )
}

export default RootImageBackground
