# M1 · Vòng chơi — thiết kế

**Liên quan:** FR-01 · FR-02 · FR-03 · FR-04 · FR-05 · FR-06 · FR-07 · FR-08 · FR-09 ·
FR-10 · FR-11 · FR-32 · NFR-A11Y-01 · NFR-A11Y-03 · NFR-A11Y-05 · NFR-A11Y-06 ·
NFR-I18N-01 · NFR-REL-03 · NFR-REL-04 · NFR-DATA-04 · ADR-0001 · ADR-0002 · ADR-0003 ·
ADR-0005 · ADR-0006 · ADR-0007

**Xong nghĩa là:** mở trang, bấm Chơi, chạy — đổi làn, nhảy, trượt, chết vì va chạm,
thấy quãng đường, chơi lại. Kỷ lục lưu trên máy. Chưa có xu, chưa có kỹ năng.

Tài liệu này **không nhắc lại** kiến trúc (`03-design/architecture.md`), bất biến
(`03-design/invariants.md`) hay token (`design-system/endless-runner/MASTER.md`). Nó
chỉ ghi những gì riêng của mốc này.

---

## 1. Ranh giới của mốc

**Trong phạm vi:** vòng lặp bước cố định · nhân vật trên ba làn · nhảy · trượt · đường
chạy theo đoạn tái sử dụng · sinh chướng ngại theo pattern · va chạm AABB · điểm theo
quãng đường · HUD tối thiểu · màn chính · màn kết thúc lượt · lưu kỷ lục · trạng thái
tải · báo thiếu WebGL.

**Ngoài phạm vi, cố ý:** xu và ví (M2) · thanh nạp và kỹ năng (M2) · power-up (M2) ·
tạm dừng (M2) · cửa hàng (M3) · âm thanh (M4) · đo và chốt ngưỡng hiệu năng (M4).

HUD ở mốc này **vẫn vẽ chỗ cho thanh nạp và nút kỹ năng** nhưng để trạng thái rỗng —
bố cục đã được duyệt ở mockup, và dời chúng vào sau sẽ phải sửa lại bố cục hai lần.

## 2. Hằng số của vòng chơi — nguồn duy nhất

Tất cả nằm trong `src/game/constants.ts`. Không hằng số nào của luật chơi được viết
rải trong code; đó là điều kiện để cân độ khó về sau mà không phải đi tìm.

| Hằng số | Giá trị | Vì sao |
| --- | --- | --- |
| `STEP_MS` | `1000 / 60` | Bước mô phỏng cố định — `invariants.md` §2 |
| `MAX_STEPS_PER_FRAME` | `5` | Trần chống "spiral of death" khi tab bị treo lâu |
| `LANE_X` | `[-1, 0, 1]` | Ba làn, đơn vị = bề rộng một làn |
| `LANE_WIDTH_M` | `2.2` | Bề rộng làn, mét |
| `SPEED_START_MPS` | `9` | Tốc độ đầu, m/s |
| `SPEED_MAX_MPS` | `26` | Trần tốc độ |
| `SPEED_RAMP_MPS2` | `0.14` | Gia tốc theo thời gian |
| `LANE_CHANGE_MS` | `140` | Thời gian trượt ngang giữa hai làn |
| `JUMP_MS` | `620` | Thời gian bay, cố định — không phụ thuộc tốc độ |
| `JUMP_HEIGHT_M` | `1.9` | Đỉnh parabol |
| `SLIDE_MS` | `520` | Thời gian trượt |
| `REACTION_MIN_MS` | `620` | **Ràng buộc chịu lực** — xem §4 |
| `SPAWN_AHEAD_M` | `95` | Khoảng cách sinh vật thể trước mặt |

`REACTION_MIN_MS = 620` là con số **chọn**, không phải đo. Nó phải được thử tay và
điều chỉnh ở cuối M1; ghi vào `backlog.md` §Nợ kỹ thuật.

## 3. Nhân vật — vị trí thật, không phải làn đích

`Player` giữ `laneFrom`, `laneTo`, `laneT ∈ [0,1]`. Vị trí ngang thật là
`lerp(LANE_X[laneFrom], LANE_X[laneTo], easeOutCubic(laneT))`.

`Collision` **chỉ đọc vị trí thật** — `invariants.md` §1. Hitbox ngang rộng
`LANE_WIDTH_M * 0.42`, hẹp hơn model, theo lệ của thể loại (tha thứ hơn là chính xác).

Ba trạng thái loại trừ nhau: `running` · `jumping` · `sliding`. Bấm nhảy khi đang nhảy
hoặc đang trượt thì **bị bỏ qua, không xếp hàng** — xếp hàng lệnh làm người chơi mất
cảm giác điều khiển. Đổi làn thì **được** phép trong lúc nhảy hoặc trượt.

Nhảy dùng parabol theo thời gian, không theo vật lý gia tốc: `y = 4h·t(1-t)`. Lý do —
thời gian bay là hằng số nên người chơi học được nhịp, và nó không đổi khi tốc độ tăng.

## 4. Sinh chướng ngại — ràng buộc chịu lực

Hai quy tắc, cả hai đều thuộc loại "sai âm thầm":

