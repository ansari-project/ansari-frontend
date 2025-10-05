import React from 'react'
import { ImageBackground } from 'react-native'

interface WelcomeRootImageBackgroundProps {
  children: React.ReactNode
  className?: string
}

const WelcomeRootImageBackground: React.FC<WelcomeRootImageBackgroundProps> = ({ children, className }) => {
  return (
    <ImageBackground source={require('@/assets/images/welcome-background.png')} className={`flex-1 ${className}`}>
      {children}
    </ImageBackground>
  )
}

export default WelcomeRootImageBackground
