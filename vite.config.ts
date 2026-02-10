import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    
    base: '/Prismnexus/',

    plugins: [react()],

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    define: {
      __GEMINI_API_KEY__: JSON.stringify(env.AIzaSyB_WzNYRaMSsxU3Zyt1gOceZBHc7m8LfXo)},

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  }
})

