import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    cors: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'https://wxcwrhefkpgz.sealosbja.site', // 后端 API 地址
        changeOrigin: true, // 修改请求头中的 Origin 字段
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径
      },
    },
  }
})
