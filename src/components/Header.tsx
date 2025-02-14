import { useAuth, useDirection, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import ActionButtons from './ActionButtons'
import { MenuDrawer } from './menu'

const Header: React.FC = () => {
  const { isAuthenticated, isGuest } = useAuth()
  const { isRTL } = useDirection()
  const { isSmallScreen, isMobile } = useScreenInfo()
  const isSideMenuOpened = useSelector((state: RootState) => state.sideMenu.isOpen)
  const displayMenuDrawer = isAuthenticated && !isGuest && (!isSideMenuOpened || isSmallScreen)
  const isInputFullMode = useSelector((state: RootState) => state.input.fullMode)

  if (isInputFullMode || (!isSmallScreen && !isAuthenticated)) {
    return null
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
  })

  return (
    <View style={styles.container}>
      <View style={styles.contentWarper}>
        <View style={styles.leftContent}>{displayMenuDrawer && <MenuDrawer />}</View>
        <View style={styles.rightContent}>{isMobile && <ActionButtons isTop={true} />}</View>
      </View>
    </View>
  )
}

export default Header
