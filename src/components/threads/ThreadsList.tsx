import { AppDispatch, RootState } from '@/store/store'
import { Thread, ThreadNameRequest } from '@/store/types/chatTypes'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useDirection, useScreenInfo } from '../../hooks'
import { deleteThread, setThreadName } from '../../store/actions/chatActions'
import { Helpers } from '../../utils'
import ConfirmationDialog from '../ConfirmationDialog'
import ThreadCard from './ThreadCard'

/**
 * Type definition for grouped threads based on their creation date.
 */
type GroupedThreads = {
  today: Thread[]
  yesterday: Thread[]
  lastWeek: Thread[]
  lastMonth: Thread[]
  older: { [key: number]: Thread[] }
}

/**
 * Function to group threads based on their creation date.
 * @param threads Array of Thread objects.
 * @returns GroupedThreads object categorizing threads into today, yesterday, last week, last month, and older.
 */
const getGroupedThreads = (threads: Thread[]): GroupedThreads => {
  const today = new Date().setHours(0, 0, 0, 0)
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)

  const groupedThreads: GroupedThreads = {
    today: [],
    yesterday: [],
    lastWeek: [],
    lastMonth: [],
    older: {},
  }

  threads.forEach((thread) => {
    const threadDate = new Date(thread.created!).setHours(0, 0, 0, 0)

    if (threadDate === today) {
      groupedThreads.today.push(thread)
    } else if (threadDate === yesterday) {
      groupedThreads.yesterday.push(thread)
    } else if (threadDate > lastWeek) {
      groupedThreads.lastWeek.push(thread)
    } else if (threadDate > lastMonth) {
      groupedThreads.lastMonth.push(thread)
    } else {
      const threadYear = new Date(threadDate).getFullYear()
      if (!groupedThreads.older[threadYear]) {
        groupedThreads.older[threadYear] = [thread]
      } else {
        groupedThreads.older[threadYear].push(thread)
      }
    }
  })

  // Sort each group in descending order of creation date and time
  Object.keys(groupedThreads).forEach((group) => {
    if (group === 'older') {
      Object.keys(groupedThreads.older).forEach((year) => {
        groupedThreads.older[year].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
      })
    } else {
      groupedThreads[group].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    }
  })

  return groupedThreads
}

interface ThreadsListProp {
  onSelectCard?: () => void
}
const ThreadsList: React.FC<ThreadsListProp> = ({ onSelectCard }) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const threads = useSelector((state: RootState) => state.chat.threads)
  const { threadId } = useParams<{ threadId: string }>()
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(threadId || null)
  const { isRTL } = useDirection()
  const textAlignStyle = isRTL ? { textAlign: 'right' } : { textAlign: 'left' }
  const { width } = useScreenInfo()

  /**
   * Handles the selection of a thread.
   * @param {string} id - The ID of the selected thread.
   */
  const handleThreadSelect = (id: string) => {
    setSelectedThreadId(id)
    if (onSelectCard) {
      onSelectCard()
    }
  }

  /**
   * Confirms before deleting a thread and handles the deletion.
   * @param {string} id - The ID of the thread to delete.
   */
  const handleThreadDelete = (aboutToDeleteThread: Thread) => {
    // Set state for dialog visibility and message
    setDialogVisible(true)
    setThreadToDeleteId(aboutToDeleteThread.id)
    setDialogMessage(aboutToDeleteThread.name || '')
  }

  const [dialogVisible, setDialogVisible] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [threadToDeleteId, setThreadToDeleteId] = useState<string | null>(null)

  const handleConfirmDelete = async () => {
    if (threadToDeleteId) {
      await dispatch(deleteThread(threadToDeleteId))
      setDialogVisible(false)
      setThreadToDeleteId(null)
      setDialogMessage('')
      if (threadId === threadToDeleteId) {
        navigate('/')
      }
    }
  }

  const handleThreadRename = async (aboutToRenameThread: Thread) => {
    const threadNameRequest: ThreadNameRequest = {
      name: String(aboutToRenameThread.name),
    }
    await dispatch(
      setThreadName({
        threadId: aboutToRenameThread.id,
        name: threadNameRequest,
      }),
    )
  }

  const groupedThreads = getGroupedThreads(threads)
  const mappedThreads = Object.entries(groupedThreads).map(
    ([date, threads]) =>
      !Helpers.isBlank(threads) && (
        <View key={date}>
          {date === 'older' ? (
            Object.entries(threads).map(([year, yearThreads]: [string, Thread[]]) => (
              <View key={year}>
                <Text style={[styles.dateHeader, textAlignStyle]}>{year}</Text>
                {yearThreads.map((thread) => (
                  <ThreadCard
                    key={thread.id}
                    thread={thread}
                    isSelected={thread.id === selectedThreadId}
                    onThreadSelect={handleThreadSelect}
                    onThreadRename={handleThreadRename}
                    onThreadDelete={handleThreadDelete}
                  />
                ))}
              </View>
            ))
          ) : (
            <View>
              <Text style={[styles.dateHeader, textAlignStyle]}>{dateHeader(date, threads[0].created)}</Text>
              {threads.map((thread: Thread) => (
                <ThreadCard
                  key={thread.id}
                  thread={thread}
                  isSelected={thread.id === selectedThreadId}
                  onThreadSelect={handleThreadSelect}
                  onThreadRename={handleThreadRename}
                  onThreadDelete={handleThreadDelete}
                />
              ))}
            </View>
          )}
        </View>
      ),
  )

  return (
    <View style={styles.container}>
      <View style={styles.list}>{mappedThreads}</View>
      <ConfirmationDialog
        stacked={width < 448}
        isRTL={isRTL}
        visible={dialogVisible}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDialogVisible(false)}
        title='Delete thread?'
        message={
          <Text>
            This will delete <Text style={{ fontWeight: 'bold' }}>{dialogMessage}</Text>.{' '}
          </Text>
        }
      />
    </View>
  )
}

/**
 * Generates a human-readable string representing a date range or a specific date
 * for displaying as a header in the threads list.
 *
 * The function takes a predefined date key ('today', 'yesterday', 'lastWeek', 'lastMonth')
 * and optionally a specific date (used for 'older' threads) to generate a descriptive
 * header indicating the time period of the threads being listed.
 *
 * @param {string} date - A predefined key representing a date range or category.
 * @param {Date} threadDate - The date of the thread, used for 'older' threads to generate a month and year string.
 * @returns {string} A descriptive header based on the input. This can be 'Today', 'Yesterday',
 * 'Previous 7 Days', 'Previous 30 Days', or a formatted string representing the month and year
 * for 'older' threads.
 */
const dateHeader = (date: string, threadDate: Date): string => {
  switch (date) {
    case 'today':
      return 'Today'
    case 'yesterday':
      return 'Yesterday'
    case 'lastWeek':
      return 'Previous 7 Days'
    case 'lastMonth':
      return 'Previous 30 Days'
    default:
      // For 'older', returns a formatted string representing the month and year.
      return threadDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '350px',
  },
  list: {
    flex: 1,
  },
  dateHeader: {
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 15,
    marginVertical: 10,
    color: '#176359',
  },
})

export default ThreadsList
