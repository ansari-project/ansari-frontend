import { useAuth, useDirection } from '@/hooks'
import React from 'react'
import { View } from 'react-native'
import InfoPopup from './InfoPopup'
import LanguageSelector from './LanguageSelector'

export type Props = {
  isTop: boolean
  margin?: number
}

const ActionButtons: React.FC<Props> = ({ isTop, margin }: Props) => {
  const { isRTL } = useDirection()
  const { isAuthenticated } = useAuth()

  const marginStyle = {
    marginLeft: isRTL && !isTop ? undefined : margin || 0,
    marginRight: isRTL && !isTop ? margin || 0 : undefined,
  }

  return (
    <View className='flex-row items-center z-[99]' style={marginStyle}>
      <LanguageSelector isTop={isTop} />
      {isAuthenticated && <InfoPopup />}
    </View>
  )
}

export default ActionButtons
