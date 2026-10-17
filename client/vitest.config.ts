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
    setupFiles: ['tests/setup.ts'],
    // Mac dinh la node: game/ va data/ khong duoc cham DOM (invariants.md §4).
    // Chi test UI moi can jsdom. Vitest 4 bo `environmentMatchGlobs`, nen hai moi
    // truong tach thanh hai project; `extends: true` giu alias, globals, setupFiles.
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
          exclude: ['tests/ui/**'],
        },
      },
      {
        extends: true,
        test: {
          name: 'ui',
          environment: 'jsdom',
          include: ['tests/ui/**/*.test.ts', 'tests/ui/**/*.test.tsx'],
        },
      },
    ],
  },
})
