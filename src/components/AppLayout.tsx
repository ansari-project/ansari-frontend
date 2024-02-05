import React, { PropsWithChildren } from 'react'
import { ScrollView, View } from 'react-native'
import Footer from './Footer'
import Header from './Header'
// import '../styles/appLayout.scss'
import styles from '../styles/nativeAppLayout' // I'm assuming you have a separate stylesheet for native

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

export default AppLayout
