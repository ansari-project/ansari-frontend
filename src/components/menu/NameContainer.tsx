import { SettingIcon } from '@/components/svg'
import { useAuth } from '@/hooks'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view'
import UserAvatar from 'react-native-user-avatar'
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
  const touchableRef = useRef<Pressable>(null)
  const theme = useSelector((state: RootState) => state.theme.theme)
  if (nameColor == undefined) {
    nameColor = theme.textColor
  }

  const styles = StyleSheet.create({
    popupContent: {
      width: 180,
      borderRadius: 4,
      padding: 16,
      position: 'absolute',
      marginLeft: 40,
      marginRight: 40,
      backgroundColor: theme.popupBackgroundColor,
      overflow: 'visible',
    },
    popupItems: {
      width: '100%',
    },
    popupItem: {
      flexDirection: 'row',
      alignItems: 'center',
      color: theme.textColor,
      paddingVertical: 16,
    },
    popupItemText: {
      fontSize: 16,
      fontWeight: '500',
      paddingHorizontal: 10,
      fontFamily: 'Inter',
      color: theme.textColor,
    },
    nameContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'self-start',
      alignItems: 'center',
      paddingVertical: 16,
    },
    userNameText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textColor,
      paddingHorizontal: 10,
      fontFamily: 'Inter',
    },
    avatarText: {
      fontWeight: 'bold',
      fontSize: 14,
    },
  })

  return (
    <View>
      <Pressable ref={touchableRef} onPress={() => setIsVisible(!isVisible)}>
        <View style={styles.nameContainer}>
          <UserAvatar
            size={34}
            name={initial || name}
            textColor={theme.textColor}
            bgColor={theme.linkColor}
            textStyle={styles.avatarText}
          />
          {displayName && <Text style={[styles.userNameText, nameColor && { color: nameColor }]}>{name}</Text>}
        </View>
      </Pressable>
      <Popover
        from={touchableRef.current}
        mode={PopoverMode.RN_MODAL}
        placement={PopoverPlacement.FLOATING}
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        popoverShift={{ x: -1, y: 0.8 }}
        popoverStyle={styles.popupContent}
      >
        <View style={styles.popupItems}>
          {!isGuest && (
            <Pressable style={styles.popupItem} onPress={() => setIsVisible(false)}>
              <SettingIcon width={24} height={24} />
              <Text style={styles.popupItemText}>{t('setting')}</Text>
            </Pressable>
          )}

          <Pressable style={[styles.popupItem, !isGuest && { borderTopWidth: 1 }]}>
            <LogoutButton onHandelPress={setIsVisible} />
          </Pressable>
        </View>
      </Popover>
    </View>
  )
}

export default NameContainer
