import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Keycloak のリダイレクト先とずれないよう、使用中なら別ポートへ切り替えず終了する。
    strictPort: true,
  },
})
