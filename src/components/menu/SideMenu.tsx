import { LineIcon, RightArrowIcon } from '@endeavorpal/assets'
import { useAuth, useScreenInfo } from '@endeavorpal/hooks'
import { AppDispatch, RootState, toggleSideMenu } from '@endeavorpal/store'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import SideMenuBody from './SideMenuBody'

const SideMenu: React.FC = () => {
  const { isMobile } = useScreenInfo()
  const { isAuthenticated, isGuest } = useAuth()
  const { isOpen: isSideMenuOpened, width } = useSelector((state: RootState) => state.sideMenu)

  const dispatch = useDispatch<AppDispatch>()
  const togglePopup = () => {
    dispatch(toggleSideMenu(!isSideMenuOpened))
  }

  return (
    isAuthenticated &&
    !isGuest &&
    !isMobile && (
      <View style={styles.menu}>
        <View style={isSideMenuOpened ? { ...styles.shown, width } : styles.hidden}>
          <SideMenuBody />
        </View>
        <View style={styles.closeButton}>
          <Pressable onPress={togglePopup}>{isSideMenuOpened ? <LineIcon /> : <RightArrowIcon />}</Pressable>
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
  closeButton: {
    marginTop: 'auto',
    marginBottom: 'auto',
    marginHorizontal: 4,
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
