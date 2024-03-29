import { EditIcon, LogoRoundIcon, MenuIcon } from '@endeavorpal/assets'
import { useAuth, useDirection, useScreenInfo } from '@endeavorpal/hooks'
import { AppDispatch, RootState, fetchThreads, toggleSideMenu } from '@endeavorpal/store'
import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import ActionButtons from '../ActionButtons'
import { ThreadsList } from '../threads'
import { NameContainer } from './'

const SideMenuBody: React.FC = () => {
  const { user } = useAuth()
  const { isMobile, isSmallScreen } = useScreenInfo()
  const { isRTL } = useDirection()
  const [isHovered, setIsHovered] = useState(false)
  const theme = useSelector((state: RootState) => state.theme.theme)
  const isSideMenuOpened = useSelector((state: RootState) => state.sideMenu.isOpen)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (isSideMenuOpened) {
      dispatch(fetchThreads())
    }
  }, [isSideMenuOpened, dispatch])

  const togglePopup = () => {
    dispatch(toggleSideMenu(!isSideMenuOpened))
  }

  const onSelectCard = () => {
    if (isMobile) {
      togglePopup()
    }
  }

  const navigate = useNavigate()
  // Function to handle press on ANSARI text
  const handlePress = () => {
    // Navigate to the home page here
    navigate('/')
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor: theme.sideMenuBackgroundColor,
      fontFamily: 'Inter',
      color: theme.textColor,
      width: '100%',
    },
    mainView: {
      height: '100%',
      position: 'relative',
      width: '100%',
      backgroundColor: theme.sideMenuBackgroundColor,
      borderRadius: 0,
      alignItems: 'flex-start',
      elevation: 5,
    },
    content: {
      overflowY: 'auto',
      scrollbarColor: 'transparent transparent', // Change scrollbar color
      scrollbarWidth: 'thin',
      width: '100%',
      borderRadius: 0,
      padding: 16,
      alignItems: 'flex-start',
      elevation: 5,
      gap: 16,
      flexGrow: 1, // make the content view expand and fill the available space
      maxHeight: '80vh',
    },
    scrollbar: {
      scrollbarColor: theme.scrollColor + ' transparent', // Change scrollbar color
      scrollbarWidth: 'thin',
    },
    headerContainer: {
      zIndex: 1,
      flexDirection: 'row',
      width: '100%',
      paddingTop: 24,
      paddingBottom: 8,
      paddingRight: isRTL ? 24 : 8,
      paddingLeft: isRTL ? 8 : 24,
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
      display: 'inline-flex',
      cursor: 'pointer',
    },
    headerContainerMobile: {
      padding: 10,
      paddingHorizontal: 16,
      height: 'auto',
    },
    headerMenu: {
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    bottomContainer: {
      width: '100%',
      bottom: 0,
      zIndex: 1,
      alignItems: 'center',
      justifyContent: 'start',
      marginTop: 'auto', // push the bottomContent to the bottom of the content view
      flexDirection: 'row',
      paddingHorizontal: 16,
    },
    nameWrapper: {
      flex: 1,
      flexDirection: 'row',
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <View style={[styles.headerContainer, isSmallScreen && styles.headerContainerMobile]}>
          {/* Drawer Header */}

          <View style={styles.headerMenu}>
            <Pressable onPress={togglePopup}>
              <MenuIcon stroke={theme.iconFill} hoverStroke={theme.hoverColor} width={24} height={24} />
            </Pressable>
            <Pressable onPress={handlePress}>
              <LogoRoundIcon width={24} height={24} />
            </Pressable>
            <Pressable onPress={handlePress}>
              <EditIcon width={24} height={24} fill={theme.iconFill} hoverFill={theme.hoverColor} />
            </Pressable>
          </View>
        </View>
        <View
          style={[styles.content, (isHovered || isMobile) && styles.scrollbar]}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Drawer Body */}
          <ThreadsList onSelectCard={onSelectCard} />
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.nameWrapper}>
            <NameContainer name={`${user?.firstName} ${user?.lastName}`} />
            {!isMobile && <ActionButtons isTop={false} margin={8} />}
          </View>
        </View>
      </View>
    </View>
  )
}

export default SideMenuBody