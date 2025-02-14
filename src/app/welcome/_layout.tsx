import { useAuth, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import { Redirect, Slot } from 'expo-router'
import React from 'react'
import { KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * WelcomeLayout Component.
 * This component defines the layout for public pages.
 * It includes a header, main content area, and a footer.
 * @returns JSX element representing the WelcomeLayout component.
 */
export const WelcomeLayout = () => {
  const { isAuthenticated, accessToken } = useAuth()
  // Hook to get screen information
  const { height } = useScreenInfo()
  // Redux hook to get theme data
  const theme = useSelector((state: RootState) => state.theme.theme)

  if (isAuthenticated && accessToken) {
    return <Redirect href='/' />
  }

  // Styles for the component
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      minHeight: height > 600 ? height : 'calc(100vh - 48px)', // Set minimum height based on screen height
      backgroundImage: `url(${theme.backgroundImage})`, // Set background image
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
    pageContainer: {
      flex: 1,
      width: '100%',
    },
    main: { flex: 1, flexGrow: 1, width: '100%' },
  })

  // Render the component
  return (
    <KeyboardAvoidingView style={[styles.mainContainer]} behavior='padding' enabled>
      <ScrollView contentContainerStyle={styles.main}>
        <Slot />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default WelcomeLayout
