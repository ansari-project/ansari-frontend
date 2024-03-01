import { BackgroundImage, ChatContainer, Toast } from '@endeavorpal/components'
import { useRedirect } from '@endeavorpal/hooks'
import { AppDispatch, setActiveThread } from '@endeavorpal/store'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

const HomeScreen: React.FC = () => {
  useRedirect('/', '/login')

  const dispatch = useDispatch<AppDispatch>()
  const [toastVisible, setToastVisible] = useState<boolean>(false)
  const location = useLocation()
  const errorMessage = location.state?.errorMsg || null
  // Initialize activeThread to an empty object when the component mounts
  useEffect(() => {
    dispatch(setActiveThread(null))
  }, [])

  useEffect(() => {
    if (errorMessage !== null && errorMessage.length > 0) {
      setToastVisible(true)
    }
    return () => setToastVisible(false)
  }, [errorMessage])

  return (
    <SafeAreaView style={[styles.container]}>
      <BackgroundImage />
      <ChatContainer isHome={true} />
      {toastVisible && <Toast message={errorMessage} duration={3000} onDismiss={() => setToastVisible(false)} />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F2F2F2',
    alignItems: 'center', // Ensure content is centered
    justifyContent: 'space-between', // Distributes children evenly
  },
  // Additional styles as needed
})

export default HomeScreen
