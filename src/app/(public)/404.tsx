// Import necessary modules and components
import { LogoIcon } from '@/components/svg'
import { Toast } from '@/components'
import { useAuth, useDirection } from '@/hooks'
import { AppDispatch, RootState, setActiveThread } from '@/store'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, SafeAreaView, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useLocalSearchParams } from 'expo-router'

// Define the NotFoundScreen component
const NotFoundScreen: React.FC = () => {
  console.log('NotFoundScreen')
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

  return (
    <SafeAreaView className='flex-1 items-center justify-between h-screen w-full'>
      <Pressable className='cursor-pointer' onPress={() => router.push('/')}>
        <LogoIcon fill={theme.iconFill} />
      </Pressable>
      <View className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center m-auto`}>
        <Text style={{ color: theme.textColor, fontFamily: 'Inter' }} className='text-2xl leading-7'>
          404 |{' '}
        </Text>
        <Text style={{ color: theme.textColor, fontFamily: 'Inter' }} className='text-base leading-[21px]'>
          {t('notfoundMessage')}
        </Text>
      </View>
      {toastVisible && <Toast message={errorMessage} duration={3000} onDismiss={() => setToastVisible(false)} />}
    </SafeAreaView>
  )
}

export default NotFoundScreen
