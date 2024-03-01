import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FeedbackClass } from '../types'

export interface ReactionButtonsState {
  threadId: string | null
  messageId: string | null
  selectedIcon: FeedbackClass | null
}

const initialState: ReactionButtonsState[] = []

const reactionButtonsSlice = createSlice({
  name: 'reactionButtons',
  initialState,
  reducers: {
    setReactionButton: (state, action: PayloadAction<ReactionButtonsState>) => {
      const index = state.findIndex(
        (reactionButtonState) =>
          reactionButtonState.threadId === action.payload.threadId &&
          reactionButtonState.messageId === action.payload.messageId,
      )
      if (index === -1) {
        state.push(action.payload)
      } else {
        state[index] = action.payload
      }
    },
  },
})

export const { setReactionButton } = reactionButtonsSlice.actions

export default reactionButtonsSlice.reducer
