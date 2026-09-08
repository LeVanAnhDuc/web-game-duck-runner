# M2 · Xu, kỹ năng, power-up — thiết kế

**Liên quan:** FR-13 · FR-14 · FR-15 · FR-16 · FR-17 · FR-18 · FR-19 · FR-20 · FR-21 ·
FR-22 · NFR-A11Y-03 · NFR-A11Y-05 · ADR-0004 · ADR-0008

**Xong nghĩa là:** nhặt xu nạp đầy thanh, bấm kỹ năng đúng lúc để thoát chết, gặp
power-up rơi trên đường, và tạm dừng được mà bộ đếm dừng theo.

## 1. Ranh giới giữa kỹ năng và power-up

Đây là quyết định nền của cả mốc. Hai hệ thống có **cùng cơ chế** — hiệu ứng có thời
hạn — nhưng khác nhau ở đúng một điểm, và điểm đó quyết định tất cả:

| | Power-up | Kỹ năng nhân vật |
| --- | --- | --- |
| Nguồn | nhặt trên đường, ngẫu nhiên | nạp bằng xu, người chơi bấm |
| Thời điểm | không chọn được | **do người chơi chọn** |
| Vai trò | phần thưởng bất ngờ | công cụ cứu nguy |

Hệ quả cứng: **kỹ năng phải là thứ mà bấm đúng lúc mới có giá trị.** Nếu hiệu quả
không phụ thuộc thời điểm thì để nó tự động còn hơn — và lúc đó nó là power-up.

Vì cơ chế giống nhau, cả hai dùng chung `game/ActiveEffects.ts`. Chỉ nguồn kích hoạt
là khác.

## 2. Thanh nạp

Xu nhặt trong lượt **vừa nạp thanh vừa vào ví**. Dùng kỹ năng chỉ reset thanh, không
trừ ví — `invariants.md` §11. Nếu dùng kỹ năng mà mất xu tiết kiệm thì người chơi sẽ
ngại dùng đúng cái cơ chế vui nhất trong game, và cả mốc này thành vô nghĩa.

Quyết định vẫn còn nguyên: vẫn phải chọn **bấm lúc nào**.

## 3. Ba kỹ năng — giải ba vấn đề khác nhau, không mạnh hơn nhau

| Kỹ năng | Làm gì | Cứu tình huống nào |
| --- | --- | --- |
| **Ủi** | húc vỡ mọi chướng ngại chạm phải | bị dồn vào thế không còn làn trống |
| **Chậm** | giảm tốc độ thế giới còn 55% | tốc độ đã vượt phản xạ |
| **Bay** | bay qua đầu mọi thứ, tự hút xu | không phải để sống sót — đổi quãng đường lấy xu |

Ba cái này **không so sánh trực tiếp được với nhau**, nên không phải cân bằng chúng.
Điều duy nhất phải giữ bằng nhau: **chi phí nạp và thời lượng** — `ADR-0004`.

## 4. Ba power-up

| Power-up | Làm gì |
| --- | --- |
| **Nam châm** | hút xu trong bán kính rộng |
| **Khiên** | bỏ qua **một** lần va chạm, rồi mất |
| **Tua nhanh** | bất tử và tăng tốc trong thời gian giới hạn |

Khiên là loại **đếm lần**, không phải đếm giờ — nó nằm cùng module nhưng khác kiểu.

## 5. Va chạm khi đang bất tử

Một bảng, vì đây là chỗ dễ để lọt trạng thái:

| Trạng thái | Chạm chướng ngại |
| --- | --- |
| bình thường | chết |
| Ủi · Bay · Tua nhanh | chướng ngại **vỡ**, lượt tiếp tục |
| Khiên | khiên mất, chướng ngại vỡ, **bất tử ngắn** để không chết ngay bởi vật kế tiếp |

Bất tử ngắn sau khi khiên vỡ là bắt buộc: chướng ngại trong một cụm cách nhau 7.5m,
tức là ~0.3 giây ở tốc độ trần. Không có nó thì khiên chỉ sống được một phần giây.

## 6. Tạm dừng — `FR-22`

Bấm Esc / P / nút tạm dừng. **Đồng hồ mô phỏng dừng**, nên mọi bộ đếm hiệu ứng dừng
theo — `invariants.md` §5. Đây là lý do `SimClock` tồn tại từ M1.

Vòng lặp render vẫn chạy để cảnh không đóng băng cứng, nhưng không có bước mô phỏng
nào được chạy.

## 7. Điều gì có thể sai

| Tình huống | Xử lý |
| --- | --- |
| Bấm kỹ năng khi thanh chưa đầy | Một nhịp rung 120ms — phản hồi rõ, không im lặng (`MASTER §7.5`) |
| Tạm dừng giữa lúc kỹ năng đang chạy | Bộ đếm dừng theo đồng hồ mô phỏng |
| Kỹ năng hết hạn đúng lúc đang ở giữa chướng ngại | Hết hạn phải kết thúc ở trạng thái an toàn: vật thể đang chồng lấn bị vỡ nốt |
| Hai power-up cùng loại chồng nhau | Gia hạn, không cộng dồn |
| Nhặt power-up trong lúc Bay | Vẫn nhận, hai hiệu ứng chạy song song |
| Bấm nút kỹ năng bị hiểu thành vuốt | Vùng loại trừ cử chỉ, đã làm ở M1 |

## 8. Kiểm thử

- Bộ đếm chạy theo **đồng hồ mô phỏng**: tạm dừng 10 giây thì thời gian còn lại không đổi
- Bất tử: chạm chướng ngại không kết thúc lượt, và chướng ngại bị vô hiệu
- Khiên: đúng **một** lần, lần thứ hai thì chết
- Gia hạn power-up không cộng dồn thời lượng quá trần
- Thanh nạp đầy đúng ở `CHARGE_COINS` xu, dùng kỹ năng reset về 0, **ví không đổi**
- Tất định vẫn giữ khi có kỹ năng trong chuỗi input
