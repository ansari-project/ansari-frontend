import { AnyAction, createAsyncThunk, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { Role } from '@/constant'
import { MessageModel } from '@/interfaces'
import { fetchMessagesStream } from '@/services/api'
import { RootState } from './store'

interface MessagesSlice {
  messages: MessageModel[]
  showIntroductionText: boolean
  streamMessage: string
  hasError: boolean
  isAssistantWriting: boolean
  isAssistantReading: boolean
  isAssistantStopped: boolean
}

const initialState: MessagesSlice = {
  messages: [],
  showIntroductionText: false,
  hasError: false,
  streamMessage: '',
  isAssistantWriting: false,
  isAssistantReading: false,
  isAssistantStopped: false,
}

const writeStreamMessage = createAsyncThunk(
  'messages/readMessages',
  async (stream: ReadableStream<Uint8Array>, { dispatch, rejectWithValue }) => {
    try {
      const reader = stream.getReader()
      const decoder = new TextDecoder()
      let data = ''
      const truthy = true
      while (truthy) {
        const { value, done } = await reader.read()
        if (done) {
          break
        }
        const decodedChunk = decoder.decode(value, { stream: true })
        data += decodedChunk
        dispatch(updateLastMessage(data))
      }
      return data
    } catch {
      return rejectWithValue({ message: 'Error: Something went wrong.' })
    }
  },
)

const readMessagesAsync = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const messages = (getState() as RootState).messagesReducer.messages
      const stream = await fetchMessagesStream({
        messages: messages.filter((message) => !message.error),
      })
      dispatch(writeStreamMessage(stream))
      return true
    } catch (error) {
      return rejectWithValue({ message: 'Error: Something went wrong.' })
    }
  },
)

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<string>) => {
      state.messages = [
        ...state.messages,
        {
          role: Role.USER,
          content: action.payload,
        },
      ]
    },
    updateStreamAssistantMessage: (state, action: PayloadAction<string>) => {
      state.streamMessage = action.payload
    },
    clearMessages: (state) => {
      state.messages = []
    },
    stopAssistant: (state) => {
      state.isAssistantStopped = true
    },
    setShowIntroductionText: (state, action: PayloadAction<boolean>) => {
      state.showIntroductionText = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(readMessagesAsync.pending, (state) => {
      state.isAssistantStopped = false
      state.isAssistantReading = true
      state.isAssistantWriting = true
      state.streamMessage = ' '
      state.hasError = false
    })
    builder.addCase(readMessagesAsync.fulfilled, (state) => {
      state.isAssistantStopped = false
      state.isAssistantReading = false
      state.hasError = false
    })
    builder.addCase(readMessagesAsync.rejected, (state) => {
      if (state.isAssistantStopped) {
        state.hasError = false
        state.messages = [
          ...state.messages,
          {
            role: Role.ASSISTANT,
            content: state.streamMessage,
          },
        ]
      } else {
        state.hasError = true
        state.streamMessage = ''
        state.messages = [
          ...state.messages,
          {
            role: Role.ASSISTANT,
            error: true,
            content: ' ',
          },
        ]
      }
      state.isAssistantWriting = false
      state.isAssistantReading = false
    })

    builder.addCase(writeStreamMessage.pending, (state) => {
      state.isAssistantStopped = false
      state.isAssistantWriting = true
      state.hasError = false
    })
    builder.addCase(writeStreamMessage.fulfilled, (state, action) => {
      state.isAssistantStopped = false
      state.isAssistantWriting = false
      state.hasError = false
      state.streamMessage = ''
      state.messages = [
        ...state.messages,
        {
          role: Role.ASSISTANT,
          content: action.payload,
        },
      ]
    })
    builder.addCase(writeStreamMessage.rejected, (state) => {
      if (state.isAssistantStopped) {
        state.hasError = false
        state.messages = [
          ...state.messages,
          {
            role: Role.ASSISTANT,
            content: state.streamMessage,
          },
        ]
      } else {
        state.hasError = true
        state.streamMessage = ''
        state.messages = [
          ...state.messages,
          {
            role: Role.ASSISTANT,
            error: true,
            content: ' ',
          },
        ]
      }
      state.isAssistantWriting = false
      state.isAssistantReading = false
    })
  },
})

const {
  addMessage: addMessageAction,
  updateStreamAssistantMessage: updateLastMessage,
  clearMessages,
  stopAssistant,
  setShowIntroductionText,
} = messagesSlice.actions

const addMessage = (text: string) => {
  return ((dispatch: Dispatch) => {
    dispatch(addMessageAction(text))
    dispatch(readMessagesAsync() as unknown as AnyAction)
  }) as unknown as AnyAction
}
export { addMessage, clearMessages, stopAssistant, setShowIntroductionText }
export default messagesSlice.reducer
