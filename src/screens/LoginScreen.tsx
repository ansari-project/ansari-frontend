import { BackgroundImage } from '@endeavorpal/components'
import { useDirection, useRedirect } from '@endeavorpal/hooks'
import { AppDispatch, login, guestLogin } from '@endeavorpal/store'
import { LoginRequest } from '@endeavorpal/types'
import { Helpers } from '@endeavorpal/utils'
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
  const [hovered, setHovered] = useState<number>(0)

  // Inside your LoginScreen component, add the following function for guest login

  const handleGuestLogin = () => {
    const { email, password } = Helpers.generateGuestCredentials()

    console.log('Guest credentials:', { email, password })

    dispatch(guestLogin())
      .unwrap()
      .then(() => {
        navigate('/') // Navigate to the home page or dashboard
      })
      .catch((error) => {
        console.error('Error logging in as guest:', error)
        // Handle error (e.g., show an error message)
      })
  }

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
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <BackgroundImage />
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
                id='email'
                name='email'
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, submitForm)}
                value={values.email}
                placeholder={t('email')}
                style={[styles.input, isRTL && styles.textAlignRight]}
                autocomplete='off'
                inputMode='email'
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <TextInput
                id='password'
                name='password'
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

              <Text style={[styles.prompt, isRTL ? styles.textAlignLeft : styles.textAlignRight]}>
                <Text
                  style={[
                    styles.forgetLink,
                    isRTL && { marginRight: 10 },
                    Platform.OS === 'web' && hovered === 1 ? styles.boldText : null,
                  ]}
                  onMouseEnter={() => setHovered(1)}
                  onMouseLeave={() => setHovered(0)}
                  onPress={() => navigate('/forgot-password')}
                >
                  {t('forgetPassword')}
                </Text>
              </Text>

              <Pressable
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>{isSubmitting ? t('submitting') : t('submit')}</Text>
              </Pressable>

              <Pressable style={[styles.button, { backgroundColor: '#657786' }]} onPress={handleGuestLogin}>
                <Text style={styles.buttonText}> {t('guestLogin')}</Text>
              </Pressable>

              <Text
                style={[
                  styles.prompt,
                  isRTL ? styles.textAlignLeft : styles.textAlignRight,
                  Platform.OS === 'web' && hovered === 2 ? styles.boldText : null,
                ]}
              >
                {t('dontHaveAccount')}
                <Text
                  style={[styles.registerLink, isRTL && { marginRight: 10 }]}
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
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      web: {
        flex: 1,
        position: 'relative',
        zIndex: 1,
        color: '#ffffff',
        backgroundColor: 'rgba(8, 37, 33, 0.8)', // #082521
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
        color: '#ffffff',
      },
      default: {
        fontSize: 24,
        fontWeight: 500,
        marginBottom: 24,
        textAlign: 'center',
        color: '#ffffff',
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
    marginVertical: 10,
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
  prompt: {
    textAlign: 'right',
    marginTop: 10,
    color: 'white',
  },
  registerLink: {
    color: 'darkorange',
    textDecorationLine: 'none',
    marginLeft: 10,
    ...Platform.select({
      web: {
        ':hover': {
          color: 'darkorange',
          fontWeight: 'bold',
        },
      },
    }),
  },
  forgetLink: {
    color: '#fff',
    textDecorationLine: 'none',
    marginLeft: 10,
    ...Platform.select({
      web: {
        ':hover': {
          color: '#fff',
          fontWeight: 'bold',
        },
      },
    }),
  },
  textAlignRight: {
    textAlign: 'right',
  },
  textAlignLeft: {
    textAlign: 'left',
  },
  boldText: {
    fontWeight: 'bold',
  },
  // ... other styles as needed
})

export default LoginScreen
