import { MenuIcon } from '@/assets'
import { useDirection, useScreenInfo } from '@/hooks'
import { AppDispatch, RootState, toggleSideMenu } from '@/store'
import React from 'react'
import { Modal, Pressable, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import SideMenuBody from './SideMenuBody'

const MenuDrawer: React.FC = () => {
  const { isMobile, sideMenuDrawer } = useScreenInfo()
  const { isRTL } = useDirection()
  const isSideMenuOpened = useSelector((state: RootState) => state.sideMenu.isOpen)
  const dispatch = useDispatch<AppDispatch>()
  const theme = useSelector((state: RootState) => state.theme.theme)

  const togglePopup = () => {
    dispatch(toggleSideMenu(!isSideMenuOpened))
  }

  const styles = StyleSheet.create({
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      elevation: 2,
      paddingLeft: isRTL ? 8 : isMobile ? 8 : 0,
      paddingRight: isRTL ? (isMobile ? 8 : 0) : 8,
    },
  })

  return (
    <>
      <Pressable onPress={() => togglePopup()} style={styles.button}>
        <MenuIcon stroke={theme.iconFill} hoverStroke={theme.hoverColor} width={24} height={24} />
      </Pressable>
      <Modal
        animationType='fade'
        transparent={true}
        visible={isSideMenuOpened && isMobile}
        onRequestClose={() => togglePopup()}
      >
        <View style={{ width: sideMenuDrawer, flex: 1 }}>
          <SideMenuBody />
        </View>
      </Modal>
    </>
  )
}

export default MenuDrawer
