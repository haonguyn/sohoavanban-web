import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load các biến môi trường dựa trên mode (development, production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [vue()],
    server: {
      proxy: {
        '/api': {
          // Nếu không có VITE_API_URL, fallback về mặc định
          target: env.VITE_API_URL ? env.VITE_API_URL.replace('/api', '') : 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
        '/ws': {
          target: env.VITE_WS_URL ? env.VITE_WS_URL.replace('/ws', '').replace('ws://', 'http://') : 'http://127.0.0.1:8000',
          ws: true,
          changeOrigin: true,
        }
      },
    },
  };
})
