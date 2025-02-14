import { ApplicationError } from '@/errors'
import { ResetPasswordResponse } from '@/types'

// UserService class definition
class UserService {
  // Base URL of the API
  private baseURL: string | undefined

  constructor() {
    this.baseURL = process.env.EXPO_PUBLIC_API_V2_URL
  }

  private createHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'X-Mobile-Ansari': 'ANSARI',
    }
  }

  // Method to request a password reset
  async requestPasswordReset(email: string): Promise<ResetPasswordResponse> {
    // Constructing the URL
    const url = `${this.baseURL}/request_password_reset`

    try {
      // Using Fetch API to make the POST request
      const response = await fetch(url, {
        method: 'POST',
        headers: this.createHeaders(),
        body: JSON.stringify({ email }),
      })

      // Checking if the response is OK (status code in the range 200-299)
      if (!response.ok) {
        throw new ApplicationError('Failed to request password reset')
      }

      // Parsing the JSON response
      return await response.json()
    } catch (error) {
      console.error('Error requesting password reset:', error)
      throw error
    }
  }

  // Method to update the password
  async updatePassword(token: string, password: string): Promise<void> {
    // Constructing the URL
    const url = `${this.baseURL}/reset_password`

    try {
      // Using Fetch API to make the POST request
      const response = await fetch(url, {
        method: 'POST',
        headers: this.createHeaders(),
        body: JSON.stringify({
          // eslint-disable-next-line camelcase
          reset_token: token,
          // eslint-disable-next-line camelcase
          new_password: password,
        }),
      })

      // Checking if the response is OK (status code in the range 200-299)
      if (!response.ok) {
        throw new ApplicationError('Failed to update password')
      }

      // Parsing the JSON response
      return await response.json()
    } catch (error) {
      console.error('Error updating password:', error)
      throw new ApplicationError('Failed to update password: ' + (error instanceof Error && error.message))
    }
  }
}

// Exporting the UserService for use in other parts of the application
export const userService = new UserService() as UserService
