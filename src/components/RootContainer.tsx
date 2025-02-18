import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
export type Props = {
  children: React.ReactNode
}

const RootContainer: React.FC<Props> = ({ children }) => {
  const styles = StyleSheet.create({
    rootView: {
      flex: 1,
    },
  })

  return <GestureHandlerRootView style={styles.rootView}>{children}</GestureHandlerRootView>
}

export default RootContainer
