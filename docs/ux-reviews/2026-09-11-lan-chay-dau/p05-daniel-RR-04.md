# Phiên 4 · p05 Daniel · RR-04 — Đổi sang một nhân vật khác

- **emulate:** `1280x800x1`, không throttle
- **Fixture:** ví nạp sẵn **240 xu · kỷ lục 320 m**
- **Luật ngôn ngữ:** không đọc được tiếng Việt; persona tuân thủ triệt để — toàn bộ tường thuật
  mô tả chữ như hình, không một lần dịch nghĩa.
- **Tool:** chrome-devtools-mcp · agent `ux-persona`
- **Thời lượng:** 252.6 s · **35 tool call** · persona tự đếm **9 lần bấm thật sự**
- **Kết quả:** **ĐẠT `done_when`** — mua nhân vật giá 200, ví 243 → 43, rồi **chọn làm nhân
  vật đang dùng**. Toàn bộ **không đọc một chữ nào**. `min_steps` = 4, persona dùng 4 bước cho
  đúng phần RR-04 (vào cửa hàng · mua · chọn · quay ra).

---

## 1. Chuyện đã xảy ra (nguyên văn persona)

Tôi mở link lên. Màn đầu tiên là một cái nền game (nhìn như một khu rừng, có view từ trên
xuống một đường chạy ba làn), chính giữa có chữ to kiểu logo, dưới đó là hai con số (320 và
240) rồi ba nút xếp dọc: một nút to nhất ở trên, hai nút nhỏ hơn bên dưới nó.

Tôi nghĩ trong đầu: **"Ba nút, không biết cái nào là cái nào, cứ bấm cái to nhất trước xem
sao."** Bấm vào — màn hình đổi ngay, giờ đây là cảnh chạy thật... Vì tôi không bấm phím mũi tên
nên nhân vật tự đâm/rơi rất nhanh — chỉ vài giây sau màn hình lại đổi, hiện ra một bảng tổng
kết có 4-5 dòng số và hai nút. Tôi đoán một nút là "chơi lại", nút kia là "quay về" — tôi bấm
nút thứ hai **vì nó nằm ở vị trí giống nút "back" tôi hay thấy ở các app khác**.

Về đúng màn đầu, giờ con số thứ hai (số tiền) tăng nhẹ so với lúc đầu — tôi nghĩ: "chắc là do
lượt chơi vừa rồi tự động cộng ít tiền, dù tôi không cố ý chơi."

Giờ tôi bấm vào nút thứ hai trong ba nút (cái nằm giữa). Lần này đúng cái tôi cần: hiện ra một
danh sách 4 ô xếp dọc, mỗi ô có một cái tên riêng, một dòng mô tả ngắn, và bên phải là hoặc
một nhãn khác màu (chắc đang dùng cái này), hoặc một con số + một nút, hoặc một nút bị làm mờ
đi kèm một dòng chữ nhỏ màu khác. Tôi nghĩ: **"đây chắc là bốn nhân vật, ô đầu là cái tôi đang
có, ba ô sau bán bằng tiền, con số cạnh mỗi nút chắc là giá."**

Nhìn các con số: ô thứ hai có số 80, ô thứ ba có số 200, ô thứ tư có số 360 kèm một nút bị mờ
hẳn đi và một dòng số nhỏ bên dưới. Ví tôi có 243. Tôi nghĩ: **"243 > 200 nên chắc mua được ô
thứ ba, còn ô thứ tư chắc quá giá nên nút mới bị mờ/khoá như vậy."**

Tôi bấm vào nút của ô thứ ba (giá 200). **Không có hộp thoại nào bật lên hỏi xác nhận** — nút
biến mất/đổi luôn, và con số tiền ở góc rớt từ 243 xuống 43 ngay lập tức. Ô thứ hai (giá 80)
giờ nút của nó **cũng bị mờ đi kèm dòng chữ nhỏ mới**. Tôi nghĩ: "vậy là mua thành công, 243
trừ 200 ra đúng 43."

Ô vừa mua giờ có một nút chữ khác (ngắn hơn chữ cũ) — tôi đoán là nút "chọn/dùng cái này". Tôi
bấm vào nó. Ô đó đổi sang một cái nhãn nổi bật khác màu, còn ô đầu tiên thì đổi từ nhãn đó
thành một nút bấm được. Tôi hiểu: **"vậy là tôi vừa đổi nhân vật đang dùng, chứ không phải chỉ
mua cho có."**

Tôi bấm nút quay lại để về màn chính — số tiền ở màn chính giờ cũng là 43, khớp.

Có một chỗ tôi bị khựng lại thật sự: lúc mới vào màn chơi, tôi bấm vào **cái nút tròn góc trên
bên trái** đang chạy, tưởng nó là nút tạm dừng để tôi bình tĩnh nhìn lại — nhưng **game báo lỗi
không tương tác được, màn hình không đổi gì cả.** Tôi nghĩ: "chắc bấm hụt, hoặc nó cần
double-click, hoặc là do tôi bấm đúng lúc game đang tự chuyển cảnh." Tôi không cố lần hai.

## 2. Con số (nguyên văn persona)

