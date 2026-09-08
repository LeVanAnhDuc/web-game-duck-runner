# Design System Master — Endless Runner

> **Sinh bởi:** `design-bootstrap`, một lần duy nhất · 2026-09-08
> **Vai trò:** nguồn đúng của token. Mọi mockup và mọi màn hình đọc file này.
> **Không chạy lại `design-bootstrap` cho từng feature** — kết quả đổi theo cách viết
> brief, và token trôi là đúng cái file này sinh ra để chặn.
> **Đổi khi:** thêm một ý nghĩa màu mới trong game · đổi hướng nghệ thuật (cần ADR mới)

Phần **Ràng buộc** đến từ `ui-ux-pro-max` và **không được ghi đè**. Phần **Lựa chọn**
là quyết định thẩm mỹ, đã ghi đè đề xuất bước 1 — lý do ở `ADR-0006`.

---

## 1. Hướng nghệ thuật — "ngược sáng lúc hoàng hôn"

Một quy tắc duy nhất, và nó vừa là thẩm mỹ vừa là chức năng:

> **Thứ người chơi phải tránh là bóng đen. Thứ người chơi muốn thì phát sáng.**

Camera nhìn về phía mặt trời đang lặn. Bầu trời là dải chuyển từ tím than trên cao
xuống hổ phách ở chân trời. Chướng ngại vật là **khối đen không màu** cắt trên nền
trời sáng đó. Xu là vật **duy nhất** màu vàng kim. Kỹ năng sẵn sàng là thứ **duy
nhất** màu aqua.

Ba lý do chọn hướng này, theo thứ tự quan trọng:

1. **Đọc được tức thì.** Phân biệt nguy hiểm bằng *độ sáng* chứ không bằng *sắc màu*,
   nên nó đúng với mọi loại mù màu. Đo thử: khi giả lập mù màu đỏ-lục, khối đen giữ
   độ sáng 0.6% còn vàng lên 82% — tách nhau tuyệt đối. Vàng và aqua tách nhau 2.28:1
   về độ sáng, đủ để phân biệt mà không cần nhìn kỹ.
2. **Làm model miễn phí trông có chủ đích.** Model CC0 của Kenney có bảng màu riêng
   của chúng và ghép lại thường lộn xộn. Chiếu sáng ngược biến chúng thành bóng —
   hình khối của model còn nguyên, màu gốc biến mất. Cả cảnh trở nên nhất quán mà
   không phải sửa một file model nào.
3. **Ăn ảnh.** Ảnh chụp portfolio có một dải hoàng hôn và các bóng đen cắt trên đó —
   khác hẳn ảnh chụp một runner sáng đều.

**Yếu tố đặc trưng — "đường chân trời".** Một dải gradient tím→hổ phách, dùng đúng
bốn chỗ và không chỗ nào khác:

| Dùng ở | Cao |
| --- | --- |
| Gạch chân tiêu đề mỗi màn | 3px |
| Đường chia trong panel | 3px |
| Thanh nạp kỹ năng (phần đã nạp) | 6px |
| Thanh tiến trình khi tải (phần đã tải) | 6px |

Hai cái đầu là **đường kẻ**, hai cái sau là **phần đầy của một thanh** — cùng một
gradient, hai vai trò. Không dùng nó làm hoạ tiết trang trí ở bất kỳ đâu khác; dùng
loãng là mất hết tác dụng.

**Viền sáng của nhân vật.** Nhân vật cũng là bóng đen như chướng ngại, nên trong một
khung hình tĩnh hai thứ dễ lẫn. Giải: **nhân vật là bóng duy nhất có viền sáng
`--sky-low` `#F5A15C`.** Mặt trời ở phía trước nên viền sáng ngược là đúng vật lý, và
nó tách nhân vật khỏi mọi thứ khác mà không thêm màu nào vào bảng.

