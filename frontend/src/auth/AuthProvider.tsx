import { createContext, useContext, ReactNode } from 'react'
import keycloak from './keycloak'

type AuthContextType = {
  username: string | undefined
  isAdmin: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const username = keycloak.tokenParsed?.preferred_username
  const isAdmin = keycloak.hasRealmRole('ADMIN')
  const logout = () => keycloak.logout({ redirectUri: import.meta.env.VITE_APP_URL })

  return (
    <AuthContext.Provider value={{ username, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}