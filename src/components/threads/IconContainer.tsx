import { DeleteIcon, RenameIcon } from '@endeavorpal/assets'
import { RootState, Thread } from '@endeavorpal/store'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'

type IconContainerProps = {
  thread: Thread
  isRTL: boolean
  /* eslint-disable no-unused-vars */
  onThreadDelete?: (aboutToDeleteThread: Thread) => void
  onThreadRename?: (aboutToRenameThread: Thread) => void
  /* eslint-disable no-unused-vars */
}

const IconContainer: React.FC<IconContainerProps> = ({ thread, isRTL, onThreadDelete, onThreadRename }) => {
  const theme = useSelector((state: RootState) => state.theme.theme)

  return (
    <View style={[styles.iconContainer, isRTL ? { left: 0 } : { right: 0 }]}>
      {onThreadRename && (
        <Pressable onPress={() => onThreadRename(thread)} style={styles.icon}>
          <RenameIcon width='18' height='18' fill={theme.iconFill} hoverFill={theme.hoverColor} />
        </Pressable>
      )}
      {onThreadDelete && (
        <Pressable
          onPress={() => onThreadDelete(thread)}
          style={[styles.icon, isRTL && onThreadRename ? { marginLeft: 8 } : { marginRight: 8 }]}
        >
          <DeleteIcon width='18' height='18' fill={theme.iconFill} hoverFill={theme.hoverColor} />
        </Pressable>
      )}
      {/* Additional icons can be added here */}
    </View>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    padding: 4,
    // Additional styling for icons can go here
  },
})

export default IconContainer
