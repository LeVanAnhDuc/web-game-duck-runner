# Design System Master — Endless Runner

> **Sinh bởi:** `design-bootstrap`, một lần duy nhất · 2026-09-08
> **Vai trò:** nguồn đúng của token. Mọi mockup và mọi màn hình đọc file này.
> **Không chạy lại `design-bootstrap` cho từng feature** — kết quả đổi theo cách viết
> brief, và token trôi là đúng cái file này sinh ra để chặn.
> **Đổi khi:** thêm một ý nghĩa màu mới trong game · đổi hướng nghệ thuật (cần ADR mới)
> **Sửa lớn:** 2026-09-10 — hướng nghệ thuật đổi từ "ngược sáng lúc hoàng hôn" sang
> "rừng sương sớm", `ADR-0009`. Bảng màu, scrim và yếu tố đặc trưng đều đổi theo.

Phần **Ràng buộc** đến từ `ui-ux-pro-max` và **không được ghi đè**. Phần **Lựa chọn**
là quyết định thẩm mỹ, đã ghi đè đề xuất bước 1 — lý do ở `ADR-0006`, rồi `ADR-0009`.

---

## 1. Hướng nghệ thuật — "rừng rậm lúc sương sớm"

Một quy tắc duy nhất, và nó vừa là thẩm mỹ vừa là chức năng — **luật hai lớp**:

> **Mọi vật thể người chơi phải đọc trong một phần giây đều có thân tối và cạnh sáng.**
> Nền tối thì cạnh đọc được; nền sáng thì thân đọc được; không tồn tại nền nào làm nó
> biến mất.

Xu đi theo chiều ngược lại vì thân xu vốn đã sáng: **thân vàng + vòng tối**. Cùng một
luật, đảo hai lớp.

Camera chạy trên một cây cầu đá qua vực, giữa rừng rậm lúc rạng đông. Sương dày sáng
màu lấp mọi khoảng trống giữa các tầng cây. Chướng ngại là **khối tối có cạnh bắt
sáng**. Xu là vật **duy nhất** màu vàng kim. Kỹ năng sẵn sàng là thứ **duy nhất** màu
aqua.

Ba lý do chọn hướng này, theo thứ tự quan trọng:

1. **Sương sáng nằm sau mọi thứ ở mọi khoảng cách.** Đây là lý do kỹ thuật, không phải
   thẩm mỹ. Cấu trúc cảnh **tự** bảo đảm mọi vật thể có nền sáng để in bóng lên, thay
   vì phải áp một nội quy lên từng vật thể và hy vọng không ai quên. Hướng cũ —
   "chướng ngại là bóng đen cắt trên nền trời" — chỉ đúng **nửa cảnh**: đo được chướng
   ngại trên mặt đường gần chỉ đạt **1.16:1**, gần như vô hình đúng trong 1,5 giây
   cuối. Xem `ADR-0009`.
2. **Nguy hiểm mã hoá bằng độ sáng, không bằng sắc màu** — đúng với mọi loại mù màu, và
   giờ đúng ở **cả hai** loại nền. 13 cặp đo đạt, cặp yếu nhất 3.32:1;
   `tests/render/contrast.test.ts` giữ nó không tụt.
3. **Ăn ảnh.** Một dải sương sáng, một hàng thân cây tối, một con đường bắc qua vực —
   khác hẳn ảnh chụp một runner sáng đều.

**Ngôn ngữ hình khối.** Nguy hiểm = cạnh thẳng, đối xứng, chắn ngang. Trang trí = cạnh
mềm, bất đối xứng. Bắt buộc, vì rừng rậm là môi trường ồn nhất về thị giác và đây là
môi trường ta tự chọn. Mắt phải tách chướng ngại khỏi cây cối **không cần đọc màu**.

**Yếu tố đặc trưng — "dải sương".** Một dải gradient mực rừng→sương, dùng đúng bốn chỗ
và không chỗ nào khác:

| Dùng ở | Cao |
| --- | --- |
| Gạch chân tiêu đề mỗi màn | 3px |
| Đường chia trong panel | 3px |
| Thanh nạp kỹ năng (phần đã nạp) | 6px |
| Thanh tiến trình khi tải (phần đã tải) | 6px |

Hai cái đầu là **đường kẻ**, hai cái sau là **phần đầy của một thanh** — cùng một
gradient, hai vai trò. Không dùng nó làm hoạ tiết trang trí ở bất kỳ đâu khác; dùng
loãng là mất hết tác dụng.

**Viền ấm của nhân vật.** Nhân vật cũng là hình bóng tối như chướng ngại, nên trong một
khung hình tĩnh hai thứ dễ lẫn. Giải: **nhân vật là hình bóng duy nhất có viền
`--player-rim` `#FFD9A8`, và đó là màu ẤM duy nhất trong cả cảnh.**

