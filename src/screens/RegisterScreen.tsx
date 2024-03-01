import { EyeIcon } from '@endeavorpal/assets'
import { BackgroundImage } from '@endeavorpal/components'
import { useDirection, useRedirect } from '@endeavorpal/hooks'
import { AppDispatch, register } from '@endeavorpal/store'
import { RegisterRequest } from '@endeavorpal/types'
import { useRegisterSchema } from '@endeavorpal/validation'
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
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
interface RegisterFormValues {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
}

const RegisterScreen: React.FC = () => {
  useRedirect('/', '/register')
  const { t } = useTranslation('register')
  const dispatch = useDispatch<AppDispatch>()
  const { isRTL } = useDirection()
  const navigate = useNavigate()
  const registerSchema = useRegisterSchema()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [hovered, setHovered] = useState<boolean>(false)

  const initialValues: RegisterFormValues = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  }

  const handleSubmit = (values: RegisterFormValues, formikHelpers: FormikHelpers<RegisterFormValues>) => {
    formikHelpers.setSubmitting(true)
    setErrorMessage(null)
    const registerRequest: RegisterRequest = {
      email: values.email,
      password: values.password,
      // eslint-disable-next-line camelcase
      first_name: values.firstName,
      // eslint-disable-next-line camelcase
      last_name: values.lastName,
    }
    dispatch(register(registerRequest))
      .unwrap()
      .then((response) => {
        console.log(response)
        if (response.status === 'error') {
          setErrorMessage(response.message || t('registerFailure'))
        } else {
          navigate('/login?s=' + t('registerSuccess'))
        }
      })
      .catch((error) => {
        formikHelpers.setSubmitting(false)
        setErrorMessage(error.message || t('registerFailure'))
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

  return (
    <>
      <BackgroundImage />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.title}>{t('title')}</Text>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object(registerSchema)}
          onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
        >
          {({ handleChange, handleBlur, handleSubmit, submitForm, touched, values, isSubmitting, errors }) => (
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
              {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <TextInput
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, submitForm)}
                value={values.firstName}
                placeholder={t('firstName')}
                style={[styles.input, isRTL && styles.textAlignRight]}
                autocomplete='off'
              />
              {touched.firstName && errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

              <TextInput
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, submitForm)}
                value={values.lastName}
                placeholder={t('lastName')}
                style={[styles.input, isRTL && styles.textAlignRight]}
                autocomplete='off'
              />
              {touched.lastName && errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

              <View style={styles.passwordInputContainer}>
                <TextInput
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, submitForm)}
                  value={values.password}
                  placeholder={t('password')}
                  secureTextEntry={!passwordVisible}
                  style={[styles.input, isRTL && styles.textAlignRight]}
                />
                <Pressable style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
                  <EyeIcon name={passwordVisible ? 'eye-slash' : 'eye'} height={16} width={16} stroke='gray' />
                </Pressable>
              </View>
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <View style={styles.passwordInputContainer}>
                <TextInput
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  onKeyPress={(event: NativeSyntheticEvent<TextInput>) => handleKeyPress(event, submitForm)}
                  value={values.confirmPassword}
                  placeholder={t('confirmPassword')}
                  secureTextEntry={!passwordVisible}
                  style={[styles.input, isRTL && styles.textAlignRight]}
                />
                <Pressable style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
                  <EyeIcon name={passwordVisible ? 'eye-slash' : 'eye'} height={16} width={16} stroke='gray' />
                </Pressable>
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

              <Pressable
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>{isSubmitting ? t('registering') : t('register')}</Text>
              </Pressable>

              <Text
                style={[
                  styles.loginPrompt,
                  isRTL ? styles.textAlignLeft : styles.textAlignRight,
                  Platform.OS === 'web' && hovered ? styles.boldText : null,
                ]}
              >
                {t('alreadyHaveAccount')}
                <Text
                  style={[styles.loginLink, isRTL && { marginRight: 10 }]}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  onPress={() => navigate('/login')}
                >
                  {t('loginHere')}
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
        height: '100vh',
        position: 'relative',
        zIndex: 1,
        color: '#ffffff',
        backgroundColor: 'rgba(8, 37, 33, 0.8)', // #082521
        width: '100%',
        minWidth: 420,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 3,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      },
      default: {
        flex: 1,
        justifyContent: 'center',
        addingHorizontal: 16,
        paddingVertical: 12,
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
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginVertical: 10,
    borderRadius: 4,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  passwordInputContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 24,
  },
  button: {
    backgroundColor: '#08786b',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
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
    textWrap: 'balance',
  },
  loginPrompt: {
    textAlign: 'right',
    marginTop: 10,
    color: 'white',
  },
  loginLink: {
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

export default RegisterScreen
