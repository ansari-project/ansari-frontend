import { LogoIcon } from '@/components/svg'
import { useDirection, useGuest, useScreenInfo } from '@/hooks'
import { AppDispatch, RootState, login } from '@/store'
import { LoginRequest } from '@/types'
import { createGeneralThemedStyles } from '@/utils'
import { useLoginSchema } from '@/validation'
import { Formik, FormikHelpers } from 'formik'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Keyboard,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useLocalSearchParams } from 'expo-router'
import * as Yup from 'yup'
import StyledText from '@/components/StyledText'

const LoginScreen: React.FC = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const successMessage = params.s || null

  const { t } = useTranslation('login')
  const loginSchema = useLoginSchema()
  const dispatch = useDispatch<AppDispatch>()
  const { guestLoading, handleGuestLogin } = useGuest()
  const { isRTL } = useDirection()
  const { isSmallScreen, width } = useScreenInfo()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [hovered, setHovered] = useState<number>(0)
  const theme = useSelector((state: RootState) => state.theme.theme)

  // Styles
  const generalStyle = createGeneralThemedStyles(theme, isRTL, isSmallScreen, width)
  const styles = StyleSheet.create({
    forgetLink: { ...generalStyle.link, marginLeft: 10, fontFamily: 'Inter' },
    successText: { color: theme.hoverColor, marginBottom: 16, alignSelf: 'center' },
  })

  const handleSubmit = (values: LoginRequest, formikHelpers: FormikHelpers<LoginRequest>) => {
    Keyboard.dismiss()
    formikHelpers.setSubmitting(true)
    setErrorMessage(null)
    dispatch(login(values))
      .unwrap()
      .then((response) => {
        if (response.status === 'error') {
          setErrorMessage(response.message || t('loginFailed'))
        } else {
          router.push('/')
        }
      })
      .catch((error) => {
        formikHelpers.setSubmitting(false)
        setErrorMessage(error.message || t('loginFailed'))
      })
      .finally(() => {
        formikHelpers.setSubmitting(false)
      })
  }

  const handleKeyPress = (event: NativeSyntheticEvent<TextInput>, submitForm: () => Promise<void>): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      submitForm()
    }
  }

  const initialValues: LoginRequest = {
    email: '',
    password: '',
  }

  return (
    <KeyboardAvoidingView style={[generalStyle.formContainer]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={generalStyle.form}>
        <View className='items-center py-2'>
          <LogoIcon fill={theme.iconFill} width={52} height={52} />
        </View>
        {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
        <StyledText variant='h2' color='primary' className='mb-6'>
          {t('title')}
        </StyledText>
        <Formik
          initialValues={initialValues}
          validateOnChange={false}
          validationSchema={Yup.object(loginSchema)}
          onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
        >
          {({ handleChange, handleBlur, handleSubmit, submitForm, touched, values, isSubmitting, errors }) => (
            <View>
              <TextInput
                id='email'
                name='email'
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, submitForm)}
                value={values.email}
                placeholder={t('email')}
                style={[generalStyle.input]}
                placeholderTextColor={theme.inputColor}
                autoCapitalize='none'
                autoComplete='username'
                autoCorrect={false}
                inputMode='email'
              />
              {touched.email && errors.email && <Text style={generalStyle.errorText}>{errors.email}</Text>}

              <TextInput
                id='password'
                name='password'
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, submitForm)}
                value={values.password}
                placeholder={t('password')}
                placeholderTextColor={theme.inputColor}
                secureTextEntry
                style={[generalStyle.input]}
                autoComplete='current-password'
              />
              {touched.password && errors.password && <Text style={generalStyle.errorText}>{errors.password}</Text>}

              {errorMessage && <Text style={generalStyle.errorText}>{errorMessage}</Text>}

              <View className='flex-row justify-end' style={generalStyle.prompt}>
                <Pressable
                  onMouseEnter={() => setHovered(1)}
                  onMouseLeave={() => setHovered(0)}
                  onPress={() => router.push('/forgot-password')}
                >
                  <Text
                    style={[generalStyle.link, Platform.OS === 'web' && hovered === 1 ? generalStyle.boldText : null]}
                  >
                    {t('forgetPassword')}
                  </Text>
                </Pressable>
              </View>

              <Pressable
                style={[generalStyle.buttonPrimary, isSubmitting && generalStyle.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={[generalStyle.buttonPrimaryText, isSubmitting && generalStyle.buttonTextDisabled]}>
                  {isSubmitting ? t('submitting') : t('submit')}
                </Text>
              </Pressable>

              <Pressable
                style={[generalStyle.buttonSecondary, guestLoading && generalStyle.buttonDisabled]}
                onPress={handleGuestLogin}
                disabled={guestLoading}
              >
                <Text style={[generalStyle.buttonSecondaryText, guestLoading && generalStyle.buttonTextDisabled]}>
                  {guestLoading ? t('submitting') : t('guestLogin')}
                </Text>
              </Pressable>

              <View
                className='flex-row justify-end'
                style={[generalStyle.prompt, Platform.OS === 'web' && hovered === 2 ? generalStyle.boldText : null]}
              >
                <StyledText style={generalStyle.primaryColorText}>{t('dontHaveAccount')}</StyledText>
                <Pressable
                  onMouseEnter={() => setHovered(2)}
                  onMouseLeave={() => setHovered(0)}
                  onPress={() => router.push('/register')}
                >
                  <StyledText style={generalStyle.link}>{t('register')}</StyledText>
                </Pressable>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen
