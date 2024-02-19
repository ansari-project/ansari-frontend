import { useDirection } from '@endeavorpal/hooks'
import { Thread } from '@endeavorpal/store'
import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
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
  const { isRTL } = useDirection()
  const navigate = useNavigate()
  const [isThreadHovered, setIsThreadHovered] = useState(false)
  const lengthThreshold = 20
  const threadNameLength = thread?.name?.length || 0
  const threadName = threadNameLength < lengthThreshold ? thread.name : `${thread?.name?.slice(0, lengthThreshold)}...`
  const [editing, setEditing] = useState(false)
  const [editedName, setEditedName] = useState(thread.name || '')

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
        setEditedName(thread.name)
      }
    }
    setEditing(false)
  }

  const containerStyles = [
    styles.container,
    isSelected && styles.selectedContainer,
    isThreadHovered && styles.hoveredContainer,
  ]

  const textAlignStyle = { textAlign: isRTL ? 'right' : 'left' }

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
            style={[styles.title, textAlignStyle]}
            value={editedName}
            onChangeText={setEditedName}
            onBlur={handleThreadRename}
            onFocus={() => setEditing(true)}
          />
        ) : (
          <Text style={[styles.title, textAlignStyle]} onPress={handleThreadCardPress}>
            {threadName}
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

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  titleContainer: {
    flex: 1,
  },
  selectedContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  hoveredContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 8,
    color: 'white',
  },
  snippet: {
    fontSize: 14,
    color: 'white',
  },
})

export default ThreadCard
