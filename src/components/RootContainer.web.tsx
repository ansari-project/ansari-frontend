import React, { useEffect } from 'react'
import { i18n } from '@/i18n'
import { View } from 'react-native'
import { inject } from '@vercel/analytics'

inject()

export type Props = {
  children: React.ReactNode
}

const RootContainer: React.FC<Props> = ({ children }) => {
  useEffect(() => {
    document.dir = i18n.dir(i18n.language)
  }, [])

  return <View className='flex-1'>{children}</View>
}

export default RootContainer