Không vật thể nào khác được có viền sáng. Vi phạm quy tắc này thì tín hiệu "đâu là
tôi" biến mất, và người chơi mất khoảng một phần giây để tìm lại nhân vật — đúng
khoảng thời gian đủ để chết.

---

## 2. Màu — *Lựa chọn*

Mọi tỉ lệ dưới đây là **số đo thật**, tính bằng công thức WCAG 2.1 tại thời điểm
chốt file, không phải ước lượng.

### 2.1 Ý nghĩa trong thế giới game

Đây là bảng quan trọng nhất trong file. Màu ở đây mang **nghĩa**, không phải trang trí.

| Token | Hex | Nghĩa | Quy tắc |
| --- | --- | --- | --- |
| `--world-ink` | `#120E1F` | chướng ngại, mọi thứ gây chết | **Không sắc màu.** Không vật thể nguy hiểm nào được tô màu khác |
| `--world-coin` | `#FFC94A` | xu | Vật **duy nhất** trong cảnh mang màu vàng kim |
| `--world-skill` | `#5BE0C8` | kỹ năng đã sẵn sàng, power-up đang chạy | Thứ **duy nhất** mang màu aqua |
| `--sky-high` | `#2B1B4D` | đỉnh trời | dải trên |
| `--sky-mid` | `#8E3B6B` | giữa trời | dải giữa |
| `--sky-low` | `#F5A15C` | chân trời | dải dưới — nền sáng nhất, xem §2.3 |

### 2.2 Giao diện

| Token | Hex | Dùng ở đâu | Đo được |
| --- | --- | --- | --- |
| `--surface` | `#151221` | nền màn hình, nền hai bên khung dọc trên desktop | — |
| `--surface-raised` | `#1E1930` | panel, thẻ nhân vật, hộp thoại | — |
| `--text` | `#F5F1EA` | chữ thường | **16.36:1** trên `--surface` · **15.08:1** trên `--surface-raised` |
| `--text-muted` | `#A79FB5` | chữ phụ, nhãn | **7.25:1** trên `--surface` · **6.69:1** trên `--surface-raised` |
| `--gold` | `#FFC94A` | số xu, nút chính, kỷ lục mới | **12.02:1** trên `--surface` |
| `--aqua` | `#5BE0C8` | trạng thái sẵn sàng, focus ring | **11.35:1** trên `--surface` |
| `--alert` | `#FF8A80` | kết thúc lượt, không đủ xu | **8.07:1** trên `--surface` |
| `--ink` | `#120E1F` | chữ trên nút màu đặc | **12.37:1** trên `--gold` · **11.68:1** trên `--aqua` |

Chữ trắng tinh bị loại: `#F5F1EA` hơi ngả ấm, hợp với trời hoàng hôn. Trắng tinh
trên nền này trông như giao diện công cụ.

### 2.3 Scrim của HUD — ràng buộc bắt buộc, có số đo

HUD nằm chồng trên cảnh 3D, mà cảnh 3D đổi độ sáng liên tục. Đo `--text` trên từng
dải trời:

| Nền | Tỉ lệ | Kết quả |
| --- | --- | --- |
| `--sky-high` `#2B1B4D` | 13.65:1 | đạt |
| `--sky-mid` `#8E3B6B` | 6.24:1 | đạt |
| `--sky-low` `#F5A15C` | **1.84:1** | **trượt** |

Nên: **mọi chữ HUD phải nằm trên scrim `#120E1F` ở alpha tối thiểu `0.45`.** Đó là
điểm đo được đầu tiên đạt 4.5:1 (chính xác 4.81:1). Dùng dạng gradient từ scrim ở
mép xuống trong suốt để không thành một thanh đen cứng. Đây là cách `NFR-A11Y-01`
được thoả trên nền động.

### 2.4 Đường chân trời

```css
--rule-horizon: linear-gradient(90deg, #2B1B4D 0%, #8E3B6B 45%, #F5A15C 100%);
```

---

