import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit'
import authReducer, { loadAuthStateFromLocalStorage } from './slices/authSlice'
import chatReducer from './slices/chatSlice'
import informationPopupReducer from './slices/informationPopupSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  informationPopup: informationPopupReducer,
  chat: chatReducer,
  // Add other reducers here...
})

const store = configureStore({
  reducer: rootReducer,
  // Preload the store with state retrieved from local storage (if available)
  preloadedState: {
    auth: loadAuthStateFromLocalStorage(),
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof rootReducer>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

export default store
