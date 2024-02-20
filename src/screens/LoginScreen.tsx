// src\screens\LoginScreen.tsx
import { BackgroundImage } from '@endeavorpal/components'
import { useDirection, useRedirect } from '@endeavorpal/hooks'
import { AppDispatch, login } from '@endeavorpal/store'
import { LoginRequest } from '@endeavorpal/types'
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
import { useDispatch } from 'react-redux'
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
  const { isRTL } = useDirection()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
    <>
      <BackgroundImage />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {successMessage && <Text style={{ color: 'white' }}>{successMessage}</Text>}
        <Text style={styles.title}>{t('title')}</Text>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object(loginSchema)}
          onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
        >
          {({ handleChange, handleBlur, handleSubmit, submitForm, values, isSubmitting, errors }) => (
            <View>
              <TextInput
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, submitForm)}
                value={values.email}
                placeholder={t('email')}
                style={[styles.input, isRTL && styles.textAlignRight]}
                autocomplete='off'
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <TextInput
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, submitForm)}
                value={values.password}
                placeholder={t('password')}
                secureTextEntry
                style={[styles.input, isRTL && styles.textAlignRight]}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

              <Pressable
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>{isSubmitting ? t('submitting') : t('submit')}</Text>
              </Pressable>

              <Text style={[styles.registerPrompt, isRTL ? styles.textAlignLeft : styles.textAlignRight]}>
                {t('dontHaveAccount')}
                <Text style={[styles.registerLink, isRTL && { marginRight: 10 }]} onPress={() => navigate('/register')}>
                  {t('register')}
                </Text>
              </Text>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      web: {
        position: 'relative',
        zIndex: 1,
        color: '#ffffff',
        backgroundColor: '#082521',
        width: '100%',
        minWidth: 420,
        paddingHorizontal: 16,
        paddingVertical: 24,
        borderRadius: 3,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      },
      default: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#F2F2F2',
      },
    }),
  },
  title: {
    ...Platform.select({
      web: {
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 24,
        fontWeight: 500,
        color: 'darkorange',
      },
      default: {
        fontSize: 24,
        fontWeight: 500,
        marginBottom: 24,
        textAlign: 'center',
        color: 'darkorange',
      },
    }),
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginVertical: 10,
    borderRadius: 4,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: '#08786b',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    maxWidth: 100,
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#dddddd',
  },
  errorText: {
    color: 'darkorange',
    marginBottom: 10,
  },
  registerPrompt: {
    textAlign: 'right',
    marginTop: 10,
    color: 'white',
  },
  registerLink: {
    color: 'darkorange',
    textDecorationLine: 'underline',
    marginLeft: 10,
  },
  textAlignRight: {
    textAlign: 'right',
  },
  textAlignLeft: {
    textAlign: 'left',
  },
  // ... other styles as needed
})

export default LoginScreen
