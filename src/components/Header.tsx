import React from 'react'
import { Text, View } from 'react-native'
import styles from '../styles/nativeAppLayout'
import InfoPopup from './InfoPopup'
import LanguageSelector from './LanguageSelector'

const Header: React.FC = () => {
  return (
    <View style={styles.appHeader}>
      <View style={styles.headerContent}>
        <View></View>
        <Text style={{ fontWeight: '500', fontSize: 24 }}>{'ANSARI'}</Text>
        <View style={styles.rightContent}>
          <LanguageSelector />
          <InfoPopup />
        </View>
      </View>
    </View>
  )
}
export default Header
