import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@mocks': path.resolve(__dirname, './src/mocks')
    },
  },
  server: {
    proxy: {
      '/api/v1': {
        target: 'https://gigachat.devices.sberbank.ru',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