- **9 lần bấm nút thật sự.**
- **Số lần bấm mà không có phản hồi gì: 1** — nút tròn góc trên lúc đang chơi.
- Số lần phải quay lui: **0**.
- **Không gặp hộp thoại xác nhận nào trong suốt quá trình mua.**
- Kết quả: **xong việc** — đổi được nhân vật, giá riêng từng nhân vật (80 / 200 / 360), mua
  xong chọn dùng ngay, số dư trừ đúng theo giá.

## 3. Đính kèm thô

10 ảnh đã lưu: `p01-home` · `p02-btn1-clicked` · `p03-ingame` · `p04-back-home` ·
**`p05-shop`** · **`p06-after-buy-click`** · **`p07-selected-new-char`** ·
`p08-home-after-swap` · `p09-play-new-char` · `p10-home-final`

```
msgid=1 [error] Failed to load resource: the server responded with a status of 404 () (0 args)
```

```
reqid=24 GET https://levananhduc.github.io/web-game-duck-runner/assets/textures/jungle-screen.webp [404]
```
(còn lại toàn bộ 25 request khác đều trả về [200])

## Trả lời hai câu hỏi thêm (nguyên văn)

**(a) Phân biệt được trạng thái các ô chỉ bằng hình?** Có — nhưng không phải qua chữ mà qua ba
dấu hiệu: (1) **độ sáng/độ mờ của nút** — nút mua bị mờ hẳn khi không đủ tiền; (2) **một nhãn
nổi bật màu khác hẳn xuất hiện đúng một chỗ** trong bốn ô — chỗ đó chắc là "đang dùng";
(3) **hình dạng nút thay đổi sau khi mua** — từ nút kèm số tiền thành nút ngắn hơn không có số.
Ba cái đó đủ để lần ra chuyện gì đang xảy ra dù không đọc được chữ.

**(b) Sau khi bấm có chắc biết mình vừa làm gì xảy ra không?** Đa số thì có — vì **số tiền ở
góc thay đổi ngay và đúng theo phép trừ tôi tự nhẩm được** (243 − 200 = 43), nên tôi tin chắc
là mua thành công chứ không phải nút chỉ đổi màu cho vui. Riêng một lần thì không: lúc bấm nút
tròn góc trên, không có gì đổi cả, tôi không biết là do bấm sai chỗ, do hệ thống chặn, hay do
bấm đúng lúc nó không nhận input — **cái đó tôi chịu, không đoán được.**

---

## Ghi chú của orchestrator (không phải lời persona)

**Phát hiện cứng, đã xác nhận độc lập: một ảnh 404 trên bản production.**
Orchestrator tự chạy `curl` sau phiên, không qua persona:

```
/web-game-duck-runner/textures/jungle-screen.webp        -> 200
/web-game-duck-runner/assets/textures/jungle-screen.webp -> 404
/web-game-duck-runner/textures/jungle-far.webp           -> 200
/web-game-duck-runner/assets/textures/jungle-far.webp    -> 404
```

Có đường dẫn giải ra **thừa một tầng `assets/`**. Phiên 2 ghi được `…/textures/jungle-screen.webp
[200]`, phiên 4 ghi được `…/assets/textures/jungle-screen.webp [404]` — cùng một tài nguyên,
hai URL, một cái hỏng. Liên quan `FR-40` (ảnh nền rừng cho màn hình 2D) và `ADR-0010`.
Nguyên nhân là việc của người làm sản phẩm; đây chỉ là số đo.

**Tín hiệu dương mạnh nhất của cả lần chạy.** `NFR-A11Y-07` cấm phân biệt bằng **riêng màu**.
Daniel phân biệt được **bốn trạng thái nút** chỉ bằng hình, và ba dấu hiệu anh kể ra —
độ mờ, vị trí nhãn, **hình dạng nút đổi** — không có cái nào là màu đơn thuần. Cửa hàng là màn
dày chữ nhất trong game, và nó vượt qua bài kiểm khắc nghiệt nhất có thể đặt ra cho nó.

**Mơ hồ, KHÔNG được tính là phát hiện nếu không tái hiện:** "nút tròn góc trên báo lỗi không
tương tác được". Chữ *"báo lỗi không tương tác được"* nghe như thông báo của **công cụ tự
động**, không phải của game — click vào một nút chồng trên canvas hay trượt vì lý do thuần kỹ
thuật của trình điều khiển. Hai persona khác chưa ai thử bấm tạm dừng. Cần phiên khác tái hiện
trước khi viết thành phát hiện. Nhưng phần **cảm giác** thì có hiệu lực ngay và độc lập với
nguyên nhân: *"tôi không biết là do bấm sai chỗ, do hệ thống chặn, hay do bấm đúng lúc nó
không nhận input — cái đó tôi chịu."*

**Chưa kiểm được, để lại cho phiên 7:** mua **không có bước xác nhận**. Daniel ghi nhận nhưng
không bấm đúp. `journeys.md` US-04 đã dự đoán trước lỗi *"bấm mua hai lần → trừ tiền hai lần"*.
p06 Vũ là persona duy nhất bấm trùng theo phản xạ.
