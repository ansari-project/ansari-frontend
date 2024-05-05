import { ApplicationError, NotFoundError } from '@endeavorpal/errors'
import { ChatService } from '@endeavorpal/services/'
import { ShareThreadResponse } from '@endeavorpal/types'
import { Helpers } from '@endeavorpal/utils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  addMessageToActiveThread,
  addStreamMessageToActiveThread,
  setActiveThread,
  setError,
  setLoading,
  setThreads,
} from '../slices/chatSlice'
import { RootState } from '../store'
import { FeedbackRequest, Message, Thread, ThreadNameRequest, UserRole } from '../types/chatTypes'

/**
 * Adds a message to the chat.
 *
 * @param threadId - The ID of the thread where the message will be added.
 * @param content - The content of the message.
 * @param signal - An AbortSignal object that can be used to abort the message addition process.
 * @returns A Promise that resolves to the added message.
 */
export const addMessage = createAsyncThunk(
  'chat/addMessage',
  async (
    { threadId, content, signal }: { threadId: string; content: string; signal: AbortSignal },
    { dispatch, getState },
  ) => {
    try {
      const { isAuthenticated, token } = (getState() as RootState).auth
      const chatService = new ChatService(isAuthenticated, token)
      const requestMessageId = Helpers.generateUniqueId()
      dispatch(addMessageToActiveThread({ id: requestMessageId, content, role: UserRole.User }))
      const stream = await chatService.addMessage(threadId, { content, role: UserRole.User }, signal, dispatch)

      if (!stream || stream === null || stream === undefined) {
        dispatch(setError('Error adding message'))
        return
      }
      let responseMessage = ''
      const responseMessageId = Helpers.generateUniqueId()
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
          if (responseMessage) {
            dispatch(setLoading(true))
          }
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
    } catch (error) {
      dispatch(setError(error.toString()))
    } finally {
      dispatch(setLoading(false))
    }
  },
)

/**
 * Creates a new thread asynchronously.
 *
 * @param _ - The placeholder parameter, not used in this action.
 * @param dispatch - The Redux dispatch function.
 * @param getState - The Redux getState function.
 * @returns A Promise that resolves to the newly created thread.
 */
export const createThread = createAsyncThunk('chat/createThread', async (_, { dispatch, getState }) => {
  try {
    // Get the current user and their role from the state
    const { isAuthenticated, token } = (getState() as RootState).auth
    const chatService = new ChatService(isAuthenticated, token)
    dispatch(setLoading(true))
    const newThread = await chatService.createThread(dispatch)
    // Convert the created Date to a serializable format (timestamp)
    if (newThread.date instanceof Date) {
      newThread.date = newThread.date.getTime()
    }

    dispatch(fetchThreads()) // refresh the list of threads after creating a new thread
    // You can dispatch more actions here if needed
    return newThread as Thread
  } catch (error) {
    dispatch(setError(error.toString()))
  } finally {
    dispatch(setLoading(false))
  }
})

/**
 * Deletes a thread asynchronously.
 *
 * @param threadId - The ID of the thread to delete.
 * @param dispatch - The dispatch function from Redux.
 * @param getState - The getState function from Redux.
 * @returns A Promise that resolves when the thread is deleted.
 */
export const deleteThread = createAsyncThunk('chat/deleteThread', async (threadId: string, { dispatch, getState }) => {
  try {
    const { isAuthenticated, token } = (getState() as RootState).auth
    const chatService = new ChatService(isAuthenticated, token)
    dispatch(setLoading(true))
    await chatService.deleteThread(threadId, dispatch)
    dispatch(fetchThreads()) // refresh the list of threads after deletion
  } catch (error) {
    dispatch(setError(error.toString()))
  } finally {
    dispatch(setLoading(false))
  }
})

/**
 * Fetches a thread from the chat service.
 *
 * @param threadId - The ID of the thread to fetch.
 * @param dispatch - The dispatch function from the Redux store.
 * @param getState - The getState function from the Redux store.
 * @returns A Promise that resolves to the fetched thread.
 * @throws {NotFoundError} If the thread is not found.
 * @throws {ApplicationError} If an application error occurs.
 */
export const fetchThread = createAsyncThunk('chat/fetchThread', async (threadId: string, { dispatch, getState }) => {
  try {
    const { isAuthenticated, token } = (getState() as RootState).auth
    const chatService = new ChatService(isAuthenticated, token)
    dispatch(setLoading(true))
    const thread = await chatService.getThread(threadId, dispatch)
    dispatch(setActiveThread(thread))
  } catch (error) {
    if (error instanceof NotFoundError) {
      dispatch(setError(error.toString()))
      throw error // Re-throw so it can be caught by the parent Catch block
    } else if (error instanceof ApplicationError) {
      dispatch(setError(error.toString()))
      throw error // Re-throw so it can be caught by the parent Catch block
    } else {
      // Handle unexpected errors here
      console.error(error)
      dispatch(setError('An unexpected error occurred'))
      throw error
    }
  } finally {
    dispatch(setLoading(false))
  }
})

