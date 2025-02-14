import { LogoutIcon } from '@/components/svg'
import { useLogout } from '@/hooks'
import { RootState } from '@/store'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text } from 'react-native'
import { useSelector } from 'react-redux'

type LogoutButtonProps = {
  onHandelPress: React.Dispatch<React.SetStateAction<boolean>>
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onHandelPress }) => {
  const doLogout = useLogout()
  const { t } = useTranslation()
  const theme = useSelector((state: RootState) => state.theme.theme)

  const handleLogout = async () => {
    onHandelPress(false)
    await doLogout()
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      color: theme.textColor,
    },
    text: {
      fontSize: 16,
      fontWeight: '500',
      paddingHorizontal: 10,
      color: theme.textColor,
    },
  })

  return (
    <Pressable onPress={handleLogout} style={styles.container}>
      <LogoutIcon />
      <Text style={styles.text}>{t('logout')}</Text>
    </Pressable>
  )
}

export default LogoutButton
