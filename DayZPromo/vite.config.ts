import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://dayz-promo.ru',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify('/api'),
    'process.env.VITE_BASE_URL': JSON.stringify('https://dayz-promo.ru')
  },
  base: '/'
})
