# TEXTURES — Ảnh CC0 tải sau frame đầu

- **REQ-TEXTURES-01** Hai ảnh (`jungle-far.webp`, `jungle-screen.webp`) chỉ được yêu cầu sau khi trang đã vẽ; màn chính bấm chơi được trước khi ảnh về.
- **REQ-TEXTURES-02** Ảnh nền màn 2D được dùng sau khi tải xong (`body[data-textures=on]`).
- **REQ-TEXTURES-03** Bật tiết kiệm dữ liệu (`navigator.connection.saveData`) thì không tải ảnh nào.
- **REQ-TEXTURES-04** Ảnh tải lỗi thì game vẫn chơi bình thường, không lỗi trang.
- **REQ-TEXTURES-05** Tổng dung lượng ảnh tải về ≤ 200 KB.
