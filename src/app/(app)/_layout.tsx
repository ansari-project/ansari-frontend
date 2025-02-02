import { LineIcon, RightArrowIcon } from '@/assets'
import { useAuth, useScreenInfo } from '@/hooks'
import { AppDispatch, RootState, toggleSideMenu } from '@/store'
import React, { Children, PropsWithChildren, ReactElement } from 'react'
import { Dimensions, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { SideMenu } from '@/components/menu'
import { Slot } from 'expo-router'

/**
 * AppLayout Component.
 * This component defines the layout for the entire application.
 * It includes a header, side menu, main content area, and a footer.
 * The side menu can be toggled open/closed by clicking a button.
 * @returns JSX element representing the AppLayout component.
 */
export const AppLayout = () => {
  // Hook to get screen information
  const { isSmallScreen, isMobile } = useScreenInfo()
  // Redux hook to get theme data
  const theme = useSelector((state: RootState) => state.theme.theme)
  // Redux hook to get side menu state
  const { isOpen: isSideMenuOpened } = useSelector((state: RootState) => state.sideMenu)
  // Hook to check authentication status
  const { isAuthenticated, isGuest } = useAuth()

  // Redux dispatcher
  const dispatch = useDispatch<AppDispatch>()

  // Get the first child element
  const child = Children.only(children) as ReactElement
  // Get the type of the child element
  const childType = child?.type || undefined
  let showFooter = false

  // Get the height of the window
  const { height } = Dimensions.get('window')

  // Function to toggle the side menu
  const togglePopup = () => {
    dispatch(toggleSideMenu(!isSideMenuOpened))
  }

  // Styles for the component
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      minHeight: height > 600 ? height : 'calc(100vh - 48px)', // Set minimum height based on screen height
      backgroundImage: `url(${theme.backgroundImage})`, // Set background image
      backgroundRepeat: 'repeat',
      backgroundSize: 'contain',
      overflowY: 'auto',
    },
    container: {
      flexGrow: 1,
      fontFamily: 'Inter',
      alignItems: 'center', // Center children horizontally
      justifyContent: 'space-between',
      width: '100%',
    },
    bodyContainer: {
      flex: 1,
      width: '100%',
      flexDirection: 'row',
      fontFamily: 'Inter',
    },
    main: { flex: 1, flexGrow: 1 },
    mainBody: { width: '100%', flex: 1 },
    appContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%', // Ensure it spans the full width
      alignSelf: 'center', // Center the content area within the parent container
      fontFamily: 'Inter',
      paddingBottom: isSmallScreen ? 4 : null,
    },
    closeButton: {
      marginTop: 'auto',
      marginBottom: 'auto',
      marginHorizontal: isSideMenuOpened ? 8 : 16,
    },
  })

  // Render the component
  return (
    <KeyboardAvoidingView style={[styles.mainContainer]} behavior='padding' enabled>
      <View style={[styles.container]}>
        <View style={styles.bodyContainer}>
          {/* Side menu */}
          <SideMenu />
          <View style={styles.main}>
            <View style={styles.mainBody}>
              {/* Header */}
              <Header />
              <View style={[styles.bodyContainer, { flexDirection: 'row' }]}>
                {/* Toggle button for side menu */}
                {isAuthenticated && !isGuest && !isMobile && (
                  <View style={styles.closeButton}>
                    <Pressable onPress={togglePopup}>{isSideMenuOpened ? <LineIcon /> : <RightArrowIcon />}</Pressable>
                  </View>
                )}
                {/* Main content area */}
                <ScrollView contentContainerStyle={styles.appContent}>
                  <Slot />
                </ScrollView>
              </View>
              {/* Footer */}
              {showFooter && <Footer />}
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default AppLayout
