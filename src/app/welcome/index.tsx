import { LogoIcon, LogoTextIcon } from '@/components/svg'
import StyledText from '@/components/StyledText'
import { useDirection, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import React from 'react'
import { Linking, Pressable, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useRouter } from 'expo-router'

const Welcome: React.FC = () => {
  const router = useRouter()
  const { isRTL } = useDirection()
  const { isSmallScreen } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)

  return (
    <View className='flex-1 justify-center items-center p-6'>
      <View className='items-center max-w-[500px] w-full'>
        <View className={`flex-row items-center mb-8`}>
          <LogoIcon fill={theme.iconFill} width={52} height={52} />
          <LogoTextIcon
            fill={theme.logoColor}
            width={81}
            className={`${isRTL ? 'mr-2' : 'ml-2'}`}
          />
        </View>

        <StyledText
          variant={isSmallScreen ? 'h2' : 'h1'}
          className='font-normal text-center mb-10'
          color={theme.textColor}
        >
          We have created a new, faster version of Ansari
        </StyledText>

        <Pressable
          className='w-full rounded-lg py-4 px-6 mb-6 items-center'
          style={{ backgroundColor: '#E5B94E' }}
          onPress={() => Linking.openURL('https://askansari.ai')}
        >
          <StyledText
            variant={isSmallScreen ? 'h3' : 'h2'}
            className='font-bold text-center'
            color='#1a1a1a'
          >
            Start using the new version of Ansari
          </StyledText>
        </Pressable>

        <Pressable
          className='py-3 px-6 items-center'
          onPress={() => router.push('/login')}
        >
          <StyledText
            variant='body'
            className='text-center'
            color={theme.secondaryTextColor || theme.textColor}
            style={{ textDecorationLine: 'underline' }}
          >
            Use the old version of Ansari
          </StyledText>
        </Pressable>
      </View>
    </View>
  )
}

export default Welcome
