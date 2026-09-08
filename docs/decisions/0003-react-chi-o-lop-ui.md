# ADR-0003 · React chỉ dùng cho lớp UI, không dùng cho cảnh 3D

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** FR-08 · FR-11 · FR-26 · FR-29 · NFR-A11Y-02 · NFR-PERF-05

## 1. Bối cảnh

Ngoài vòng chơi còn năm màn hình có trạng thái thật: màn chính, cửa hàng, cài đặt,
tạm dừng, kết thúc lượt. Cửa hàng có danh sách, quyền sở hữu, trạng thái đủ/không đủ
xu — viết bằng DOM thuần sẽ thành một mớ cập nhật thủ công.

Ngược lại, cảnh 3D chạy 60 lần mỗi giây và không có gì để reconcile.

## 2. Quyết định

React dựng các màn hình ngoài lúc chơi, trên DOM, chồng lên canvas. Cảnh 3D là
Three.js thuần, **không dùng react-three-fiber**.

Kèm một ràng buộc cứng: **React không re-render trong lúc đang chơi.** HUD — quãng
đường, ví xu, thanh nạp — cập nhật bằng cách ghi thẳng vào DOM qua ref, không qua
state. Xem `invariants.md` §7.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| react-three-fiber cho cả cảnh 3D | Đặt cảnh dưới reconciler của React và thêm một tầng trừu tượng nữa lên trên Three.js — nhiều bẫy hiệu năng hơn, khó truy hơn khi người viết còn mới với 3D |
| DOM thuần bằng TypeScript, không framework | Bundle nhỏ nhất và không có rủi ro re-render, nhưng cửa hàng và cài đặt sẽ thành cập nhật DOM thủ công |
| Đưa HUD vào trong canvas, vẽ bằng Three.js | Mất luôn a11y, mất luôn khả năng dùng CSS cho responsive, và chữ trong canvas khó đạt `NFR-A11Y-01` |

## 4. Hệ quả

**Được:**
- Các màn hình có state phức tạp viết dễ và sửa dễ.
- HUD và mọi màn hình đều là DOM: `NFR-A11Y-01`…`04` kiểm được bằng công cụ thông thường, responsive làm bằng CSS.

**Mất / phải chấp nhận:**
- Bundle lớn hơn phương án DOM thuần.
- Hai mô hình cập nhật trong cùng một dự án: React ở ngoài, ghi thẳng DOM ở HUD. Đây là chỗ dễ bị phá nhất, và vi phạm thì biểu hiện là rớt frame chứ không phải lỗi — nên nó nằm trong `invariants.md`.

**Điều kiện xem lại quyết định này:** nếu số màn hình ngoài vòng chơi giảm còn hai
hoặc ba màn tĩnh, thì React không còn đáng giá.
