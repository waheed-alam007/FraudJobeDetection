import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // In development, proxy /api requests to the backend so the browser
  // sees everything as same-origin (no cross-origin fetch/preflight).
  // Set BACKEND_URL in .env if your backend runs on a non-default port.
  const backendTarget = env.BACKEND_URL || 'http://localhost:9000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },
  }
})