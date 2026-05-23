import { createContext, useContext, type ReactNode } from 'react'
import keycloak from './keycloak'

interface AuthContextType {
  authenticated: boolean
  username: string | undefined
  isAdmin: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

interface Props {
  authenticated: boolean
  children: ReactNode
}

export const AuthProvider = ({ authenticated, children }: Props) => {
  const username = keycloak.tokenParsed?.preferred_username
  const isAdmin = keycloak.hasRealmRole('ADMIN')
  const login = () => keycloak.login()
  const logout = () => keycloak.logout({ redirectUri: import.meta.env.VITE_APP_URL })

  return (
    <AuthContext.Provider value={{ authenticated, username, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}