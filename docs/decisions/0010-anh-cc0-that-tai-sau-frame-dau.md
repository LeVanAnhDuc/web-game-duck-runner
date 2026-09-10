# ADR-0010 · Ảnh CC0 thật, tải sau frame đầu — và chỗ nào thì ảnh vô dụng

> **Ngày:** 2026-09-10
> **Trạng thái:** accepted
> **Thay thế:** ADR-0007
> **Liên quan:** FR-39 · FR-40 · NFR-PERF-07 · NFR-PERF-09 · NFR-PERF-10 · NFR-SEC-07 ·
> ADR-0001 · ADR-0009

## 1. Bối cảnh

`ADR-0007` bỏ model tải về vì `ADR-0006` tô mọi thứ một màu phẳng: một file model không
còn đóng góp texture, bảng màu hay chi tiết bề mặt nào. Nó tự viết điều kiện xem lại:
*"nếu hướng nghệ thuật ở ADR-0006 bị thay bằng một hướng có chiếu sáng thật, thì quyết
định này mất toàn bộ căn cứ"*.

`ADR-0009` thay hướng nghệ thuật, và người dùng yêu cầu thẳng: *"có thể fetch trên mạng
để lấy các svg hoặc webp để lấy hình ảnh trông thật"*.

Nhưng `ADR-0009` không phải là "chiếu sáng thật" — nó vẫn không đèn. Nên câu hỏi không
phải *có dùng ảnh không*, mà **ảnh có đóng góp gì ở đâu**.

## 2. Quyết định

**Dùng ảnh thật, nhưng chỉ ở nơi ảnh thật đóng góp được, và luôn tải sau frame đầu.**

### Chỗ ảnh đóng góp

| Chỗ | File | Vì sao ảnh thắng hình vẽ |
| --- | --- | --- |
| Tầng lá xa, **trên** đường chân trời | `jungle-far.webp` 640×288, 31.4 KB | Chiều sâu của một tán rừng thật không dựng lại được bằng vài chục hình ellipse |
| Nền các màn 2D đặc | `jungle-screen.webp` 512×512, 65.9 KB | Nhìn phẳng, không phối cảnh, nên một tấm ảnh dùng được nguyên |

### Chỗ ảnh KHÔNG đóng góp, và đây là phần quan trọng hơn

- **Mặt đường.** Biên độ texture bị `ADR-0009` khoá ở **±8%** để giữ mọi cặp tương phản
  trên 3:1. Ở ±8%, một tấm ảnh đá thật và một hàm nhiễu vẽ bằng canvas cho ra **cùng
  một thứ**: một lớp vân rất nhạt. Tải về 60 KB để đổi lấy khác biệt không thấy được là
  một cái giá trả cho không cái gì.
- **Chướng ngại và nhân vật.** Vẫn là hình khối. Chúng nằm dưới đường chân trời, tức
  trong vùng phải đọc trong một phần giây, và ở đó thứ quyết định là **hình bóng** —
  đúng lập luận gốc của `ADR-0007`, vẫn còn nguyên hiệu lực cho vật thể trong luồng
  chơi. Không có model vịt CC0 nào khớp bốn hình bóng đã có, và vịt là vật duy nhất có
  viền ấm.
- **Vùng dưới đường chân trời, nói chung.** Ảnh không được vẽ vào đó. Dải sương sáng là
  thứ bảo đảm mọi vật thể có nền sáng để in bóng lên; đặt một tấm ảnh nhiều chi tiết
  vào đấy là tự tay dựng lại cái nền ồn mà `ADR-0009` vừa loại bỏ.

### Ràng buộc tải

**Không một byte ảnh nào nằm trên đường tới frame đầu** (`NFR-PERF-10`). `NFR-PERF-07`
đòi dưới 3 giây tới lúc bấm chơi được và lần đo gần nhất là 2 679 ms — còn 321 ms, tức
khoảng 16 KB trên Slow 4G. Ảnh không vừa vào chỗ đó, nên chúng không được xếp vào đó.

