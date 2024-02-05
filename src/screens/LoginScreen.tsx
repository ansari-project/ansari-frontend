import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, Text } from 'react-native'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { login } from '../store/actions/authActions'
import { AppDispatch } from '../store/store'
import '../styles/loginScreen.scss'
import { LoginRequest } from '../types'
import { useLoginSchema } from '../validation'
import { useRedirect } from '../hooks'

const LoginScreen: React.FC = () => {
  useRedirect('/chat', '/login')
  const { t } = useTranslation('login')
  const loginSchema = useLoginSchema()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const initialValues: LoginRequest = {
    email: '',
    password: '',
  }

  const successMessage = useLocation().state?.successMessage || ''
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = (values: LoginRequest, formikHelpers: FormikHelpers<LoginRequest>) => {
    formikHelpers.setSubmitting(true)
    setErrorMessage(null)
    dispatch(login(values))
      .unwrap() // Unwrap the payload from the fulfilled action
      .then((response) => {
        if (response.status === 'error') {
          setErrorMessage(response.message || t('loginFailed'))
        } else {
          // Handle successful login
          // navigate('/home')
        }
      })
      .catch((error) => {
        setErrorMessage(error.message || t('loginFailed'))
      })
      .finally(() => {
        formikHelpers.setSubmitting(false)
      })
  }

  return (
    <>
      <div
        className='background-image'
        style={{
          ...(window.innerWidth < 768 && { backgroundSize: 'cover' }),
        }}
      />
      <div className='login-container'>
        <h1>{t('title')}</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object(loginSchema)}
          onSubmit={(values, formikHelpers) => {
            handleSubmit(values, formikHelpers)
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <Form className='login-form'>
              <div>{successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}</div>
              {/* <div className='form-field'> */}
              <Field className='form-field' name='email' type='email' placeholder={t('email')} autoComplete='off' />
              {/* </div> */}
              <ErrorMessage name='email' component='div' className='error-message' />
              {/* <div className='form-field'> */}
              <Field className='form-field' name='password' type='password' placeholder={t('password')} />
              {/* </div> */}
              <ErrorMessage name='password' component='div' className='error-message' />
              {/* Displaying the error message */}
              {errorMessage && (
                <div className='error-message' style={{ marginBottom: '10px' }}>
                  {errorMessage}
                </div>
              )}
              <Pressable style={{ width: 'fit-content' }} type='submit' disabled={isSubmitting} onPress={handleSubmit}>
                <Text
                  style={{
                    width: '100%',
                    maxWidth: 100,
                    backgroundColor: isSubmitting ? '#dddddd' : '#ffffff',
                    color: '#08786b',
                    borderRadius: 2,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    fontWeight: 'bold',
                    fontSize: 16,
                    margin: 8,
                    textAlign: 'center',
                  }}
                >
                  {isSubmitting ? t('submitting') : t('submit')}
                </Text>
              </Pressable>

              <div className='register-prompt' style={{ textAlign: 'right' }}>
                {t('dontHaveAccount')}{' '}
                <a href='#' className='register-link' onClick={() => navigate('/register')}>
                  {t('register')}
                </a>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}

export default LoginScreen
