import React from 'react'
import { ActivityIndicator, useColorScheme, View } from 'react-native'
import { useScreenInfo } from '../hooks'
import { getThemeStyle } from '@/utils'

const LoadingScreen: React.FC = () => {
  const { width, height } = useScreenInfo()
  const colorScheme = useColorScheme()

  return (
    <View
      className='flex-1 items-center justify-between'
      style={{ width, height, backgroundColor: getThemeStyle(colorScheme, 'backgroundColor') }}
    >
      <View className='my-auto h-[400px] w-full'>
        <ActivityIndicator size='small' color='#09786b' />
      </View>
    </View>
  )
}

export default LoadingScreen
