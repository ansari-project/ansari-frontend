import { createContext, useContext } from 'react'
import { useAuth } from '../hooks'

type AuthContextValue = {
  token: string | null
  isAuthenticated: boolean
}
const AuthContext = createContext<AuthContextValue>({
  token: null,
  isAuthenticated: false,
})

export const useAuthContext = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isAuthenticated } = useAuth()

  // You can include more authentication logic here
  // For example, refreshing tokens, handling login/logout

  const value = {
    token,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
