import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit'
import authReducer, { loadAuthState } from './slices/authSlice'
import chatReducer from './slices/chatSlice'
import informationPopupReducer from './slices/informationPopupSlice'
import reactionButtonsReducer from './slices/reactionButtonsSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  informationPopup: informationPopupReducer,
  reactionButtons: reactionButtonsReducer,
  // Add other reducers here...
})

const store = configureStore({
  reducer: rootReducer,
  // Preload the store with state retrieved from local storage (if available)
  preloadedState: {
    auth: loadAuthState(),
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof rootReducer>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

export default store
