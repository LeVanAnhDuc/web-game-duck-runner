# DEPLOY — quyết định

## Nguồn

Đọc ngày 2026-10-18:

- `../docs/02-requirements/scope.md` FR-33
- `../docs/02-requirements/nfr.md` NFR-SEC-07, NFR-DATA-05
- `../.github/workflows/deploy.yml`, `../client/vite.config.ts` (`VITE_BASE_PATH`)
- `../client/index.html`

Requirement do user đưa trong chat: không có — user uỷ quyền cho agent chốt toàn bộ (brief 2026-10-18); mọi quyết định dưới đây ghi "Chốt bởi agent (user uỷ quyền)" khi agent chọn giữa các cách hiểu.

## Quyết định chốt qua hỏi đáp

- **Q1** Chạy được ở cả ENV=dev (gốc `/`) và ENV=prd (Pages, gốc `/web-game-duck-runner/`): REQ-DEPLOY-03 chỉ thực sự chứng minh base path khi chạy prd. Chốt bởi agent (user uỷ quyền). → REQ-DEPLOY-03

## Tài khoản test

Không có: game tĩnh, không backend, không tài khoản game. Tiến trình gieo thẳng vào `localStorage` (`BasePage.seedSave`).

## Ngoài phạm vi

- Bundle ≤ 250 KB gzip (NFR-PERF-09): CI của client in kích thước sau build.

## Tech debt liên quan

- (không có)
