import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  root: '.',
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://api:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2020',
    minify: 'terser',
  },
})
