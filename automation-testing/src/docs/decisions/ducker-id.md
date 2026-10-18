# DUCKERID — quyết định

## Nguồn

Đọc ngày 2026-10-18:

- `../docs/02-requirements/scope.md` FR-41
- `../docs/01-product/journeys.md` US-06
- `../docs/decisions/0012-ducker-id-sign-in.md`
- `../docs/specs/ducker-id-sign-in/design.md`
- `../docs/02-requirements/nfr.md` NFR-SEC-03, NFR-DATA-05
- `../client/src/auth/`, `../client/src/hooks/useAccountMenu.ts`, `../client/src/components/AccountButton/index.tsx`

Requirement do user đưa trong chat: không có — user uỷ quyền cho agent chốt toàn bộ (brief 2026-10-18); mọi quyết định dưới đây ghi "Chốt bởi agent (user uỷ quyền)" khi agent chọn giữa các cách hiểu.

## Quyết định chốt qua hỏi đáp

- **Q1** Ducker ID thật không có trong CI → issuer giả `http://ducker.test` trả lời bằng `page.route` (`fixtures/issuer.fixture.ts`), build riêng bật cờ ở :5285 (project `app-auth`, chỉ dev). Chốt bởi agent (user uỷ quyền). → REQ-DUCKERID-03…09
- **Q2** Cờ bật nhưng thiếu một biến thì tính năng tắt: cần một build thứ ba; đã có unit test `client/tests/auth/config.test.ts` → ngoài phạm vi e2e. Chốt bởi agent (user uỷ quyền). → —

## Tài khoản test

Không có: game tĩnh, không backend, không tài khoản game. Tiến trình gieo thẳng vào `localStorage` (`BasePage.seedSave`). Đăng nhập Ducker ID dùng issuer giả, profile `DUCKER.user` trong `src/data/test-data.ts`.

## Ngoài phạm vi

- Cờ bật + thiếu biến (unit test). Issuer treo 15 s rồi về chưa đăng nhập (unit test `client/tests/auth/request.test.ts`).

## Tech debt liên quan

- (không có)
