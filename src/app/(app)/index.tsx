import { ChatContainer, Toast } from '@/components'
import { useAuth, useScreenInfo } from '@/hooks'
import { AppDispatch, setActiveThread, toggleSideMenu } from '@/store'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import { useDispatch } from 'react-redux'
import { useLocalSearchParams } from 'expo-router'

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, isGuest } = useAuth()
  const [toastVisible, setToastVisible] = useState<boolean>(false)
  const params = useLocalSearchParams()
  const errorMessage = params.errorMsg || null
  const { isMobile } = useScreenInfo()

  // Initialize activeThread to null when the component mounts
  useEffect(() => {
    // If the user is authenticated and not a guest, set the active thread to null.
    // Guest users will have the active thread set to the last thread they were in.
    if (isAuthenticated && !isGuest) {
      dispatch(setActiveThread(null))
    }
    if (!isMobile && !isGuest) {
      dispatch(toggleSideMenu(true))
    }
  }, [])

  useEffect(() => {
    if (errorMessage !== null && errorMessage.length > 0) {
      setToastVisible(true)
    }
    return () => setToastVisible(false)
  }, [errorMessage])

  return (
    <SafeAreaView className='flex-1 items-center justify-between'>
      <ChatContainer isHome={true} />
      {toastVisible && <Toast message={errorMessage} duration={3000} onDismiss={() => setToastVisible(false)} />}
    </SafeAreaView>
  )
}

export default HomeScreen
