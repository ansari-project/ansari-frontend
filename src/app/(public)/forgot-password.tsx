import { DoubleCheckIcon, LogoIcon } from '@/components/svg'
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
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useSelector } from 'react-redux'
import { useRouter } from 'expo-router'
import * as Yup from 'yup'

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
  const styles = StyleSheet.create({
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.primaryColor,
      textAlign: isRTL ? 'right' : 'left',
      fontFamily: 'Inter',
    },
    description: {
      fontSize: 16,
      marginBottom: 20,
      color: theme.primaryColor,
      fontFamily: 'Inter',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
  })

  if (emailState.submitted) {
    return (
      <View style={generalStyle.formContainer}>
        <LogoIcon fill={theme.iconFill} width={52} height={52} />
        <View style={generalStyle.form}>
          <Text style={[styles.title, { textAlign: 'center', width: '100%' }]}>{t('forgotYourPassword')}</Text>
          <View style={{ alignItems: 'center', width: '100%' }}>
            <DoubleCheckIcon width='50' />
          </View>

          <Text style={styles.description}>{t('forgotSuccessMessage')}</Text>
          <View style={styles.buttonContainer}>
            <Text
              style={[
                generalStyle.prompt,
                { alignItems: 'flex-start' },
                Platform.OS === 'web' && hovered ? styles.boldUnderlineText : null,
              ]}
              onPress={handleBack}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Text style={generalStyle.link}>{t('login')}</Text>
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={generalStyle.formContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LogoIcon fill={theme.iconFill} width={52} height={52} />
      <View style={generalStyle.form}>
        <Text style={styles.title}>{t('forgotYourPassword')}</Text>
        <Text style={styles.description}>{t('forgotMessage')}</Text>
        <TextInput
          id='email'
          name='email'
          style={generalStyle.input}
          onChangeText={handleEmailChange}
          onBlur={async (event: NativeSyntheticEvent<TextInput>) => await validateEmail(event.target.value)}
          onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, handleSubmit)}
          value={emailState.email}
          placeholder={t('yourEmail')}
          autoCapitalize='none'
          autoComplete='username'
          autoCorrect={false}
          inputMode='email'
        />
        {errors.email && <Text style={generalStyle.errorText}>{errors.email}</Text>}
        <Pressable style={generalStyle.buttonPrimary} onPress={handleSubmit}>
          <Text style={generalStyle.buttonPrimaryText}>{t('continue')}</Text>
        </Pressable>

        <View style={styles.buttonContainer}>
          <Text
            style={[
              generalStyle.prompt,
              { alignItems: 'flex-start' },
              Platform.OS === 'web' && hovered ? generalStyle.boldUnderlineText : null,
            ]}
            onPress={handleBack}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Text style={generalStyle.link}>{t('back')}</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default ForgetPasswordScreen
