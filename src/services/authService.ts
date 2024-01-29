import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from 'types'

const API_URL = process.env.REACT_APP_API_V2_URL

const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Mobile-Ansari': 'ANSARI',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Registration failed')
  }

  return await response.json()
}

const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Mobile-Ansari': 'ANSARI',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return await response.json()
}

export default {
  register,
  login,
}
