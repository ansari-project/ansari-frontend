import { Drawer } from 'react-native-drawer-layout'
import { AppDispatch, RootState, toggleSideMenu } from '@/store'
import React from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import SideMenuBody from './SideMenuBody'
import { useAuth, useScreenInfo } from '@/hooks'

export type Props = {
  children: React.ReactNode
}

const MenuDrawer: React.FC<Props> = ({ children }) => {
  const isSideMenuOpened = useSelector((state: RootState) => state.sideMenu.isOpen)
  const { isMobile } = useScreenInfo()
  const { isGuest } = useAuth()
  const dispatch = useDispatch<AppDispatch>()
  const theme = useSelector((state: RootState) => state.theme.theme)

  const togglePopup = (open: boolean) => {
    dispatch(toggleSideMenu(open))
  }

  return (
    <Drawer
      drawerType={isGuest || isMobile || !isSideMenuOpened ? 'front' : 'permanent'}
      open={isSideMenuOpened}
      drawerStyle={{
        backgroundColor: theme.sideMenuBackgroundColor,
        width: 300,
      }}
      overlayStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
      }}
      onOpen={() => togglePopup(true)}
      onClose={() => togglePopup(false)}
      renderDrawerContent={() => (
        <View>
          <View className='flex-1 flex-row'>
            <SideMenuBody />
          </View>
        </View>
      )}
    >
      {children}
    </Drawer>
  )
}

export default MenuDrawer
