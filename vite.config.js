import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  plugins: [
    vue(),
  ],
  base: process.env.VITE_APP_BASE_URL || '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0', // 允许所有主机访问
    port: 8080, // 设置开发服务器的端口
    proxy: {
      '/api': {
        target: 'http://llm.if4.ttyt.cc',
        changeOrigin: true, // 允许代理跨域
        secure: false, // 如果使用的是自签名证书，需要将 secure 设置为 false
        pathRewrite: {
        '^/api': '', // 将请求路径中的 `/api` 去掉
      },
      }
    }
  },
  // outputDir: 'C:\\Users\\t\\PycharmProjects\\DLTheoryAssiOJ\\oj\\static\\main\\dist',
})
