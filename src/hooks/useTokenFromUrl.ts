import { useRouter, useLocalSearchParams } from 'expo-router'

export const useTokenFromUrl = () => {
  const router = useRouter()
  const { token } = useLocalSearchParams()
  if (!token) {
    router.push('/login')
  }
  return token
}
