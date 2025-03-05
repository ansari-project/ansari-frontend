import { useDirection, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import getEnv from '@/utils/getEnv'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Pressable, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

type Props = {
  marginLeft?: number | string
}

const TermsAndPrivacy: React.FC<Props> = ({ marginLeft = -40 }) => {
  const { t } = useTranslation()
  const { isRTL } = useDirection()
  const { isMobile } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)

  const marginLeftStyle = isMobile ? (isRTL ? marginLeft : 0) : isRTL ? 0 : marginLeft

  return (
    <View className='flex-1 w-full items-center justify-center flex-row' style={{ marginLeft: marginLeftStyle }}>
      <Pressable
        className='px-2'
        onPress={() => {
          // Open the subscription URL in a new tab on web, and in the system browser on native
          if (typeof window !== 'undefined' && 'open' in window) {
            window.open(getEnv('TERMS_URL'), '_blank')
          } else {
            Linking.openURL(getEnv('TERMS_URL'))
          }
        }}
      >
        <Text className="text-xs leading-[21px] font-light font-['Inter']" style={{ color: theme.textColor }}>
          {t('termOfUse')}
        </Text>
      </Pressable>
      <Text className="text-xs leading-[21px] font-light font-['Inter']" style={{ color: theme.textColor }}>
        |
      </Text>
      <Pressable
        className='px-2'
        onPress={() => {
          // Open the subscription URL in a new tab on web, and in the system browser on native
          if (typeof window !== 'undefined' && 'open' in window) {
            window.open(getEnv('PRIVACY_URL'), '_blank')
          } else {
            Linking.openURL(getEnv('PRIVACY_URL'))
          }
        }}
      >
        <Text className="text-xs leading-[21px] font-light font-['Inter']" style={{ color: theme.textColor }}>
          {t('privacyPolicy')}
        </Text>
      </Pressable>
    </View>
  )
}

export default TermsAndPrivacy
