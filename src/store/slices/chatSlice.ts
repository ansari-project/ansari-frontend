import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Message, Thread } from '../types/chatTypes' // Adjust the import path

interface ChatState {
  threads: Thread[] // Array to store threads
  activeThread: Thread | null // Currently active thread
  loading: boolean // Loading state for async actions
  error: string | null // Error state
}

const initialState: ChatState = {
  threads: [],
  activeThread: null,
  loading: false,
  error: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Action to set the list of threads
    setThreads(state, action: PayloadAction<Thread[]>) {
      state.threads = action.payload
    },

    // Action to set the active thread
    setActiveThread(state, action: PayloadAction<Thread | null>) {
      state.activeThread = action.payload
    },

    // Action to add a message to the active thread
    addMessageToActiveThread(state, action: PayloadAction<Message>) {
      if (state.activeThread) {
        state.activeThread.messages.push(action.payload)
      }
    },

    // Action to add a stream of messages to the active thread
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

    // Action to set loading state
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },

    // Action to set error state
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

// Export the actions
export const {
  setThreads,
  setActiveThread,
  addMessageToActiveThread,
  addStreamMessageToActiveThread,
  setLoading,
  setError,
} = chatSlice.actions

// Export the reducer
export default chatSlice.reducer
