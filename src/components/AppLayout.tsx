import React, { PropsWithChildren } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import Footer from './Footer'
import Header from './Header'

type AppLayoutProps = PropsWithChildren<{ children?: React.ReactNode }>

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.appContent}>{children}</ScrollView>
      <Footer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Roboto',
    // backgroundColor: '#F2F2F2',
    backgroundColor: '#FFF',
    alignItems: 'center', // Center children horizontally
    justifyContent: 'space-between',
    height: '100vh',
    width: '100%',
  },
  appContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Ensure it spans the full width
    alignSelf: 'center', // Center the content area within the parent container
    // paddingHorizontal: 16,
    // Adjust padding/margin to prevent overlap with the header/footer
    paddingTop: 56, // Example: Adjust based on your header's height
    paddingBottom: 20, // Example: Adjust based on your footer's height
  },
})

export default AppLayout
