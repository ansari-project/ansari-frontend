import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const sideMenuSlice = createSlice({
  name: 'sideMenu',
  initialState: {
    isOpen: false,
    width: 0,
  },
  reducers: {
    toggleSideMenu: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload
      state.width = action.payload ? 300 : 0
    },
  },
})

export const { toggleSideMenu } = sideMenuSlice.actions

export default sideMenuSlice.reducer
