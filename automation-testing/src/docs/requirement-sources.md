# Nguồn requirement của Duck Runner

**Requirement của module lấy ở đâu.** `/write-tests` đọc file này ở bước 1 và chỉ đọc các nơi liệt kê dưới đây, cộng với
những gì user nói trong chat. Không dùng Jira/Confluence.

Đường dẫn tính từ thư mục gốc repo test. Danh sách này được user xác nhận lúc scaffold (2026-10-18: user uỷ quyền cho
agent chốt, xem `decisions/<module>.md`); khi user chỉ thêm nơi khác, hoặc một nơi bị bỏ/đóng băng, sửa bảng này trong
cùng lượt.

## Tài liệu

- `../docs/README.md` — bản đồ tài liệu + quy ước ID (US / FR / NFR / ADR); đọc trước để biết file nào là nguồn đúng
- `../docs/01-product/overview.md` — định vị, Non-Goals (không backend, không tài khoản game, không chống gian lận, một ngôn ngữ)
- `../docs/01-product/journeys.md` — luồng người dùng US-01…US-06, kèm "Điều gì có thể sai" (nguồn chính cho case negative)
- `../docs/01-product/glossary.md` — tên khái niệm ↔ tên trong code ↔ tên trên UI (thanh nạp, ví, kỹ năng, power-up…)
- `../docs/02-requirements/scope.md` — danh mục chức năng FR-01…FR-41 và trạng thái
- `../docs/02-requirements/nfr.md` — ngưỡng NFR-PERF / SEC / A11Y / I18N / REL / DATA áp cho mọi feature
- `../docs/03-design/invariants.md` — điều kiện sai âm thầm (xu vào ví cuối lượt, save phải validate, thứ tự nạp auth…)
- `../docs/decisions/` — ADR-0001…0012: vì sao hành vi như vậy (vd ADR-0008 âm thanh sau tương tác đầu, ADR-0010 ảnh CC0 sau frame đầu, ADR-0012 đăng nhập Ducker ID sau cờ)
- `../docs/specs/<feature>/design.md` — thiết kế đã duyệt của từng feature (core-run, coins-and-skills, character-shop, polish-and-audio, jungle-dawn, ducker-id-sign-in)
- `../docs/design-system/endless-runner/MASTER.md` — ngưỡng hiển thị (vùng bấm 44px, trạng thái vô hiệu kèm chữ, nút kỹ năng là vùng loại trừ cử chỉ)
- `../README.md` — mục Features + Controls: hợp đồng hành vi hướng tới người chơi

## Code

- `../client/src/data/strings.ts` — mọi chuỗi UI (chỉ tiếng Việt), nguồn của `src/data/copy.ts`
- `../client/src/views/Play/index.tsx` — điều phối màn hình (tải, chính, chơi, tạm dừng, kết thúc, cửa hàng, cài đặt, lỗi) và ghi save sau lượt
- `../client/src/views/Play/components/`, `../client/src/views/Play/mains/Hud/` — từng màn và HUD
- `../client/src/views/Play/GameHost.ts` — vòng lặp, nối HUD với luật chơi, xử lý mất WebGL context
- `../client/src/core/input.ts` — bàn phím + cử chỉ vuốt → một `InputIntent`; vùng loại trừ `data-no-swipe`
- `../client/src/data/save.ts`, `../client/src/data/shop.ts`, `../client/src/data/catalog.ts` — save (khoá, validate, khoá cũ), mua/chọn nhân vật, giá
- `../client/src/game/` — luật chơi (tốc độ, va chạm, xu, thanh nạp, kỹ năng, power-up)
- `../client/src/audio/Audio.ts` — âm thanh tổng hợp, chỉ tạo `AudioContext` ở tương tác đầu
- `../client/src/render/TextureStream.ts` — ảnh CC0 tải sau frame đầu, bỏ qua khi `saveData`
- `../client/src/auth/`, `../client/src/hooks/`, `../client/src/components/AccountButton/` — đăng nhập Ducker ID (OIDC + PKCE) sau cờ tính năng
- `../client/vite.config.ts`, `../.github/workflows/deploy.yml` — base path (`VITE_BASE_PATH`) của bản build và bản Pages

## Không đọc như nguồn đúng

- `../docs/specs/*/plan.md` — danh sách task lúc build, không phải hành vi
- `../docs/04-state/backlog.md` — việc đang làm / nợ kỹ thuật, không phải hành vi đã ship
- `../docs/code-conventions.md` — quy ước viết code dùng chung, không nói về hành vi
- `../docs/ux-reviews/` — nhật ký phiên persona 2026-09-11: phát hiện UX **chưa** thành FR/NFR, không phải requirement
- `../client/tests/` — unit test (vitest) của app: gợi ý hành vi, không phải requirement

## Thứ tự thẩm quyền

User (chat) > tài liệu trên > code. Code cho biết app *đang* làm gì, không cho biết *nên* làm gì.
