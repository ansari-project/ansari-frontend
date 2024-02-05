import React from 'react'
import { View } from 'react-native'
import Subscription from './Subscription'
import styles from '../styles/nativeAppLayout'

const Footer: React.FC = () => {
  return (
    <View styles={styles.appFooter}>
      <Subscription />
    </View>
  )
}

export default Footer