Con số này đo được, không chọn: `#F5A15C` của hướng cũ chỉ đạt **2.60:1** trên mặt
đường mới, còn `#FFD9A8` đạt **4.04:1**.

Không vật thể nào khác được có viền ấm. Vi phạm quy tắc này thì tín hiệu "đâu là tôi"
biến mất, và người chơi mất khoảng một phần giây để tìm lại nhân vật — đúng khoảng thời
gian đủ để chết.

**Ảnh thật.** Chỉ ở hai chỗ, và cả hai đều **ngoài** vùng phải đọc nhanh: tầng lá xa
**trên** đường chân trời, và nền các màn hình 2D đặc. Không bao giờ vẽ ảnh vào vùng
dưới đường chân trời — xem `ADR-0010`.

---

## 2. Màu — *Lựa chọn*

Mọi tỉ lệ dưới đây là **số đo thật**, tính bằng công thức WCAG 2.1 tại thời điểm
chốt file, không phải ước lượng.

### 2.1 Ý nghĩa trong thế giới game

Đây là bảng quan trọng nhất trong file. Màu ở đây mang **nghĩa**, không phải trang trí.
Mọi con số tương phản đo bằng công thức WCAG 2.1, ngày 2026-09-10.

| Token | Hex | Nghĩa | Quy tắc |
| --- | --- | --- | --- |
| `--hazard` | `#191410` | **thân** chướng ngại | **Không sắc màu.** Không vật thể nguy hiểm nào được tô màu khác |
| `--hazard-edge` | `#EAF0E6` | **cạnh** chướng ngại | Đặt đúng ở đường biên người chơi phải vượt: đỉnh khúc gỗ, đáy chùm dây leo |
| `--world-coin` | `#FFC94A` | xu | Vật **duy nhất** mang màu vàng kim |
| `--coin-ring` | `#171208` | vòng tối quanh xu | Lớp thứ hai của xu — không có nó thì xu biến mất trên dải sương |
| `--world-skill` | `#5BE0C8` | kỹ năng sẵn sàng, power-up đang chạy | Thứ **duy nhất** mang màu aqua |
| `--player-rim` | `#FFD9A8` | viền nhân vật | Màu **ấm** duy nhất trong cảnh. Không vật thể nào khác được dùng |
| `--mist-far` | `#CBD6C6` | sương xa, chân trời | **Điểm sáng nhất của cảnh.** Fog cũng dùng màu này |
| `--mist-near` | `#93A896` | sương giữa các tầng cây | dải giữa |
| `--canopy` | `#0D1512` | tán lá, thân cây | Tối nhất của phần rừng |
| `--road-near` | `#6F6A5D` | đá ướt dưới chân | **Bị ràng buộc hai đầu**, xem dưới |
| `--road-far` | `#A8AC9E` | mặt đường hoà vào sương | — |
| `--chasm` | `#05070A` | vực | Tối tuyệt đối |

**`--road-near` là token khó đổi nhất trong bảng.** Sáng hơn thì xu và kỹ năng tụt dưới
3:1; tối hơn thì chướng ngại tụt dưới 3:1. Khoảng độ sáng hợp lệ chỉ là **13%–16.7%**, và
`#6F6A5D` nằm giữa ở 14.5%. Texture mặt đường nhân vào nó bị khoá biên độ **±8%** vì
cùng lý do.

Mười ba cặp đo đạt, cặp yếu nhất **3.32:1** (kỹ năng trên mặt đường). Cặp từng hỏng —
chướng ngại trên mặt đường gần — từ **1.16:1** lên **3.39:1**.
`tests/render/contrast.test.ts` giữ cả mười ba cặp không tụt.

### 2.2 Giao diện

| Token | Hex | Dùng ở đâu | Đo được |
| --- | --- | --- | --- |
| `--surface` | `#101A16` | nền màn hình, nền hai bên khung dọc trên desktop | — |
| `--surface-raised` | `#1C2B25` | panel, thẻ nhân vật, hộp thoại | — |
| `--text` | `#F5F1EA` | chữ thường | **15.79:1** trên `--surface` · **13.12:1** trên `--surface-raised` |
| `--text-muted` | `#9DAEA3` | chữ phụ, nhãn | **7.63:1** trên `--surface` · **6.34:1** trên `--surface-raised` |
| `--gold` | `#FFC94A` | số xu, nút chính, kỷ lục mới | **11.60:1** trên `--surface` |
| `--aqua` | `#5BE0C8` | trạng thái sẵn sàng, focus ring | **10.95:1** trên `--surface` |
| `--alert` | `#FF8A80` | kết thúc lượt, không đủ xu | **7.79:1** trên `--surface` |
| `--ink` | `#0D1512` | chữ trên nút màu đặc | **12.10:1** trên `--gold` · **11.42:1** trên `--aqua` |

