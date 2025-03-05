import { useDirection, useScreenInfo } from '@/hooks'
import { AppDispatch, RootState, Thread, ThreadNameRequest, deleteThread, setThreadName } from '@/store'
import { Helpers } from '@/utils'
import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ActivityIndicator, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useLocalSearchParams } from 'expo-router'
import ConfirmationDialog from '../ConfirmationDialog'
import ThreadCard from './ThreadCard'
import i18next from 'i18next'

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
    const threadDate = new Date(thread.date!).setHours(0, 0, 0, 0)

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
        groupedThreads.older[year].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      })
    } else {
      groupedThreads[group].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  })

  return groupedThreads
}

interface ThreadsListProp {
  onSelectCard?: () => void
}
const ThreadsList: React.FC<ThreadsListProp> = ({ onSelectCard }) => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const threads = useSelector((state: RootState) => state.chat.threads)
  const loading = useSelector((state: RootState) => state.chat.loading)
  const { threadId } = useLocalSearchParams<{ threadId: string }>()
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(threadId || null)
  const { isRTL } = useDirection()
  const { width, isSmallScreen } = useScreenInfo()
  const { t } = useTranslation()
  const theme = useSelector((state: RootState) => state.theme.theme)

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
    setDialogMessage(aboutToDeleteThread.name || t('newChat'))
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
        router.push('/')
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

  if (loading) {
    return (
      <View className='flex-1 w-full justify-center items-center'>
        <ActivityIndicator size='small' color={theme.hoverColor} />
      </View>
    )
  }

  const groupedThreads = getGroupedThreads(threads)
  const mappedThreads = Object.entries(groupedThreads).map(
    ([dateCategory, threads]) =>
      !Helpers.isBlank(threads) && (
        <View key={dateCategory}>
          {dateCategory === 'older' ? (
            Object.entries(threads).map(([year, yearThreads]: [string, Thread[]]) => (
              <View key={year}>
                <Text
                  className={`font-light my-[10px] font-['Inter'] ${isRTL ? 'text-right' : 'text-left'}`}
                  style={{ color: theme.linkColor }}
                >
                  {year}
                </Text>
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
              <Text
                className={`font-light my-[10px] font-['Inter'] ${isRTL ? 'text-right' : 'text-left'}`}
                style={{ color: theme.linkColor }}
              >
                {Helpers.createLocalizedDateHeader(dateCategory, threads[0].date, t)}
              </Text>
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
    <View className='flex-1'>
      <View className='flex-1'>{mappedThreads}</View>
      <ConfirmationDialog
        stacked={width < 448}
        isRTL={isRTL}
        isSmallScreen={isSmallScreen}
        visible={dialogVisible}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDialogVisible(false)}
        title={t('deleteThread')}
        message={
          <Text>
            <Trans
              i18n={i18next}
              parent={Text}
              i18nKey='deleteThreadMessage'
              components={{
                1: <Text className='font-bold'></Text>,
              }}
              values={{ threadName: dialogMessage }}
            />
          </Text>
        }
      />
    </View>
  )
}

export default ThreadsList