## 3. Chữ — *Lựa chọn*

**Hai họ chữ khác nhau về bản chất**, cộng bản mono cùng họ cho số.

| Vai trò | Font | Weight | Dùng ở đâu |
| --- | --- | --- | --- |
| Hiển thị | **Bricolage Grotesque** | 800 | tên game, tiêu đề màn, điểm lớn ở màn kết thúc |
| Giao diện | **Chivo** | 400 · 700 | nhãn, mô tả, nút, chữ trong cửa hàng |
| Số động | **Chivo Mono** | 700 | quãng đường, xu, mọi số đổi mỗi frame |

```
https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Chivo:wght@400;700&family=Chivo+Mono:wght@700&display=swap
```

**Vì sao số dùng mono:** bộ đếm quãng đường đổi mỗi frame. Với font tỉ lệ, mỗi lần
chữ số đổi là chiều rộng đổi, và cả cụm HUD giật sang trái phải liên tục. Đây là lỗi
không ai chỉ đúng tên được — người chơi chỉ thấy "HUD hơi rung". Mono khoá chiều
rộng. Chữ tĩnh trong HUD vẫn dùng Chivo với `font-variant-numeric: tabular-nums`.

**Thang cỡ chữ**

| Token | Cỡ | Line-height | Dùng |
| --- | --- | --- | --- |
| `--text-display` | `clamp(2.5rem, 8vw, 4.5rem)` | 0.95 | tên game, điểm cuối lượt |
| `--text-title` | `clamp(1.5rem, 5vw, 2rem)` | 1.1 | tiêu đề màn |
| `--text-hud` | `clamp(1.125rem, 4.5vw, 1.5rem)` | 1 | quãng đường, xu |
| `--text-body` | `1rem` | 1.5 | mô tả |
| `--text-label` | `0.875rem` | 1.4 | nhãn, chú thích |

Cỡ nhỏ nhất là `0.875rem` — không có gì dưới 14px, kể cả chú thích trong cửa hàng.

---

## 4. Khoảng cách — *Ràng buộc*, giữ nguyên bước 1

| Token | Giá trị | Dùng |
| --- | --- | --- |
| `--space-xs` | `4px` | khe hẹp |
| `--space-sm` | `8px` | khe giữa icon và chữ |
| `--space-md` | `16px` | padding chuẩn |
| `--space-lg` | `24px` | padding của panel |
| `--space-xl` | `32px` | khe lớn |
| `--space-2xl` | `48px` | lề giữa các khối |
| `--space-3xl` | `64px` | lề của khối hero |

---

## 5. Độ nổi và ánh sáng

Nền tối nên đổ bóng gần như không đọc được. Độ nổi thể hiện bằng **độ sáng của bề
mặt** và bằng **quầng sáng** cho thứ đang tương tác được.

| Token | Giá trị | Dùng |
| --- | --- | --- |
| `--elev-flat` | `background: var(--surface)` | nền |
| `--elev-raised` | `background: var(--surface-raised)` | panel, thẻ |
| `--elev-overlay` | `background: var(--surface-raised)` + `box-shadow: 0 16px 48px rgba(0,0,0,.55)` | hộp thoại, tạm dừng |
| `--glow-gold` | `0 0 24px rgba(255,201,74,.35)` | nút chính |
| `--glow-skill` | `0 0 32px rgba(91,224,200,.45)` | nút kỹ năng khi **đã sẵn sàng** |

Quầng aqua chỉ được xuất hiện khi thanh nạp đầy. Nó là tín hiệu, không phải trang trí
— dùng sai chỗ là phá mất ý nghĩa duy nhất của nó.

---

## 6. Chuyển động

| Loại | Thời lượng | Ghi chú |
| --- | --- | --- |
| Đổi trạng thái UI (hover, focus, bấm) | 150–200ms | *Ràng buộc bước 1: 150–300ms* |
| Chuyển màn | 250–300ms | mờ dần + trượt 8px, không trượt cả màn |
| Thanh nạp đầy | 200ms + một nhịp quầng sáng | nhịp duy nhất, không đập liên tục |

