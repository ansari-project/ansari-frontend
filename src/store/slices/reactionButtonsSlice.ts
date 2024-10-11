import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FeedbackClass } from '../types'

// Define the state structure for a single reaction button.
export interface ReactionButtonsState {
  threadId: string | null
  messageId: string | null
  selectedIcon: FeedbackClass | null
}

// Initialize the state with an empty array.
const initialState: ReactionButtonsState[] = []

// Create the slice.
const reactionButtonsSlice = createSlice({
  name: 'reactionButtons',
  initialState,
  reducers: {
    // Action to set the state of a specific reaction button.
    setReactionButton: (state, action: PayloadAction<ReactionButtonsState>) => {
      const index = state.findIndex(
        (reactionButtonState) =>
          reactionButtonState.threadId === action.payload.threadId &&
          reactionButtonState.messageId === action.payload.messageId,
      )
      if (index === -1) {
        // If the reaction button does not exist in the state, add it.
        state.push(action.payload)
      } else {
        // If it exists, update its state.
        state[index] = action.payload
      }
    },
    // Action to reset the states of all reaction buttons.
    resetReactionButtons: () => {
      return initialState
    },
  },
})

// Export the action creators.
export const { setReactionButton, resetReactionButtons } = reactionButtonsSlice.actions

// Export the reducer as default.
export default reactionButtonsSlice.reducer
