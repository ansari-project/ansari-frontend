import { useDirection, useScreenInfo } from '@endeavorpal/hooks'
import { RootState, Thread } from '@endeavorpal/store'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
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
  const { isSmallScreen } = useScreenInfo()
  const { isRTL } = useDirection()
  const navigate = useNavigate()
  const [isThreadHovered, setIsThreadHovered] = useState(false)
  const lengthThreshold = 30
  const { t } = useTranslation()
  const threadNameLength = thread?.name?.length || 0
  const threadName = threadNameLength < lengthThreshold ? thread.name : `${thread?.name?.slice(0, lengthThreshold)}...`
  const [editing, setEditing] = useState(false)
  const [editedName, setEditedName] = useState(thread.name || t('newChat'))
  const theme = useSelector((state: RootState) => state.theme.theme)
  const [inputRef] = useState(React.createRef<TextInput>())

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])

  const handleEditIconPress = () => {
    setEditing(true)
  }

  const handleThreadCardPress = () => {
    if (!editing) {
      setIsThreadHovered(true)
      onThreadSelect(thread.id)
      navigate(`/chat/${thread.id}`)
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

  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 6,
      alignItems: 'center',
    },
    containerMobile: {
      padding: 8,
    },
    titleContainer: {
      flex: 1,
    },
    selectedContainer: {
      backgroundColor: theme.inputBackgroundColor,
      borderRadius: 8,
    },
    hoveredContainer: {
      backgroundColor: theme.inputBackgroundColor,
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.8)',
      borderRadius: 8,
    },
    title: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      fontSize: 12,
      lineHeight: 15,
      fontWeight: '500',
      fontFamily: 'Inter',
      color: theme.textColor,
      textAlign: isRTL ? 'right' : 'left',
    },
    snippet: {
      fontSize: 14,
      color: theme.textColor,
    },
  })

  const containerStyles = [
    styles.container,
    isSmallScreen && styles.containerMobile,
    isSelected && styles.selectedContainer,
    isThreadHovered && styles.hoveredContainer,
  ]

  return (
    <Pressable
      style={containerStyles}
      onMouseEnter={() => handleThreadHover(true)}
      onMouseLeave={() => handleThreadHover(false)}
      onPress={handleThreadCardPress}
    >
      <View style={styles.titleContainer}>
        {editing ? (
          <TextInput
            ref={inputRef}
            style={styles.title}
            value={editedName}
            onChangeText={setEditedName}
            onBlur={handleThreadRename}
            onFocus={() => setEditing(true)}
          />
        ) : (
          <Text style={styles.title} onPress={handleThreadCardPress}>
            {threadName ?? t('newChat')}
          </Text>
        )}
        {isThreadHovered && threadNameLength > lengthThreshold && <Text style={styles.snippet}>{thread.name}</Text>}
      </View>

      {!editing && (isSelected || isThreadHovered) && (
        <IconContainer
          thread={thread}
          isRTL={isRTL}
          onThreadDelete={onThreadDelete}
          onThreadRename={handleEditIconPress}
        />
      )}
    </Pressable>
  )
}

export default ThreadCard
