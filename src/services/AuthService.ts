import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types'

class AuthService {
  baseURL: string | undefined

  constructor() {
    this.baseURL = process.env.EXPO_PUBLIC_API_V2_URL
  }
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${this.baseURL}/users/register`, {
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

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/users/login`, {
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

  async logout(accessToken: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/users/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-mobile-ansari': 'ANSARI',
      },
    })

    if (!response.ok) {
      // Handle HTTP errors
      console.error(`HTTP error! status: ${response.status}`)
    } else {
      // console.log(`Response is ${response}`)
    }
  }
}

export default AuthService
