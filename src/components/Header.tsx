import { useAuth, useDirection, useScreenInfo } from '@/hooks'
import { AppDispatch, RootState, toggleSideMenu } from '@/store'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
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

  const styles = StyleSheet.create({
    container: {
      zIndex: 10,
      width: '100%',
      flexDirection: 'row',
      justifyContent: displayMenuDrawer ? 'space-between' : 'flex-end',
      alignItems: 'center',
    },
    contentWarper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
      padding: isSmallScreen ? 8 : 16,
    },
    leftContent: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      marginRight: 10,
    },
    rightContent: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    button: {
      padding: 8,
      borderRadius: 4,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.contentWarper}>
        <View style={styles.leftContent}>
          {displayMenuDrawer && (
            <Pressable onPress={() => togglePopup()} style={styles.button}>
              <MenuIcon stroke={theme.iconFill} hoverStroke={theme.hoverColor} width={28} height={28} />
            </Pressable>
          )}
        </View>
        <View style={styles.rightContent}>{isMobile && <ActionButtons isTop={true} />}</View>
      </View>
    </View>
  )
}

export default Header
