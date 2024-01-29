// src/screens/RegisterScreen.tsx
import React, { useState } from 'react'
// import { InputField, Button } from '../components'
import { AuthService } from '../services'

const RegisterScreen: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  setUsername('a@a.com')
  setPassword('a@a.com')

  const handleRegister = async () => {
    try {
      await AuthService.register(username, password)
      // Handle successful registration
    } catch (error) {
      // Handle registration error
    }
  }

  console.log(handleRegister)

  return (
    <div>
      {/* <InputField value={username} onChange={setUsername} placeholder='Username' />
      <InputField value={password} onChange={setPassword} placeholder='Password' type='password' />
      <Button title='Register' onClick={handleRegister} /> */}
    </div>
  )
}

export default RegisterScreen
