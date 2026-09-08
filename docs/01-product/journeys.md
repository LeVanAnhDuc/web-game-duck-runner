# Luồng người dùng

> **Trả lời:** Người dùng đi qua những luồng nào từ đầu đến cuối?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-08 · commit —
> **Cập nhật khi:** có luồng người dùng mới · một luồng cũ đổi bản chất

<!-- CÁCH ĐIỀN
Viết bằng NGÔN NGỮ NGƯỜI DÙNG. Không có tên bảng, tên endpoint, tên component ở đây.
Mỗi luồng một mục, ID tăng dần US-01, US-02... không tái dùng số.

Mục "Điều gì có thể sai" là mục có giá trị nhất — nó là nguồn của test case và của
các trạng thái lỗi trên UI. Bỏ trống mục đó thì AI sẽ chỉ hiện thực đường đi đẹp.

KHÔNG chứa: chi tiết bố cục UI, danh mục chức năng (-> 02-requirements/scope.md).
-->

## US-01 · Lượt chơi đầu tiên

**Bối cảnh:** Người xem portfolio mở link trên điện thoại, chưa biết đây là game gì,
không có ý định đọc hướng dẫn.

**Các bước:**
1. Mở trang. Thấy màn hình chính với một nút bắt đầu rõ ràng.
2. Bấm bắt đầu. Nhân vật chạy tự động ở làn giữa.
3. Vuốt trái/phải để né, vuốt lên để nhảy, vuốt xuống để trượt.
4. Va vào chướng ngại. Lượt kết thúc.
5. Thấy quãng đường vừa đạt, số xu nhặt được, và nút chơi lại.

**Kết quả mong đợi:** Hiểu được cách chơi mà không cần đọc chữ; điểm cao được lưu
trên máy nên lần sau quay lại vẫn còn.

**Điều gì có thể sai:**
- Tải model và âm thanh lâu → người chơi thấy màn hình trắng rồi thoát. Phải có
  trạng thái tải nhìn thấy được, và chơi được ngay khi đủ tài nguyên tối thiểu.
- Thiết bị không hỗ trợ WebGL, hoặc trình duyệt tắt hardware acceleration → phải
  báo rõ bằng chữ, không để canvas đen.
- Vuốt bị trình duyệt hiểu thành cuộn trang hoặc kéo-để-tải-lại.
- Người chơi không nhận ra vuốt được → cần gợi ý cử chỉ ở vài giây đầu.
- Xoay ngang máy giữa lượt.

**Chức năng liên quan:** FR-01 · FR-02 · FR-03 · FR-04 · FR-05 · FR-06 · FR-07 · FR-08 · FR-09 · FR-10 · FR-11

---

## US-02 · Chơi lại để phá kỷ lục của chính mình

**Bối cảnh:** Vừa chết ở lượt trước, đang nhìn màn kết thúc, biết kỷ lục cũ của mình.

**Các bước:**
1. Bấm chơi lại ngay trên màn kết thúc.
2. Lượt mới bắt đầu, không quay về màn hình chính.
3. Trong lúc chơi thấy quãng đường hiện tại; khi vượt kỷ lục cũ thì được báo.
4. Chết. Nếu vượt kỷ lục, màn kết thúc nói rõ đó là kỷ lục mới.

**Kết quả mong đợi:** Vòng lặp chơi-lại không có ma sát; kỷ lục mới ghi đè kỷ lục cũ
trên máy.

**Điều gì có thể sai:**
- Bấm chơi lại quá nhanh khi lượt trước chưa dọn xong → hai lượt chồng nhau.
- Đóng tab đúng lúc đang ghi → dữ liệu lưu dở.
- Dữ liệu lưu từ phiên bản cũ không đọc được → phải về mặc định, không được hỏng game.

**Chức năng liên quan:** FR-07 · FR-09 · FR-10

---

## US-03 · Dùng kỹ năng để cứu một lượt

