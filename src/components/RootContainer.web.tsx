import React from 'react'
import { View, StyleSheet } from 'react-native'
export type Props = {
  children: React.ReactNode
}

const RootContainer: React.FC<Props> = ({ children }) => {
  const styles = StyleSheet.create({
    rootView: {
      flex: 1,
    },
  })

  return <View style={styles.rootView}>{children}</View>
}

export default RootContainer
