import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { BackgroundImage, ChatContainer, PromptList, Toast, Welcome } from '../components'
import { useRedirect, useScreenInfo } from '../hooks'
import { setActiveThread } from '../store/slices/chatSlice'
import { AppDispatch } from '../store/store'

const HomeScreen: React.FC = () => {
  useRedirect('/', '/login')

  const { isSmallScreen } = useScreenInfo()
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
      <ChatContainer isHome={true}>
        <View style={styles.contentWrapper}>
          <Welcome />
          <View style={[styles.promptContent, isSmallScreen ? styles.promptSmallScreen : styles.promptLargeScreen]}>
            <PromptList />
          </View>
        </View>
      </ChatContainer>
      {toastVisible && <Toast message={errorMessage} duration={3000} onDismiss={() => setToastVisible(false)} />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    alignItems: 'center', // Ensure content is centered
    justifyContent: 'space-between', // Distributes children evenly
  },
  contentWrapper: {
    width: '100%', // Use full width for smaller screens
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    flex: 1,
  },
  promptContent: {
    width: '100%', // Ensure it uses the full width of its container
    alignItems: 'flex-start', // Center items for consistency
  },
  promptSmallScreen: {
    alignItems: 'stretch',
    // Additional styles for small screens if necessary
  },
  promptLargeScreen: {
    // alignItems: 'stretch',
    // Additional styles for large screens, e.g., padding or margins
  },
  // Additional styles as needed
})

export default HomeScreen
