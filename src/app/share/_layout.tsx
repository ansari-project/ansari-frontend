import { useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import React from 'react'
import { ImageBackground, KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import ActionButtons from '@/components/ActionButtons'
import Footer from '@/components/Footer'
import { Slot } from 'expo-router'

/**
 * ShareLayout Component.
 * This component defines the layout for public pages.
 * It includes a header, main content area, and a footer.
 * @returns JSX element representing the ShareLayout component.
 */
export const ShareLayout = () => {
  // Hook to get screen information
  const { isSmallScreen, isMobile, width, height } = useScreenInfo()
  // Redux hook to get theme data
  const theme = useSelector((state: RootState) => state.theme.theme)

  // Styles for the component
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      minHeight: height > 600 ? height : 'calc(100vh - 48px)', // Set minimum height based on screen height
      backgroundRepeat: 'repeat',
      backgroundSize: 'contain',
      width: '100%',
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
    },
    pageContainer: {
      flex: 1,
      width: '100%',
    },
    main: { flex: 1, flexGrow: 1, width: '100%' },
    appContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%', // Ensure it spans the full width
      alignSelf: 'center', // Center the content area within the parent container
      fontFamily: 'Inter',
      paddingBottom: isSmallScreen ? 4 : null,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'end',
      width: '100%',
      alignItems: 'center',
      padding: isSmallScreen ? 8 : 16,
    },
  })

  // Render the component
  return (
    <ImageBackground style={{ width, height }} source={require('@/assets/images/background.png')}>
      <KeyboardAvoidingView style={[styles.mainContainer]} behavior='padding' enabled>
        <View style={[styles.container]}>
          <View style={styles.pageContainer}>
            {isMobile && (
              <View style={styles.header}>
                <ActionButtons isTop={true} />
              </View>
            )}

            <View style={styles.main}>
              <View style={styles.bodyContainer}>
                <View style={styles.appContent}>
                  <Slot />
                </View>
              </View>
              <Footer />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

export default ShareLayout
