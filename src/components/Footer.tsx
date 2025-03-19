import { useAuth, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Pressable, View } from 'react-native'
import { useSelector } from 'react-redux'
import ActionButtons from './ActionButtons'
import Subscription from './Subscription'
import TermsAndPrivacy from './TermsAndPrivacy'
import { NameContainer } from './menu'
import StyledText from './StyledText'

const Footer: React.FC = () => {
  const { t } = useTranslation()
  const { isMobile, isSmallScreen } = useScreenInfo()
  const { isAuthenticated, isGuest } = useAuth()
  const displayName = !(isAuthenticated && isGuest && (isMobile || isSmallScreen))
  const theme = useSelector((state: RootState) => state.theme.theme)
  const isInputFullMode = useSelector((state: RootState) => state.input.fullMode)

  if (isInputFullMode) {
    return null
  }

  const containerClass = 'w-full flex-row justify-start items-center py-2 px-2'

  if (!isAuthenticated) {
    return (
      <Pressable onPress={Keyboard.dismiss} className={containerClass}>
        {!isMobile && <ActionButtons isTop={false} />}
        <TermsAndPrivacy />
      </Pressable>
    )
  }

  if (isGuest) {
    return (
      <Pressable onPress={Keyboard.dismiss} className={containerClass}>
        <NameContainer
          name={t('welcomeGuestText') as string}
          initial={t('welcomeGuest') as string}
          nameColor={theme.textColor}
          displayName={displayName}
        />
        {!isMobile && <ActionButtons isTop={false} />}
        <View className='flex-1 px-1'>
          <StyledText className='text-xs leading-[21px] font-light'>{t('authorizedFooterText')}</StyledText>
        </View>
        <Subscription />
      </Pressable>
    )
  }

  return (
    <Pressable onPress={Keyboard.dismiss} className='w-full flex-row justify-start items-center py-2 px-2'>
      <View className='flex-1'>
        <View className='flex-row items-center justify-center px-1.5'>
          <StyledText className='text-xs leading-[21px] font-light'>{t('authorizedFooterText')}</StyledText>
          <Subscription />
        </View>
      </View>
    </Pressable>
  )
}

export default Footer
