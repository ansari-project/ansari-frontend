import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useScreenInfo } from '../hooks'

const LoadingScreen: React.FC = () => {
  const { width, height } = useScreenInfo()

  return (
    <View className='flex-1 items-center justify-between' style={{ width, height }}>
      <View className='my-auto h-[400px] w-full'>
        <ActivityIndicator size='small' color='#09786b' />
      </View>
    </View>
  )
}

export default LoadingScreen
