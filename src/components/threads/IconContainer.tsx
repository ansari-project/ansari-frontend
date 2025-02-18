import { DeleteIcon, RenameIcon, ShareIcon } from '@/components/svg'
import { RootState, Thread } from '@/store'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'

type IconContainerProps = {
  thread: Thread
  isRTL: boolean
  /* eslint-disable no-unused-vars */
  onThreadDelete?: (aboutToDeleteThread: Thread) => void
  onThreadRename?: (aboutToRenameThread: Thread) => void
  onThreadShare?: (aboutToShareThread: Thread) => void
  /* eslint-disable no-unused-vars */
}

const IconContainer: React.FC<IconContainerProps> = ({
  thread,
  isRTL,
  onThreadDelete,
  onThreadRename,
  onThreadShare,
}) => {
  const theme = useSelector((state: RootState) => state.theme.theme)

  return (
    <View style={[styles.iconContainer, isRTL ? styles.iconContainerLeft : styles.iconContainerRight]}>
      {onThreadRename && (
        <Pressable onPress={() => onThreadRename(thread)} style={styles.icon}>
          <RenameIcon width='18' height='18' fill={theme.iconFill} hoverFill={theme.hoverColor} />
        </Pressable>
      )}
      {onThreadShare && (
        <Pressable onPress={() => onThreadShare(thread)} style={styles.icon}>
          <ShareIcon width='16' height='16' fill={theme.iconFill} hoverFill={theme.hoverColor} />
        </Pressable>
      )}
      {onThreadDelete && (
        <Pressable
          onPress={() => onThreadDelete(thread)}
          style={[styles.icon, isRTL && onThreadRename ? styles.iconMarginLeft : styles.iconMarginRight]}
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
  iconContainerLeft: {
    left: 0,
  },
  iconContainerRight: {
    right: 0,
  },
  iconMarginLeft: {
    marginLeft: 8,
  },
  iconMarginRight: {
    marginRight: 8,
  },
})

export default IconContainer
