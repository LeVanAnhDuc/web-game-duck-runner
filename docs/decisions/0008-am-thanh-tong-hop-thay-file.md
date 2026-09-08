# ADR-0008 · Tổng hợp âm thanh bằng Web Audio, không dùng file và không dùng Howler

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** FR-27 · FR-28 · FR-29 · NFR-PERF-07 · NFR-SEC-07 · ADR-0007

## 1. Bối cảnh

`FR-27` và `FR-28` cần hiệu ứng âm thanh và nhạc nền. Kế hoạch ban đầu là Howler cộng
một bộ file CC0.

`ADR-0007` đã bỏ việc tải model ngoài, và lý do ở đó áp nguyên vào âm thanh: một
endless runner chỉ cần vài âm ngắn — nhảy, nhặt xu, va chạm, kỹ năng — và tất cả đều
là những âm mà bộ dao động tổng hợp được chính xác. Nhạc nền của game này là một
lớp pad hoàng hôn, cũng vậy.

Thêm nữa, tải file âm thanh làm phát sinh đúng cái vấn đề mà `NFR-PERF-07` đang canh:
thời gian từ lúc mở trang tới lúc chơi được.

## 2. Quyết định

Tổng hợp toàn bộ âm thanh bằng **Web Audio API** trong `src/audio/Audio.ts`. Không
file `.mp3`/`.ogg`, không Howler — **gỡ `howler` khỏi `package.json`**.

`AudioContext` chỉ được tạo ở **tương tác đầu tiên của người dùng**, không tạo lúc
tải trang: mọi trình duyệt hiện đại chặn tự động phát, và cố phát sớm sẽ để lại một
context ở trạng thái `suspended` mà không có gì báo.

Nhạc nền là một chuỗi hợp âm lặp, lập lịch trước theo đồng hồ của `AudioContext` chứ
không theo `setInterval` — `setInterval` bị trình duyệt giảm nhịp khi tab mất focus và
nhạc sẽ giật.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Howler + bộ file CC0 | Thêm một thư viện và vài trăm KB tài nguyên cho bốn âm ngắn; kéo dài thời gian tới lúc chơi được |
| Howler nhưng nguồn âm tổng hợp | Howler tồn tại để quản lý sprite âm thanh và tải file — bỏ file thì nó không còn việc gì |
| Không có âm thanh | Một game không âm thanh luôn bị cảm thấy chưa xong. Đây là dự án portfolio |
| Tự thu âm | Không có thiết bị, không có kỹ năng, và không giải quyết được gì mà bộ dao động không giải quyết được |

## 4. Hệ quả

**Được:**
- Không tài nguyên nhị phân nào trong repo, đúng như `ADR-0007`. Không giấy phép, không
  lệ thuộc bên ngoài.
- Bớt một dependency; bundle nhỏ hơn, thời gian tới lúc chơi được ngắn hơn.
- Âm thanh **tham số hoá**: cao độ của tiếng nhặt xu tăng dần theo chuỗi liên tiếp là
  vài dòng, không phải mười file.

**Mất / phải chấp nhận:**
- Trần thẩm mỹ thấp hơn âm thanh thu thật. Nghe ra là tổng hợp — chấp nhận được, vì
  hình ảnh cũng là hình khối tổng hợp.
- Phải tự viết phần lập lịch. `AudioContext` có những chỗ khác nhau giữa các trình
  duyệt, đặc biệt là Safari trên iOS.
- Không có nhạc nền phức tạp. Một lớp pad và một dòng bass là trần.

**Điều kiện xem lại quyết định này:** nếu có nhạc sĩ tham gia, hoặc nếu người chơi thật
nói phần âm thanh là điểm yếu rõ rệt.
