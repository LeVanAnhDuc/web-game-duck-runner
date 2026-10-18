# PERSISTENCE — Lưu tiến độ trên máy

- **REQ-PERSISTENCE-01** Sau mỗi lượt, kỷ lục và ví được ghi vào localStorage `duck-runner.save.v1` (có `version`) và còn sau khi tải lại.
- **REQ-PERSISTENCE-02** Save không đọc được (không phải JSON) thì về mặc định, game vẫn chơi được, không lỗi trang.
- **REQ-PERSISTENCE-03** Trường sai kiểu, âm hoặc vượt biên được thay bằng mặc định hoặc kẹp vào biên, không thành NaN.
- **REQ-PERSISTENCE-04** Save dưới khoá cũ `duskrun.save.v1` vẫn được đọc; lần ghi sau sang khoá mới.
- **REQ-PERSISTENCE-05** Trình duyệt chặn localStorage thì game vẫn mở và chơi hết lượt (chỉ không nhớ).
