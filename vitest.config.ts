import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Alias @/ phai khai o BA cho trong repo nay: tsconfig.json (tsc), vite.config.ts
  // (build/dev) va day (Vitest). tests/ui/flow.test.tsx nap views/Play bang dynamic
  // import, nen thieu cho nay thi dung test do do.
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    globals: true,
    // Mac dinh la node: game/ va data/ khong duoc cham DOM (invariants.md §4).
    // Chi test UI moi can jsdom, khai bao bang docblock o dau file.
    environment: 'node',
    environmentMatchGlobs: [['tests/ui/**', 'jsdom']],
    setupFiles: ['tests/setup.ts'],
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
  },
})
