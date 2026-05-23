import { useState } from 'react'
import { useAuth } from '../../auth/AuthProvider'
import { findMyProfile, findAllUsers } from './api'
import type { User } from './type'
import ErrorMessage from '../../component/ErrorMessage'

const STATUS_MESSAGES: Record<number, string> = {
  401: '認証が必要です。ログインしてください',
  403: '認可に失敗しました。ログイン中のユーザーに権限がありません',
  404: 'リソースが見つかりません',
  500: 'サーバーエラーが発生しました',
}

const resolveErrorMessage = (e: any): string => {
  if (e.response) {
    const status: number = e.response.status
    const message = STATUS_MESSAGES[status] ?? 'エラーが発生しました'
    return `${status} - ${message}`
  }
  return e.message ?? 'エラーが発生しました'
}

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  padding: '0.25rem 0',
}

const labelStyle: React.CSSProperties = {
  color: '#888',
  minWidth: '5rem',
  flexShrink: 0,
}

function UserCard({ user, index, total }: { user: User; index: number; total: number }) {
  return (
    <div>
      {total > 1 && (
        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.4rem' }}>
          User {index + 1}
        </div>
      )}
      <div style={fieldStyle}>
        <span style={labelStyle}>id</span>
        <span style={{ wordBreak: 'break-all' }}>{user.id}</span>
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>username</span>
        <span>{user.username}</span>
      </div>
      <div style={fieldStyle}>
        <span style={labelStyle}>email</span>
        <span>{user.email}</span>
      </div>
      {index < total - 1 && (
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '0.75rem 0' }} />
      )}
    </div>
  )
}

export default function UserDashboard() {
  const { authenticated, username, login, logout } = useAuth()
  const [result, setResult] = useState<User | User[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFindMyProfile = async () => {
    setError(null)
    setResult(null)
    try {
      setResult(await findMyProfile())
    } catch (e: any) {
      setError(resolveErrorMessage(e))
    }
  }

  const handleFindAll = async () => {
    setError(null)
    setResult(null)
    try {
      setResult(await findAllUsers())
    } catch (e: any) {
      setError(resolveErrorMessage(e))
    }
  }

  const users: User[] = result === null ? [] : Array.isArray(result) ? result : [result]

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', width: '100%', maxWidth: '600px', margin: '0 auto', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h1 style={{ fontSize: '1.25rem', margin: 0 }}>My App</h1>
        {authenticated
          ? <button onClick={logout}>logout</button>
          : <button onClick={login}>login</button>
        }
      </div>

      {authenticated
        ? <p>ようこそ、<strong>{username}</strong> さん</p>
        : <p>ログインしていません</p>
      }

      <div style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0', justifyContent: 'center' }}>
        <button onClick={handleFindMyProfile}>
          自分の情報を照会
        </button>
        <button onClick={handleFindAll}>
          全ユーザーを表示
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {users.length > 0 && (
        <div style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '4px', fontSize: '0.9rem' }}>
          {users.map((user, i) => (
            <UserCard key={user.id} user={user} index={i} total={users.length} />
          ))}
        </div>
      )}
    </div>
  )
}