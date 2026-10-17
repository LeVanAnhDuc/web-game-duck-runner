# CLAUDE.md

**Duck Runner** — a three-lane endless runner: Vite + React 18 for the screens, Three.js
for the scene, a pure-TypeScript rule set in `client/src/game/`. Served from GitHub
Pages (https://levananhduc.github.io/web-game-duck-runner/). No server, no database,
no API: everything runs in the browser and progress stays in `localStorage`. The
methodology layer (docs contract, feature flow, hooks) is `.claude/CLAUDE.md`; read it
before working.

## Layout

| Folder | Holds |
| --- | --- |
| `client/` | the game app: `package.json`, `pnpm-lock.yaml`, `.env.example`, `index.html`, `public/`, `src/`, `scripts/`, unit + component tests (vitest) in `tests/` |
| `docs/` | product docs, requirements, ADRs, feature specs — map in `docs/README.md` |
| `.claude/`, `.githooks/`, `.github/`, `cliff.toml` | Claude config, git hooks, CI, release notes config — all at the root |

`.env.example` lives at `client/.env.example` (`.claude/CLAUDE.md` and the auto table in
`docs/README.md` still draw it at the root — same file, it moved with the app).

## Commands

```bash
cd client
pnpm install --frozen-lockfile
pnpm dev              # http://localhost:5173
pnpm test             # vitest: game rules in Node, UI tests in jsdom
pnpm typecheck
pnpm lint
pnpm build            # tsc, then the production build into client/dist/
pnpm preview          # serve client/dist/
pnpm exec vite-node scripts/measure-economy.ts   # re-measure the coin economy
pnpm release:next     # next version, from the commits (git-cliff, repo root)
```

Git hooks: `git config core.hooksPath .githooks` (commit-msg + pre-commit ESLint on staged
`client/` files).
