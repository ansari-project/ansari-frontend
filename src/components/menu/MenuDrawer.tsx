import { Drawer } from 'react-native-drawer-layout'
import { AppDispatch, RootState, toggleSideMenu } from '@/store'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import SideMenuBody from './SideMenuBody'

export type Props = {
  children: React.ReactNode
}

const MenuDrawer: React.FC<Props> = ({ children }) => {
  const isSideMenuOpened = useSelector((state: RootState) => state.sideMenu.isOpen)
  const dispatch = useDispatch<AppDispatch>()
  const theme = useSelector((state: RootState) => state.theme.theme)

  const togglePopup = () => {
    dispatch(toggleSideMenu(!isSideMenuOpened))
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.sideMenuBackgroundColor,
      fontFamily: 'Inter',
      color: theme.textColor,
    },
  })

  return (
    <>
      <Drawer
        drawerType='front'
        open={isSideMenuOpened}
        drawerStyle={styles.container}
        overlayStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        onOpen={() => togglePopup()}
        onClose={() => togglePopup()}
        renderDrawerContent={() => (
          <View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <SideMenuBody />
            </View>
          </View>
        )}
      >
        {children}
      </Drawer>
    </>
  )
}

export default MenuDrawer
