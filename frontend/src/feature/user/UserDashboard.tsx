import { useState } from 'react'
import { isAxiosError } from 'axios'
import { useAuth } from '../../auth/AuthProvider'
import { findMyProfile, findAllUsers } from './api'
import type { User, UserSummary } from './type'
import ErrorMessage from '../../component/ErrorMessage'

const PETAL_COUNT = 14
const TAGLINE_LINES = ['着飾らないあなたから、', '新しいつながりを。'] as const
const TAGLINE = TAGLINE_LINES.join('')
const REGISTRATION_MESSAGE = 'よりあいは、ただいま招待制です。\n招待状を受け取った方のみご登録いただけます。'

const MOMENT_CARDS = [
  {
    className: 'moment-flowers',
    height: 700,
    posts: [
      { image: 'flowers.jpg', label: 'MY LITTLE JOYS', note: '帰り道、春を見つけた。' },
      { image: 'walk.jpg', label: 'A SMALL DETOUR', note: '今日は、少し遠回り。' },
    ],
  },
  {
    className: 'moment-coffee',
    height: 520,
    posts: [
      { image: 'coffee.jpg', label: 'SLOW SUNDAY', note: '待ち合わせより、少し早く。' },
      { image: 'reading.jpg', label: 'ONE MORE PAGE', note: 'もう一章だけ、読んでいこう。' },
    ],
  },
] as const

