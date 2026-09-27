// Docker Compose を使わず Vite を起動した場合も、同じローカル環境へ接続する。
export const appConfig = {
  keycloakUrl: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  keycloakRealm: import.meta.env.VITE_KEYCLOAK_REALM || 'my-app',
  keycloakClientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'react-client',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
}
