import { LineIcon, RightArrowIcon } from '@/components/svg'
import { useAuth, useScreenInfo } from '@/hooks'
import { AppDispatch, RootState, toggleSideMenu } from '@/store'
import React from 'react'
import { Dimensions, ImageBackground, KeyboardAvoidingView, Pressable, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { MenuDrawer } from '@/components/menu'
import { Redirect, Slot } from 'expo-router'

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
  const { isAuthenticated, isGuest, accessToken } = useAuth()

  // Redux dispatcher
  const dispatch = useDispatch<AppDispatch>()

  const showFooter = true

  // Get the height of the window
  const { width, height } = Dimensions.get('window')

  // Function to toggle the side menu
  const togglePopup = () => {
    dispatch(toggleSideMenu(!isSideMenuOpened))
  }

  if (!isAuthenticated || !accessToken) {
    return <Redirect href='/welcome' />
  }

  // Styles for the component
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      minHeight: height > 600 ? height : height - 48, // Set minimum height based on screen height
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
    mainBody: { width: '100%', flex: 1 },
    appContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center', // Center the content area within the parent container
      fontFamily: 'Inter',
      paddingBottom: isSmallScreen ? 4 : null,
    },
    closeButton: {
      marginTop: 'auto',
      marginBottom: 'auto',
      marginHorizontal: isSideMenuOpened ? 8 : 16,
    },
    bodyInnerContainer: {
      flexDirection: 'row',
    },
  })

  // Render the component
  return (
    <ImageBackground style={{ width, height }} source={require('@/assets/images/background.png')}>
      <MenuDrawer>
        <KeyboardAvoidingView style={[styles.mainContainer]} behavior='padding' enabled>
          <View style={styles.container}>
            <View style={styles.bodyContainer}>
              {/* Side menu */}
              <View style={styles.mainBody}>
                {/* Header */}
                <Header />
                <View style={styles.bodyInnerContainer}>
                  {/* Toggle button for side menu */}
                  {isAuthenticated && !isGuest && !isMobile && (
                    <View style={styles.closeButton}>
                      <Pressable onPress={togglePopup}>
                        {isSideMenuOpened ? <LineIcon /> : <RightArrowIcon />}
                      </Pressable>
                    </View>
                  )}
                  {/* Main content area */}
                  <View style={styles.appContent}>
                    <Slot />
                  </View>
                </View>
                {/* Footer */}
                {showFooter && <Footer />}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </MenuDrawer>
    </ImageBackground>
  )
}

export default AppLayout