function MomentCollage() {
  return (
    <div className="welcome-collage">
      <div aria-hidden="true">
        {MOMENT_CARDS.map((card, cardIndex) => (
          <div className={`moment-card ${card.className}`} key={card.className}>
            {card.posts.map(post => (
              <div className="moment-slide" key={post.image}>
                <p className="moment-label">{post.label}<span>0{cardIndex + 1}</span></p>
                <img src={`/images/${post.image}`} alt="" width="600" height={card.height} />
                <p className="moment-note">{post.note}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const STATUS_MESSAGES: Record<number, string> = {
  401: 'ログインの有効期限が切れています。もう一度ログインしてください。',
  403: 'この情報を表示する権限がありません。',
  404: 'プロフィールが見つかりません。',
  500: '情報を取得できませんでした。時間をおいてお試しください。',
}

const resolveErrorMessage = (error: unknown): string => {
  if (isAxiosError(error) && error.response) {
    return STATUS_MESSAGES[error.response.status] ?? '情報を取得できませんでした。'
  }
  return error instanceof Error ? error.message : 'エラーが発生しました。'
}

function Profile({ user }: { user: User }) {
  return (
    <div className="profile-layout">
      <section className="card profile-card" aria-labelledby="profile-name">
        <div className="profile-banner" aria-hidden="true" />
        <div className="profile-content">
          <div className="avatar" aria-hidden="true">{user.username.slice(0, 1).toUpperCase()}</div>
          <p className="eyebrow">MY PROFILE</p>
          <h2 id="profile-name">{user.username}</h2>
          <p className="profile-subtitle">{user.residence} · {user.occupation}</p>
          <div className="introduction">
            <h3>自己紹介</h3>
            <p>{user.introduction}</p>
          </div>
        </div>
      </section>
      <div className="profile-details">
        <section className="card details-card" aria-labelledby="account-heading">
          <p className="eyebrow">ACCOUNT</p>
          <h2 id="account-heading">登録情報</h2>
          <dl className="account-fields">
            <div><dt>メールアドレス</dt><dd>{user.email}</dd></div>
            <div><dt>生年月日</dt><dd>{user.birthDate}</dd></div>
            <div><dt>居住地</dt><dd>{user.residence}</dd></div>
            <div><dt>職業</dt><dd>{user.occupation}</dd></div>
            <div><dt>会員ID</dt><dd className="member-id">{user.id}</dd></div>
          </dl>
        </section>
        <section className="card note-card" aria-labelledby="note-heading">
          <p className="eyebrow">PERSONAL NOTE</p>
          <h2 id="note-heading">自分だけのメモ</h2>
          <p className="note-message">{user.secretMessage}</p>
        </section>
      </div>
    </div>
  )
}

function MemberList({ users }: { users: UserSummary[] }) {
  return (
    <section className="card members-card" aria-labelledby="members-heading">
      <div className="members-heading">
        <h2 id="members-heading">登録会員</h2>
        <span className="count-badge">{users.length}人</span>
      </div>
      {users.length === 0 ? <p className="empty-message">登録されている会員はいません。</p> : (
        <div className="table-scroll" role="region" aria-label="登録会員一覧" tabIndex={0}>
          <table>
            <thead><tr><th scope="col">会員</th><th scope="col">メールアドレス</th><th scope="col">生年月日</th></tr></thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.username}</strong><span className="member-id">{user.id}</span></td>
                  <td>{user.email}</td>
                  <td className="birth-date">{user.birthDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default function UserDashboard() {
  const { authenticated, username, isAdmin, login, logout } = useAuth()
  const [result, setResult] = useState<User | UserSummary[] | null>(null)
  const [view, setView] = useState<'profile' | 'members'>('profile')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async (nextView: 'profile' | 'members', fetchData: () => Promise<User | UserSummary[]>) => {
    setView(nextView)
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      setResult(await fetchData())
    } catch (error: unknown) {
      setError(resolveErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand"><span className="brand-mark" aria-hidden="true">y.</span><span>よりあい<span className="brand-caption">{TAGLINE}</span></span></div>
        <div className="session-actions">
          {authenticated && (
            <div className="session-identity">
              {isAdmin && <span className="admin-badge">管理者モード</span>}
              <span className="session-name">{username}<span>さん</span></span>
            </div>
          )}
          <button className="button button-quiet" onClick={authenticated ? logout : login}>{authenticated ? 'ログアウト' : 'ログイン'}</button>
          {!authenticated && <button className="button button-primary" onClick={() => window.alert(REGISTRATION_MESSAGE)}>会員登録</button>}
        </div>
      </header>

      <main>
        {!authenticated ? (
          <section className="welcome" aria-labelledby="welcome-heading">
            <div className="welcome-petals" aria-hidden="true">
              {Array.from({ length: PETAL_COUNT }, (_, index) => <i key={index} />)}
            </div>
            <div className="welcome-copy">
              <p className="eyebrow">YORIAI — A LITTLE MORE YOU.</p>
              <h1 id="welcome-heading"><span>{TAGLINE_LINES[0]}</span><br /><span>{TAGLINE_LINES[1]}</span></h1>
              <p className="welcome-description">好きなことも、何気ない日常も。<br />そのままのあなたを、誰かが好きになる。<br />まずは、あなたのプロフィールから。</p>
              <button className="button button-primary" onClick={login}>ログインしてはじめる <span aria-hidden="true">↗</span></button>
            </div>
            <MomentCollage />
          </section>
        ) : (
          <>
            <div className="page-heading">
              <div><p className="eyebrow">{view === 'members' ? 'MEMBERS' : 'MY PAGE'}</p><h1>{view === 'members' ? '会員一覧' : 'マイプロフィール'}</h1><p className="page-description">{view === 'members' ? '登録されている会員の情報を確認できます。' : 'あなたらしさと、大切なことをここに。'}</p></div>
              <div className="page-actions">
                <button className="button button-primary" disabled={loading} onClick={() => load('profile', findMyProfile)}>自分の情報を照会</button>
                {isAdmin && <button className="button button-secondary" disabled={loading} onClick={() => load('members', findAllUsers)}>全ユーザーを表示</button>}
              </div>
            </div>
            {error && <ErrorMessage message={error} />}
            <div aria-busy={loading}>
              {loading && <div className="card empty-state" role="status"><span className="loading-dot" aria-hidden="true" /><p>情報を読み込んでいます…</p></div>}
              {!loading && !error && result === null && (
                <div className="card empty-state"><span className="empty-symbol" aria-hidden="true">✳</span><h2>あなたのプロフィールを確認しましょう</h2><p>「自分の情報を照会」を押すと、登録情報とメモを表示します。</p></div>
              )}
              {result !== null && (Array.isArray(result) ? <MemberList users={result} /> : <Profile user={result} />)}
            </div>
          </>
        )}
      </main>
      <footer className="site-footer"><span>よりあい</span><span>{TAGLINE}</span></footer>
    </div>
  )
}
