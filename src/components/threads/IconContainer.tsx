import { DeleteIcon, RenameIcon, ShareIcon } from '@/components/svg'
import { RootState, Thread } from '@/store'
import React from 'react'
import { Pressable, View } from 'react-native'
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
    <View className={`flex-row items-center ${isRTL ? 'left-0' : 'right-0'}`}>
      {onThreadRename && (
        <Pressable onPress={() => onThreadRename(thread)} className='p-1'>
          <RenameIcon width='18' height='18' fill={theme.iconFill} hoverFill={theme.hoverColor} />
        </Pressable>
      )}
      {onThreadShare && (
        <Pressable onPress={() => onThreadShare(thread)} className='p-1'>
          <ShareIcon width='16' height='16' fill={theme.iconFill} hoverFill={theme.hoverColor} />
        </Pressable>
      )}
      {onThreadDelete && (
        <Pressable
          onPress={() => onThreadDelete(thread)}
          className={`p-1 ${isRTL && onThreadRename ? 'ml-2' : 'mr-2'}`}
        >
          <DeleteIcon width='18' height='18' fill={theme.iconFill} hoverFill={theme.hoverColor} />
        </Pressable>
      )}
      {/* Additional icons can be added here */}
    </View>
  )
}

export default IconContainer
