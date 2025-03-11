import { AddIcon, LogoRoundIcon, MenuIcon } from '@/components/svg'
import { useAuth, useDirection, useScreenInfo } from '@/hooks'
import { AppDispatch, RootState, fetchThreads, toggleSideMenu } from '@/store'
import React, { useEffect, useState } from 'react'
import { Pressable, View, Text, ScrollView, SafeAreaView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'expo-router'
import ActionButtons from '../ActionButtons'
import { ThreadsList } from '../threads'
import NameContainer from './NameContainer'
import { Helpers } from '@/utils'

const SideMenuBody: React.FC = () => {
  const { user } = useAuth()
  const { isMobile, isSmallScreen } = useScreenInfo()
  const { isRTL } = useDirection()
  const [isHovered, setIsHovered] = useState(false)
  const theme = useSelector((state: RootState) => state.theme.theme)
  const isSideMenuOpened = useSelector((state: RootState) => state.sideMenu.isOpen)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (isSideMenuOpened) {
      dispatch(fetchThreads())
    }
  }, [isSideMenuOpened, dispatch])

  const togglePopup = () => {
    dispatch(toggleSideMenu(!isSideMenuOpened))
  }

  const onSelectCard = () => {
    if (isMobile) {
      togglePopup()
    }
  }

  const router = useRouter()
  // Function to handle press on ANSARI text
  const handlePress = () => {
    // Navigate to the home page here
    if (isMobile) {
      dispatch(toggleSideMenu(!isSideMenuOpened))
    }
    router.push('/')
  }

  return (
    <SafeAreaView
      className={'flex-1 justify-center items-start w-full'}
      style={{ backgroundColor: theme.sideMenuBackgroundColor }}
    >
      <View
        className={`z-[1] flex-row w-full items-center gap-2 inline-flex cursor-pointer ${
          isSmallScreen ? 'p-[10px] px-4 h-auto' : `py-4 ${isRTL ? 'pr-4 pl-2' : 'pl-4 pr-2'}`
        }`}
      >
        {/* Drawer Header */}
        <View className='flex-1 justify-between flex-row items-center'>
          <Pressable onPress={() => togglePopup()}>
            <MenuIcon stroke={theme.iconFill} hoverStroke={theme.hoverColor} width={24} height={24} />
          </Pressable>
          <Pressable onPress={handlePress}>
            <LogoRoundIcon width={24} height={24} />
          </Pressable>
          <Pressable onPress={handlePress}>
            <AddIcon width={24} height={24} fill={theme.iconFill} hoverFill={theme.hoverColor} />
          </Pressable>
        </View>
      </View>
      <View
        className={`flex-1 w-full rounded-none p-4 py-2 items-start elevation-5 gap-4 flex-grow overflow-y-auto ${
          isHovered || isMobile ? 'scrollbar-thin' : ''
        }`}
        style={{
          maxHeight: Helpers.isMobileWithAddressBar() ? 'calc(100vh - 180px)' : 'calc(100vh - 120px)',
          scrollbarColor: isHovered || isMobile ? `${theme.scrollColor} transparent` : 'transparent transparent',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ScrollView>
          <ThreadsList onSelectCard={onSelectCard} />
        </ScrollView>
      </View>
      <View className='w-full bottom-0 z-[1] items-center justify-start flex-row px-4'>
        <View className='flex-row'>
          <NameContainer name={`${user?.firstName} ${user?.lastName}`} />
          {!isSmallScreen && <ActionButtons isTop={false} margin={8} />}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SideMenuBody
