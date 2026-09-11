# Red Route — Duck Runner

> **Chốt ngày:** 2026-09-11 · **đã được người dùng duyệt 2026-09-11**
> Sửa file này là đổi phạm vi của mọi lần chạy về sau, và **phá khả năng so sánh** với các
> lần chạy trước. Sửa thì ghi vào §Lịch sử ở cuối.

Red route theo David Travis: việc **nhiều người làm** × **làm thường xuyên**, cộng thêm mức
**nghiêm trọng** của luồng (bản 2006 nói rõ chỉ tần suất là không đủ). Một lỗi nằm trên red
route ảnh hưởng gần như mọi người chơi; một lỗi ngoài nó thì không.

## Ba quy ước của file này

**1. Hai trường thêm, ngoài 9 trường bắt buộc của máy phát.** Vì đây là game thời gian thực,
không phải CRUD app:

- `travis_rank` — `red` (nhiều người × thường xuyên × nghiêm trọng) hoặc `amber` (giữ trong
  danh sách vì lý do khác, ghi rõ trong `why_red`). **Không tô đỏ hết mọi thứ**: một danh sách
  toàn đỏ thì không ưu tiên được gì, và đó đúng là cái sai mà matrix của Travis sinh ra để
  tránh.
- `measurable` — persona đo được tới đâu, theo `SKILL.md` §1 (độ trễ tool). `full` = kết luận
  có hiệu lực trọn vẹn. `comprehension-only` = chỉ kết luận được về **hiểu hay không hiểu**,
  không kết luận được về **làm được hay không làm được**.

**2. Cách đếm `min_steps`.** Một bước = một hành động **có chủ ý** của người chơi. Mở trang
tính 1 bước. Chết **không** tính (người chơi không chọn). Nhìn thấy một màn hình **không**
tính. Một chuỗi né liên tục cho tới khi đủ xu tính **1 bước** — nó là một ý định, không phải
nhiều ý định. `min_steps` là mẫu số của điểm hiệu suất, nên đếm sai là hỏng cả bảng điểm.

**3. Không có route `planned` nào.** Toàn bộ `FR-01`…`FR-40` trong `scope.md` đều **xong**, và
`backlog.md` §Việc tiếp theo không có chức năng người dùng nào mới. Nên khác với một project
giai đoạn scaffold, ở đây **không có gì bị loại khỏi lượt chạy** — 5/5 route đều `live`.
Nếu sau này thêm `FR-` mới, route của nó vào file này với `status: planned` **trước** khi code.

---

## RR-01 · Lượt chơi đầu tiên

- **id:** RR-01
- **name:** Lượt chơi đầu tiên
- **actor:** p01 (primary — người xem portfolio, mở link trên điện thoại)
- **entry:** trang gốc, context sạch — ví 0 xu, kỷ lục 0 m, chưa từng mở trang này
- **done_when:** Người chơi **tự** bấm nút bắt đầu; sau đó **tự** làm được ít nhất một hành
  động điều khiển mà nhân vật trên màn hình phản hồi thấy được (đổi làn / nhảy / trượt); rồi
  nhìn thấy một màn hình kết thúc có **một con số quãng đường**. Không cần chạy được xa.
- **min_steps:** 3 · mở trang · bấm bắt đầu · một hành động điều khiển
- **why_red:** 100% người chơi đi qua, mọi phiên, và là **tiêu chí thành công số 1** của dự án
  — *"chơi hết một lượt mà không hỏi cách chơi"*. Lỗi ở đây thì mọi thứ phía sau không ai thấy.
- **status:** live
- **travis_rank:** red
- **measurable:** full — không có bước nào ở đây cần phản xạ. Hiểu được nút bắt đầu, hiểu được
  mình điều khiển cái gì, đọc được số mét: cả ba đều đo được dù mỗi hành động mất vài trăm ms.
- **derived_from:** `docs/01-product/journeys.md:18` (US-01) · `docs/02-requirements/scope.md:50`
  (FR-11) · `docs/02-requirements/scope.md:51` (FR-32) · `docs/01-product/overview.md:73`
  (tiêu chí thành công 1)

## RR-02 · Chơi lại ngay, không quay về màn chính

- **id:** RR-02
- **name:** Chơi lại ngay, không quay về màn chính
- **actor:** p01 (phiên thứ hai, context sạch lại từ đầu)
- **entry:** màn hình kết thúc của một lượt vừa chết
- **done_when:** Một lượt **mới** đang chạy — nhân vật lại đang chạy và số mét lại đếm từ đầu —
  mà người chơi **không** đi qua màn hình chính ở giữa.
