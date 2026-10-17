# MENU — quyết định

## Nguồn

Đọc ngày 2026-10-18:

- `../docs/02-requirements/scope.md` FR-10, FR-11
- `../docs/01-product/journeys.md` US-01, US-02
- `../client/src/views/Play/components/MenuScreen/index.tsx`, `../client/src/data/strings.ts`
- `../README.md` §Features/§Controls

Requirement do user đưa trong chat: không có — user uỷ quyền cho agent chốt toàn bộ (brief 2026-10-18); mọi quyết định dưới đây ghi "Chốt bởi agent (user uỷ quyền)" khi agent chọn giữa các cách hiểu.

## Quyết định chốt qua hỏi đáp

- **Q1** Dòng gợi ý ở desktop vẫn là "VUỐT ĐỂ ĐỔI LÀN…" (chuỗi `hintDesktop` có nhưng không dùng). Đây là phát hiện UX F-06 của lượt persona 2026-09-11, **chưa** thành FR/NFR → không ghi là bug; REQ chỉ đòi có gợi ý. Chốt bởi agent (user uỷ quyền). → REQ-MENU-04
- **Q2** Google Fonts là request ngoài duy nhất được phép (có trước tính năng, NFR-DATA-05); lỗi console tính cả việc tải font hỏng. Chốt bởi agent (user uỷ quyền). → REQ-MENU-05

## Tài khoản test

Không có: game tĩnh, không backend, không tài khoản game. Tiến trình gieo thẳng vào `localStorage` (`BasePage.seedSave`).

## Ngoài phạm vi

- Màn ĐANG TẢI: chỉ tồn tại trong một lần render trước khi effect khởi tạo chạy, không chờ được ổn định — xem `loading` ở `webgl.md` decisions.

## Tech debt liên quan

- (không có)
