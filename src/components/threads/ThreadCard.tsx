import { useDirection } from '@/hooks'
import { AppDispatch, RootState, Thread, toggleSharePopup, toggleSideMenu } from '@/store'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, TextInput, View, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'expo-router'
import IconContainer from './IconContainer'
import StyledText from '../StyledText'

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
  const { isRTL } = useDirection()
  const [isThreadHovered, setIsThreadHovered] = useState(false)
  const lengthThreshold = 90
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

  const handleThreadSelect = () => {
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

  return (
    <View
      className={'flex flex-col items-center border-b py-1 p-2'}
      style={{
        borderColor: theme.textColor,
        backgroundColor: isSelected || isThreadHovered ? theme.inputBackgroundColor : undefined,
      }}
    >
      <Pressable
        onMouseEnter={() => handleThreadHover(true)}
        onMouseLeave={() => handleThreadHover(false)}
        onPress={handleThreadSelect}
      >
        <View className=''>
          {editing ? (
            <TextInput
              ref={inputRef}
              className={`px-[6px] py-[6px] font-['Inter'] ${isRTL ? 'text-right' : 'text-left'}`}
              style={{ color: theme.textColor, width: 250 }}
              value={editedName}
              onChangeText={setEditedName}
              onBlur={handleThreadRename}
              onFocus={() => setEditing(true)}
              placeholderTextColor={theme.inputColor}
              multiline={true}
              numberOfLines={3}
            />
          ) : (
            <Text
              className={`px-[6px] py-[6px] font-['Inter'] ${isRTL ? 'text-right' : 'text-left'}`}
              style={{ color: theme.textColor }}
            >
              {threadName ?? t('newChat')}
            </Text>
          )}
        </View>
      </Pressable>

      <View className='items-center justify-center'>
        {editing && (
          <View className={`flex-row items-center ${isRTL ? 'left-0' : 'right-0'}`}>
            <Pressable className={'cursor-pointer py-2 px-2 rounded items-center'} onPress={handleThreadRename}>
              <StyledText>{t('submit')}</StyledText>
            </Pressable>
            <Pressable className={'cursor-pointer py-2 px-2 rounded items-center'} onPress={() => setEditing(false)}>
              <StyledText>{t('cancel')}</StyledText>
            </Pressable>
          </View>
        )}
        {!editing && (
          <IconContainer
            thread={thread}
            isRTL={isRTL}
            onThreadSelect={handleThreadSelect}
            onThreadDelete={onThreadDelete}
            onThreadRename={handleEditIconPress}
            onThreadShare={handleShareIconPress}
          />
        )}
      </View>
    </View>
  )
}

export default ThreadCard
