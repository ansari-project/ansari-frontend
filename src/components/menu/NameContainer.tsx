import React, { useState } from 'react'
import { Linking, Platform, Pressable, Text, View } from 'react-native'
import { Avatar } from '@kolking/react-native-avatar'
import { AppDispatch, RootState, toggleSideMenu } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { CloseIcon, LikeIcon, LogoutIcon } from '@/components/svg'
import { useAuth, useLogout } from '@/hooks'
import PopupMenu, { PopupMenuSeparator } from '@/components/PopupMenu'

type NameContainerProps = {
  name: string
  initial?: string
  nameColor?: string
  displayName?: boolean
}

const NameContainer: React.FC<NameContainerProps> = ({ name, nameColor, displayName = true, initial }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const { isGuest } = useAuth()
  const theme = useSelector((state: RootState) => state.theme.theme)
  const { t } = useTranslation('common')
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const doLogout = useLogout()

  if (nameColor === undefined) {
    nameColor = theme.textColor
  }

  return (
    <View className=''>
      <Pressable onPress={() => setIsVisible(!isVisible)}>
        <View className='flex-grow flex-row items-center'>
          <Avatar
            size={34}
            name={initial || name}
            color={theme.linkColor}
            textStyle={{ fontWeight: 'bold', fontSize: 14, color: theme.textColor }}
          />
          {displayName && (
            <Text className="font-semibold text-base px-[10px] font-['Inter']" style={{ color: nameColor }}>
              {name}
            </Text>
          )}
        </View>
      </Pressable>
      <PopupMenu
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        position='bottom-left'
        menuStyle={{ width: 225 }}
      >
        {(Platform.OS === 'ios' || Platform.OS === 'android') && (
          <>
            <Pressable
              className='flex-row items-center py-4'
              onPress={() => {
                setIsVisible(false)
                const appStoreUrl =
                  Platform.OS === 'ios'
                    ? 'itms-apps://itunes.apple.com/app/viewContentsUserReviews/id6743072108?action=write-review'
                    : 'market://details?id=chat.ansari.app&showAllReviews=true'
                Linking.openURL(appStoreUrl)
              }}
            >
              <LikeIcon width={24} height={24} fill={theme.textColor} stroke={theme.textColor} />
              <Text className="text-base font-medium px-[10px] font-['Inter']" style={{ color: theme.textColor }}>
                {t('rateApp')}
              </Text>
            </Pressable>
            <PopupMenuSeparator />
          </>
        )}

        {!isGuest && (
          <>
            <Pressable
              className='flex-row items-center py-4'
              onPress={() => {
                setIsVisible(false)
                dispatch(toggleSideMenu(false))
                router.push('/delete-account')
              }}
            >
              <CloseIcon width={24} height={24} fill={theme.textColor} stroke={theme.textColor} />
              <Text className="text-base font-medium px-[10px] font-['Inter']" style={{ color: theme.textColor }}>
                {t('deleteAccount')}
              </Text>
            </Pressable>
            <PopupMenuSeparator />
          </>
        )}

        <Pressable
          className='flex-row items-center py-4'
          onPress={async () => {
            setIsVisible(false)
            dispatch(toggleSideMenu(false))
            await doLogout()
            router.push('/')
          }}
        >
          <LogoutIcon stroke={theme.textColor} />
          <Text className='text-base font-medium px-[10px] font-[Inter]' style={{ color: theme.textColor }}>
            {t('logout')}
          </Text>
        </Pressable>
      </PopupMenu>
    </View>
  )
}

export default NameContainer
