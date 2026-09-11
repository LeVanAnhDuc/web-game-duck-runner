# Phiên 3 · p03 Hạnh · RR-03 — Nhận ra kỹ năng đã sẵn sàng, rồi dùng nó

- **emulate:** `1440x900x1`, không `mobile`, không `touch`, không throttle
- **Thiết bị đầu vào:** **chỉ bàn phím.** Luật khoá tuyệt đối trong brief; persona tuân thủ,
  không lách sang chuột lần nào.
- **Tool:** chrome-devtools-mcp · agent `ux-persona`
- **Thời lượng:** 479.6 s · **40 tool call** · persona tự đếm **~39 hành động**, sát trần 40
- **Kết quả:** **KHÔNG ĐẠT `done_when`.** Hạnh chơi 2 ván, đạt 202 m, **và không một lần nào
  nhắc tới thanh nạp hay nút kỹ năng** — không phải "bấm mà không được", mà là **không hề
  nhận ra nó tồn tại**. Dừng vì sát trần hành động, không phải vì bỏ cuộc.

---

## 1. Chuyện đã xảy ra (nguyên văn persona)

Mở link ra thấy một trang tối màu, có con đường xuyên khu rừng đen, chữ "DUCK RUNNER" to, dưới
có câu "Ba làn. Một kỹ năng. Một con đường qua vực." Tôi nghĩ trong đầu: "À, chắc đây là game
chạy né vật, ba làn đường như cái dòng chữ nhỏ phía dưới ghi." Tôi thấy dòng **"VUỐT ĐỂ ĐỔI
LÀN · NHẢY · TRƯỢT"** — nghĩ ngay: **"Chết rồi, hướng dẫn này là cho người vuốt tay, còn mình
gõ phím, không biết có ánh xạ sang phím mũi tên không hay là bó tay."**

Việc đầu tiên tôi luôn làm: bấm Tab xem có viền sáng không. Bấm phát đầu tiên, **viền xanh
ngọc hiện quanh nút "CHƠI" luôn** — mừng, nghĩ "may quá, trang này dùng được." Tab thêm phát
nữa nhảy sang "CỬA HÀNG", cũng thấy viền rõ. Tôi lùi lại bằng Shift+Tab về "CHƠI" rồi bấm Enter.

Vào thẳng trong game luôn, không có màn hướng dẫn hay khởi động gì — nhân vật đã chạy được 93m
sẵn. Cảnh đang chuyển động, đúng như tôi lo, tôi thấy khó bám mắt vào nhân vật vì mọi thứ trôi
về phía mình liên tục. Tôi thử bấm mũi tên trái để đổi làn — chưa kịp hiểu gì thì màn "KỶ LỤC
MỚI 189m" hiện ra luôn. Trong đầu tôi nghĩ: **"Ơ, thua rồi à? Mình còn chưa kịp nhìn thấy cái
gì cản đường mà đã hết game."**

Tab thử trên màn thua thấy viền sáng ở "CHƠI LẠI" — ok, bấm Enter chơi lại. Lần này tôi cẩn
thận hơn: nhìn thấy vật cản hình hộp đen ở làn giữa từ xa, bấm ArrowRight để né sang phải —
né được! Nhưng ngay sau đó, **hình nhân vật biến mất khỏi giữa màn hình, chỉ còn một mẩu hình
đen lởm chởm dính ở rìa phải khung chơi.** Tôi nghĩ: **"Ơ, nhân vật của mình đâu rồi? Sao chỉ
thấy có nửa cái bóng dính ở mép màn hình vậy?"** Đây đúng là cảm giác "mất phương hướng" mà
tôi hay gặp trên màn hình động — tôi phải tìm cách đưa nó về giữa để nhìn thấy trọn vẹn lại.
Bấm ArrowLeft, nhân vật quay về giữa, hiện đầy đủ hình trở lại — nhẹ cả người.

Từ đó tôi giữ nguyên làn giữa, theo dõi từng khối chướng ngại vật trôi tới — đa số nằm ở làn
trái/phải riêng lẻ nên tôi cứ đứng yên là qua được, mét số tăng dần: 112, 127, 139, 152, 167,
179, rồi 198m — đã vượt kỷ lục 189m cũ. Nhưng ngay sau đó xuất hiện một dải chướng ngại thấp
chắn NGANG cả ba làn cùng lúc — không né được bằng cách đổi làn. Tôi nghĩ nhanh: "Chắc phải
nhảy qua thôi" và bấm ArrowUp — nhưng có vẻ bấm hơi trễ, va phải và thua ở 202m.

## 2. Con số (nguyên văn persona)