/**
 * Fetches threads from the chat service asynchronously.
 *
 * @param _ - The placeholder parameter, not used in the function.
 * @param dispatch - The Redux dispatch function.
 * @param getState - The Redux getState function.
 * @returns A Promise that resolves to the fetched threads.
 */
export const fetchThreads = createAsyncThunk('chat/fetchThreads', async (_, { dispatch, getState }) => {
  try {
    const { isAuthenticated, token } = (getState() as RootState).auth
    const chatService = new ChatService(isAuthenticated, token)
    dispatch(setLoading(true))
    const threads = await chatService.getAllThreads(dispatch)
    dispatch(setThreads(threads))
    return threads
  } catch (error) {
    dispatch(setError(error.toString()))
  } finally {
    dispatch(setLoading(false))
  }
})

/**
 * Sets the name of a thread asynchronously.
 *
 * @param threadId - The ID of the thread.
 * @param name - The new name for the thread.
 * @returns A Promise that resolves when the thread name is successfully set.
 */
export const setThreadName = createAsyncThunk(
  'chat/setThreadName',
  async ({ threadId, name }: { threadId: string; name: ThreadNameRequest }, { dispatch, getState }) => {
    try {
      const { isAuthenticated, token } = (getState() as RootState).auth
      const chatService = new ChatService(isAuthenticated, token)
      dispatch(setLoading(true))
      await chatService.setThreadName(threadId, name, dispatch)
      dispatch(fetchThreads()) // refresh the list of threads after deletion
    } catch (error) {
      dispatch(setError(error.toString()))
    } finally {
      dispatch(setLoading(false))
    }
  },
)

/**
 * Get Share uuid for a thread asynchronously.
 *
 * @param threadId - The ID of the thread.
 * @returns A Promise that resolves when the share thread uuid generated successfully.
 */
export const getShareThreadUUID = createAsyncThunk(
  'chat/getShareThreadUUID',
  async ({ threadId }: { threadId: string }, { dispatch, getState }) => {
    try {
      const { isAuthenticated, token } = (getState() as RootState).auth
      const chatService = new ChatService(isAuthenticated, token)
      dispatch(setLoading(true))
      const response = await chatService.getShareThreadUUID(threadId, dispatch)
      if (response.status === 'success') {
        return response as ShareThreadResponse
      }
    } catch (error) {
      dispatch(setError(error.toString()))
    } finally {
      dispatch(setLoading(false))
    }
  },
)

/**
 * Fetches a shared thread from the chat service.
 *
 * @param sharedThreadUUID - The uuid of the shared thread to fetch.
 * @param dispatch - The dispatch function from the Redux store.
 * @param getState - The getState function from the Redux store.
 * @returns A Promise that resolves to the fetched thread.
 * @throws {NotFoundError} If the thread is not found.
 * @throws {ApplicationError} If an application error occurs.
 */
export const fetchSharedThread = createAsyncThunk(
  'chat/fetchSharedThread',
  async (sharedThreadUUID: string, { dispatch, getState }) => {
    try {
      const { isAuthenticated, token } = (getState() as RootState).auth
      const chatService = new ChatService(isAuthenticated, token)
      dispatch(setLoading(true))
      const thread = await chatService.getSharedThread(sharedThreadUUID, dispatch)
      if (!thread.messages) {
        throw NotFoundError
      }
      dispatch(setActiveThread(thread))
    } catch (error) {
      if (error instanceof NotFoundError) {
        dispatch(setError(error.toString()))
        throw error // Re-throw so it can be caught by the parent Catch block
      } else if (error instanceof ApplicationError) {
        dispatch(setError(error.toString()))
        throw error // Re-throw so it can be caught by the parent Catch block
      } else {
        // Handle unexpected errors here
        dispatch(setError('An unexpected error occurred'))
        throw error
      }
    } finally {
      dispatch(setLoading(false))
    }
  },
)

/**
 * Sends feedback asynchronously.
 * @param feedbackRequest - The feedback request object.
 * @param dispatch - The dispatch function from Redux.
 * @param getState - The getState function from Redux.
 */
export const sendFeedback = createAsyncThunk(
  'chat/sendFeedback',
  async ({ feedbackRequest }: { feedbackRequest: FeedbackRequest }, { dispatch, getState }) => {
    try {
      const { isAuthenticated, token } = (getState() as RootState).auth
      const chatService = new ChatService(isAuthenticated, token)
      dispatch(setLoading(true))
      await chatService.sendFeedback(
        feedbackRequest.threadId,
        feedbackRequest.messageId,
        feedbackRequest.feedbackClass,
        feedbackRequest.comment,
        dispatch,
      )
      // dispatch(setFeedback) // refresh the list of threads after deletion
    } catch (error) {
      dispatch(setError(error.toString()))
    } finally {
      dispatch(setLoading(false))
    }
  },
)
