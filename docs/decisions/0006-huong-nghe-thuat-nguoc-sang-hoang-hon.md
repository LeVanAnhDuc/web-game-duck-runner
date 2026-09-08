# ADR-0006 · Hướng nghệ thuật "ngược sáng lúc hoàng hôn", bỏ đề xuất pixel art

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** FR-08 · FR-30 · FR-31 · NFR-A11Y-01 · NFR-A11Y-03 · ADR-0001 · ADR-0005

## 1. Bối cảnh

`design-bootstrap` bước 1 chạy `ui-ux-pro-max` để lấy ràng buộc và đề xuất. Kết quả
trả về: style **Pixel Art**, cặp chữ **Press Start 2P / VT323**, và bảng màu
`#DC2626` đỏ + `#2563EB` lam + `#22C55E` lục trên nền `#0F172A`.

Ba vấn đề, theo thứ tự nghiêm trọng giảm dần:

1. **Bảng màu vi phạm chính ràng buộc a11y của bước 1.** Đo bằng công thức WCAG 2.1:
   `#DC2626` trên `#0F172A` đạt **3.70:1**, `#2563EB` đạt **3.45:1** — cả hai dưới
   ngưỡng 4.5:1 mà chính bước 1 đặt ra là không được ghi đè.
2. **Pixel art mâu thuẫn trực tiếp với `ADR-0001`.** Dự án dựng cảnh 3D low-poly bằng
   Three.js với model `.glb` của Kenney. Pixel art là phong cách raster độ phân giải
   thấp; ghép hai thứ này lại thì hoặc phải bỏ model 3D, hoặc phải giả pixel bằng
   post-process — cả hai đều đắt và đều không phục vụ gì.
3. **Cả bảng màu lẫn cặp chữ đều là mặc định của danh mục.** Bốn màu trả về đúng là
   Tailwind `red-600`/`blue-600`/`green-500`/`slate-900` không sửa. `Press Start 2P`
   là font "game indie" phổ biến nhất trên Internet, và ở cỡ nhỏ nó gần như không đọc
   được — trong khi HUD của game này chủ yếu là số.

## 2. Quyết định

**Hướng nghệ thuật: ngược sáng lúc hoàng hôn.** Camera nhìn về phía mặt trời lặn.
Một quy tắc chi phối toàn bộ: *thứ phải tránh là bóng đen không màu, thứ muốn lấy thì
phát sáng.* Chướng ngại là khối `#120E1F` cắt trên dải trời tím→hổ phách; xu là vật
duy nhất màu vàng `#FFC94A`; kỹ năng sẵn sàng là thứ duy nhất màu aqua `#5BE0C8`.

**Chữ:** `Bricolage Grotesque` 800 cho hiển thị, `Chivo` cho giao diện, `Chivo Mono`
cho mọi số đổi mỗi frame.

**Yếu tố đặc trưng:** "đường chân trời" — dải gradient tím→hổ phách cao 3px, dùng
đúng ba chỗ: thanh nạp kỹ năng, gạch chân tiêu đề, đường chia panel.

Ràng buộc a11y/UX của bước 1 **giữ nguyên toàn bộ**: 4.5:1, vùng bấm 44px, focus nhìn
thấy được, `prefers-reduced-motion`, transition 150–300ms, bốn khổ màn hình, không
emoji làm icon.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Pixel art + Press Start 2P + bảng Tailwind (đề xuất bước 1) | Mâu thuẫn với `ADR-0001`; hai màu trượt ngưỡng contrast do chính bước 1 đặt; font không đọc được ở cỡ HUD |
| Neon magenta + cyan trên nền tối ("synthwave") | Tương phản tốt và hợp thể loại, nhưng là mặc định thứ hai của danh mục game, ngay sau pixel art |
| Phân biệt nguy hiểm/phần thưởng bằng cặp đỏ–lục | Cặp màu tệ nhất cho mù màu đỏ-lục, mà đây là tín hiệu người chơi phải đọc trong một phần giây |
| Ban ngày sáng đều, model giữ màu gốc | Model CC0 ghép từ nhiều bộ sẽ lộ ra là chắp vá; và không có tín hiệu độ sáng nào để tách nguy hiểm khỏi phần thưởng |

## 4. Hệ quả

**Được:**
- Tín hiệu nguy hiểm mã hoá bằng **độ sáng**, không phải sắc màu — đúng với mọi loại
  mù màu. Đo giả lập deuteranopia: chướng ngại 0.6% độ sáng, xu 82%.
- Model CC0 từ nhiều bộ khác nhau trở nên nhất quán mà không phải sửa file nào, vì
  chúng thành bóng.
- Mọi cặp màu/nền trong UI đo được đều vượt 4.5:1, thấp nhất là 6.69:1.
- `ADR-0005` để lại hai dải trống hai bên khung dọc trên desktop; hướng này biến chỗ
  trống đó thành nền hoàng hôn có chủ đích thay vì khoảng đen thừa.

**Mất / phải chấp nhận:**
- **HUD bắt buộc phải có scrim.** Chữ thường trên chân trời sáng nhất chỉ đạt
  **1.84:1**. Đo được: scrim `#120E1F` ở alpha **0.45** là mức tối thiểu đạt 4.5:1
  (chính xác 4.81:1). Đây là ràng buộc cứng lên mọi bố cục HUD, không phải gợi ý.
- Vàng và aqua bị khoá làm màu ngữ nghĩa — không được dùng cho việc trang trí ở bất
  kỳ đâu, kể cả khi trông đẹp.
- Chỉ có một chế độ tối. Không làm light mode.
- Ngược sáng nghĩa là chi tiết mặt nhân vật gần như không thấy; nhân vật phân biệt
  nhau bằng **hình bóng**, và điều đó ràng buộc việc chọn model ở mốc M3.

**Điều kiện xem lại quyết định này:** nếu đo được rằng dải trời gradient tốn quá
nhiều fill rate trên mobile và phải thay bằng nền phẳng, thì toàn bộ lập luận về
tương phản độ sáng phải tính lại từ đầu.
