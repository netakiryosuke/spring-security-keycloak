import { AuthProvider } from './auth/AuthProvider'
import UserDashboard from './feature/user/UserDashboard'

interface Props {
  authenticated: boolean
}

export default function App({ authenticated }: Props) {
  return (
    <AuthProvider authenticated={authenticated}>
      <UserDashboard />
    </AuthProvider>
  )
}
