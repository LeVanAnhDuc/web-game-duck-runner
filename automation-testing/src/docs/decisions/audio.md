# AUDIO — quyết định

## Nguồn

Đọc ngày 2026-10-18:

- `../docs/02-requirements/scope.md` FR-27, FR-28, FR-29
- `../docs/01-product/journeys.md` US-05
- `../docs/decisions/0008-am-thanh-tong-hop-thay-file.md`
- `../client/src/audio/Audio.ts`, `../client/src/views/Play/index.tsx` (`play` gọi `unlock`)

Requirement do user đưa trong chat: không có — user uỷ quyền cho agent chốt toàn bộ (brief 2026-10-18); mọi quyết định dưới đây ghi "Chốt bởi agent (user uỷ quyền)" khi agent chọn giữa các cách hiểu.

## Quyết định chốt qua hỏi đáp

- **Q1** Không nghe được âm thanh trong test → đếm qua lớp bọc AudioContext (`instrumentAudio`): số context và số nguồn âm (oscillator, buffer source) được tạo. Chốt bởi agent (user uỷ quyền). → REQ-AUDIO-01…03
- **Q2** US-05 nói "trước khi người chơi chạm vào trang"; code chỉ mở âm ở CHƠI. Lấy CHƠI làm mốc (chặt hơn). Chốt bởi agent (user uỷ quyền). → REQ-AUDIO-01

## Tài khoản test

Không có: game tĩnh, không backend, không tài khoản game. Tiến trình gieo thẳng vào `localStorage` (`BasePage.seedSave`).

## Ngoài phạm vi

- Cao độ xu tăng theo chuỗi nhặt, âm lượng thực: không đo được bằng DOM — unit test `client/tests/ui/audio.test.ts`.

## Tech debt liên quan

- (không có)
