import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import keycloak from './auth/keycloak.ts'

keycloak.init({ onLoad: 'check-sso' }).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App authenticated={keycloak.authenticated} />
    </StrictMode>,
  )
})
