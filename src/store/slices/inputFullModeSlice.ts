import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const inputFullModeSlice = createSlice({
  name: 'input',
  initialState: {
    fullMode: false,
  },
  reducers: {
    tootleInputFullMode: (state, action: PayloadAction<boolean>) => {
      state.fullMode = action.payload
    },
  },
})

export const { tootleInputFullMode } = inputFullModeSlice.actions

export default inputFullModeSlice.reducer
