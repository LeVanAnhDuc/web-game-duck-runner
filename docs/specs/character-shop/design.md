# M3 · Cửa hàng nhân vật — thiết kế

**Liên quan:** FR-23 · FR-24 · FR-25 · FR-26 · NFR-A11Y-02 · NFR-A11Y-03 · NFR-DATA-04 ·
ADR-0004 · ADR-0007

**Xong nghĩa là:** mở cửa hàng từ màn chính, thấy bốn nhân vật với kỹ năng và giá, mua
được cái đủ tiền, chọn được cái đã mua, và lượt chơi sau dùng nhân vật đó.

## 1. Nhân vật khác nhau ở đâu

`ADR-0004`: **kỹ năng chủ động** khác nhau, **chỉ số cơ bản giống nhau**. Tốc độ, lực
nhảy, kích thước hitbox — y hệt giữa bốn nhân vật. Nếu khác thì phải cân bằng độ khó
cho từng nhân vật, và kỷ lục mất ý nghĩa so sánh với chính mình.

Thứ hai làm chúng khác nhau: **hình bóng**. `ADR-0007` dựng nhân vật bằng hình khối,
và vì cảnh ngược sáng nên người chơi chỉ thấy bóng — chi tiết mặt, màu áo, texture đều
vô nghĩa. Nên nhận dạng phải nằm ở tỉ lệ và cấu trúc: cao gầy, thấp đậm, có mũ, có tai,
có đuôi.

## 2. Ba trạng thái của một thẻ

| Trạng thái | Hiện gì | Bấm được không |
| --- | --- | --- |
| Chưa mua, **đủ** xu | giá màu vàng | **MUA** |
| Chưa mua, **không đủ** xu | giá màu mờ + *còn thiếu N* | không — nút bị vô hiệu |
| Đã mua, chưa chọn | không hiện giá | **CHỌN** |
| Đang dùng | nhãn *ĐANG DÙNG* | không |

`MASTER §7.1`: trạng thái vô hiệu **phải kèm chữ giải thích**, không bao giờ chỉ làm
mờ. Người chơi phải biết còn thiếu bao nhiêu xu, chứ không phải đoán tại sao nút không
bấm được.

## 3. Mua hai lần

Bấm **MUA** hai lần rất nhanh không được trừ tiền hai lần. Cách chặn: hàm mua nhận
trạng thái hiện tại và trả về trạng thái mới; nếu nhân vật đã thuộc sở hữu thì nó trả
về **chính trạng thái cũ**. Không phải một cờ `isBuying` — cờ thì phải nhớ dọn.

## 4. Lưu

Dùng lại `data/save.ts` từ M1, không thêm key nào. `sanitize()` đã lo phần khó: một
bản lưu bị sửa tay nói rằng sở hữu một nhân vật không có trong danh mục sẽ bị lọc bỏ,
và nhân vật mặc định luôn thuộc sở hữu — `NFR-DATA-04`.

## 5. Đổi nhân vật giữa hai lượt

Đổi nhân vật **không** ảnh hưởng lượt đang chơi. `GameHost.setCharacter()` dựng lại
hình bóng trong cảnh; lượt kế tiếp mới dùng kỹ năng mới. Đổi giữa lượt sẽ cho người
chơi ba kỹ năng trong một lượt.

## 6. Điều gì có thể sai

| Tình huống | Xử lý |
| --- | --- |
| Bấm mua hai lần | Hàm mua là idempotent theo `id` |
| Mua khi không đủ xu | Nút vô hiệu **và** hiện số xu còn thiếu |
| Bản lưu nói sở hữu một nhân vật không tồn tại | `sanitize()` lọc bỏ |
| Bản lưu nói đang dùng một nhân vật chưa sở hữu | Về nhân vật mặc định |
| Ghi vào `localStorage` thất bại | `save()` trả về false; ví trong bộ nhớ vẫn đúng cho phiên này |
| Đi bằng bàn phím | Mọi thẻ và nút vào được bằng Tab, focus thấy được (`NFR-A11Y-02`) |
