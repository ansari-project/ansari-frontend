import React, { useEffect } from 'react'
import { ActivityIndicator, useColorScheme, View } from 'react-native'
import { getThemeStyle } from '@/utils'
import { useLogout, useScreenInfo } from '@/hooks'

const LogoutScreen: React.FC = () => {
  const { width, height } = useScreenInfo()
  const colorScheme = useColorScheme()
  const doLogout = useLogout()

  useEffect(() => {
    doLogout()
  }, [])

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

export default LogoutScreen