**`prefers-reduced-motion: reduce`** — *Ràng buộc, không được bỏ:*

- UI: bỏ mọi trượt, chỉ còn mờ dần. Quầng sáng thành viền tĩnh.
- Trong game: tắt rung camera, vệt tốc độ, particle. **Vòng chơi giữ nguyên** — không
  thể tắt chuyển động chính của một runner, và giả vờ tắt còn tệ hơn. Xem `FR-30`.

---

## 7. Đặc tả thành phần

### 7.1 Nút

| Loại | Nền | Chữ | Dùng |
| --- | --- | --- | --- |
| Chính | `--gold` | `--ink` | "Chơi", "Chơi lại", "Mua" |
| Phụ | trong suốt, viền `--text-muted` 1px | `--text` | "Về màn chính", "Huỷ" |
| Nguy hiểm | trong suốt, viền `--alert` | `--alert` | "Xoá tiến độ" |

- Cao tối thiểu **48px**, vùng bấm tối thiểu **44×44px** — *Ràng buộc `NFR-A11Y-03`*.
- Bo góc `12px`. Không bo tròn hoàn toàn: hình viên thuốc là mặc định của mọi trang web.
- `cursor: pointer` — *Ràng buộc*.
- Focus: viền `--aqua` 2px cách 2px, **luôn nhìn thấy được** — *Ràng buộc*.
- Trạng thái vô hiệu: giảm còn 40% độ đục **và** kèm chữ giải thích. Không bao giờ chỉ
  làm mờ — người chơi phải biết còn thiếu bao nhiêu xu.

### 7.2 Panel

Nền `--surface-raised`, bo `16px`, padding `--space-lg`, không viền. Tiêu đề dùng
`--text-title` với gạch chân `--rule-horizon`.

### 7.3 HUD

- Nằm trong vùng an toàn: `env(safe-area-inset-*)` cộng `--space-md`.
- Nền là scrim gradient, alpha đỉnh tối thiểu `0.45` — xem §2.3.
- Số dùng `Chivo Mono`.
- Không có thành phần HUD nào đặt ở **1/3 giữa màn hình theo chiều dọc** — đó là vùng
  người chơi đang nhìn.

### 7.4 Thanh nạp kỹ năng

Cao `6px`, tràn hết chiều ngang, ngay dưới hàng HUD trên cùng. Phần đã nạp tô
`--rule-horizon`; phần chưa nạp là `--world-ink` ở alpha `0.45`. Khi đầy: đổi sang
`--world-skill` đặc và nhận một nhịp `--glow-skill`.

### 7.5 Nút kỹ năng

- **56×56px**, góc dưới phải, lùi vào theo vùng an toàn.
- Là **vùng loại trừ của cử chỉ vuốt** — chạm vào đây không được tính thành vuốt đổi làn.
- Chưa sẵn sàng: viền `--text-muted`, icon `--text-muted`, không quầng sáng.
- Sẵn sàng: viền và icon `--world-skill`, có `--glow-skill`.
- Bấm khi chưa sẵn sàng: một nhịp rung 120ms — phản hồi rõ ràng, không im lặng.

### 7.6 Thẻ nhân vật (cửa hàng)

Panel chứa: hình nhân vật · tên (`--text-body` 700) · tên kỹ năng (`--world-skill`) ·
một câu mô tả kỹ năng (`--text-label`, `--text-muted`) · giá kèm icon xu, hoặc nhãn
"Đang dùng". Đủ tiền thì giá màu `--gold`; không đủ thì `--text-muted` kèm số xu còn
thiếu.

---

## 8. Bố cục màn hình

