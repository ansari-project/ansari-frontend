import { useAuth, useDirection, useScreenInfo } from '@/hooks'
import { AppDispatch, RootState, toggleSideMenu } from '@/store'
import React from 'react'
import { Pressable, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ActionButtons from './ActionButtons'
import { MenuIcon } from './svg'

const Header: React.FC = () => {
  const { isAuthenticated, isGuest } = useAuth()
  const { isRTL } = useDirection()
  const { isSmallScreen, isMobile } = useScreenInfo()
  const isSideMenuOpened = useSelector((state: RootState) => state.sideMenu.isOpen)
  const displayMenuDrawer = isAuthenticated && !isGuest && (!isSideMenuOpened || isSmallScreen)
  const isInputFullMode = useSelector((state: RootState) => state.input.fullMode)
  const theme = useSelector((state: RootState) => state.theme.theme)
  const dispatch = useDispatch<AppDispatch>()

  if (isInputFullMode || (!isSmallScreen && !isAuthenticated)) {
    return null
  }

  const togglePopup = () => {
    dispatch(toggleSideMenu(!isSideMenuOpened))
  }

  return (
    <View
      className='z-10 w-full flex-row items-center'
      style={{ justifyContent: displayMenuDrawer ? 'space-between' : 'flex-end' }}
    >
      <View className={`flex-row w-full items-center justify-between ${isSmallScreen ? 'p-2' : 'p-4'}`}>
        <View className={`items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'} mr-2.5`}>
          {displayMenuDrawer && (
            <Pressable onPress={() => togglePopup()} className='p-2 rounded'>
              <MenuIcon stroke={theme.iconFill} hoverStroke={theme.hoverColor} width={28} height={28} />
            </Pressable>
          )}
        </View>
        <View className={`${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          {isMobile && <ActionButtons isTop={true} />}
        </View>
      </View>
    </View>
  )
}

export default Header
