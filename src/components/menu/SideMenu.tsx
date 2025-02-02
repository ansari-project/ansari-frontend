import { useAuth, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import SideMenuBody from './SideMenuBody'

const SideMenu: React.FC = () => {
  const { isMobile } = useScreenInfo()
  const { isAuthenticated, isGuest } = useAuth()
  const { isOpen: isSideMenuOpened, width } = useSelector((state: RootState) => state.sideMenu)

  return (
    isAuthenticated &&
    !isGuest &&
    !isMobile && (
      <View style={styles.menu}>
        <View style={isSideMenuOpened ? { ...styles.shown, width } : styles.hidden}>
          <SideMenuBody />
        </View>
      </View>
    )
  )
}

const styles = StyleSheet.create({
  menu: {
    flexDirection: 'row',
    overflowY: 'visible',
  },
  hidden: {
    width: 0,
    visibility: 'hidden',
    transition: 'width 0.3s ease, visibility 0.5s ease',
  },
  shown: {
    transition: 'width 0.3s ease',
  },
})

export default SideMenu
