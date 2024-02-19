import { LogoutIcon } from '@endeavorpal/assets'
import { useAuth } from '@endeavorpal/hooks'
import { AppDispatch, clearAuthStateFromLocalStorage, logout } from '@endeavorpal/store'
import React from 'react'
import { Pressable } from 'react-native'
import { useDispatch } from 'react-redux'

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { token } = useAuth()

  const handleLogout = async () => {
    if (token) {
      try {
        await dispatch(logout(token))
      } catch (error) {
        console.error('Error logging out:', error)
      }
      clearAuthStateFromLocalStorage()
    }
  }

  return (
    <Pressable onPress={handleLogout} style={{ paddingRight: 8 }}>
      <LogoutIcon />
    </Pressable>
  )
}

export default LogoutButton
