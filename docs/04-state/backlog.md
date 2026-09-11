# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-10 · commit —
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

**Mốc M5 xong: hướng nghệ thuật đổi sang rừng sương sớm.** Bắt đầu từ một lỗi người
chơi báo — "chướng ngại khó nhìn" — và lỗi đó đo được: chướng ngại trên mặt đường gần
chỉ đạt **1.16:1**, trong khi xu trên cùng nền đó đạt 10.62:1.

- **Live:** <https://levananhduc.github.io/web-game-duck-runner/>
- **Repo:** `LeVanAnhDuc/web-game-duck-runner`
- 141 test xanh · `tsc` và `eslint` sạch · README đạt hợp đồng 13 mục
  (`readme_audit.py` exit 0 — script của skill, không phải job `audit` của CI ở dưới)

`ADR-0009` thay `ADR-0006` bằng **luật hai lớp** (thân tối + cạnh sáng), `ADR-0010`
thay `ADR-0007` để mở đường cho ảnh CC0 thật ở đúng hai chỗ. Số đo mới:
tương phản yếu nhất **3.32:1** · **28** draw call · **184.3 KB** gzip · ảnh bắt đầu
tải ở **198 ms**, sau FCP **196 ms**.

**Việc còn chặn, không phải do code:**

1. **fps trên máy mobile thật** — vẫn là ngưỡng suy ra. Và giờ nó **quan trọng hơn
   trước**: cảnh có thêm một mặt phẳng alpha toàn màn (tán lá) và một `InstancedMesh`
   44 thân cây, tức thêm fill rate — đúng thứ một GPU mobile thiếu chứ không phải CPU.
2. **Đo lại `NFR-PERF-05` ở CPU throttle 4×** — số 103–104 fps cũ là của cảnh hoàng
   hôn. Lần đo tự động cho 1 fps vì Chrome hạ `requestAnimationFrame` khi cửa sổ bị
   che, và đó là nhiễu chứ không phải hồi quy (xem §Giới hạn trong `nfr.md`).
3. **Đo lại `NFR-PERF-07`** trên Slow 4G + CPU 4×. Phần việc mới trên đường tới frame
   đầu đã đo riêng: **3.9 ms** sinh texture, tức ~16 ms ở throttle 4×, trong 321 ms dư.

**Job `audit` trong CI đang đỏ, và đỏ từ trước PR #1** — 5 advisory của
`vite`/`vitest`/`esbuild`, toàn bộ là devDependency, và bản vá là major breaking.
Không phải do PR nào gây ra; `verify` (lint · test · build · chặn ranh giới
ADR-0002) vẫn xanh. Đừng coi nó là hồi quy của thay đổi kế tiếp.

