import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ShareState {
  isOpen: boolean
}

const initialState: ShareState = {
  isOpen: false,
}

const shareSlice = createSlice({
  name: 'share',
  initialState,
  reducers: {
    toggleSharePopup(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload
    },
  },
})

export const { toggleSharePopup } = shareSlice.actions
export default shareSlice.reducer
