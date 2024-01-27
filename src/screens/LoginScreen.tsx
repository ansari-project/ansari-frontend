// screens/LoginScreen.tsx
import React from 'react'
import InputField from '../components/InputField'
import Button from '../components/Button'
import { useTranslation } from 'react-i18next'

const LoginScreen: React.FC = () => {
  const { t } = useTranslation('login')

  return (
    <div>
      <h1>{t('title')}</h1>
      <InputField type='text' placeholder='Username' />
      <InputField type='password' placeholder='Password' />
      <Button
        title='Login'
        onClick={() => {
          /* Handle login */
        }}
      />
    </div>
  )
}

export default LoginScreen
