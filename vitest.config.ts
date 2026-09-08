import { defineConfig } from 'vitest/config'

export default defineConfig({
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
