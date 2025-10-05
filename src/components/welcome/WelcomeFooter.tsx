import StyledText from '@/components/StyledText'
import getEnv from '@/utils/getEnv'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Pressable, View } from 'react-native'

const WelcomeFooter: React.FC = () => {
  const { t } = useTranslation()

  const handleUrlPress = (url: string) => {
    if (typeof window !== 'undefined' && 'open' in window) {
      window.open(url, '_blank')
    } else {
      Linking.openURL(url)
    }
  }

  return (
    <View className='absolute bottom-8 w-full items-center'>
      <View className='flex-row items-center'>
        <Pressable
          className='px-2'
          onPress={() => handleUrlPress(getEnv('TERMS_URL'))}
        >
          <StyledText style={{ color: '#666666', fontSize: 12 }}>
            {t('termOfUse')}
          </StyledText>
        </Pressable>
        <StyledText style={{ color: '#666666', fontSize: 12 }}>|</StyledText>
        <Pressable
          className='px-2'
          onPress={() => handleUrlPress(getEnv('PRIVACY_URL'))}
        >
          <StyledText style={{ color: '#666666', fontSize: 12 }}>
            {t('privacyPolicy')}
          </StyledText>
        </Pressable>
      </View>
    </View>
  )
}

export default WelcomeFooter
