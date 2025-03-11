import { SettingIcon } from '@/components/svg'
import { useAuth } from '@/hooks'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, Text, View } from 'react-native'
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view'
import { Avatar } from '@kolking/react-native-avatar'
import LogoutButton from '../Logout'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

type NameContainerProps = {
  name: string
  initial?: string
  nameColor?: string
  displayName?: boolean
}

const NameContainer: React.FC<NameContainerProps> = ({ name, nameColor, displayName = true, initial }) => {
  const { t } = useTranslation()
  const { isGuest } = useAuth()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const touchableRef = useRef(null)
  const theme = useSelector((state: RootState) => state.theme.theme)
  if (nameColor == undefined) {
    nameColor = theme.textColor
  }

  return (
    <View className='flex-1'>
      <Pressable ref={touchableRef} onPress={() => setIsVisible(!isVisible)}>
        <View className='flex-grow flex-row items-center py-4'>
          <Avatar
            size={34}
            name={initial || name}
            color={theme.linkColor}
            textStyle={{ fontWeight: 'bold', fontSize: 14, color: theme.textColor }}
          />
          {displayName && (
            <Text className="font-semibold text-[16px] px-[10px] font-['Inter']" style={{ color: nameColor }}>
              {name}
            </Text>
          )}
        </View>
      </Pressable>
      <Popover
        from={touchableRef}
        mode={PopoverMode.RN_MODAL}
        placement={PopoverPlacement.FLOATING}
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        popoverShift={{ x: -1, y: 0.8 }}
        popoverStyle={{
          width: 180,
          borderRadius: 4,
          padding: 16,
          position: 'absolute',
          marginLeft: 40,
          marginRight: 40,
          backgroundColor: theme.popupBackgroundColor,
          overflow: 'visible',
        }}
      >
        <View className='w-full'>
          {/* Not implemented  */}
          {/* {!isGuest && (
            <Pressable className='flex-row items-center py-4' onPress={() => setIsVisible(false)}>
              <SettingIcon width={24} height={24} />
              <Text className="text-base font-medium px-[10px] font-['Inter']" style={{ color: theme.textColor }}>
                {t('setting')}
              </Text>
            </Pressable>
          )} */}

          <Pressable className={'flex-row items-center py-4'}>
            <LogoutButton onHandelPress={setIsVisible} />
          </Pressable>
        </View>
      </Popover>
    </View>
  )
}

export default NameContainer
