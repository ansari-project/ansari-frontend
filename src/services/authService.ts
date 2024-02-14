import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types'

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
    const error = await response.json()
    throw new Error(error.detail || error.error || error.message || 'Registration failed')
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

async function logout(token: string): Promise<void> {
  const response = await fetch(`${API_URL}/users/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-mobile-ansari': 'ANSARI',
    },
  })

  if (!response.ok) {
    // Handle HTTP errors
    console.error(`HTTP error! status: ${response.status}`)
  } else {
    console.log(`Response is ${response}`)
  }
}

export default {
  register,
  login,
  logout,
}
