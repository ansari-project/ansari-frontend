import { darkTheme, Theme } from '@endeavorpal/utils/theme'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ThemeState {
  theme: Theme // Assuming your theme is represented as a string
}

const initialState: ThemeState = {
  theme: darkTheme, // Initial theme
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
    },
  },
})

export const { setTheme } = themeSlice.actions
export default themeSlice.reducer
