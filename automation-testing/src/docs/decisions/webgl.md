# WEBGL — quyết định

## Nguồn

Đọc ngày 2026-10-18:

- `../docs/02-requirements/scope.md` FR-32
- `../docs/02-requirements/nfr.md` NFR-REL-03, NFR-REL-04
- `../docs/01-product/journeys.md` US-01
- `../client/src/views/Play/index.tsx`, `components/ErrorScreen`, `components/LoadingScreen`, `GameHost.ts` (`webglcontextlost`)

Requirement do user đưa trong chat: không có — user uỷ quyền cho agent chốt toàn bộ (brief 2026-10-18); mọi quyết định dưới đây ghi "Chốt bởi agent (user uỷ quyền)" khi agent chọn giữa các cách hiểu.

## Quyết định chốt qua hỏi đáp

- **Q1** Thiếu WebGL giả bằng cách cho `getContext('webgl*')` trả null (đúng điều `hasWebGL()` kiểm); mất context bằng `WEBGL_lose_context` trên canvas của game. Chốt bởi agent (user uỷ quyền). → REQ-WEBGL-01, REQ-WEBGL-03
- **Q2** Màn ĐANG TẢI chỉ sống trong lần render đầu (effect khởi tạo chạy ngay sau đó), không có tài nguyên nào phải chờ trên đường tới frame đầu (ADR-0010) → không chờ được ổn định; để manual. Chốt bởi agent (user uỷ quyền). → REQ-WEBGL-04

## Tài khoản test

Không có: game tĩnh, không backend, không tài khoản game. Tiến trình gieo thẳng vào `localStorage` (`BasePage.seedSave`).

## Ngoài phạm vi

- (không có)

## Tech debt liên quan

- (không có)
