import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { checkForOtaUpdate, dismissOtaUpdate, applyOtaUpdate } from '@/store/slices/otaUpdateSlice'
import OtaUpdatePopup from './OtaUpdatePopup'

interface OtaUpdateManagerProps {
  suppressWhenForced?: boolean
}

const OtaUpdateManager: React.FC<OtaUpdateManagerProps> = ({ suppressWhenForced = false }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { isUpdateAvailable, isCritical } = useSelector((state: RootState) => state.otaUpdate)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const [popupVisible, setPopupVisible] = useState(false)
  const appStateRef = useRef<AppStateStatus>(AppState.currentState)

  // Check on mount
  useEffect(() => {
    dispatch(checkForOtaUpdate())
  }, [dispatch])

  // Check when app returns to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appStateRef.current.match(/inactive|background/) && nextState === 'active') {
        dispatch(checkForOtaUpdate())
      }
      appStateRef.current = nextState
    })

    return () => subscription.remove()
  }, [dispatch])

  // Check after login
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(checkForOtaUpdate())
    }
  }, [isAuthenticated, dispatch])

  // Show popup when update becomes available
  useEffect(() => {
    if (isUpdateAvailable && !suppressWhenForced) {
      setPopupVisible(true)
    }
  }, [isUpdateAvailable, suppressWhenForced])

  const handleUpdate = useCallback(() => {
    applyOtaUpdate()
  }, [])

  const handleDismiss = useCallback(() => {
    setPopupVisible(false)
    dispatch(dismissOtaUpdate())
  }, [dispatch])

  return (
    <OtaUpdatePopup visible={popupVisible} isCritical={isCritical} onUpdate={handleUpdate} onDismiss={handleDismiss} />
  )
}

export default OtaUpdateManager
