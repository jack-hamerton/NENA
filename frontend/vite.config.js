import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
  },
  plugins: [react({
    babel: {
      presets: ['@babel/preset-typescript'],
    }
  })],
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
