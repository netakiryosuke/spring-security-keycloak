import { useState } from 'react'
import { useAuth } from '../../auth/AuthProvider'
import { findMyProfile, findAllUsers } from './api'
import type { User } from './type'
import ErrorMessage from '../../component/ErrorMessage'

export default function UserDashboard() {
  const { username, isAdmin, logout } = useAuth()
  const [result, setResult] = useState<User | User[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFindMyProfile = async () => {
    setError(null)
    try {
      setResult(await findMyProfile())
    } catch (e: any) {
      setError(`エラー: ${e.response?.status} ${e.response?.data?.title ?? ''}`)
    }
  }

  const handleFindAll = async () => {
    setError(null)
    try {
      setResult(await findAllUsers())
    } catch (e: any) {
      setError(`エラー: ${e.response?.status} ${e.response?.data?.title ?? ''}`)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.25rem' }}>My App</h1>
        <button onClick={logout}>logout</button>
      </div>

      <p>ようこそ、<strong>{username}</strong> さん</p>

      <div style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0' }}>
        <button onClick={handleFindMyProfile}>
          自分の情報を照会
        </button>
        <button
          onClick={handleFindAll}
          disabled={!isAdmin}
          style={{ opacity: isAdmin ? 1 : 0.4, cursor: isAdmin ? 'pointer' : 'not-allowed' }}
        >
          全ユーザーを表示
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {result && (
        <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
