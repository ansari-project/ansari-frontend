import { LogoutIcon } from '@/components/svg'
import { useLogout } from '@/hooks'
import { RootState } from '@/store'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, Text } from 'react-native'
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

  return (
    <Pressable onPress={handleLogout} className='flex-1 flex-row items-center'>
      <LogoutIcon stroke={theme.textColor} />
      <Text className='text-[16px] font-medium px-[10px]' style={{ color: theme.textColor }}>
        {t('logout')}
      </Text>
    </Pressable>
  )
}

export default LogoutButton
