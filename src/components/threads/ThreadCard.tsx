import { useDirection, useScreenInfo } from '@/hooks'
import { AppDispatch, RootState, Thread, toggleSharePopup, toggleSideMenu } from '@/store'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, TextInput, View, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'expo-router'
import IconContainer from './IconContainer'

type ThreadCardProps = {
  thread: Thread
  isSelected: boolean
  /* eslint-disable no-unused-vars */
  onThreadSelect: (threadId: string) => void
  onThreadDelete?: (aboutToDeleteThread: Thread) => void
  onThreadRename?: (aboutToRenameThread: Thread) => void
  /* eslint-disable no-unused-vars */
}

/**
 * Represents a card component for a thread, providing interactive elements
 * like select, delete, and rename actions.
 */
const ThreadCard: React.FC<ThreadCardProps> = ({
  thread,
  isSelected,
  onThreadSelect,
  onThreadDelete,
  onThreadRename,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { isSmallScreen } = useScreenInfo()
  const { isRTL } = useDirection()
  const [isThreadHovered, setIsThreadHovered] = useState(false)
  const lengthThreshold = 30
  const { t } = useTranslation()
  const threadNameLength = thread?.name?.length || 0
  const threadName = threadNameLength < lengthThreshold ? thread.name : `${thread?.name?.slice(0, lengthThreshold)}...`
  const [editing, setEditing] = useState(false)
  const [editedName, setEditedName] = useState(thread.name || t('newChat'))
  const theme = useSelector((state: RootState) => state.theme.theme)
  const isSharePopupVisible = useSelector((state: RootState) => state.share.isOpen)
  const isSideMenuOpened = useSelector((state: RootState) => state.sideMenu.isOpen)

  const [inputRef] = useState(React.createRef<TextInput>())

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])

  const handleEditIconPress = () => {
    setEditing(true)
  }
  const handleShareIconPress = () => {
    dispatch(toggleSideMenu(!isSideMenuOpened))
    dispatch(toggleSharePopup(!isSharePopupVisible))
    router.push(`/chat/${thread.id}`)
  }

  const handleThreadCardPress = () => {
    if (!editing) {
      setIsThreadHovered(true)
      onThreadSelect(thread.id)
      router.push(`/chat/${thread.id}`)
    }
  }

  const handleThreadHover = (hovered: boolean) => {
    setIsThreadHovered(hovered)
  }

  const handleThreadRename = () => {
    if (onThreadRename) {
      if (editedName !== thread.name) {
        onThreadRename({ ...thread, name: editedName })
      } else {
        const name = thread.name || t('newChat')
        setEditedName(name)
      }
    }
    setEditing(false)
  }

  const containerClasses = `
    flex flex-row items-center
    ${isSmallScreen ? 'p-2' : 'px-4 py-[6px]'}
    ${isSelected ? `bg-[${theme.inputBackgroundColor}] rounded-lg` : ''}
    ${isThreadHovered ? `bg-[${theme.inputBackgroundColor}] shadow-lg rounded-lg` : ''}
  `

  return (
    <Pressable
      className={containerClasses}
      onMouseEnter={() => handleThreadHover(true)}
      onMouseLeave={() => handleThreadHover(false)}
      onPress={handleThreadCardPress}
    >
      <View className='flex-1'>
        {editing ? (
          <TextInput
            ref={inputRef}
            className={`px-[10px] py-[6px] font-medium font-['Inter'] ${isRTL ? 'text-right' : 'text-left'}`}
            style={{ color: theme.textColor }}
            value={editedName}
            onChangeText={setEditedName}
            onBlur={handleThreadRename}
            onFocus={() => setEditing(true)}
            placeholderTextColor={theme.inputColor}
          />
        ) : (
          <Text
            className={`px-[10px] py-[6px] font-medium font-['Inter'] ${isRTL ? 'text-right' : 'text-left'}`}
            style={{ color: theme.textColor }}
            onPress={handleThreadCardPress}
          >
            {threadName ?? t('newChat')}
          </Text>
        )}
        {isThreadHovered && threadNameLength > lengthThreshold && (
          <Text className='text-sm' style={{ color: theme.textColor }}>
            {thread.name}
          </Text>
        )}
      </View>

      {!editing && (isSelected || isThreadHovered) && (
        <IconContainer
          thread={thread}
          isRTL={isRTL}
          onThreadDelete={onThreadDelete}
          onThreadRename={handleEditIconPress}
          onThreadShare={handleShareIconPress}
        />
      )}
    </Pressable>
  )
}

export default ThreadCard