Chữ trắng tinh bị loại: `#F5F1EA` hơi ngả ấm, và nó là thứ giữ một chút hơi ấm trong
một cảnh gần như không còn màu ấm nào ngoài viền nhân vật.

Khi ảnh nền rừng đã tải (`ADR-0010`), nó phủ `--surface` ở opacity `0.5`. Đo trên
**toàn bộ** ảnh: chỗ sáng nhất sau khi composite là **8.6% độ sáng**, cho `--text`
**6.85:1**. Đo toàn ảnh chứ không chỉ chỗ chữ đang đứng, vì bố cục còn đổi.

### 2.3 Scrim của HUD — ràng buộc bắt buộc, có số đo

HUD nằm chồng trên cảnh 3D, mà cảnh 3D đổi độ sáng liên tục. Đo `--text` trên từng
dải:

| Nền | Tỉ lệ | Kết quả |
| --- | --- | --- |
| `--canopy` `#0D1512` | 16.46:1 | đạt |
| `--mist-near` `#93A896` | 2.25:1 | **trượt** |
| `--mist-far` `#CBD6C6` | **1.33:1** | **trượt** |

Nên: **mọi chữ HUD phải nằm trên scrim `#0D1512` ở alpha tối thiểu `0.55`.**

Con số này **đổi từ `0.45`** của `ADR-0006`, và đó là hệ quả trực tiếp của việc nền
sáng lên: trên dải sương, alpha `0.45` chỉ còn **3.75:1** — dưới `NFR-A11Y-01` — còn
`0.55` đạt **4.99:1**. Dùng dạng gradient từ scrim ở mép xuống trong suốt để không
thành một thanh đen cứng.

`tests/render/contrast.test.ts` kiểm **cả hai chiều**: 0.55 phải đạt, và 0.45 phải
trượt. Cái thứ hai quan trọng hơn — nó là thứ ghi lại *vì sao* con số đổi, ở dạng chạy
được.

### 2.4 Dải sương

```css
--rule-mist: linear-gradient(90deg, #0D1512 0%, #93A896 48%, #CBD6C6 100%);
```

Thay `--rule-horizon` (tím→hổ phách) của `ADR-0006`. Giữ nguyên **cấu trúc**: cùng bốn
chỗ dùng, cùng 3px cho đường kẻ và 6px cho phần đầy của thanh. Chỉ màu đổi.

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
`--text-title` với gạch chân `--rule-mist`.

### 7.3 HUD

- Nằm trong vùng an toàn: `env(safe-area-inset-*)` cộng `--space-md`.
- Nền là scrim gradient, alpha đỉnh tối thiểu `0.55` — xem §2.3.
- Số dùng `Chivo Mono`.
- Không có thành phần HUD nào đặt ở **1/3 giữa màn hình theo chiều dọc** — đó là vùng
  người chơi đang nhìn.

### 7.4 Thanh nạp kỹ năng

Cao `6px`, tràn hết chiều ngang, ngay dưới hàng HUD trên cùng. Phần đã nạp tô
`--rule-mist`; phần chưa nạp là `--canopy` ở alpha `0.55`. Khi đầy: đổi sang
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
- ❌ **Tô màu cho chướng ngại vật.** Thân là `--hazard`, cạnh là `--hazard-edge`, hết.
- ❌ **Vật thể một lớp.** Thân tối mà không có cạnh sáng, hoặc ngược lại: nó sẽ biến mất
  trên một loại nền. Xem `invariants.md` §14.
- ❌ **Viền ấm cho bất cứ thứ gì không phải nhân vật.**
- ❌ **Vẽ ảnh thật vào vùng dưới đường chân trời.** Đó là vùng phải đọc trong một phần
  giây, và một tấm ảnh nhiều chi tiết ở đấy dựng lại đúng cái nền ồn mà `ADR-0009` loại
  bỏ. Ảnh chỉ ở tầng lá xa trên đường chân trời, và ở nền các màn 2D.
- ❌ **Đặt thành phần HUD vào 1/3 giữa màn hình.**
- ❌ Font pixel, chữ viền dày, gradient cầu vồng — mặc định của "game indie", và là
  thứ `ADR-0006` cố ý tránh, và `ADR-0009` giữ nguyên việc tránh.

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
không phải thiếu sót: cảnh 3D là rừng lúc sương sớm, và một bản sáng của nó sẽ là
một trò chơi khác. Dòng "light mode contrast" trong checklist gốc của bước 1 vì vậy
không áp dụng.
