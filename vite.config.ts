import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Static SPA build output -> dist/ (ready for Firebase Hosting).
  build: {
    outDir: 'dist',
  },
})
