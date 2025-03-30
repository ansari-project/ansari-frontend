import React from 'react'
import { Text, View } from 'react-native'
import RootContainer from './RootContainer'
import RootImageBackground from './RootImageBackground'
import { LogoIcon } from './svg'

const MaintenanceScreen: React.FC = () => {
  return (
    <RootContainer>
      <RootImageBackground>
        <View className='flex-1'>
          <View className='w-full p-8 items-center justify-start gap-4'>
            <LogoIcon />
            <Text className='text-center text-white text-xl' style={{ fontFamily: 'Inter' }}>
              Ansari Chat is currently under maintenance.
            </Text>
            <Text className='text-center text-white text-xl' style={{ fontFamily: 'Inter' }}>
              We are working hard to bring you the best experience possible.
            </Text>
            <Text className='text-center text-white text-xl' style={{ fontFamily: 'Inter' }}>
              Thank you for your patience!
            </Text>
          </View>
        </View>
      </RootImageBackground>
    </RootContainer>
  )
}

export default MaintenanceScreen