**Khoảng cách theo thời gian.** Khoảng cách tối thiểu giữa hai cụm là
`REACTION_MIN_MS / 1000 * speedNow`, không phải hằng số mét — `invariants.md` §3. Ở
tốc độ đầu là ~5.6m, ở trần là ~16m.

**Pattern có bảo đảm giải được.** Chướng ngại không sinh riêng lẻ; `data/patterns.ts`
chứa một catalog cụm viết tay. Mỗi cụm là một lưới `slots[]`, mỗi slot có ba ô ứng với
ba làn, mỗi ô là `null` · `low` (nhảy) · `high` (trượt) · `block` (chỉ đổi làn).

Mỗi pattern gắn `tier: 1 | 2 | 3`. Độ khó chọn tier theo tốc độ hiện tại, không theo
thời gian — người chơi giỏi tới tốc độ cao nhanh hơn thì gặp cụm khó sớm hơn.

**Solver** trong `game/PatternSolver.ts` chứng minh tính giải được: tìm kiếm theo chiều
rộng trên `(lane, state)` qua các slot, trả `true` nếu tồn tại chuỗi hành động. Test
duyệt **toàn bộ** catalog; pattern nào không giải được thì CI đỏ — `invariants.md` §10.

## 5. Đường chạy — pool, không cấp phát

`Track` giữ một pool cố định các đoạn (`SEGMENT_LEN_M = 12`, `SEGMENT_COUNT = 14`) và
một pool chướng ngại. Đoạn nào lùi ra sau camera thì được đẩy về đầu hàng và nạp lại
nội dung. Không `new` gì trong vòng lặp — `invariants.md` §9. Test khẳng định số object
sống là hằng số sau 10 000 bước.

## 6. Điểm

`distanceM` cộng dồn `speedNow * dt`. Điểm hiển thị là `Math.floor(distanceM)`. Không
có hệ số nhân ở M1.

## 7. Hiển thị

`render/Scene.ts` dựng: `PerspectiveCamera` đặt sau và trên nhân vật; `fov` khoá theo
chiều dọc và **không** đổi theo tỉ lệ khung hình — `ADR-0005`. Trời là một
`ShaderMaterial` gradient ba chặng trên một mặt phẳng nền, cộng một quầng mặt trời tại
điểm tụ. Mọi vật thể dùng `MeshBasicMaterial` màu `--world-ink` — không đèn, không
shadow map: cảnh ngược sáng nên vật thể **là** bóng, và bỏ đèn là cách rẻ nhất đạt
`NFR-PERF-08`.

Nhân vật là bóng duy nhất có viền sáng — `MASTER §1`. Cách làm: một bản mesh phóng to
`1.06` với `side: BackSide` màu `--sky-low`, tức là kỹ thuật outline cổ điển, không cần
post-processing.

Trên khổ rộng, canvas được đóng khung theo tỉ lệ 9:16 ở giữa — `ADR-0005`, `FR-31`.
`FR-31` thuộc M4 trên giấy, nhưng khung này **phải làm ở M1** vì mọi bố cục UI phụ
thuộc vào nó; cập nhật `scope.md` cho đúng.

## 8. Điều gì có thể sai — nguồn của test

| Tình huống | Xử lý |
| --- | --- |
| Không có WebGL | `FR-32` — màn báo lỗi bằng chữ, không để canvas đen (`NFR-REL-04`) |
| Mất WebGL context giữa lúc chơi | Bắt `webglcontextlost`, dừng vòng lặp, hiện màn lỗi |
| Tab bị ẩn rồi hiện lại sau 30 giây | Accumulator bị chặn bởi `MAX_STEPS_PER_FRAME`; không tua nhanh |
| Màn hình 144Hz | Bước cố định — kết quả giống 60Hz (test tất định) |
| Dữ liệu lưu hỏng / thiếu field / version cũ | `NFR-DATA-04` — về mặc định, không crash |
| Vuốt bị hiểu thành cuộn trang | `touch-action: none` trên canvas + `preventDefault` |
| Bấm chơi lại hai lần rất nhanh | `Game` là máy trạng thái; `start()` khi đang `running` bị bỏ qua |
| `prefers-reduced-motion` | `NFR-A11Y-05` — tắt vệt tốc độ và rung camera, vòng chơi giữ nguyên |

## 9. Kiểm thử

| Tầng | Công cụ | Nội dung |
| --- | --- | --- |
| `game/`, `data/` | Vitest (Node) | va chạm theo vị trí thật · khoảng cách spawn ở mọi tốc độ · solver duyệt toàn catalog · pool không tăng · save hỏng → mặc định · **tất định: cùng seed + cùng chuỗi input → cùng kết quả** |
| `ui/` | Vitest + Testing Library | màn chính → chơi → kết thúc → chơi lại; bàn phím đi hết được (`NFR-A11Y-06`) |
| `render/` | không unit test | xem bằng mắt trên app thật |

## 10. Ngôn ngữ hiển thị

Một ngôn ngữ: **tiếng Việt**. Mọi chuỗi nằm trong `data/strings.ts`, không hardcode
trong component — `NFR-I18N-01`. Đây chưa phải i18n, chỉ là điều kiện để thêm i18n sau
mà không phải đi tìm chuỗi.
