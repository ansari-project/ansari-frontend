import { useAuth, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className={`w-full flex-row justify-start items-center z-10 ${isSmallScreen ? 'px-4' : 'px-6'} ${!isAuthenticated ? 'py-4' : 'pt-4'}`}
      >
        {isAuthenticated && isGuest && (
          <View className='mx-2.5'>
            <NameContainer
              name={t('welcomeGuestText') as string}
              initial={t('welcomeGuest') as string}
              nameColor={theme.textColor}
              displayName={displayName}
            />
          </View>
        )}
        {(!isAuthenticated || isGuest) && !isMobile && <ActionButtons isTop={false} />}
        {isAuthenticated && (
          <View className='flex-1'>
            <View className='flex-row items-center justify-center px-1.5'>
              <StyledText className='text-xs leading-[21px] font-light'>{t('authorizedFooterText')}</StyledText>
              <Subscription />
            </View>
          </View>
        )}
        {!isAuthenticated && <TermsAndPrivacy />}
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Footer
