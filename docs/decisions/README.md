# Quyết định kiến trúc (ADR)

> **Trả lời:** Sáu tháng sau — tại sao lại làm thế này?
> **Cập nhật khi:** chốt một quyết định kỹ thuật. Ghi **ngay trong phiên đó**.

## Mục lục

<!-- BEGIN:auto — bảng dưới do .claude/scripts/docs-regen.sh sinh từ các file ADR. Đừng sửa tay. -->
| ID | Tiêu đề | Ngày | Trạng thái |
| --- | --- | --- | --- |
| [ADR-0001](0001-dung-three-js-thay-phaser.md) | Dùng Three.js với model low-poly CC0 thay vì Phaser hoặc PixiJS | 2026-09-08 | accepted |
| [ADR-0002](0002-tach-mo-phong-khoi-hien-thi.md) | Tách mô phỏng khỏi hiển thị: `game/` không được import `three` | 2026-09-08 | accepted |
| [ADR-0003](0003-react-chi-o-lop-ui.md) | React chỉ dùng cho lớp UI, không dùng cho cảnh 3D | 2026-09-08 | accepted |
| [ADR-0004](0004-nhan-vat-khac-ky-nang-giong-chi-so.md) | Nhân vật khác nhau ở kỹ năng chủ động, giống nhau ở chỉ số cơ bản | 2026-09-08 | accepted |
| [ADR-0005](0005-khoa-goc-nhin-theo-chieu-doc.md) | Khoá góc nhìn theo chiều dọc, đóng khung canvas trên màn hình rộng | 2026-09-08 | accepted |
| [ADR-0006](0006-huong-nghe-thuat-nguoc-sang-hoang-hon.md) | Hướng nghệ thuật "ngược sáng lúc hoàng hôn", bỏ đề xuất pixel art | 2026-09-08 | superseded bởi `ADR-0009` (2026-09-10) |
| [ADR-0007](0007-dung-hinh-khoi-thay-model-tai-ve.md) | Dựng vật thể bằng hình khối trong code, không tải model ngoài | 2026-09-08 | superseded bởi `ADR-0010` (2026-09-10) |
| [ADR-0008](0008-am-thanh-tong-hop-thay-file.md) | Tổng hợp âm thanh bằng Web Audio, không dùng file và không dùng Howler | 2026-09-08 | accepted |
| [ADR-0009](0009-rung-suong-som-thay-nguoc-sang-hoang-hon.md) | Rừng sương sớm, và luật hai lớp thay quy tắc in bóng một chiều | 2026-09-10 | accepted |
| [ADR-0010](0010-anh-cc0-that-tai-sau-frame-dau.md) | Ảnh CC0 thật, tải sau frame đầu — và chỗ nào thì ảnh vô dụng | 2026-09-10 | accepted |
<!-- END:auto -->

Trạng thái: `accepted` · `superseded by ADR-00xx` · `deprecated`

## Cách thêm một ADR

1. Lấy số kế tiếp, tạo `NNNN-<slug-tieng-anh>.md` từ [`_template.md`](_template.md).
   Ví dụ: `0003-dung-prisma-thay-typeorm.md`.
2. Điền. Giữ trong khoảng 15–40 dòng.
3. Thêm một dòng vào bảng trên.

## Ba quy tắc

- **Một quyết định, một file.** File thứ hai bàn cùng chuyện nghĩa là quyết định đầu chưa dứt.
- **Append-only.** ADR đã `accepted` thì **không sửa nội dung**. Đổi ý thì viết ADR mới, ghi `supersedes ADR-0007`, và đổi ADR cũ sang `superseded by`.
- **Ghi ngay khi chốt**, không để cuối phiên. Ngữ cảnh của một phiên dài có thể bị nén trước khi phiên kết thúc, và lúc đó lý do đã mất.

## Khi nào cần ADR

Cần: chọn thư viện/framework/datastore · đổi ranh giới module · chọn cách xử lý một vấn đề mà có ≥ 2 phương án hợp lý · chấp nhận một hạn chế lâu dài.

Không cần: sửa bug · thêm chức năng theo đúng khuôn có sẵn · quyết định có thể đảo trong 10 phút.
