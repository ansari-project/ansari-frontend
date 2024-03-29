import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const informationPopupSlice = createSlice({
  name: 'informationPopup',
  initialState: {
    isOpen: true,
  },
  reducers: {
    toggleInformationPopup: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload
    },
  },
})

export const { toggleInformationPopup } = informationPopupSlice.actions

export default informationPopupSlice.reducer
