import { Action, combineReducers, configureStore, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit'
import {
  authReducer,
  chatReducer,
  informationPopupReducer,
  loadAuthState,
  reactionButtonsReducer,
  sideMenuReducer,
  themeReducer,
  shareReducer,
} from './slices'

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  informationPopup: informationPopupReducer,
  sideMenu: sideMenuReducer,
  reactionButtons: reactionButtonsReducer,
  theme: themeReducer,
  share: shareReducer,
  // Add other reducers here...
})

const initStore = async () => {
  const preloadedState = await loadAuthState()

  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  })

  return store
}

// export type AppDispatch = typeof initStore.dispatch
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = ThunkDispatch<RootState, undefined, Action>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

export default initStore