*Ràng buộc bước 1 — mẫu **Hero-Centric**, đọc theo đúng nghĩa của nó ở sản phẩm này:*
dự án không có trang marketing, nên "hero" là **màn hình chính**, và "một CTA chính"
là nút Chơi. Thứ tự khối của mẫu đó áp cho màn chính:

1. Hero tràn viền — tên game trên nền cảnh 3D đang chạy nền (không tương tác)
2. Một dòng trạng thái — kỷ lục hiện tại, số xu
3. CTA chính — nút **Chơi**
4. Lối phụ — Cửa hàng, Cài đặt

Các màn còn lại không thuộc mẫu đó và không bị ép theo: cửa hàng là lưới, cài đặt là
danh sách, tạm dừng và kết thúc lượt là hộp thoại.

**Khổ màn hình.** Phân biệt hai việc khác nhau:

- **Vẽ mockup: ba khổ** — 375 · 768 · 1440, thiết kế từ **375 trước** (theo skill
  `feature-flow`).
- **Kiểm trên app thật: bốn khổ** — 375 · 768 · **1024** · 1440 (*ràng buộc bước 1*).
  1024 không có artboard riêng vì nó nằm giữa hai khổ đã vẽ; nhưng nó **phải được
  chụp và soi** ở bước "xem trên app đang chạy".

Trên khổ rộng, canvas giữ tỉ lệ dọc ở giữa, hai bên là `--surface` (xem `ADR-0005`).
Màn báo thiếu WebGL là ngoại lệ: không có cảnh 3D nào để cân góc nhìn, nên nó dùng
hết chiều rộng.

---

## 9. Cấm — *Ràng buộc bước 1, cộng bổ sung của dự án*

- ❌ Emoji làm icon. Dùng SVG một bộ duy nhất (Lucide).
- ❌ Chữ dưới 4.5:1. Trên cảnh 3D thì đo ở frame sáng nhất, không phải frame trung bình.
- ❌ Đổi trạng thái tức thì, không có transition.
- ❌ Focus không nhìn thấy được.
- ❌ Hover làm dịch chuyển layout.
- ❌ Style không nhất quán giữa các màn.
- ❌ **Dùng aqua cho bất cứ thứ gì không phải trạng thái kỹ năng.**
- ❌ **Dùng vàng kim cho bất cứ thứ gì không phải xu, CTA chính, hoặc dấu kỷ lục mới.**
- ❌ **Tô màu cho chướng ngại vật.** Chúng là bóng đen.
- ❌ **Đặt thành phần HUD vào 1/3 giữa màn hình.**
- ❌ Font pixel, chữ viền dày, gradient cầu vồng — mặc định của "game indie", và là
  thứ `ADR-0006` cố ý tránh.

---

## 10. Danh sách kiểm trước khi giao

- [ ] Không emoji làm icon; icon cùng một bộ
- [ ] `cursor: pointer` trên mọi thứ bấm được
- [ ] Hover có transition 150–300ms
- [ ] Chữ đạt 4.5:1 — **HUD phải đo trên frame sáng nhất của cảnh**
- [ ] Focus nhìn thấy được khi đi bằng bàn phím
- [ ] `prefers-reduced-motion` được tôn trọng
- [ ] Đủ 375 / 768 / 1024 / 1440, không cuộn ngang ở 375
- [ ] Vùng bấm ≥ 44×44px, gồm cả nút kỹ năng và nút tạm dừng
- [ ] Không có nội dung nào bị vùng an toàn của thiết bị che
- [ ] Aqua chỉ xuất hiện ở trạng thái kỹ năng; vàng chỉ ở xu, CTA chính và dấu kỷ lục mới

**Không có light mode.** Game này chỉ có một chế độ tối. Đây là lựa chọn có ý thức,
không phải thiếu sót: cảnh 3D là hoàng hôn ngược sáng, và một bản sáng của nó sẽ là
một trò chơi khác. Dòng "light mode contrast" trong checklist gốc của bước 1 vì vậy
không áp dụng.
