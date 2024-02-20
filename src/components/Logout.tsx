import { LogoutIcon } from '@endeavorpal/assets'
import { useAuth } from '@endeavorpal/hooks'
import { AppDispatch, clearAuthStateFromLocalStorage, logout } from '@endeavorpal/store'
import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'
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
    <Pressable onPress={handleLogout} style={styles.container}>
      <LogoutIcon />
      <Text style={styles.text}>Logout</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
})

export default LogoutButton
