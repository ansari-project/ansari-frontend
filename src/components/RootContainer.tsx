import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export type Props = {
  children: React.ReactNode
}

const RootContainer: React.FC<Props> = ({ children }) => {
  return <GestureHandlerRootView className='flex-1'>{children}</GestureHandlerRootView>
}

export default RootContainer