**Bài học từ hai lỗi hình ảnh liên tiếp (PR #2 và M5):** cả hai đều do người chơi thật
tìm ra, và cả 121 test đều không bắt được, vì tất cả đều đo **luật chơi** — mà luật
chơi vẫn đúng khi màn hình lật ngược hoặc khi chướng ngại vô hình. Cách trả là biến
luật thị giác thành test: `tests/render/screen-axis.test.ts` và
`tests/render/contrast.test.ts` giờ là cổng CI. Đó cũng là lý do hai việc đầu ở mục
dưới ưu tiên **cao**: không có test nào thay được việc ngồi chơi.

**Lệch tên có ý thức:** thư mục vẫn là `web-game-endless-runner` còn repo là
`web-game-duck-runner`. Thư mục giữ tên **thể loại** cho khớp 12 game bên cạnh
(`web-game-tetris`, `web-game-sokoban`…) — nhìn danh sách là biết game gì; repo giữ
tên **sản phẩm**. Script `capture-screenshots.mjs` lấy tên repo từ `git remote` chứ
không từ basename, nên nó xử lý đúng trường hợp này.

**Lượt review UX bằng persona đầu tiên: xong (2026-09-11).** Skill workspace `ux-persona-lab`
đã sinh skill con `ux-persona-review` vào `.claude/skills/` — 5 Red Route (RR-01…RR-05, người
dùng duyệt 2026-09-11) và 6 persona. Chạy **7 phiên tuần tự** trên **bản live**, không phải
dev server. Báo cáo: [`docs/ux-reviews/2026-09-11-lan-chay-dau.md`](../ux-reviews/2026-09-11-lan-chay-dau.md)
· log từng phiên nằm cạnh nó · 54 ảnh thô chỉ còn ở
`.claude/skills/ux-persona-review/runs/2026-09-11-run1/anh-tho/` (gitignored, **chỉ trên máy này**).

Kết quả: **RR-01 3/4 · RR-02 4/4 · RR-03 0/4 · RR-04 1/1 · RR-05 1/1**. Chín phát hiện —
1 Critical, 3 High, 2 Medium, 3 Low — cộng 13 kết quả dương có cùng chất lượng dẫn chứng.

Ba điều lượt này **không** đóng được, đừng nhầm:

- Nó **không** thay được việc *"cho 5 người chơi thử"* ở mục dưới. Độ trễ tool khiến persona
  không chơi giỏi được, nên mọi kết luận về **độ khó** và về `REACTION_MIN_MS = 620` đều vô
  hiệu. Nó chỉ thu hẹp việc đó lại: 5 người thật không nên tiêu lượt thử vào thứ persona đã
  tìm ra. Báo cáo §Ghi chú mục 2 liệt kê đúng những câu đã bị **cố ý loại bỏ** vì lý do này.
- Phát hiện **chưa được cấp `FR-`/`NFR-` nào** — cấp ID là quyết định phạm vi, thuộc về người
  làm sản phẩm, không thuộc về một lượt đo. Bốn việc dưới đây là đề xuất, chưa phải cam kết.
- Dàn persona là **proto-persona**, chưa dựng từ nghiên cứu thật. Khi 5 người thật chơi xong,
  việc đầu tiên là **sửa dàn persona theo họ**, không phải viết thêm persona mới.

## Việc tiếp theo

| Việc | Liên quan | Ưu tiên | Vì sao ưu tiên đó |
| --- | --- | --- | --- |
| **Ảnh nền 404 trên bản live** — cùng một ảnh tải bằng hai đường dẫn, đường thừa tầng `assets/` trả 404 | FR-40 · ADR-0010 | cao | Khuyết tật **cứng** duy nhất lượt review xác nhận được: 4/7 phiên ghi được, cộng `curl` kiểm lại. Không persona nào *cảm* thấy, nên báo cáo xếp Low — nhưng đó là mức trải nghiệm, không phải mức kỹ thuật |
| **Không ai nhận ra kỹ năng tồn tại** — 4/4 persona ở trong một lượt chơi | FR-14 · FR-15 · overview.md §1 | cao | Phát hiện Critical F-01. Đây là **lý do sản phẩm tồn tại**; một người sống tới 202 m vẫn không thấy nó. Hướng: khoảnh khắc chuyển sang *sẵn sàng* phải là sự kiện không bỏ lỡ được, không phải nhãn to hơn |
| **Màn kết thúc không nói vừa vấp cái gì** — 3/4 persona | FR-09 · journeys.md US-01 | trung bình | Phát hiện High F-02. Thiếu **nguyên nhân**, không phải thiếu số liệu — đó là thứ biến chuỗi thua thành vòng học |
| **Nói ra những thứ cố ý KHÔNG làm** (điểm chỉ so với chính mình · xu không phải tiền thật) | overview.md §Non-Goals | trung bình | Phát hiện High F-04, và là việc **rẻ nhất** cả báo cáo: một câu chữ đóng được cả hai hướng hại. Một người sợ mất tiền thật nên không dám bấm mua; một người tưởng có bảng xếp hạng nên đi tìm rồi kết luận game "chưa hoàn chỉnh" |
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
| Quy trình tạo hai file ảnh CC0 là việc TAY | Các bước ghi trong `docs/assets/CREDITS.md`, không phải script trong repo | Chạy lại là việc một lần; viết script cần thêm `sharp` hoặc Playwright làm devDependency chỉ để chuẩn bị tài nguyên | Khi cần đổi hoặc thêm ảnh lần thứ hai |
| Không dùng worktree cho từng mốc | Mỗi mốc là một nhánh thường, rẽ từ `main` | Không có remote, một người làm, và mỗi worktree cần một `node_modules` riêng | Khi có người thứ hai, hoặc khi hai mốc chạy song song |