- Tổng số hành động: khoảng **39 lần**, sát trần 40.
- Số lần chơi: **2 lượt** (189m, 202m).
- Số lần phải quay lui: **1 lần** — bấm ArrowLeft để đưa nhân vật từ rìa phải về lại giữa.
- Số lần bấm vào chỗ không có phản hồi rõ ràng: **0**.
- Kết quả: đạt 202m. **Không bỏ cuộc**, dừng vì gần chạm trần hành động.
- **Không gặp bước "bế tắc" nào** theo đúng nghĩa — chỉ có khoảnh khắc bối rối ngắn khi nhân
  vật biến mất khỏi giữa màn hình.

## 3. Đính kèm thô

Ảnh đã lưu: `p01-mo-trang.png` · `p02-tab1.png` (viền sáng quanh "CHƠI") ·
`p03-sau-khi-bam-choi.png` (93m).

Các ảnh còn lại — 198m trước lúc va dải chắn ngang cả ba làn, **cảnh nhân vật biến mất khỏi
giữa màn hình khi ở làn phải**, hai màn "KỶ LỤC MỚI" — chỉ xem trực tiếp, **không lưu file**.

> Console/network log: tôi không kiểm tra — không biết đó là gì nên không mở, đúng như thật.

**Trả lời câu hỏi thêm về Tab:** mỗi lần bấm Tab tôi **đều thấy** có gì đó sáng lên rõ ràng
(viền xanh ngọc) — cả ở màn hình chờ (CHƠI, CỬA HÀNG) lẫn ở màn kết quả sau khi thua
(CHƠI LẠI). **Không có màn hình nào bấm Tab mà không thấy gì sáng lên** — suốt buổi không gặp
trường hợp "Tab vào khoảng không".

---

## Ghi chú của orchestrator (không phải lời persona)

**`NFR-A11Y-02` — đạt, trên mọi màn hình persona này chạm tới.** Viền tiêu điểm thấy được ở
màn chính và màn kết thúc. Chưa kiểm cửa hàng và cài đặt bằng bàn phím — phiên khác.

**`NFR-A11Y-06` — vòng chơi chơi được chỉ bằng bàn phím: đạt ở phần persona này chạm tới.**
Mũi tên trái/phải/lên đều ăn. Nhưng **Space và nút kỹ năng chưa bao giờ được thử**, nên câu
"toàn bộ vòng chơi" vẫn chưa được chứng minh trọn vẹn.

**RR-03 trượt theo một cách khác hẳn dự đoán.** `red-routes.md` dự đoán persona sẽ chết trước
khi nhặt đủ 18 xu. Chuyện xảy ra khác: Hạnh **sống tới 202 m và vẫn không hề thấy** thanh nạp
hay nút kỹ năng — cô không nhắc tới chúng một lần nào trong toàn bộ tường thuật, kể cả ở đoạn
liệt kê rất chi tiết từng mốc mét. Đây là dữ liệu mạnh hơn dự đoán ban đầu, và nó thuộc loại
**hiểu**, không thuộc loại phản xạ — tức là **không** bị độ trễ tool làm nhiễu.

Đối chiếu: Mai (phiên 2) **có** nhìn thấy "Dùng kỹ năng / ĐANG NẠP" trên viewport điện thoại
390 px, nhưng không thử. Hạnh trên 1440 px **không thấy gì cả**.

**Dòng hướng dẫn sai đối tượng — hai lần quan sát độc lập.** Trên viewport desktop 1440 không
`touch`, dòng chữ hiển thị là **"VUỐT ĐỂ ĐỔI LÀN · NHẢY · TRƯỢT"**. Orchestrator cũng thấy
đúng dòng đó trong lần dò dấu hiệu nhận biết ở đầu lần chạy, trên một cửa sổ desktop. Hạnh
phản ứng ngay và nói ra thành lời: *"hướng dẫn này là cho người vuốt tay, còn mình gõ phím"*.
Đây là quan sát từ trình duyệt, **không phải đọc code** — nguyên nhân để người làm sản phẩm
điều tra, không phải để báo cáo kết luận.

**Ứng viên phát hiện nặng, cần persona thứ hai xác nhận:** nhân vật **biến mất khỏi khung
hình khi ở làn phải** trên 1440×900, chỉ còn một mẩu dính ở mép. Hạnh phải đổi làn để **nhìn
thấy lại nhân vật của mình** — đó là mất quyền quan sát chính mình, không phải chuyện thẩm mỹ.
Ảnh **không được lưu**; nếu phiên sau tái hiện được thì phải lưu bằng được.
