import { LogoIcon, LogoTextIcon, MenuIcon } from '@endeavorpal/assets'
import { AppDispatch, fetchThreads, RootState } from '@endeavorpal/store'
import { User } from '@endeavorpal/types'
import React, { useEffect, useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import LogoutButton from '../Logout'
import ThreadsList from './ThreadsList'

const ThreadsDrawer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user: User | null = useSelector((state: RootState) => state.auth.user) as User | null
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchThreads())
    }
  }, [isOpen, dispatch])

  const togglePopup = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <Pressable onPress={togglePopup} style={styles.button}>
        <MenuIcon stroke='#08786b' width={'30'} height={'30'} />
      </Pressable>

      <Modal animationType='fade' transparent={true} visible={isOpen} onRequestClose={togglePopup}>
        <View style={styles.container} onClick={togglePopup}>
          <View
            style={[styles.modalView, { overflowY: isHovered ? 'scroll' : 'hidden' }]}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <View onPress={togglePopup} style={styles.headerContainer}>
              {/* Drawer Header */}

              <View style={styles.headerMenu}>
                <MenuIcon stroke='white' width={'30'} height={'30'} />
              </View>
              <View style={styles.headerContent}>
                <LogoIcon fill='white' width={'39'} height={'39'} />
                <LogoTextIcon fill='white' width={'77 '} height={'25'} />
              </View>
            </View>
            <View style={styles.modalContent}>
              {/* Drawer Body */}
              <ThreadsList onSelectCard={togglePopup} />
            </View>
            <View style={styles.bottomContainer}>
              <LogoutButton />
              <Pressable style={[styles.userNameContainer]}>
                <Text style={styles.userNameText}>
                  {user?.firstName} {user?.lastName}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    elevation: 2,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    fontFamily: 'Roboto',
    color: 'white',
  },
  modalView: {
    overflowY: 'hidden',
    overflowX: 'hidden',
    height: '100%',
    position: 'relative',
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#082521',
    borderRadius: 0,
    paddingHorizontal: 5,
    alignItems: 'flex-start',
    boxShadowColor: '#000',
    boxShadowOffset: {
      width: 0,
      height: 2,
    },
    boxShadowOpacity: 0.25,
    boxShadowRadius: 0,
    elevation: 5,
  },
  modalContent: {
    marginVertical: 20,
    marginHorizontal: 10,
    borderRadius: 0,
    padding: 10,
    marginBottom: '70px',
    maxWidth: '420px',
    top: '40px',
    alignItems: 'flex-start',
    boxShadowColor: '#000',
    boxShadowOffset: {
      width: 0,
      height: 2,
    },
    boxShadowOpacity: 0.25,
    boxShadowRadius: 0,
    elevation: 5,
    gap: 16,
    flexGrow: 1, // make the modalContent view expand and fill the available space
  },
  headerContainer: {
    position: 'fixed',
    zIndex: 1,
    flexDirection: 'row',
    maxWidth: '415px',
    width: '100%',
    height: 72,
    padding: 24,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    display: 'inline-flex',
    cursor: 'pointer',
    backgroundColor: '#082521',
  },
  headerMenu: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  headerContent: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  bottomContainer: {
    position: 'fixed',
    bottom: 0,
    height: '40px', // 32 * 2 for density pixels
    maxWidth: '415px',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto', // push the bottomContent to the bottom of the modalContent view
    borderTopColor: '#E0E0E0',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    flexDirection: 'row',
    left: 0,
    right: 0,
    backgroundColor: '#082521', // '#FFA500',
    paddingHorizontal: 16,
  },
  userNameContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 16,
    alignItems: 'end',
  },
  userNameText: {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: '0em',
    color: '#fff',
    textAlign: 'left',
  },
})

export default ThreadsDrawer
