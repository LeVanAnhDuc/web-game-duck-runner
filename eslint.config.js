import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage', '.vite', '.playwright-mcp'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // ── Bien gioi chiu luc: invariants.md §4 va ADR-0002 ──────────────────
    // game/ va data/ la mo phong thuan so. Chung khong duoc biet gi ve
    // Three.js, ve DOM, hay ve dong ho thuc. Vi pham thi test gameplay bat
    // buoc phai bat trinh duyet, va tren thuc te se khong ai viet chung nua.
    files: ['src/game/**/*.ts', 'src/data/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        paths: [
          { name: 'three', message: 'game/ va data/ khong duoc phu thuoc Three.js — ADR-0002.' },
          { name: 'react', message: 'game/ va data/ khong duoc phu thuoc React — ADR-0003.' },
          { name: 'howler', message: 'game/ va data/ khong phat am thanh.' },
        ],
        patterns: [
          { group: ['three/*', '../render/*', '../ui/*', '../audio/*'],
            message: 'Chieu phu thuoc chi di mot huong: render/ doc game/, khong nguoc lai.' },
        ],
      }],
      'no-restricted-globals': ['error',
        { name: 'window', message: 'game/ chay duoc trong Node — invariants.md §4.' },
        { name: 'document', message: 'game/ khong cham DOM — invariants.md §4.' },
        { name: 'localStorage', message: 'Chi data/save.ts duoc cham localStorage, qua mot adapter.' },
      ],
      'no-restricted-properties': ['error',
        { object: 'Date', property: 'now',
          message: 'Dung dong ho mo phong, khong dung dong ho thuc — invariants.md §5.' },
        { object: 'performance', property: 'now',
          message: 'Dung dong ho mo phong, khong dung dong ho thuc — invariants.md §5.' },
      ],
      'no-restricted-syntax': ['error',
        { selector: "NewExpression[callee.name='Date']",
          message: 'Dung dong ho mo phong — invariants.md §5.' },
        { selector: "CallExpression[callee.object.name='Math'][callee.property.name='random']",
          message: 'Dung core/rng.ts co seed, de tai lap duoc — invariants.md, test tat dinh.' },
      ],
    },
  },
  {
    // data/save.ts la ngoai le duy nhat: no la adapter cho localStorage.
    files: ['src/data/save.ts'],
    rules: { 'no-restricted-globals': 'off' },
  },
  {
    files: ['tests/**/*.ts', 'tests/**/*.tsx'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
)
