# ADR-0009 · Rừng sương sớm, và luật hai lớp thay quy tắc in bóng một chiều

> **Ngày:** 2026-09-10
> **Trạng thái:** accepted
> **Thay thế:** ADR-0006
> **Liên quan:** FR-34 · FR-35 · FR-36 · FR-37 · FR-38 · NFR-A11Y-01 · NFR-A11Y-07 ·
> NFR-PERF-08 · ADR-0005 · ADR-0010 · bất biến #14

## 1. Bối cảnh

`ADR-0006` chốt hướng "ngược sáng lúc hoàng hôn" với một quy tắc: *thứ phải tránh là
bóng đen không màu, thứ muốn lấy thì phát sáng*. Lập luận a11y của nó đo được và đúng —
**trên nền trời**.

Người chơi báo chướng ngại khó nhìn. Đo tương phản độ sáng WCAG giữa chướng ngại
`#120E1F` và thứ nằm ngay sau nó:

| Chướng ngại trên… | Tương phản |
| --- | --- |
| mặt đường **gần** `#241A3D` | **1.16 : 1** |
| mặt đường xa `#5D3550` | 1.89 : 1 |
| trời thấp `#F5A15C` | 9.14 : 1 |

Quy tắc của `ADR-0006` chỉ đúng nửa cảnh. Ngay khi chướng ngại tụt xuống dưới đường
chân trời — tức khoảng 1,5 giây cuối, đúng lúc người chơi cần thấy nó nhất — tương phản
sụp còn **1.16:1**. Xu trên cùng nền đó được **10.62:1**.

Ba điều làm lỗi này sống sót qua cả bốn mốc:

1. Quy tắc chỉ nói về **nguy hiểm so với trời**, và không ai kiểm nó so với mặt đường.
2. `nfr.md` không có ngưỡng nào áp cho vật thể trong cảnh — `NFR-A11Y-01` chỉ áp cho
   **chữ trong HUD**.
3. Cả 121 test đều đo **luật chơi**, và luật chơi vẫn đúng khi màn hình gần như trống.

Đồng thời người dùng yêu cầu bối cảnh **rừng rậm**, hai bên đường là **vực thẳm**, và
hình ảnh **trông thật hơn**.

## 2. Quyết định

**Bối cảnh: rừng rậm lúc sương sớm. Con đường là một cây cầu đá qua vực.**

Chọn sương sớm chứ không phải hoàng hôn hay ban ngày vì một lý do kỹ thuật: **sương
sáng nằm sau mọi thứ ở mọi khoảng cách**. Cấu trúc cảnh tự bảo đảm mọi vật thể đều có
nền sáng để in bóng lên, thay vì phải áp một nội quy lên từng vật thể và hy vọng không
ai quên.

**Luật hai lớp thay quy tắc một chiều của `ADR-0006`:**

> Mọi vật thể người chơi phải đọc trong một phần giây đều có **thân tối và cạnh sáng**.
> Nền tối thì cạnh đọc được; nền sáng thì thân đọc được; không tồn tại nền nào làm nó
> biến mất.

Xu đi theo chiều ngược lại vì thân xu vốn đã sáng: **thân vàng + vòng tối**. Cùng một
luật, đảo hai lớp.

Hai lớp **nướng thẳng vào hình học** bằng vertex color, không phải hai mesh chồng nhau:
không thêm draw call nào, và hai lớp không bao giờ lệch nhau một frame.

**Bảng màu** (13 cặp đo đạt, xem `docs/specs/jungle-dawn/design.md` §4): sương
`#CBD6C6` · tán `#0D1512` · đường `#6F6A5D` → `#A8AC9E` · vực `#05070A` · thân chướng
ngại `#191410` · cạnh sáng `#EAF0E6` · viền vịt `#FFD9A8` · xu `#FFC94A` + vòng
`#171208` · kỹ năng `#5BE0C8`.

**Ngôn ngữ hình khối:** nguy hiểm = cạnh thẳng, đối xứng, chắn ngang. Trang trí = cạnh
mềm, bất đối xứng. Bắt buộc, vì rừng rậm là môi trường ồn nhất về thị giác và đây là
môi trường vừa tự chọn.

