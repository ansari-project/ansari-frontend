import { DoubleCheckIcon, EyeIcon, LogoIcon } from '@/components/svg'
import { ApplicationError } from '@/errors'
import { useDirection, useScreenInfo, useTokenFromUrl } from '@/hooks'
import { UserService } from '@/services'
import { RootState } from '@/store'
import { createGeneralThemedStyles } from '@/utils'
import { useRegisterSchema } from '@/validation'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useRouter } from 'expo-router'
import * as Yup from 'yup'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'

// TypeScript interface for the component's state
interface PasswordState {
  password: string
  confirmPassword: string
  submitted: boolean
}

const ResetPasswordScreen: React.FC = () => {
  const router = useRouter()
  const { t } = useTranslation('register')
  const { isRTL } = useDirection()
  const { isSmallScreen, width } = useScreenInfo()
  const token = useTokenFromUrl()
  const { password: passwordSchema, confirmPassword: confirmPasswordSchema } = useRegisterSchema()
  const [passwordState, setPasswordState] = useState<PasswordState>({
    password: '',
    confirmPassword: '',
    submitted: false,
  })
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; error?: string }>({})
  const [hovered, setHovered] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const theme = useSelector((state: RootState) => state.theme.theme)

  // Handles password and confirm password changes
  const handlePasswordChange = (field: keyof PasswordState, value: string) => {
    setPasswordState((prevState) => ({ ...prevState, [field]: value }))
  }

  // Submits the form after validation
  const handleSubmit = async () => {
    Keyboard.dismiss()
    setIsSubmitting(true)
    try {
      await validatePassword()
      if (!passwordState.password || Object.keys(errors).length !== 0) {
        throw new Error('Validation failed')
      }
      await UserService.updatePassword(String(token), passwordState.password)
      setPasswordState((prevState) => ({ ...prevState, submitted: true }))
    } catch (error) {
      const serviceErrors: { [key: string]: string } = {}
      if (error instanceof ApplicationError) {
        serviceErrors['error'] = error.message
      } else {
        serviceErrors['error'] = error instanceof Error ? error.message : 'An unexpected error occurred'
      }

      setErrors(serviceErrors)
      console.error('Error resetting password:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Validates password and confirmPassword fields
  const validatePassword = async () => {
    try {
      const validationSchema = Yup.object({ password: passwordSchema, confirmPassword: confirmPasswordSchema })
      await validationSchema.validate(
        { password: passwordState.password, confirmPassword: passwordState.confirmPassword },
        { abortEarly: false },
      )
      setErrors({})
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {}
        error.inner.forEach(({ path, message }) => {
          if (path) validationErrors[path] = message
        })
        setErrors(validationErrors)
      }
    }
  }

  // Navigates back to the login screen
  const handleBack = () => router.push('/login')

  // Styles
  const generalStyle = createGeneralThemedStyles(theme, isRTL, isSmallScreen, width)
  const styles = StyleSheet.create({
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.primaryColor,
    },
    description: {
      fontSize: 16,
      marginBottom: 20,
      color: theme.primaryColor,
    },
    passwordInputContainer: {
      position: 'relative',
      width: '100%',
    },
    passwordInputField: {
      justifyContent: 'center',
      width: '100%',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    iconContainer: {
      alignItems: 'center',
      width: '100%',
    },
    alignStart: {
      alignItems: 'flex-start',
    },
  })

  if (passwordState.submitted) {
    // Display success message after password reset
    return (
      <View style={generalStyle.formContainer}>
        <LogoIcon fill={theme.iconFill} width={52} height={52} />
        <View style={generalStyle.form}>
          <Text style={styles.title}>{t('passwordResetSuccess')}</Text>
          <View style={styles.iconContainer}>
            <DoubleCheckIcon width='50' />
          </View>
          <Text style={styles.description}>{t('passwordResetSuccessMessage')}</Text>

          <View style={styles.buttonContainer}>
            <Text
              style={[
                generalStyle.prompt,
                styles.alignStart,
                Platform.OS === 'web' && hovered ? generalStyle.boldUnderlineText : null,
              ]}
              onPress={handleBack}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Text style={generalStyle.link}>{t('loginHere')}</Text>
            </Text>
          </View>
        </View>
      </View>
    )
  }

  // Main reset password form
  return (
    <KeyboardAwareScrollView contentContainerStyle={generalStyle.formContainer} keyboardShouldPersistTaps='handled'>
      <LogoIcon fill={theme.iconFill} width={52} height={52} />
      <View style={generalStyle.form}>
        <Text style={styles.title}>{t('passwordReset')}</Text>
        {['password', 'confirmPassword'].map((field) => (
          <View key={field} style={styles.passwordInputContainer}>
            <View key={field} style={styles.passwordInputField}>
              <TextInput
                secureTextEntry={!passwordVisible}
                style={generalStyle.input}
                onChangeText={(value: string) => handlePasswordChange(field as keyof PasswordState, value)}
                onBlur={validatePassword}
                value={passwordState[field as keyof PasswordState]}
                placeholder={t(field)}
                autoCapitalize='none'
              />
              <Pressable onPress={() => setPasswordVisible(!passwordVisible)} style={generalStyle.eyeIcon}>
                <EyeIcon name={passwordVisible ? 'eye-slash' : 'eye'} height={16} width={16} stroke='gray' />
              </Pressable>
            </View>
            {errors[field as keyof typeof errors] && (
              <Text style={generalStyle.errorText}>{errors[field as keyof typeof errors]}</Text>
            )}
          </View>
        ))}

        {errors.error && <Text style={generalStyle.errorText}>{errors.error}</Text>}
        <Pressable
          style={[generalStyle.buttonPrimary, isSubmitting && generalStyle.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={[generalStyle.buttonPrimaryText, isSubmitting && generalStyle.buttonTextDisabled]}>
            {isSubmitting ? t('login:submitting') : t('continue')}
          </Text>
        </Pressable>
        <View style={styles.buttonContainer}>
          <Text
            style={[
              generalStyle.prompt,
              styles.alignStart,
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
    </KeyboardAwareScrollView>
  )
}

export default ResetPasswordScreen
