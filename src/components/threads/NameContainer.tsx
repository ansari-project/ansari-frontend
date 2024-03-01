import { SettingIcon } from '@endeavorpal/assets'
import React, { useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view'
import UserAvatar from 'react-native-user-avatar'
import LogoutButton from '../Logout'

type NameContainerProps = {
  name: string
}

const NameContainer: React.FC<NameContainerProps> = ({ name }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const touchableRef = useRef<Pressable>(null)

  return (
    <View>
      <Pressable ref={touchableRef} onPress={() => setIsVisible(!isVisible)}>
        <View style={styles.nameContainer}>
          <UserAvatar
            size={34}
            name={name}
            textColor='#fff'
            bgColor='#17B5A2'
            textStyle={{ fontWeight: 'bold', fontSize: 14 }}
          />
          <Text style={styles.userNameText}>{name}</Text>
        </View>
      </Pressable>
      <Popover
        from={touchableRef.current}
        mode={PopoverMode.RN_MODAL}
        placement={PopoverPlacement.FLOATING}
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        popoverShift={{ x: -1, y: 0.8 }}
        popoverStyle={[
          styles.popupContent,
          {
            paddingTop: 20, // add some space for the arrow
            paddingBottom: 10, // adjust the padding to fit the arrow
            paddingLeft: 16,
            paddingRight: 16,
            overflow: 'visible', // make sure the arrow is visible outside the container
          },
        ]}
      >
        <View style={styles.popupItems}>
          <Pressable style={styles.popupItem} onPress={() => setIsVisible(false)}>
            <SettingIcon stroke='black' width={24} height={24} />
            <Text style={styles.popupItemText}>Setting</Text>
          </Pressable>
          <Pressable
            style={[
              styles.popupItem,
              { marginBottom: 0, borderTopWidth: 1, paddingTop: 5, borderColor: 'rgba(0,0,0,0.1)' },
            ]}
          >
            <LogoutButton onHandelPress={setIsVisible} />
          </Pressable>
        </View>
      </Popover>
    </View>
  )
}

const styles = StyleSheet.create({
  popupContent: {
    width: 180,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
    padding: 16,
    position: 'absolute',
    marginLeft: 40,
    marginRight: 40,
  },
  popupItems: {
    width: '100%',
  },
  popupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  popupItemText: {
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 10,
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
    color: '#fff',
    paddingHorizontal: 10,
  },
})

export default NameContainer
