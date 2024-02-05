import React from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { BackgroundImage, PromptList, Welcome } from '../components'
import { useScreenSize } from '../hooks'

const HomeScreen: React.FC = () => {
  const { isSmallScreen } = useScreenSize()

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage />
      <View style={styles.content}>
        <Welcome />
      </View>
      <View style={styles.content}>
        <View style={[styles.promptContent, { width: isSmallScreen ? '100%' : '80%' }]}>
          <PromptList />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    gap: 0,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch', // This centers the children along the cross axis (vertically)
    backgroundColor: '#F2F2F2', // Assuming this is the background color for the entire screen
    fontFamily: 'Roboto',
    paddingLeft: 112,
    paddingRight: 112,
    paddingTop: 56,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Roboto',
    marginVertical: 40,
  },
  promptContent: {
    height: 'fit-content',
    borderRadius: 0,
    alignItems: 'flex-start',
    gap: 16,
    width: '80%',
  },
  // Add more styles if needed
})

export default HomeScreen
