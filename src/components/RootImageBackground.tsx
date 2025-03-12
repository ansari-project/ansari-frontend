import React from 'react'
import { ImageBackground } from 'react-native'

interface RootImageBackgroundProps {
  children: React.ReactNode
  className?: string
}

const RootImageBackground: React.FC<RootImageBackgroundProps> = ({ children, className }) => {
  return (
    <ImageBackground source={require('@/assets/images/background.png')} className={`flex-1 ${className}`}>
      {children}
    </ImageBackground>
  )
}

export default RootImageBackground
