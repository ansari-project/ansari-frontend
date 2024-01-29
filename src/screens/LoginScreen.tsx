import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import AuthService from '../services/authService'
import { useLoginSchema } from '../validation'
// import { Button } from 'components' // Assume this is a wrapper for a native button
import { useNavigate } from 'react-router-dom'
import '../styles/loginScreen.scss'
import { LoginRequest, LoginResponse } from '../types'

const LoginScreen: React.FC = () => {
  const { t } = useTranslation('login')
  const loginSchema = useLoginSchema()
  const navigate = useNavigate()

  const initialValues: LoginRequest = {
    email: '',
    password: '',
  }

  const successMessage = '' // location.state?.successMessage
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (values: LoginRequest, formikHelpers: FormikHelpers<LoginRequest>) => {
    try {
      const response: LoginResponse = await AuthService.login(values)
      if (response?.status === 'error') {
        setErrorMessage(response?.message || t('loginFailed'))
      } else {
        setErrorMessage(null)
        // Handle successful login
        navigate('/home') // Navigate to the home screen or dashboard
      }
    } catch (error) {
      setErrorMessage(t('unexpectedError'))
    } finally {
      formikHelpers.setSubmitting(false)
      // formikHelpers.resetForm()
    }
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
          onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
        >
          {({ isSubmitting }) => (
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

              <button type='submit' disabled={isSubmitting} className='submit-button'>
                {t('submit')}
              </button>
              {/* <Button type='submit' disabled={isSubmitting}>
          {t('submit')}
        </Button> */}

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
