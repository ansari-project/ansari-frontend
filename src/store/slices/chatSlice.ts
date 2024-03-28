import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Message, Thread } from '../types/chatTypes'

/**
 * Represents the state of the chat.
 */
interface ChatState {
  threads: Thread[] // Array to store threads
  activeThread: Thread | null // Currently active thread
  loading: boolean // Loading state for async actions
  error: string | null // Error state
}

/**
 * Represents the initial state of the chat slice.
 */
const initialState: ChatState = {
  threads: [],
  activeThread: null,
  loading: false,
  error: null,
}

/**
 * Represents the chat slice of the Redux store.
 */
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    /**
     * Sets the threads in the chat state.
     * @param state - The current chat state.
     * @param action - The Redux action containing the payload of type Thread[].
     */
    setThreads(state, action: PayloadAction<Thread[]>) {
      state.threads = action.payload
    },

    /**
     * Sets the active thread in the chat slice state.
     * @param state - The current chat slice state.
     * @param action - The payload action containing the thread to set as active.
     */
    setActiveThread(state, action: PayloadAction<Thread | null>) {
      state.activeThread = action.payload
    },

    /**
     * Adds a message to the active thread.
     *
     * @param state - The current state of the chat slice.
     * @param action - The payload action containing the message to be added.
     */
    addMessageToActiveThread(state, action: PayloadAction<Message>) {
      if (state.activeThread) {
        state.activeThread.messages.push(action.payload)
      }
    },

    /**
     * Adds a stream message to the active thread.
     * If a message with the same id already exists, updates its content.
     * Otherwise, adds the new message to the array of messages in the active thread.
     *
     * @param state - The current state of the chat slice.
     * @param action - The payload action containing the message to be added.
     */
    addStreamMessageToActiveThread(state, action: PayloadAction<Message>) {
      if (state.activeThread && action.payload.content.length > 0) {
        const messageIndex = state.activeThread.messages.findIndex(
          (message: Message) => message.id === action.payload.id,
        )

        if (messageIndex !== -1) {
          // If a message with the same id already exists, update its content
          state.activeThread.messages[messageIndex] = action.payload
        } else {
          // Otherwise, add the new message to the array
          state.activeThread.messages.push(action.payload)
        }
      }
    },

    /**
     * Sets the loading state of the chat slice.
     * @param state - The current state of the chat slice.
     * @param action - The payload action containing the loading value.
     */
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },

    /**
     * Sets the error state in the chat slice.
     * @param state - The current state of the chat slice.
     * @param action - The payload action containing the error message.
     */
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },

    /**
     * Resets the chat state to its initial state.
     */
    resetChatState: () => {
      return initialState
    },
  },
})

/**
 * Actions for chatSlice.
 * @remarks
 * This module contains actions for managing chat state.
 */
export const {
  addMessageToActiveThread,
  addStreamMessageToActiveThread,
  resetChatState,
  setActiveThread,
  setError,
  setLoading,
  setThreads,
} = chatSlice.actions

/**
 * The reducer function for the chat slice.
 * @returns The updated state after applying the action.
 */
export default chatSlice.reducer
