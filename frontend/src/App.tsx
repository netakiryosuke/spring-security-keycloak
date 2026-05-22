import { AuthProvider } from './auth/AuthProvider'
import UserDashboard from './feature/user/UserDashboard'

export default function App() {
  return (
    <AuthProvider>
      <UserDashboard />
    </AuthProvider>
  )
}
