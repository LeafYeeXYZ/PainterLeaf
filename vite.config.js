import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 如果改了编译目标记得同步修改 src/libs/checkBroswer.js
    target: ['chrome108', 'edge108', 'firefox101', 'safari15.4'],
    rollupOptions: {
      output: {
        manualChunks: {
          antd: ['antd', '@ant-design/icons'],
        },
      },
    },
  }
})
