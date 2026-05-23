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

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        {/* グローバルCSSのh1マージン(32px)を打ち消す */}
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

      <div style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0' }}>
        <button onClick={handleFindMyProfile}>
          自分の情報を照会
        </button>
        <button onClick={handleFindAll}>
          全ユーザーを表示
        </button>
      </div>

      {/* error/resultが出現してもボタン位置がずれないよう領域を確保 */}
      <div style={{ minHeight: '3rem' }}>
        {error && <ErrorMessage message={error} />}

        {result && (
          <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '4px', overflow: 'auto', margin: 0 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}