`src/render/TextureStream.ts` đợi **hai lần `requestAnimationFrame`** — lần đầu chạy
trước khi frame được trình bày, lần thứ hai sau — rồi mới nạp. Ảnh nền màn 2D đi qua một
biến CSS do JS đặt, chứ không viết `url()` trong stylesheet: viết trong stylesheet thì
trình duyệt tải ngay khi màn hình render, tức đặt nó trở lại vào đúng chỗ vừa dọn ra.

Đo được: **FCP 196 ms, hai ảnh bắt đầu tải ở 198 ms.** Tổng payload **97.3 KB**.

`navigator.connection.saveData` bật thì **bỏ qua hoàn toàn** — không phải tải bản nhỏ
hơn, mà không tải gì. Bản hình khối chơi được đầy đủ, và đó là bản họ nên nhận.

Mọi lỗi tải đều **im lặng có ý**: mạng chết, bị chặn, trình duyệt không đọc được WebP —
tất cả ra cùng một kết quả, là game giữ nguyên bản hình khối.

### Giấy phép

Chỉ **CC0 / phạm vi công cộng**. Nguồn, tác giả, giấy phép và cách xử lý từng file ghi
trong `docs/assets/CREDITS.md`. Đây là điều kiện của `NFR-SEC-07` và của mức chi phí
`0đ` trong `overview.md`.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Ảnh có mặt ngay từ frame đầu | Phá `NFR-PERF-07`. 97 KB trên Slow 4G ăn hết 321 ms dư và còn hơn thế |
| Texture ảnh cho mặt đường | Biên độ ±8% làm nó không phân biệt được với hàm nhiễu vẽ bằng canvas. Tải 60 KB đổi lấy không gì |
| Model 3D cho nhân vật và chướng ngại | Vẫn là hình bóng dưới đường chân trời; lập luận của `ADR-0007` chưa mất hiệu lực ở đó |
| Ảnh cho vùng dưới đường chân trời | Dựng lại đúng cái nền ồn mà `ADR-0009` vừa loại bỏ |
| Tải bản ảnh nhỏ hơn khi `saveData` | Vẫn là tải. Người bật tiết kiệm dữ liệu muốn **không tải**, và bản hình khối đã đủ |
| Ảnh Unsplash / Pexels | Giấy phép cho phép dùng nhưng **không phải CC0**, và điều kiện có thể đổi. Wikimedia phạm vi công cộng thì không |

## 4. Hệ quả

**Được:**

- Chiều sâu thật ở tầng lá xa và ở nền các màn 2D, với 97.3 KB **ngoài** đường tải tới
  frame đầu.
- Bundle JS không đổi vì ảnh không đi qua bundler: `NFR-PERF-09` vẫn là 183.5 KB gzip.
- Đo được chỗ sáng nhất của ảnh nền màn 2D sau khi composite là **8.6% độ sáng**, cho
  chữ trắng **6.85:1** — trên ngưỡng 4.5:1, và đo trên **toàn bộ** ảnh chứ không chỉ chỗ
  chữ đang đứng, vì bố cục còn đổi.
- Người bật tiết kiệm dữ liệu, người mất mạng giữa đường, và trình duyệt không đọc được
  WebP đều nhận một game chạy được.

**Mất / phải chấp nhận:**

- Repo có tài nguyên nhị phân lần đầu. `ADR-0007` từng lấy "không file nhị phân nào" làm
  một cái được, và điều đó mất.
- Hai file ảnh cần một quy trình chuẩn bị: tải bản 960px từ Wikimedia, giảm bão hoà và
  tối đi cho khớp bảng màu, rồi mã hoá WebP. Quy trình ghi trong `CREDITS.md`; nó
  **không** phải một script trong repo, nên chạy lại là việc tay.
- Có một khoảng thời gian ngắn cảnh trông khác: hình khối trước, ảnh vào sau. Trên máy
  nhanh gần như không thấy (2 ms); trên mạng chậm thì đây là một lần thay hình rõ.

**Điều kiện xem lại quyết định này:** nếu `NFR-PERF-07` được nới, hoặc nếu tìm được bộ
model CC0 khớp với bốn hình bóng vịt, thì phần "chỗ ảnh không đóng góp" phải tính lại.