**Chữ giữ nguyên:** `Bricolage Grotesque` 800 · `Chivo` · `Chivo Mono`. Không có lý do
nào để đổi, và đổi là mất một vòng đo lại toàn bộ.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Giữ hoàng hôn, chỉ thêm rừng và vực | Giữ được tên, tagline, ảnh README và mọi số đo HUD — nhưng rừng rậm lúc hoàng hôn thì tối, nên "trông thật hơn" gần như không đến; và lỗi 1.16:1 vẫn phải sửa bằng một nội quy riêng thay vì bằng cấu trúc |
| Rừng ban ngày, nắng xuyên tán | "Thật" nhất và đúng chợ nhất, nhưng nền xanh sáng đều là trường hợp **tệ nhất** để đọc chướng ngại: nền ồn, nhiều chi tiết, không có hướng sáng nào tách vật thể ra |
| Chiếu sáng thật + `MeshStandardMaterial` + shadow map | Hình khối cơ bản được chiếu sáng thật thường trông **tệ hơn** hình bóng dứt khoát; thêm một render pass; và phải giải lại bài đọc-chướng-ngại từ đầu vì màu vật liệu sẽ quyết định tương phản thay cho độ sáng |
| Chỉ đổi mapping input / chỉ làm chướng ngại sáng hơn | Che triệu chứng. Một chướng ngại sáng đọc được trên đường tối nhưng biến mất trên dải sương — đúng cái lỗi cũ, lật ngược |

## 4. Hệ quả

**Được:**

- Tương phản chướng ngại/mặt đường gần: **1.16:1 → 3.39:1**. Cặp yếu nhất trong cả
  bảng là 3.32:1 (kỹ năng trên mặt đường).
- Nguy hiểm vẫn mã hoá bằng **độ sáng**, không phải sắc màu — đúng với mọi loại mù màu,
  và giờ đúng ở **cả hai** loại nền chứ không chỉ nền trời.
- `NFR-A11Y-07` biến luật thiết kế thành **cổng CI**: 18 test tính tương phản WCAG trên
  chính các hằng trong `palette.ts`. Lần sau máy tìm ra trước người chơi.
- Vực, gờ đường và mặt đường nằm trong **một shader** đang có sẵn — không thêm draw
  call nào. Đo được **26 draw call** ở cảnh có 3 chướng ngại + 6 xu, ngưỡng là 100.
- `ADR-0005` để lại hai dải trống hai bên khung dọc trên desktop; hướng này biến chỗ đó
  thành mực rừng có chủ đích.

**Mất / phải chấp nhận:**

- **Scrim HUD từ alpha 0.45 → 0.55.** Đo được: trên dải sương sáng nhất, 0.45 chỉ còn
  **3.75:1** — dưới `NFR-A11Y-01`; 0.55 đạt **4.99:1**. Ràng buộc cứng lên mọi bố cục
  HUD, thay con số 0.45 của `ADR-0006`.
- **Viền nhân vật phải sáng lên.** `#F5A15C` cũ chỉ đạt **2.60:1** trên mặt đường mới.
  `#FFD9A8` đạt 4.04:1, và vẫn là màu **ấm** duy nhất trong cảnh.
- Tagline "chạy về phía mặt trời lặn" chết; đầu đề README và ảnh chụp phải làm lại.
- `--road-near` bị ràng buộc **hai đầu**: sáng hơn thì xu và kỹ năng tụt dưới 3:1, tối
  hơn thì chướng ngại tụt dưới 3:1. Khoảng hợp lệ của độ sáng chỉ là **13%–16.7%**. Đây
  là token khó đổi nhất trong bảng, và `contrast.test.ts` sẽ chặn nếu ai thử.
- Texture mặt đường bị khoá biên độ ở **±8%**: ±12% là đẩy cặp yếu nhất xuống dưới 3.
- Vẫn chỉ một chế độ tối, vẫn không light mode.

**Điều kiện xem lại quyết định này:** nếu đo được rằng dải sương và tán lá tốn quá nhiều
fill rate trên mobile thật và phải bỏ, thì lập luận "sương sáng nằm sau mọi thứ" mất căn
cứ và luật hai lớp phải được bảo đảm bằng cách khác.
