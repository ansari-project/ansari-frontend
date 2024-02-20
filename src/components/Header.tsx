import { useAuth, useDirection } from '@endeavorpal/hooks'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useNavigate } from 'react-router-dom'
import InfoPopup from './InfoPopup'
import LanguageSelector from './LanguageSelector'
import ThreadsDrawer from './threads/ThreadsDrawer'

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const { isRTL } = useDirection()
  const navigate = useNavigate()
  // Function to handle press on ANSARI text
  const handlePress = () => {
    // Navigate to the home page here
    navigate('/')
  }
  const flexDirection = { flexDirection: isRTL ? 'row-reverse' : 'row' }

  return (
    <View style={[styles.container]}>
      <View style={[styles.contentWarper]}>
        <View style={[styles.leftContent, flexDirection]}>
          {isAuthenticated && <ThreadsDrawer />}
          {!isAuthenticated && (
            <>
              <InfoPopup />
              <LanguageSelector />
            </>
          )}
        </View>
        <Pressable onPress={handlePress}>
          <Text style={{ fontWeight: '500', fontSize: 24 }}>{'ANSARI'}</Text>
        </Pressable>
        <View style={[styles.rightContent, flexDirection]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 56,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff', // f2f2f2
  },
  contentWarper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  rightContent: {
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'red',
  },
})
export default Header
