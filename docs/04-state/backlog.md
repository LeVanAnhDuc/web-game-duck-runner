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

**Mốc M2 xong** (nhánh `feat/coins-and-skills`). Xu nạp thanh, ba kỹ năng, ba
power-up, tạm dừng đóng băng mô phỏng thật. 90 test xanh.

**Bước kế tiếp:** mốc M3 — `docs/specs/character-shop/`. Cửa hàng, mua và đổi
nhân vật.

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
| `docs/02-requirements/nfr.md` §Performance | `NFR-PERF-05`…`08` là **mục tiêu đặt ra, chưa đo lần nào** | Chưa đủ vật thể trên cảnh để số đo có nghĩa | Mốc M4 — đo bằng DevTools rồi sửa số, chuyển file sang 🟢 |
| `src/game/constants.ts` — `REACTION_MIN_MS = 620` | Con số **chọn**, không phải đo | Chưa có ai chơi thật để biết 620ms là dễ hay khó | Cuối M2, sau khi chơi đủ lâu ở tốc độ trần |
| `src/data/catalog.ts` — giá nhân vật, tỉ lệ rơi xu, chi phí nạp thanh | Chưa có con số nào | Phải chơi thật rồi đo xu/phút mới đặt được | Cuối M3 |
| `docs/01-product/glossary.md` | Vẫn ⚪ chưa áp dụng | Giờ đã có `Player`, `Track`, `Spawner` thật để đối chiếu | Đầu M3, khi cửa hàng thêm khái niệm "nhân vật" và "kỹ năng" |
| Khổ 1024 chưa được soi tận mắt | Chỉ mới chụp 375 / 768 / 1440 | 1024 nằm giữa hai khổ đã kiểm, rủi ro thấp | Mốc M4, cùng lượt đo hiệu năng |
| Không dùng worktree cho từng mốc | Mỗi mốc là một nhánh thường, rẽ từ `main` | Không có remote, một người làm, và mỗi worktree cần một `node_modules` riêng | Khi có người thứ hai, hoặc khi hai mốc chạy song song |
