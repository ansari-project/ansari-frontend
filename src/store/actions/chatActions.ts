import { createAsyncThunk } from '@reduxjs/toolkit'
import { ChatService } from '../../services/chatService'
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
    dispatch(
      setActiveThread({
        id: String(45),
        name: 'New chat',
        messages: [],
      } as Thread),
    ) // Temporary placeholder until real data is returned.
    console.log((getState() as RootState).auth)
    // Get the current user and their role from the state
    // const { isAuthenticated, token } = (getState() as RootState).auth
    // const chatService = new ChatService(isAuthenticated, token)
    // dispatch(setLoading(true))
    // const newThread = await chatService.createThread()
    // dispatch(setActiveThread(newThread))
    // You can dispatch more actions here if needed
    // return newThread as Thread
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
    // alert('chat/addMessage')
    try {
      console.log('add message -->', threadId, content)
      const { isAuthenticated, token } = (getState() as RootState).auth
      const chatService = new ChatService(isAuthenticated, token)
      dispatch(setLoading(true))
      dispatch(addMessageToActiveThread({ content, role: UserRole.User }))
      // Assuming chatService.addMessage will return the new message data
      console.log(
        'chat/addMessage ---> calling chatService.addMessage with content ',
        threadId,
        { content, role: UserRole.User },
        signal,
      )
      const stream = await chatService.addMessage(threadId, { content, role: UserRole.User }, signal)

      if (!stream || stream === null || stream === undefined) {
        // alert('stream not defined!')
        dispatch(setError('Error adding message'))
        return
      }
      let responseMessage = ''
      const messageId = ChatService.generateUniqueId()
      // alert('messageId: ' + messageId)
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

          console.log('chat/addMessage ---> stream response ', {
            id: messageId,
            role: UserRole.Assistant,
            content: responseMessage,
            timestamp: new Date().getTime().toString(),
          })

          dispatch(
            addStreamMessageToActiveThread({
              id: messageId,
              role: UserRole.Assistant,
              content: responseMessage,
              timestamp: new Date().getTime().toString(),
            }),
          )
        }
        const message: Message = {
          id: messageId,
          role: UserRole.Assistant,
          content: responseMessage,
          timestamp: new Date().getTime().toString(),
        }
        console.log('chat/addMessage ---> return message response ', message)
        return message
      } catch {
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
    // Here, you might want to update the threads list or handle UI changes
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
      // Update thread's name in the state, if necessary
    } catch (error) {
      dispatch(setError(error.toString()))
    } finally {
      dispatch(setLoading(false))
    }
  },
)
