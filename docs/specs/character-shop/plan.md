# M3 · Cửa hàng nhân vật — kế hoạch

- [x] A1 · `data/shop.ts` — `cardState` · `shortfall` · `buy` · `equip`, hàm thuần
- [x] A2 · `buy` **idempotent theo id**: bấm hai lần không trừ tiền hai lần
- [x] B1 · `ui/screens/Shop.tsx` — lưới thẻ, bốn trạng thái
- [x] B2 · Trạng thái vô hiệu kèm *còn thiếu N xu* (`MASTER §7.1`)
- [x] B3 · Hình bóng SVG đọc **cùng** bảng `SILHOUETTES` mà `render/` dùng
- [x] C1 · Wire vào `App`: mua · chọn · đổi hình bóng trong cảnh ngay
- [x] C2 · Đổi nhân vật **không** ảnh hưởng lượt đang chơi
- [x] D1 · 16 test mới, gồm bản lưu bị sửa tay
- [x] E1 · `scripts/measure-economy.ts` — đo **29.8 xu/phút**
- [x] E2 · Đặt lại giá 80 / 200 / 360 theo số đo, ghi lý do vào `catalog.ts`
- [x] F1 · Điền `glossary.md` — giờ đã có code thật để khoá tên
- [x] F2 · Xem tận mắt; sửa hai lỗi: hình bóng quá nhỏ, phụ kiện đầu ra ngoài viewBox
