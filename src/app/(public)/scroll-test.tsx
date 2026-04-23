import { LogoIcon } from '@/components/svg'
import { useDirection, useScreenInfo } from '@/hooks'
import { RootState } from '@/store'
import { createGeneralThemedStyles } from '@/utils'
import { Redirect } from 'expo-router'
import React from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { useSelector } from 'react-redux'
import StyledText from '@/components/StyledText'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

const ScrollTestScreen: React.FC = () => {
  const { isRTL } = useDirection()
  const { isSmallScreen, width } = useScreenInfo()
  const theme = useSelector((state: RootState) => state.theme.theme)

  if (!__DEV__) {
    return <Redirect href='/login' />
  }

  const generalStyle = createGeneralThemedStyles(theme, isRTL, isSmallScreen, width)

  return (
    <KeyboardAwareScrollView
      bottomOffset={50}
      contentContainerStyle={generalStyle.formContainer}
      keyboardShouldPersistTaps='handled'
    >
      <View style={generalStyle.form}>
        <View className='items-center py-2'>
          <LogoIcon fill={theme.iconFill} width={52} height={52} />
        </View>
        <StyledText variant='h2' color='primary' className='my-12' textAlign='center'>
          Scroll Test
        </StyledText>

        <TextInput placeholder='Email' placeholderTextColor={theme.inputColor} style={generalStyle.input} />
        <TextInput placeholder='First Name' placeholderTextColor={theme.inputColor} style={generalStyle.input} />
        <TextInput placeholder='Last Name' placeholderTextColor={theme.inputColor} style={generalStyle.input} />
        <TextInput
          placeholder='Password'
          placeholderTextColor={theme.inputColor}
          style={generalStyle.input}
          secureTextEntry
        />
        <TextInput
          placeholder='Confirm Password'
          placeholderTextColor={theme.inputColor}
          style={generalStyle.input}
          secureTextEntry
        />

        <Pressable style={generalStyle.buttonPrimary}>
          <Text style={generalStyle.buttonPrimaryText}>Test Submit</Text>
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  )
}

export default ScrollTestScreen
