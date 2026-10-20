import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'




// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // loads .env files for this config only. Since the third argument is '',
  // ALL variables are loaded here, but only VITE_-prefixed ones ever reach the browser.
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env['API_PROXY_TARGET'] ?? 'http://127.0.0.1:3000';

  const proxy = {
    '/api': { target: apiTarget, changeOrigin: true }
  }

  return {
    plugins: [react()],
    server: { proxy },
    preview: { proxy }
  }
})
