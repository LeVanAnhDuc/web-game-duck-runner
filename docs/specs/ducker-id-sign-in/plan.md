# Đăng nhập Ducker ID — kế hoạch (duck-runner)

Kế hoạch chung: `web-game/docs/superpowers/plans/2026-10-04-ducker-id-sign-in.md`.
Thiết kế repo: [`design.md`](design.md).

- [x] **Task 0** — worktree `.worktrees/ducker-id-sign-in`, cài, baseline xanh (lint, 141 test, build)
- [x] **Task 1** — `vite.config.ts` đọc `base` từ `VITE_BASE_PATH`; `.env.example`; `deploy.yml`
      đặt base path và không truyền cờ; `.worktrees/` vào `.gitignore`; `readDuckerConfig` + test
- [x] **Task 2** — PKCE, bắt callback lúc nạp module, request token/userinfo, store phiên, `initialOf` + test
- [x] **Task 3** — hook, `AccountButton`, chuỗi, icon, gắn vào `MenuScreen`, test component, chụp 375/768/1440
- [ ] ~~**Task 4** — e2e~~ — bỏ: repo không có Playwright (thay bằng chụp màn hình + giả issuer bằng route)
- [x] **Task 5** — Non-Goal, ADR-0012, NFR-SEC-03 / NFR-DATA-05 / NFR-DATA-01, bất biến 15, FR-41, US-06, README
- [ ] **Task 6** — gate đầy đủ, đẩy nhánh, mở PR (không merge)
