import { useAuth, useDirection } from '@/hooks'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import InfoPopup from './InfoPopup'
import LanguageSelector from './LanguageSelector'

export type Props = {
  isTop: boolean
  margin?: number
}

const ActionButtons: React.FC<Props> = ({ isTop, margin }: Props) => {
  const { isRTL } = useDirection()
  const { isAuthenticated } = useAuth()
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 99,
      marginLeft: isRTL && !isTop ? undefined : margin || 0,
      marginRight: isRTL && !isTop ? margin || 0 : undefined,
    },
  })

  return (
    <View style={styles.container}>
      <LanguageSelector isTop={isTop} />
      {isAuthenticated && <InfoPopup />}
    </View>
  )
}

export default ActionButtons
