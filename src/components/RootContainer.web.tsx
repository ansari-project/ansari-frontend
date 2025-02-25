import React, { useEffect } from 'react'
import { i18n } from '@/i18n'
import { View, StyleSheet } from 'react-native'
export type Props = {
  children: React.ReactNode
}

const RootContainer: React.FC<Props> = ({ children }) => {
  useEffect(() => {
    document.dir = i18n.dir(i18n.language)
  }, [])

  const styles = StyleSheet.create({
    rootView: {
      flex: 1,
    },
  })

  return <View style={styles.rootView}>{children}</View>
}

export default RootContainer