- **min_steps:** 1 · bấm nút chơi lại trên chính màn kết thúc
- **why_red:** Tần suất cao thứ hai sau RR-01, và là **tiêu chí thành công số 3** —
  *"tự bấm chơi lại ít nhất một lần mà không được nhắc"*. Đây là chỗ duy nhất đo được
  người chơi có **muốn** chơi tiếp không, mà không phải hỏi họ.
- **status:** live
- **travis_rank:** red
- **measurable:** full
- **derived_from:** `docs/01-product/journeys.md:46` (US-02) · `docs/02-requirements/scope.md:48`
  (FR-09) · `docs/01-product/overview.md:77` (tiêu chí thành công 3)

## RR-03 · Nhận ra kỹ năng đã sẵn sàng, rồi dùng nó

- **id:** RR-03
- **name:** Nhận ra kỹ năng đã sẵn sàng, rồi dùng nó
- **actor:** p03 (a11y — chỉ dùng bàn phím)
- **entry:** đang trong một lượt chơi, thanh nạp ở 0
- **done_when:** Người chơi **tự nhận ra** trạng thái sẵn sàng đã bật (nói ra được là "cái này
  giờ bấm được rồi" trước khi bấm), **tự** bấm, và **thấy** màn hình đổi khác đi vì việc bấm đó.
  Không tính nếu bấm ngẫu nhiên rồi mới nhận ra.
- **min_steps:** 4 · mở trang · bấm bắt đầu · né cho tới khi thanh đầy · bấm kỹ năng
- **why_red:** Đây là **lý do sản phẩm tồn tại**. `overview.md` §1 định vị game bằng đúng một
  câu: mỗi nhân vật có một kỹ năng chủ động *do người chơi tự chọn thời điểm bấm*. Nếu người
  chơi không bao giờ nhận ra nó, cái duy nhất phân biệt game này với một bản web clone là
  **không tồn tại về mặt trải nghiệm** — dù code chạy đúng và test xanh. Đỏ vì mức nghiêm
  trọng, không vì tần suất.
- **status:** live
- **travis_rank:** red
- **measurable:** **comprehension-only.** Thanh nạp cần **18 xu** (`CHARGE_COINS`), nhặt được
  trong lượt chứ không nạp sẵn được — `chargeCoins` là biến của một lượt, không nằm trong
  `SaveData`. Với độ trễ tool, khả năng một persona sống đủ lâu để nhặt 18 xu là rất thấp.
  Nên phiên này trả lời được: *thanh nạp và nút kỹ năng có tự giải thích được không, người
  chơi có hiểu nó đang đo cái gì không*. Nó **không** trả lời được: *kỹ năng có cứu được lượt
  không*. Nếu persona chết trước khi thanh đầy, ghi lại đúng như thế — **đó là dữ liệu**, không
  phải phiên lỗi: một người xem portfolio chơi 1–3 phút có thể cũng chưa bao giờ thấy nó.
- **derived_from:** `docs/01-product/journeys.md:68` (US-03) · `docs/02-requirements/scope.md:59`
  (FR-14) · `docs/02-requirements/scope.md:60` (FR-15) · `docs/01-product/overview.md` §1

## RR-04 · Đổi sang một nhân vật khác

- **id:** RR-04
- **name:** Đổi sang một nhân vật khác
- **actor:** p05 (không đọc được tiếng Việt — chơi bằng hình ảnh)
- **entry:** màn hình chính, **ví nạp sẵn 240 xu và kỷ lục 320 m** (xem `SKILL.md` §3 — đây là
  fixture, đúng bối cảnh của US-04 *"đã chơi vài lượt, ví có xu"*, không phải mách nước)
- **done_when:** Một nhân vật **khác** nhân vật ban đầu đang hiện là nhân vật đang dùng, **và**
  số xu trong ví đã giảm đúng bằng giá của nó.
- **min_steps:** 4 · vào cửa hàng · mua · chọn · quay ra
- **why_red:** **amber, không đỏ** — và nói thẳng ra thì tần suất của nó thấp: nhóm chính chơi
  1–3 phút, còn nhịp kiếm xu đo được là 29.8 xu/phút, nên phần lớn người chơi **không bao giờ**
  đến được đây bằng cách chơi thật. Giữ trong danh sách vì hai lý do: (a) đây là chỗ **duy
  nhất** trong game có một giao dịch mất mát được — bấm mua là trừ xu, và `US-04` đã dự
  đoán trước lỗi "bấm mua hai lần trừ tiền hai lần"; (b) bộ giá 80/200/360 được **đặt lại từ số
  đo** với đúng một mục đích là để màn này được thấy hoạt động — và điều đó **chưa ai kiểm
  bằng một người chơi**, chỉ bằng một autopilot tham lam.
- **status:** live
- **travis_rank:** amber
- **measurable:** full — toàn bộ là màn hình 2D, không dính phản xạ.
- **derived_from:** `docs/01-product/journeys.md:94` (US-04) · `docs/02-requirements/scope.md:74`
  (FR-24) · `docs/02-requirements/scope.md:75` (FR-25) · `docs/02-requirements/scope.md:76`
  (FR-26) · `src/data/catalog.ts` (giá và nhịp xu)

## RR-05 · Tắt tiếng, và tin rằng nó nhớ

- **id:** RR-05
- **name:** Tắt tiếng, và tin rằng nó nhớ
- **actor:** p02 (desktop, chưa từng chơi runner, ngồi trong phòng làm việc chung)
- **entry:** trang gốc, context sạch, âm thanh đang bật theo mặc định
- **done_when:** Không còn âm thanh nào phát ra, **và** sau khi tải lại trang thì vẫn đang tắt —
  người chơi tự kiểm được điều đó mà không cần ai nói.
- **min_steps:** 4 · mở trang · vào cài đặt · tắt · quay ra
- **why_red:** **amber.** Nghiêm trọng thì có — mở link ở văn phòng mà game phát nhạc là lý do
  đóng tab ngay lập tức, không quay lại, và đó là mất trắng một người xem portfolio. Nhưng
  `FR-28` đã hạ mức đó xuống: nhạc **chỉ** phát sau tương tác đầu tiên, nên không có cú sốc âm
  thanh lúc vừa mở trang. Còn lại là câu hỏi thật: người chơi có **tìm thấy** chỗ tắt trước khi
  họ cần tới nó không.
  Đây cũng là chỗ duy nhất còn lại cho lăng kính *Form design* (`persona-rules.md` §4.5) — game
  không có form nào khác.
- **status:** live
- **travis_rank:** amber
- **measurable:** full
- **derived_from:** `docs/01-product/journeys.md:119` (US-05) · `docs/02-requirements/scope.md:84`
  (FR-29) · `src/data/strings.ts` (`settings`)

---

## Cố ý KHÔNG phải Red Route

Ghi ra để lần sau không ai phải hỏi lại.

| Không đưa vào | Vì sao |
| --- | --- |
| Màn báo thiếu WebGL (`FR-32`) | Là đường lỗi, không phải hành trình. Và không tắt được WebGL từ phía persona một cách tin cậy, nên đưa vào chỉ để bỏ trống. |
| Ba power-up (`FR-19`…`FR-21`) | **Bị động** — người chơi không chọn thời điểm, đó là toàn bộ điểm khác biệt so với kỹ năng (`glossary.md`). Không có ý định thì không có hành trình. |
| Tạm dừng (`FR-22`) | Một bước, không có đích. Nếu persona dùng tới, ghi lại như quan sát rời. |
| Xoá tiến độ (`settings.reset`) | Không hoàn tác được → rào an toàn cấm. Persona được **mở** hộp xác nhận và kể lại nó đọc ra sao, rồi bấm HUỶ. Không ai bấm XOÁ. |
| Độ khó, nhịp sinh chướng ngại, `REACTION_MIN_MS` | `SKILL.md` §1: độ trễ tool làm sai lệch, persona **không có quyền kết luận**. Vẫn nằm ở `backlog.md:68-69`, và chỉ người thật đóng được. |

## Bảng phiên của một lần chạy

5 route `live` + 2 phiên mù = **7 phiên**, trần 4 phiên đồng thời (`lib/orchestration.md`).

| # | Phiên | Persona | Thiết bị · mạng |
| --- | --- | --- | --- |
| 1 | RR-01 | p01 | điện thoại 390×844 · 4G |
| 2 | RR-02 | p01 (context sạch lại) | điện thoại 390×844 · 4G |
| 3 | RR-03 | p03 | desktop 1440 · chỉ bàn phím |
| 4 | RR-04 | p05 | desktop 1280 · nhanh · ví nạp sẵn |
| 5 | RR-05 | p02 | desktop 1440 · nhanh |
| 6 | mù — trình độ số thấp | p04 | điện thoại 360×740 · Slow 4G |
| 7 | mù — power user | p06 | desktop 1920 · nhanh |

Phiên mù **không có** `goal_in_user_words`: chỉ đưa link và để họ tự làm gì họ muốn. Đó là chỗ
duy nhất phát hiện được thứ mà không Red Route nào nghĩ tới việc đi tìm.

## Lịch sử

| Ngày | Đổi gì | Vì sao |
| --- | --- | --- |
| 2026-09-11 | Bản đầu — 5 route: RR-01/02/03 đỏ, RR-04/05 hổ phách | Cài `ux-persona-review` vào project |
