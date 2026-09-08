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

**Cả bốn mốc M1–M4 xong, và đã phát hành.** Game đổi tên thành **Duck Runner**, hình
bóng nhân vật đổi thành vịt cho khớp tên.

- **Live:** <https://levananhduc.github.io/web-game-duck-runner/>
- **Repo:** `LeVanAnhDuc/web-game-duck-runner` · release `v0.1.1`
- 121 test xanh · `tsc` và `eslint` sạch · README đạt hợp đồng 13 mục của skill
  `readme-game` (audit exit 0)

**Lệch tên có ý thức:** thư mục vẫn là `web-game-endless-runner` còn repo là
`web-game-duck-runner`. Thư mục giữ tên **thể loại** cho khớp 12 game bên cạnh
(`web-game-tetris`, `web-game-sokoban`…) — nhìn danh sách là biết game gì; repo giữ
tên **sản phẩm**. Script `capture-screenshots.mjs` lấy tên repo từ `git remote` chứ
không từ basename, nên nó xử lý đúng trường hợp này.

**Việc còn chặn duy nhất, không phải do code:** xác nhận fps trên **máy mobile thật**.
CPU throttle của DevTools không thay được một GPU mobile, nên ngưỡng "≥45fps trên
mobile tầm trung" ở `NFR-PERF-05` vẫn là suy ra.

## Việc tiếp theo

| Việc | Liên quan | Ưu tiên | Vì sao ưu tiên đó |
| --- | --- | --- | --- |
| Chơi thật trên một điện thoại | NFR-PERF-05 · NFR-A11Y-03 · NFR-A11Y-06 | cao | Vuốt, vùng bấm 44px và fps đều chỉ đúng khi thử trên ngón tay thật |
| Cho 5 người chơi thử, không giải thích trước | overview.md §6 | cao | Tiêu chí thành công số 1 nói rõ phải đo bằng cách này |
| Rà lại `REACTION_MIN_MS = 620` | invariants.md §3 | trung bình | Con số chọn, chưa đo. Autopilot cho trung vị 6.4 giây/lượt — có thể là bot yếu, có thể là game khó |
| Thêm pattern cho tier 2 và 3 | FR-05 | trung bình | 14 cụm là ít; chơi lâu sẽ thấy lặp |
| Chia bundle: Three.js thành chunk riêng | NFR-PERF-09 | thấp | 180.8 KB gzip đã đạt ngưỡng, nên đây là tối ưu chứ không phải sửa lỗi |

## Nợ kỹ thuật — cố ý làm tạm

| Chỗ nào | Đã đánh đổi gì | Vì sao chấp nhận | Khi nào buộc phải trả |
| --- | --- | --- | --- |
| `docs/02-requirements/nfr.md` §Performance | `NFR-PERF-05`…`08` là **mục tiêu đặt ra, chưa đo lần nào** | Chưa đủ vật thể trên cảnh để số đo có nghĩa | Mốc M4 — đo bằng DevTools rồi sửa số, chuyển file sang 🟢 |
| `src/game/constants.ts` — `REACTION_MIN_MS = 620` | Con số **chọn**, không phải đo | Chưa có ai chơi thật để biết 620ms là dễ hay khó | Cuối M2, sau khi chơi đủ lâu ở tốc độ trần |
| ~~`src/data/catalog.ts` — giá nhân vật~~ | **Đã trả.** Đo được **29.8 xu/phút** bằng `scripts/measure-economy.ts`, giá đặt lại thành 80 / 200 / 360 | — | — |
| `PATTERN_SLOT_GAP_M = 7.5` là khoảng cách CỐ ĐỊNH | Trong một cụm, hai ô cách nhau 833ms ở tốc độ đầu nhưng chỉ 288ms ở tốc độ trần — dưới `REACTION_MIN_MS` | Solver đã chứng minh mọi cụm vẫn giải được ở tốc độ trần, nên nó chỉ chặt chứ không bất khả | Nếu người chơi thật báo phần tốc độ cao là không đọc kịp |
| Autopilot trong `measure-economy.ts` là người chơi trung bình-yếu | Trung vị 6.4 giây/lượt, 120m — số đo là **giới hạn dưới**, không phải nhịp thật của người | Đủ để so sánh tương đối giữa các bộ giá | Khi có số liệu từ người chơi thật |
| `docs/01-product/glossary.md` | Vẫn ⚪ chưa áp dụng | Giờ đã có `Player`, `Track`, `Spawner` thật để đối chiếu | Đầu M3, khi cửa hàng thêm khái niệm "nhân vật" và "kỹ năng" |
| Khổ 1024 chưa được soi tận mắt | Chỉ mới chụp 375 / 768 / 1440 | 1024 nằm giữa hai khổ đã kiểm, rủi ro thấp | Mốc M4, cùng lượt đo hiệu năng |
| Không dùng worktree cho từng mốc | Mỗi mốc là một nhánh thường, rẽ từ `main` | Không có remote, một người làm, và mỗi worktree cần một `node_modules` riêng | Khi có người thứ hai, hoặc khi hai mốc chạy song song |
