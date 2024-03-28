import { useScreenInfo } from '@endeavorpal/hooks'
import { RootState } from '@endeavorpal/store'
import React, { Children, PropsWithChildren, ReactElement } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import Footer from './Footer'
import Header from './Header'
import { SideMenu } from './menu'
import { WelcomeScreen } from '@endeavorpal/screens'

type AppLayoutProps = PropsWithChildren<{ children?: React.ReactNode }>

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isSmallScreen, height } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)

  // Get the first child element
  const child = Children.only(children) as ReactElement
  // Get the type of the child element
  const childType = child?.type || undefined
  let showFooter = true
  if (childType === WelcomeScreen) {
    showFooter = false
  }

  // Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      fontFamily: 'Inter',
      // backgroundColor: theme.backgroundColor,
      alignItems: 'center', // Center children horizontally
      justifyContent: 'space-between',
      width: '100%',
      backgroundImage: `url(${theme.backgroundImage})`,
      backgroundRepeat: 'repeat',
      backgroundSize: 'contain',
    },
    bodyContainer: {
      flex: 1,
      width: '100%',
      flexDirection: 'row',
      fontFamily: 'Inter',
    },
    main: { flex: 1, flexGrow: 1 },
    mainBody: { width: '100%', flex: 1 },
    appContent: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%', // Ensure it spans the full width
      alignSelf: 'center', // Center the content area within the parent container
      fontFamily: 'Inter',
    },
    appContentMobile: {
      paddingBottom: 4,
    },
  })

  // Component Return Value
  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.bodyContainer}>
        <SideMenu />
        <View style={styles.main}>
          <View style={styles.mainBody}>
            <Header />
            <ScrollView contentContainerStyle={[styles.appContent, isSmallScreen && styles.appContentMobile]}>
              {children}
            </ScrollView>
            {showFooter && <Footer />}
          </View>
        </View>
      </View>
    </View>
  )
}

export default AppLayout
