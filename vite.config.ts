import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Alias @/ -> src/ (R-13). Phai khai o CA HAI cho: tsconfig cho tsc, cho nay cho
  // Vitest co config rieng (vitest.config.ts) nen alias phai khai o CA BA cho.
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  plugins: [react()],
  base: './',
  build: { target: 'es2022' },
})
