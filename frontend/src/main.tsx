import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import keycloak from './auth/keycloak.ts'

const root = createRoot(document.getElementById('root')!)

root.render(
  <main className="app-shell">
    <section className="empty-state" role="status"><p>ログイン状態を確認しています…</p></section>
  </main>,
)

keycloak.init({ onLoad: 'check-sso' }).then(() => {
  root.render(
    <StrictMode>
      <App authenticated={keycloak.authenticated} />
    </StrictMode>,
  )
}).catch((error: unknown) => {
  console.error('認証サービスの初期化に失敗しました', error)
  root.render(
    <main className="app-shell">
      <section className="card empty-state" role="alert">
        <h1>ログイン状態を確認できませんでした</h1>
        <p>認証サービスが利用できないか、接続設定に問題があります。<br />サービスの起動状態と接続先を確認して、もう一度お試しください。</p>
        <button className="button button-primary" onClick={() => window.location.reload()}>再読み込み</button>
      </section>
    </main>,
  )
})
