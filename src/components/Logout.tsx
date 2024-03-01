import { LogoutIcon } from '@endeavorpal/assets'
import { useAuth } from '@endeavorpal/hooks'
import { AppDispatch, clearAuthState, logout } from '@endeavorpal/store'
import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { useDispatch } from 'react-redux'

type LogoutButtonProps = {
  onHandelPress: React.Dispatch<React.SetStateAction<boolean>>
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onHandelPress }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { token } = useAuth()

  const handleLogout = async () => {
    onHandelPress(false)
    try {
      await dispatch(logout(String(token)))
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      clearAuthState()
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
