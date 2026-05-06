import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    proxy: process.env.CI
      ? {}
      : {
          '/api': { target: 'http://localhost:8000', changeOrigin: true },
          '/ws': { target: 'ws://localhost:8000', ws: true },
        },
  },
  preview: {
    proxy: process.env.CI
      ? {}
      : {
          '/api': { target: 'http://localhost:8000', changeOrigin: true },
          '/ws': { target: 'ws://localhost:8000', ws: true },
        },
  },
})
