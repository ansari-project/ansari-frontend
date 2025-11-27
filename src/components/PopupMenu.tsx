import React from 'react'
import { Modal, Pressable, View, ViewStyle, StyleProp } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

type PopupMenuProps = {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  menuStyle?: StyleProp<ViewStyle>
}

export const PopupMenuSeparator: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.theme)
  return <View style={{ height: 1, backgroundColor: theme.primaryColor, marginVertical: 8, opacity: 0.3 }} />
}

const PopupMenu: React.FC<PopupMenuProps> = ({ visible, onClose, children, position = 'bottom-left', menuStyle }) => {
  const theme = useSelector((state: RootState) => state.theme.theme)

  const positionStyles = {
    'bottom-left': 'justify-end items-start pb-24 pl-4',
    'bottom-right': 'justify-end items-end pb-24 pr-4',
    'top-left': 'justify-start items-start pt-24 pl-4',
    'top-right': 'justify-start items-end pt-24 pr-4',
  }

  return (
    <Modal transparent visible={visible} animationType='fade' onRequestClose={onClose}>
      <Pressable className='flex-1' onPress={onClose}>
        <View className={`flex-1 ${positionStyles[position]}`}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              className='elevation-5'
              style={[
                {
                  backgroundColor: theme.popupBackgroundColor,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.primaryColor,
                  padding: 16,
                  minWidth: 180,
                },
                menuStyle,
              ]}
            >
              {children}
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  )
}

export default PopupMenu
