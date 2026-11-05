import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base: './' 使用相对路径，保证在 /guwen/ 子路径与根域 guwen.201573.xyz 下都能正确加载资源
export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
