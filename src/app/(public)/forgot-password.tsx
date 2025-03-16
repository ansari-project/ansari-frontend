import { LogoIcon } from '@/components/svg'
import { useDirection, useScreenInfo } from '@/hooks'
import { UserService } from '@/services'
import { RootState } from '@/store'
import { createGeneralThemedStyles } from '@/utils'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  TextInput,
  View,
  Text,
  Keyboard,
} from 'react-native'
import { useSelector } from 'react-redux'
import { useRouter } from 'expo-router'
import * as Yup from 'yup'
import StyledText from '@/components/StyledText'

// TypeScript interface for the initial state
interface EmailState {
  email: string
  submitted: boolean
}

const ForgetPasswordScreen: React.FC = () => {
  const router = useRouter()
  const { t } = useTranslation('login')
  const { isRTL } = useDirection()
  const { isSmallScreen, width } = useScreenInfo()
  const [emailState, setEmailState] = useState<EmailState>({ email: '', submitted: false })
  const [hovered, setHovered] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ email?: string }>({})
  const theme = useSelector((state: RootState) => state.theme.theme)

  const handleEmailChange = (email: string) => {
    setEmailState({ ...emailState, email })
  }

  const emailValidationSchema = Yup.object().shape({
    email: Yup.string().email(t('emailValidationMessage')).required(t('emailRequired')),
  })

  const handleSubmit = async () => {
    try {
      await validateEmail(emailState.email)
      if (emailState.email.trim().length !== 0 && Object.keys(errors).length === 0) {
        Keyboard.dismiss()
        await UserService.requestPasswordReset(emailState.email)
        setEmailState({ ...emailState, submitted: true })
      }
    } catch (error) {
      console.error('Error sending password reset email:', error)
    }
  }

  const validateEmail = async (email: string) => {
    try {
      await emailValidationSchema.validate({ email: email }, { abortEarly: false })
      const errors: { [key: string]: string } = {}
      setErrors(errors)
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors: { [key: string]: string } = {} // Initialize errors as an empty object
        error.inner.forEach(({ path, message }) => {
          errors[path as string] = message // Cast path as string
        })
        setErrors(errors)
      } else {
        console.error('Error sending password reset email:', error)
      }
    }
  }

  const handleKeyPress = (event: NativeSyntheticEvent<TextInput>, submitForm: () => Promise<void>): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      submitForm()
    }
  }

  const handleBack = () => {
    router.push('/login')
  }

  // Styles
  const generalStyle = createGeneralThemedStyles(theme, isRTL, isSmallScreen, width)

  if (emailState.submitted) {
    return (
      <KeyboardAvoidingView
        style={[generalStyle.formContainer]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={generalStyle.form}>
          <View className='items-center py-2'>
            <LogoIcon fill={theme.iconFill} width={52} height={52} />
          </View>
          <StyledText variant='h2' color='primary' className='mb-6'>
            {t('forgotYourPassword')}
          </StyledText>

          <StyledText color='primary' className='mb-5'>
            {t('forgotSuccessMessage')}
          </StyledText>
          <View className='flex-row justify-start'>
            <Pressable
              style={[generalStyle.prompt, Platform.OS === 'web' && hovered ? generalStyle.boldUnderlineText : null]}
              onPress={handleBack}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <StyledText style={generalStyle.link}>{t('continue')}</StyledText>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }

  return (
    <KeyboardAvoidingView style={[generalStyle.formContainer]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={generalStyle.form}>
        <View className='items-center py-2'>
          <LogoIcon fill={theme.iconFill} width={52} height={52} />
        </View>
        <StyledText variant='h2' color='primary' className='font-semibold mb-6'>
          {t('forgotYourPassword')}
        </StyledText>
        <StyledText color='primary' className='mb-5 text-[16px]'>
          {t('forgotMessage')}
        </StyledText>
        <TextInput
          id='email'
          name='email'
          style={generalStyle.input}
          onChangeText={handleEmailChange}
          onBlur={async (event: NativeSyntheticEvent<TextInput>) => await validateEmail(event.target.value)}
          onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, handleSubmit)}
          value={emailState.email}
          placeholder={t('yourEmail')}
          placeholderTextColor={theme.inputColor}
          autoCapitalize='none'
          autoComplete='username'
          autoCorrect={false}
          inputMode='email'
        />
        {errors.email && <StyledText color='yellow'>{errors.email}</StyledText>}
        <Pressable style={generalStyle.buttonPrimary} onPress={handleSubmit}>
          <Text style={generalStyle.buttonPrimaryText}>{t('continue')}</Text>
        </Pressable>

        <View className='flex-row justify-start items-center'>
          <Pressable
            className='flex-start'
            style={[generalStyle.prompt, Platform.OS === 'web' && hovered ? generalStyle.boldUnderlineText : null]}
            onPress={handleBack}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <StyledText style={generalStyle.link}>{t('back')}</StyledText>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default ForgetPasswordScreen
