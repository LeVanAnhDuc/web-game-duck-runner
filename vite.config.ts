import { fileURLToPath } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // Alias @/ -> src/ (R-13). Phai khai o CA HAI cho: tsconfig cho tsc, cho nay cho
    // Vitest co config rieng (vitest.config.ts) nen alias phai khai o CA BA cho.
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    plugins: [react()],
    // Doc tu env, khong co gia tri mac dinh trong code: de trong = goc ten mien.
    // Deploy dat VITE_BASE_PATH=/<ten-repo>/ (deploy.yml). redirect_uri cua Ducker ID
    // dua vao dung gia tri nay (import.meta.env.BASE_URL).
    base: env.VITE_BASE_PATH,
    build: { target: 'es2022' },
  }
})
