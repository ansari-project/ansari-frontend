// Import necessary modules and components
import { LogoIcon } from '@/components/svg'
import { Toast } from '@/components'
import { useAuth, useDirection } from '@/hooks'
import { AppDispatch, RootState, setActiveThread } from '@/store'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useLocalSearchParams } from 'expo-router'

// Define the NotFoundScreen component
const NotFoundScreen: React.FC = () => {
  // Localization hook
  const { t } = useTranslation()
  // Authentication and direction hooks
  const { isAuthenticated, isGuest } = useAuth()
  const { isRTL } = useDirection()
  // State variables
  const [toastVisible, setToastVisible] = useState<boolean>(false)
  // Redux hooks and dispatch function
  const dispatch = useDispatch<AppDispatch>()
  // React router hooks
  const params = useLocalSearchParams()
  // Retrieve error message from location state or set to null
  const errorMessage = params.errorMsg || null
  // Retrieve theme data from Redux store
  const theme = useSelector((state: RootState) => state.theme.theme)
  // Navigation hook
  const router = useRouter()

  // Effect hook to initialize activeThread on component mount
  useEffect(() => {
    // If the user is authenticated and not a guest, set the active thread to null.
    // Guest users will have the active thread set to the last thread they were in.
    if (isAuthenticated && !isGuest) {
      dispatch(setActiveThread(null))
    }
  }, [])

  // Effect hook to show toast message if an error message is present
  useEffect(() => {
    if (errorMessage !== null && errorMessage.length > 0) {
      setToastVisible(true)
    }
    return () => setToastVisible(false)
  }, [errorMessage])

  // Define component styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center', // Ensure content is centered
      justifyContent: 'space-between', // Distributes children evenly
      height: '100vh',
      width: '100%',
    },
    body: {
      margin: 'auto',
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
    },
    text: {
      color: theme.textColor,
      fontFamily: 'Inter',
      fontSize: 24,
      lineHeight: 28,
    },
    textSmall: {
      color: theme.textColor,
      fontFamily: 'Inter',
      fontSize: 16,
      lineHeight: 21,
    },
    logo: {
      cursor: 'pointer',
    },
    // Additional styles as needed
  })

  // Render the component
  return (
    <SafeAreaView style={[styles.container]}>
      {/* Pressable logo to navigate back to home screen */}
      <Pressable style={styles.logo} onPress={() => router.push('/')}>
        <LogoIcon fill={theme.iconFill} />
      </Pressable>
      {/* Body text indicating 404 error */}
      <View style={styles.body}>
        <Text style={styles.text}>404 | </Text>
        <Text style={styles.textSmall}>{t('notfoundMessage')}</Text>
      </View>
      {/* Toast component to display error message if present */}
      {toastVisible && <Toast message={errorMessage} duration={3000} onDismiss={() => setToastVisible(false)} />}
    </SafeAreaView>
  )
}

export default NotFoundScreen
