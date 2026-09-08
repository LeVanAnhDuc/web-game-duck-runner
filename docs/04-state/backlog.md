# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-08 · commit —
> **Cập nhật khi:** bắt đầu/kết thúc một việc · brainstorm ra việc mới · cố ý đi đường tắt

<!-- CÁCH ĐIỀN
Mục "Đang làm" là chỗ một phiên làm việc MỚI đọc đầu tiên. Giữ nó ngắn: đang làm
gì, dừng ở bước nào, cái gì đang chặn. Cập nhật nó TRƯỚC KHI DỪNG phiên, không
phải sau.

Mục "Nợ kỹ thuật" chỉ ghi thứ CỐ Ý làm tạm, và ghi NGAY LÚC ĐÓ. Bug thì không
thuộc đây. Việc chưa làm cũng không — đó là mục 2.

KHÔNG chứa: tính năng ngoài phạm vi (-> 01-product/overview.md §Non-Goals).
-->

## Đang làm

**Giai đoạn: brainstorm xong, đang dựng nền tài liệu.** Nhánh
`docs/project-foundation`.

Đã xong: toàn bộ tier-1 (`overview`, `journeys`, `scope`, `nfr`, `architecture`,
`invariants`) và `ADR-0001`…`0005`.

**Bước kế tiếp, theo đúng thứ tự:**
1. Chạy skill `design-bootstrap` → sinh `docs/design-system/endless-runner/MASTER.md`
   + một ADR ghi lại cái gì của bước 1 bị ghi đè. Chưa có file này thì **không viết
   một dòng UI nào**.
2. Mockup trên canvas Artifact — các màn của mốc M1, mỗi màn ba khổ 375 / 768 / 1440,
   thiết kế từ 375 trước. Wireframe ASCII của màn chơi đã được duyệt trong phiên
   2026-09-08.
3. Người dùng duyệt canvas. Đây là cổng duyệt cuối của giai đoạn brainstorm.
4. `superpowers:writing-plans` cho **mốc M1** → `docs/specs/core-run/plan.md`.

**Chưa có code.** Repo mới chỉ có tài liệu; chưa có `package.json`, chưa cài
dependency nào.

## Việc tiếp theo

| Việc | Liên quan | Ưu tiên | Vì sao ưu tiên đó |
| --- | --- | --- | --- |
| `design-bootstrap` → `MASTER.md` | FR-08 · FR-11 | cao | Chặn mọi việc UI. Không có token thì mỗi màn hình sẽ tự bịa màu và font |
| Mốc M1 — vòng chơi chạy được | FR-01…FR-11 · FR-32 | cao | Là thứ duy nhất chứng minh được kiến trúc ở `ADR-0002` có đứng vững không |
| Dựng khung dự án: Vite + TS + Vitest + lint chặn import | — | cao | Quy tắc lint là thứ ép `invariants.md` §4; thiếu nó thì ranh giới sẽ thủng ngay tuần đầu |
| Chọn và tải bộ model Kenney, chốt danh sách file dùng | FR-05 · FR-23 | trung bình | Kích thước model quyết định `NFR-PERF-07`; biết sớm thì đỡ phải làm lại |
| Mốc M2 — xu, thanh nạp, kỹ năng, power-up | FR-12…FR-22 | trung bình | Phụ thuộc M1 |
| Mốc M3 — cửa hàng nhân vật | FR-23…FR-26 | thấp | Phụ thuộc M2 |
| Mốc M4 — âm thanh, hoàn thiện, đo hiệu năng, deploy | FR-27…FR-33 | thấp | Phần đo hiệu năng phải làm cuối, khi cảnh đã đủ dày để số đo có nghĩa |

## Nợ kỹ thuật — cố ý làm tạm

| Chỗ nào | Đã đánh đổi gì | Vì sao chấp nhận | Khi nào buộc phải trả |
| --- | --- | --- | --- |
| `docs/02-requirements/nfr.md` §Performance | `NFR-PERF-05`…`08` là **mục tiêu đặt ra, chưa đo lần nào** | Chưa có code để đo. Đặt số bây giờ là bịa | Mốc M4 — đo thật bằng DevTools rồi sửa số và chuyển file sang 🟢 |
| `data/catalog` — giá nhân vật, tỉ lệ rơi xu, chi phí nạp thanh kỹ năng | Chưa có con số nào | Phải chơi thật rồi đo xu/phút mới đặt được. Đặt trước là bịa | Cuối mốc M3, sau khi chơi đủ để đo tốc độ tích xu |
| `docs/01-product/glossary.md` | Vẫn ⚪ chưa áp dụng | Chưa có code nên chưa có tên trong code để đối chiếu với tên trên UI | Khi mốc M1 có `Player`, `Track`, `Spawner` thật — lúc đó khoá tên |
