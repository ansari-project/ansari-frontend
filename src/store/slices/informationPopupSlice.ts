import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InformationPopupState {
  isOpen: boolean | undefined
}

const initialState: InformationPopupState = {
  isOpen: undefined,
}

const informationPopupSlice = createSlice({
  name: 'informationPopup',
  initialState,
  reducers: {
    toggleInformationPopup: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload
    },
  },
})

export const { toggleInformationPopup } = informationPopupSlice.actions

export default informationPopupSlice.reducer
