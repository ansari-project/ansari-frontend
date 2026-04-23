import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as Updates from 'expo-updates'
import { Platform } from 'react-native'

const THROTTLE_MS = 60_000

interface OtaUpdateState {
  isChecking: boolean
  isUpdateAvailable: boolean
  isCritical: boolean
  error: string | null
}

const initialState: OtaUpdateState = {
  isChecking: false,
  isUpdateAvailable: false,
  isCritical: false,
  error: null,
}

// Module-level transient state (not in Redux — resets on app restart, which is fine)
let checkInProgress = false
let lastCheckTimestamp = 0

// Extract criticalIndex from manifest with unknown type
function getCriticalIndex(manifest: unknown): number {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const m = manifest as any
  return (m?.extra?.expoClient?.extra?.criticalIndex as number) ?? 0
}

function shouldThrottle(): boolean {
  return Date.now() - lastCheckTimestamp < THROTTLE_MS
}

export const checkForOtaUpdate = createAsyncThunk<
  { isUpdateAvailable: boolean; isCritical: boolean },
  void,
  { rejectValue: string }
>('otaUpdate/check', async (_, { rejectWithValue }) => {
  // Skip in dev mode (expo-updates doesn't work in dev)
  if (__DEV__ || Platform.OS === 'web') {
    return { isUpdateAvailable: false, isCritical: false }
  }

  if (!Updates.isEnabled) {
    return { isUpdateAvailable: false, isCritical: false }
  }

  // Prevent concurrent checks
  if (checkInProgress) {
    return { isUpdateAvailable: false, isCritical: false }
  }

  // Throttle checks
  if (shouldThrottle()) {
    return { isUpdateAvailable: false, isCritical: false }
  }

  checkInProgress = true
  lastCheckTimestamp = Date.now()

  try {
    const checkResult = await Updates.checkForUpdateAsync()
    if (!checkResult.isAvailable) {
      return { isUpdateAvailable: false, isCritical: false }
    }

    // Verify it's a different update
    const newUpdateId = checkResult.manifest?.id
    if (!newUpdateId || newUpdateId === Updates.updateId) {
      return { isUpdateAvailable: false, isCritical: false }
    }

    const fetchResult = await Updates.fetchUpdateAsync()
    if (!fetchResult.isNew) {
      return { isUpdateAvailable: false, isCritical: false }
    }

    // Check if update is critical
    const isCritical = getCriticalIndex(fetchResult.manifest) > getCriticalIndex(Updates.manifest)

    return { isUpdateAvailable: true, isCritical }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OTA update check failed'
    console.error('[OTA] Check failed:', error)
    return rejectWithValue(message)
  } finally {
    checkInProgress = false
  }
})

const otaUpdateSlice = createSlice({
  name: 'otaUpdate',
  initialState,
  reducers: {
    dismissOtaUpdate(state) {
      if (!state.isCritical) {
        state.isUpdateAvailable = false
      }
    },
    resetOtaState() {
      checkInProgress = false
      lastCheckTimestamp = 0
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkForOtaUpdate.pending, (state) => {
        state.isChecking = true
        state.error = null
      })
      .addCase(checkForOtaUpdate.fulfilled, (state, action) => {
        state.isChecking = false
        if (action.payload.isUpdateAvailable) {
          state.isUpdateAvailable = true
          state.isCritical = action.payload.isCritical
        }
      })
      .addCase(checkForOtaUpdate.rejected, (state, action) => {
        state.isChecking = false
        state.error = action.payload ?? 'Unknown error'
      })
  },
})

export const { dismissOtaUpdate, resetOtaState } = otaUpdateSlice.actions

// Standalone functions (not thunks — these reload the app, no state update possible)
export async function applyOtaUpdate(): Promise<void> {
  try {
    await Updates.reloadAsync()
  } catch (error) {
    console.error('[OTA] Reload failed:', error)
  }
}

export async function reloadForCleanup(): Promise<void> {
  if (__DEV__ || Platform.OS === 'web' || !Updates.isEnabled) {
    return
  }
  try {
    await Updates.reloadAsync()
  } catch (error) {
    console.error('[OTA] Cleanup reload failed:', error)
  }
}

export default otaUpdateSlice.reducer
