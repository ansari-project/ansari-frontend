import { createAsyncThunk } from '@reduxjs/toolkit'
import { ChatService } from '../../services/'
import {
  addMessageToActiveThread,
  addStreamMessageToActiveThread,
  setActiveThread,
  setError,
  setLoading,
  setThreads,
} from '../slices/chatSlice'
import { RootState } from '../store'
import { Message, Thread, ThreadNameRequest, UserRole } from '../types/chatTypes'

// Async thunk for creating a new thread
export const createThread = createAsyncThunk('chat/createThread', async (_, { dispatch, getState }) => {
  try {
    // Get the current user and their role from the state
    const { isAuthenticated, token } = (getState() as RootState).auth
    const chatService = new ChatService(isAuthenticated, token)
    dispatch(setLoading(true))
    const newThread = await chatService.createThread()
    // Convert the created Date to a serializable format (timestamp)
    if (newThread.created instanceof Date) {
      newThread.created = newThread.created.getTime()
    }
    // // Convert the timestamp back to a Date object before dispatching the setActiveThread action
    // const newThreadWithDate = { ...newThread, created: new Date(newThread.created!) }
    dispatch(fetchThreads()) // refresh the list of threads after creating a new thread
    // You can dispatch more actions here if needed
    return newThread as Thread
  } catch (error) {
    dispatch(setError(error.toString()))
  } finally {
    dispatch(setLoading(false))
  }
})

// Async thunk for adding a message to a thread
export const addMessage = createAsyncThunk(
  'chat/addMessage',
  async (
    { threadId, content, signal }: { threadId: string; content: string; signal: AbortSignal },
    { dispatch, getState },
  ) => {
    try {
      const { isAuthenticated, token } = (getState() as RootState).auth
      const chatService = new ChatService(isAuthenticated, token)
      const requestMessageId = ChatService.generateUniqueId()
      dispatch(setLoading(true))
      dispatch(addMessageToActiveThread({ id: requestMessageId, content, role: UserRole.User }))
      // Assuming chatService.addMessage will return the new message data
      const stream = await chatService.addMessage(threadId, { content, role: UserRole.User }, signal)

      if (!stream || stream === null || stream === undefined) {
        dispatch(setError('Error adding message'))
        return
      }
      let responseMessage = ''
      const responseMessageId = ChatService.generateUniqueId()
      try {
        const reader = stream.getReader()
        const decoder = new TextDecoder()
        const truthy = true
        while (truthy) {
          const { value, done } = await reader.read()
          if (done) {
            break
          }
          const decodedChunk = decoder.decode(value, { stream: true })
          responseMessage += decodedChunk
          dispatch(
            addStreamMessageToActiveThread({
              id: responseMessageId,
              role: UserRole.Assistant,
              content: responseMessage,
              timestamp: new Date().getTime().toString(),
            }),
          )
        }
        const message: Message = {
          id: responseMessageId,
          role: UserRole.Assistant,
          content: responseMessage,
          timestamp: new Date().getTime().toString(),
        }
        return message
      } catch (error) {
        dispatch(setError('Error adding message'))
        return
      }

      // const message: Message = {
      //   id: messageId,
      //   role: UserRole.Assistant,
      //   content: responseMessage,
      //   timestamp: new Date().getTime().toString(),
      // }

      // dispatch(addMessageToActiveThread(message))
      // return message
    } catch (error) {
      dispatch(setError(error.toString()))
    } finally {
      dispatch(setLoading(false))
    }
  },
)

// Async thunk for fetching all threads
export const fetchThreads = createAsyncThunk('chat/fetchThreads', async (_, { dispatch, getState }) => {
  try {
    const { isAuthenticated, token } = (getState() as RootState).auth
    const chatService = new ChatService(isAuthenticated, token)
    dispatch(setLoading(true))
    const threads = await chatService.getAllThreads()
    dispatch(setThreads(threads))
    return threads
  } catch (error) {
    dispatch(setError(error.toString()))
  } finally {
    dispatch(setLoading(false))
  }
})

// Async thunk for fetching a specific thread
export const fetchThread = createAsyncThunk('chat/fetchThread', async (threadId: string, { dispatch, getState }) => {
  try {
    const { isAuthenticated, token } = (getState() as RootState).auth
    const chatService = new ChatService(isAuthenticated, token)
    dispatch(setLoading(true))
    const thread = await chatService.getThread(threadId)
    dispatch(setActiveThread(thread))
  } catch (error) {
    dispatch(setError(error.toString()))
  } finally {
    dispatch(setLoading(false))
  }
})

// Async thunk for deleting a thread
export const deleteThread = createAsyncThunk('chat/deleteThread', async (threadId: string, { dispatch, getState }) => {
  try {
    const { isAuthenticated, token } = (getState() as RootState).auth
    const chatService = new ChatService(isAuthenticated, token)
    dispatch(setLoading(true))
    await chatService.deleteThread(threadId)
    dispatch(fetchThreads()) // refresh the list of threads after deletion
  } catch (error) {
    dispatch(setError(error.toString()))
  } finally {
    dispatch(setLoading(false))
  }
})

// Async thunk for setting a thread's name
export const setThreadName = createAsyncThunk(
  'chat/setThreadName',
  async ({ threadId, name }: { threadId: string; name: ThreadNameRequest }, { dispatch, getState }) => {
    try {
      const { isAuthenticated, token } = (getState() as RootState).auth
      const chatService = new ChatService(isAuthenticated, token)
      dispatch(setLoading(true))
      await chatService.setThreadName(threadId, name)
      dispatch(fetchThreads()) // refresh the list of threads after deletion
    } catch (error) {
      dispatch(setError(error.toString()))
    } finally {
      dispatch(setLoading(false))
    }
  },
)
