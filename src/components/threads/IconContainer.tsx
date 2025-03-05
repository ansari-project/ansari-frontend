import { ChatIcon, DeleteIcon, RenameIcon, ShareIcon } from '@/components/svg'
import { RootState, Thread } from '@/store'
import React from 'react'
import { Pressable, View } from 'react-native'
import { useSelector } from 'react-redux'

type IconContainerProps = {
  thread: Thread
  isRTL: boolean
  /* eslint-disable no-unused-vars */
  onThreadSelect?: (aboutToShareThread: Thread) => void
  onThreadDelete?: (aboutToDeleteThread: Thread) => void
  onThreadRename?: (aboutToRenameThread: Thread) => void
  onThreadShare?: (aboutToShareThread: Thread) => void
  /* eslint-disable no-unused-vars */
}

const IconContainer: React.FC<IconContainerProps> = ({
  thread,
  isRTL,
  onThreadSelect,
  onThreadDelete,
  onThreadRename,
  onThreadShare,
}) => {
  const theme = useSelector((state: RootState) => state.theme.theme)

  return (
    <View className={`flex-row items-center ${isRTL ? 'left-0' : 'right-0'}`}>
      {onThreadSelect && (
        <Pressable onPress={() => onThreadSelect(thread)} className='py-2 px-4'>
          <ChatIcon width='22' height='22' fill={theme.iconFill} hoverFill={theme.hoverColor} />
        </Pressable>
      )}
      {onThreadRename && (
        <Pressable onPress={() => onThreadRename(thread)} className='py-2 px-4'>
          <RenameIcon width='22' height='22' fill={theme.iconFill} hoverFill={theme.hoverColor} />
        </Pressable>
      )}
      {onThreadShare && (
        <Pressable onPress={() => onThreadShare(thread)} className='py-2 px-4'>
          <ShareIcon width='20' height='20' fill={theme.iconFill} hoverFill={theme.hoverColor} />
        </Pressable>
      )}
      {onThreadDelete && (
        <Pressable
          onPress={() => onThreadDelete(thread)}
          className={`py-2 px-4 ${isRTL && onThreadRename ? 'ml-2' : 'mr-2'}`}
        >
          <DeleteIcon width='22' height='22' fill={theme.iconFill} hoverFill={theme.hoverColor} />
        </Pressable>
      )}
      {/* Additional icons can be added here */}
    </View>
  )
}

export default IconContainer