**Bối cảnh:** Đang chơi, tốc độ đã cao, thanh nạp vừa đầy nhờ nhặt đủ xu.

**Các bước:**
1. Nhặt xu trên đường; thanh nạp đầy dần.
2. Thanh đầy — nút kỹ năng chuyển sang trạng thái sẵn sàng, thấy được bằng thị giác
   ngoại vi.
3. Gặp tình huống khó (bị dồn vào thế không còn làn trống, hoặc tốc độ vượt phản xạ).
4. Bấm nút kỹ năng. Hiệu ứng chạy trong khoảng thời gian giới hạn.
5. Hết thời gian, thanh nạp về 0, chơi tiếp bình thường.

**Kết quả mong đợi:** Người chơi cảm thấy chính mình quyết định thời điểm, không phải
may rủi. Xu đã nhặt vẫn vào ví dù có dùng kỹ năng.

**Điều gì có thể sai:**
- Bấm nút kỹ năng bị hiểu nhầm thành vuốt đổi làn.
- Bấm khi thanh chưa đầy → phải phản hồi rõ là chưa sẵn sàng, không im lặng.
- Tạm dừng giữa lúc kỹ năng đang chạy → bộ đếm phải dừng theo.
- Kỹ năng kết thúc đúng lúc đang ở vị trí không thể thoát → hiệu ứng phải kết thúc ở
  trạng thái an toàn.

**Chức năng liên quan:** FR-12 · FR-14 · FR-15 · FR-16 · FR-17 · FR-18 · FR-22

---

## US-04 · Tích xu và mua nhân vật mới

**Bối cảnh:** Đã chơi vài lượt, ví có xu, muốn đổi thứ gì đó.

**Các bước:**
1. Từ màn hình chính vào cửa hàng.
2. Xem danh sách nhân vật: cái nào đã có, cái nào còn thiếu bao nhiêu xu, mỗi cái
   mang kỹ năng gì.
3. Mua một nhân vật đủ tiền. Xu trừ khỏi ví.
4. Chọn nhân vật đó làm nhân vật đang dùng.
5. Quay lại chơi — nhân vật và kỹ năng đã đổi.

**Kết quả mong đợi:** Ví và quyền sở hữu được lưu trên máy; chọn nhân vật đổi kỹ năng
chứ không đổi độ khó.

**Điều gì có thể sai:**
- Bấm mua hai lần → trừ tiền hai lần.
- Mua khi không đủ xu → nút phải chặn trước, không để lỗi sau khi bấm.
- Model của nhân vật mới tải chưa xong khi lượt bắt đầu.
- Dữ liệu lưu bị sửa tay khiến sở hữu một nhân vật không có trong danh mục.

**Chức năng liên quan:** FR-13 · FR-23 · FR-24 · FR-25 · FR-26

---

## US-05 · Chơi ở nơi cần im lặng

**Bối cảnh:** Đang ở văn phòng hoặc trên xe, mở game nhưng không muốn phát ra tiếng.

**Các bước:**
1. Vào cài đặt từ màn hình chính, hoặc bấm nút tắt tiếng ngay khi vừa vào.
2. Tắt nhạc nền và/hoặc hiệu ứng âm thanh.
3. Chơi bình thường.
4. Lần sau mở lại — vẫn đang tắt tiếng.

**Kết quả mong đợi:** Không có âm thanh nào phát ra trước khi người chơi chạm vào
trang; lựa chọn tắt tiếng được nhớ.

**Điều gì có thể sai:**
- Trình duyệt chặn tự động phát âm thanh → không được coi đó là lỗi, phải chờ tương
  tác đầu tiên.
- Người dùng bật `prefers-reduced-motion` ở hệ điều hành → phải giảm hiệu ứng trang
  trí mà không làm hỏng vòng chơi.

**Chức năng liên quan:** FR-27 · FR-28 · FR-29 · FR-30
