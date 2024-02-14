import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { DeleteIcon, RenameIcon } from '../../assets'
import { Thread } from '../../store/types/chatTypes'

type IconContainerProps = {
  thread: Thread
  isRTL: boolean
  /* eslint-disable no-unused-vars */
  onThreadDelete?: (aboutToDeleteThread: Thread) => void
  onThreadRename?: (aboutToRenameThread: Thread) => void
  /* eslint-disable no-unused-vars */
}

const IconContainer: React.FC<IconContainerProps> = ({ thread, isRTL, onThreadDelete, onThreadRename }) => {
  return (
    <View style={[styles.iconContainer, isRTL ? { left: 0 } : { right: 0 }]}>
      {onThreadRename && (
        <Pressable onPress={() => onThreadRename(thread)} style={styles.icon}>
          <RenameIcon width='24' height='24' fill='#fff' />
        </Pressable>
      )}
      {onThreadDelete && (
        <Pressable
          onPress={() => onThreadDelete(thread)}
          style={[styles.icon, isRTL && onThreadRename ? { marginLeft: 20 } : { marginRight: 20 }]}
        >
          <DeleteIcon width='24' height='24' fill='red' />
        </Pressable>
      )}
      {/* Additional icons can be added here */}
    </View>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  icon: {
    padding: 4,
    // Additional styling for icons can go here
  },
})

export default IconContainer
