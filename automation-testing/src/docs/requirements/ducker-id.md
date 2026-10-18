# DUCKERID — Đăng nhập Ducker ID (sau cờ tính năng)

- **REQ-DUCKERID-01** Cờ tắt (bản deploy): không có nút đăng nhập, không request ra ngoài (trừ Google Fonts), không ghi `ducker.pkce`.
- **REQ-DUCKERID-02** Cờ tắt: `?code=&state=` lạ trên URL được để yên.
- **REQ-DUCKERID-03** Cờ bật: Đăng nhập → qua Ducker ID → quay về đúng màn chính với nút tài khoản (tên), URL sạch `code`/`state`, `ducker.pkce` đã xoá, không lỗi console.
- **REQ-DUCKERID-04** Menu tài khoản hiện tên, email, liên kết hồ sơ (`<issuer>/profile`, tab mới, `noopener`) và Đăng xuất; Esc đóng menu và trả focus về nút tài khoản; Đăng xuất trả focus về nút Đăng nhập.
- **REQ-DUCKERID-05** Tải lại trang thì về chưa đăng nhập (profile không được lưu).
- **REQ-DUCKERID-06** State sai hoặc Ducker ID trả lỗi/từ chối thì về chưa đăng nhập, im lặng, URL sạch.
- **REQ-DUCKERID-07** Đăng nhập không đổi save và game vẫn chơi được.
- **REQ-DUCKERID-08** Ở 375 px nút đăng nhập ≥ 44 px và menu tài khoản nằm trọn trong màn hình.
- **REQ-DUCKERID-09** Phím ↑/↓/Home/End chuyển focus giữa các mục của menu tài khoản.
