# Bất biến chịu lực

> **Trả lời:** Sửa gì thì hệ thống sai **âm thầm** — test vẫn xanh mà kết quả vẫn sai?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-10 · commit —
> **Cập nhật khi:** phát hiện một bất biến mới — thường là ngay sau khi ai đó vừa phá nó

<!-- CÁCH ĐIỀN
ĐỌC FILE NÀY TRƯỚC KHI SỬA BẤT KỲ DÒNG CODE NÀO.

Bất biến ở đây KHÁC quy ước code. Quy ước format/naming thì ESLint bắt được; bất
biến thì không có công cụ nào bắt, và vi phạm nó thì code vẫn chạy, test vẫn xanh,
chỉ có kết quả là sai.

GIỮ FILE NÀY < 40 DÒNG NỘI DUNG. Nó được đọc mỗi lần sửa code; dài ra là không ai
đọc nữa. Thứ gì không thuộc loại "sai âm thầm" thì bỏ ra khỏi đây.

KHÔNG chứa: quy ước format/naming (-> lint config), kiến trúc (-> architecture.md).
-->

| # | Bất biến | Vi phạm thì sao |
| --- | --- | --- |
| 1 | Va chạm kiểm theo **vị trí thật** của nhân vật, không theo làn đích | Bấm đổi làn đúng lúc là xuyên qua chướng ngại. Game vẫn chạy, test vẫn xanh, có một lỗ khai thác |
| 2 | Mô phỏng chạy ở **bước thời gian cố định**; render nội suy. Logic không bao giờ dùng độ dài frame thật | Máy 144Hz chơi game nhanh gấp đôi; máy tụt frame thì nhân vật nhảy xuyên vật thể |
| 3 | Khoảng cách sinh chướng ngại = **thời gian phản ứng tối thiểu × tốc độ hiện tại**, không phải hằng số khoảng cách | Sau khoảng một phút, game trở thành bất khả chứ không phải khó. Không ai báo lỗi, họ chỉ bỏ chơi |
| 4 | `game/` **không import `three`** và không chạm DOM | Mọi test gameplay phải bật trình duyệt, và trên thực tế sẽ không ai viết chúng nữa |
| 5 | Mọi bộ đếm thời gian của hiệu ứng chạy theo **đồng hồ mô phỏng**, không phải `Date.now()` | Tạm dừng không dừng bộ đếm — kỹ năng hết hạn trong lúc người chơi đang xem menu |
| 6 | Góc nhìn khoá theo **chiều dọc**; màn hình rộng không được nhìn xa hơn | Người chơi màn hình rộng thấy chướng ngại sớm hơn — game dễ hơn thật sự mà không ai nhận ra |
| 7 | React **không re-render trong lúc đang chơi**; HUD cập nhật qua ref | Mỗi lần điểm đổi là một lần reconcile — frame rớt đều đặn, đổ lỗi nhầm cho Three.js |
| 8 | Dữ liệu đọc từ `localStorage` phải **validate trước khi dùng**; hỏng thì về mặc định | Một field thiếu thành `NaN` lan khắp phần tính điểm. Không crash, chỉ hiện `NaN` |
| 9 | Vật thể trong vòng lặp lấy từ **pool**, không `new` rồi vứt mỗi frame | GC gom rác giữa lúc chơi gây khựng theo chu kỳ, rất khó truy vì không tái lập được |
| 10 | Mọi pattern trong `data/patterns` phải **tồn tại ít nhất một đường đi qua** | Người chơi chết oan vì cả ba làn bị chắn. Trông giống game khó, thật ra là bug dữ liệu |
| 11 | Xu nhặt trong lượt **vừa nạp thanh kỹ năng vừa vào ví**; dùng kỹ năng chỉ reset thanh, không trừ ví | Người chơi ngại dùng cơ chế vui nhất trong game vì sợ mất tiến độ |
| 12 | Các nhân vật có **cùng chỉ số cơ bản** — tốc độ, lực nhảy, kích thước hitbox | Điểm cao mất ý nghĩa so sánh, và độ khó phải cân lại cho từng nhân vật |
| 13 | **Làn 0 phải hiện ra ở nửa trái màn hình.** Camera đứng ở z âm và nhìn về +z, nên "phải của màn hình" là −X: phép lật nằm ở `world.scale.x = -1`, đúng một chỗ | Bấm mũi tên trái thì nhân vật nhảy sang phải. Luật chơi vẫn đúng, mọi test luật vẫn xanh — chỉ người chơi là sai, và không ai đoán được nguyên nhân nằm ở camera |
