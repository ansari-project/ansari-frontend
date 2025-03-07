import { Action, combineReducers, configureStore, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit'

import {
  authReducer,
  chatReducer,
  informationPopupReducer,
  inputFullModeReducer,
  loadAuthState,
  reactionButtonsReducer,
  shareReducer,
  sideMenuReducer,
  themeReducer,
} from './slices'

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  informationPopup: informationPopupReducer,
  sideMenu: sideMenuReducer,
  reactionButtons: reactionButtonsReducer,
  theme: themeReducer,
  share: shareReducer,
  input: inputFullModeReducer,
  // Add other reducers here...
})

const initStore = async () => {
  const preloadedState = await loadAuthState()

  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    devTools: __DEV__,
  })

  return store
}

// export type AppDispatch = typeof initStore.dispatch
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = ThunkDispatch<RootState, undefined, Action>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

export default initStore
