import { LogoIcon } from '@endeavorpal/assets'
import { useDirection, useGuest, useRedirect, useScreenInfo } from '@endeavorpal/hooks'
import { AppDispatch, RootState, login } from '@endeavorpal/store'
import { LoginRequest } from '@endeavorpal/types'
import { createGeneralThemedStyles } from '@endeavorpal/utils'
import { useLoginSchema } from '@endeavorpal/validation'
import { Formik, FormikHelpers } from 'formik'
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
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

const LoginScreen: React.FC = () => {
  const location = useLocation()
  const urlParams = new URLSearchParams(location.search)
  const successMessage = urlParams.get('s') || null
  useRedirect('/', '/login' + (urlParams.size ? `?${urlParams.toString()}` : ''))

  const navigate = useNavigate()
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
    title: {
      ...Platform.select({
        web: {
          textAlign: 'center',
          marginBottom: 24,
          fontSize: 24,
          fontWeight: 500,
          color: theme.primaryColor,
          fontFamily: 'Inter',
        },
        default: {
          fontSize: 24,
          fontWeight: 500,
          marginBottom: 24,
          textAlign: 'center',
          color: theme.primaryColor,
        },
      }),
    },
    forgetLink: { ...generalStyle.link, marginLeft: 10, fontFamily: 'Inter' },
    successText: { color: theme.hoverColor, marginBottom: 16, alignSelf: 'center' },
  })

  const handleSubmit = (values: LoginRequest, formikHelpers: FormikHelpers<LoginRequest>) => {
    formikHelpers.setSubmitting(true)
    setErrorMessage(null)
    dispatch(login(values))
      .unwrap()
      .then((response) => {
        if (response.status === 'error') {
          setErrorMessage(response.message || t('loginFailed'))
        } else {
          navigate('/')
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
    <KeyboardAvoidingView style={[generalStyle.formContainer]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LogoIcon fill={theme.iconFill} width={52} height={52} />
      <View style={generalStyle.form}>
        {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
        <Text style={styles.title}>{t('title')}</Text>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object(loginSchema)}
          onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
        >
          {({ handleChange, handleBlur, handleSubmit, submitForm, values, isSubmitting, errors }) => (
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
                autoCapitalize='none'
                autoComplete='username'
                autoCorrect={false}
                inputMode='email'
              />
              {errors.email && <Text style={generalStyle.errorText}>{errors.email}</Text>}

              <TextInput
                id='password'
                name='password'
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, submitForm)}
                value={values.password}
                placeholder={t('password')}
                secureTextEntry
                style={[generalStyle.input]}
                autoComplete='current-password'
              />
              {errors.password && <Text style={generalStyle.errorText}>{errors.password}</Text>}

              {errorMessage && <Text style={generalStyle.errorText}>{errorMessage}</Text>}

              <Text style={generalStyle.prompt}>
                <Text
                  style={[generalStyle.link, Platform.OS === 'web' && hovered === 1 ? generalStyle.boldText : null]}
                  onMouseEnter={() => setHovered(1)}
                  onMouseLeave={() => setHovered(0)}
                  onPress={() => navigate('/forgot-password')}
                >
                  {t('forgetPassword')}
                </Text>
              </Text>

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

              <Text
                style={[generalStyle.prompt, Platform.OS === 'web' && hovered === 2 ? generalStyle.boldText : null]}
              >
                {t('dontHaveAccount')}
                <Text
                  style={generalStyle.link}
                  onMouseEnter={() => setHovered(2)}
                  onMouseLeave={() => setHovered(0)}
                  onPress={() => navigate('/register')}
                >
                  {t('register')}
                </Text>
              </Text>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen
