import React from 'react'
import { View } from 'react-native'

interface RootImageBackgroundProps {
  children: React.ReactNode
  className?: string
}

const RootImageBackground: React.FC<RootImageBackgroundProps> = ({ children, className }) => {
  return (
    <View
      style={{ backgroundImage: 'url(/images/background.png)' }}
      className={`flex-1 bg-repeat bg-contain ${className}`}
    >
      {children}
    </View>
  )
}

export default RootImageBackground
