import { useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import React, { PropsWithChildren } from 'react'
import { KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'

// Define the type of props that the WelcomeLayout component accepts
type Props = PropsWithChildren<{ children?: React.ReactNode }>

/**
 * WelcomeLayout Component.
 * This component defines the layout for public pages.
 * It includes a header, main content area, and a footer.
 * @param children The child components to be rendered within the main content area.
 * @returns JSX element representing the WelcomeLayout component.
 */
export const WelcomeLayout: React.FC<Props> = ({ children }) => {
  // Hook to get screen information
  const { height } = useScreenInfo()
  // Redux hook to get theme data
  const theme = useSelector((state: RootState) => state.theme.theme)

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
      <ScrollView contentContainerStyle={styles.main}>{children}</ScrollView>
    </KeyboardAvoidingView>
  )
}

export default WelcomeLayout
