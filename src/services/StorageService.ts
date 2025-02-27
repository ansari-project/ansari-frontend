import AsyncStorage from '@react-native-async-storage/async-storage'

const ACCESS_TOKEN_KEY = 'ac-at'
const REFRESH_TOKEN_KEY = 'ac-rt'

class StorageService {
  async saveTokens(accessToken?: string, refreshToken?: string): Promise<void> {
    try {
      if (accessToken) await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken)

      if (refreshToken) await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    } catch (error) {
      console.error('Error storing items:', error)
    }
  }

  async getTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
    try {
      const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY)
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY)
      return { accessToken, refreshToken }
    } catch (error) {
      console.error('Error retrieving item:', error)
      return { accessToken: null, refreshToken: null }
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(ACCESS_TOKEN_KEY)
    } catch (error) {
      console.error('Error retrieving item:', error)
      return null
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY)
    } catch (error) {
      console.error('Error retrieving item:', error)
      return null
    }
  }

  async removeTokens(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN_KEY)
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY)
      // Legacy items
      await AsyncStorage.removeItem('au')
      await AsyncStorage.removeItem('ek')
    } catch (error) {
      console.error('Error removing items:', error)
    }
  }
}

export default StorageService
