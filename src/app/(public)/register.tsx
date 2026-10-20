import React from 'react'
import { Redirect } from 'expo-router'

/**
 * RegisterScreen Component.
 * Account creation is disabled: this version of Ansari is being retired.
 * Any direct or bookmarked link to /register is sent to the login screen.
 */
const RegisterScreen: React.FC = () => {
  return <Redirect href='/login' />
}

export default RegisterScreen
