import axios from 'axios'
import keycloak from '../auth/keycloak'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

apiClient.interceptors.request.use(async (config) => {
  if (keycloak.authenticated) {
    await keycloak.updateToken(30)
    config.headers.Authorization = `Bearer ${keycloak.token}`
  }
  // 確認のため、未認証の場合はAuthorizationヘッダなしでそのまま送る → バックエンドから401が返る
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error)
    }
    return Promise.reject(new Error('ネットワークエラーが発生しました'))
  }
)

export default apiClient
