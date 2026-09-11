# Duck Runner — UX persona review · 2026-09-11

> 7 phiên · 6 persona · 5 Red Route
> Công cụ trình duyệt: `chrome-devtools-mcp` — **hạng 2, tụt một hạng có chủ ý** so với mặc
> định của `lib/browser-capability.md`; đổi lại có throttle mạng và giả lập cảm ứng thật, hai
> năng lực mà hạng 1 không có và thiếu chúng thì p04 và hai phiên điện thoại thành vô nghĩa.
> Red route chốt ngày: 2026-09-11
> Đích: bản live <https://levananhduc.github.io/web-game-duck-runner/>
> Log từng phiên: `2026-09-11-lan-chay-dau/` · ảnh dẫn chứng: `2026-09-11-lan-chay-dau/anh/`

## Bảng điểm theo Red Route

| Red Route | Hiệu quả | Hiệu suất | Hài lòng |
| --- | --- | --- | --- |
| RR-01 · Lượt chơi đầu tiên | **3/4** persona | ~7 / 3 (≈2,3×) | Hai cực rõ rệt: hào hứng ngắn ("*ơ vậy ra chơi được, xa được*" — Mai) rồi nản; bà Liên chơi hết ba ván mà "*không hiểu mình phải làm gì*" |
| RR-02 · Chơi lại ngay | **4/4** persona | 1 / 1 (1,0×) | Dương, rồi tắt vì lý do ngoài phạm vi: "*rất muốn chơi tiếp*" → dừng vì "*thua hoài không tiến bộ*", **không phải** vì bí (Mai) |
| RR-03 · Nhận ra kỹ năng rồi dùng nó | **0/4** persona | không đo được — không ai đạt | Không ai thất vọng, vì không ai biết là có thứ đó để mà thất vọng |
| RR-04 · Đổi sang nhân vật khác | **1/1** persona | 4 / 4 (1,0×) | Tự tin, tự kiểm được: "*243 − 200 = 43, nên tôi tin chắc là mua thành công chứ không phải nút chỉ đổi màu cho vui*" (Daniel) |
| RR-05 · Tắt tiếng, và tin rằng nó nhớ | **1/1** persona | 4 / 4 (1,0×) | Cao nhất cả lần chạy, và là sự **tin tưởng** chứ không chỉ là xong việc: "*Vậy là nó nhớ rồi, không phải chỉ tắt tạm lúc nãy thôi*" (Tuấn) |

**Cách đọc bảng này — ba chỗ phải nói rõ, nếu không con số sẽ bị hiểu sai:**

1. **Mẫu số đếm theo NGƯỜI, không theo phiên.** Mai có hai phiên (RR-01, RR-02) và tính là
   **một** persona ở mọi ô.
2. **Mẫu số của RR-01/RR-02/RR-03 lớn hơn số phiên được giao route đó**, vì các persona phiên
   mù và phiên route khác cũng đi qua đúng những bước đó và log ghi lại đủ để chấm. RR-01:
   Mai · Hạnh · bà Liên · Vũ đã thử đủ ba mệnh đề của `done_when`; **Daniel không được tính là
   "đã thử"** vì anh chủ động không thực hiện thao tác điều khiển nào ("*Vì tôi không bấm phím
   mũi tên nên nhân vật tự đâm/rơi rất nhanh*") — mục tiêu phiên của anh là cửa hàng. Tuấn
   không bấm CHƠI lần nào nên không nằm trong mẫu số RR-01/02/03. RR-04: bà Liên và Vũ **có**
   vào cửa hàng nhưng ví 0 xu nên không thoả `entry` của route, không tính vào mẫu số.
3. **Cột hiệu suất của RR-01 là số dựng lại**, không phải số đo trực tiếp: log chỉ ghi tổng
   hành động cả phiên, không tách mốc đạt `done_when`. Đếm lại từ tường thuật của 3 persona
   đạt: Mai ~5 · Vũ ~7 · Hạnh ~9 → trung vị 7. Bốn ô còn lại là số persona tự đếm trong log.

**Ai trượt RR-01 và trượt ở mệnh đề nào:** bà Liên. Cô tự bấm bắt đầu (đạt), thấy màn kết thúc
có số mét (đạt), nhưng không bao giờ thực hiện được một hành động điều khiển mà cô nhận ra là
có phản hồi: "*Chạm vào đó nó cũng chạy được lâu hơn, nhưng mình chạm mà không biết mình đang
làm cái gì, cứ chạm đại vậy thôi.*"

---

## Phát hiện

Xếp theo mức nghiêm trọng giảm dần.

### F-01 · Critical · Visual hierarchy · Trigger words · ISO 9241-11 (hiệu quả)

**Ở đâu:** RR-03 — HUD trong lúc chơi: thanh nạp và nút "Dùng kỹ năng"

**Chuyện gì xảy ra:** Không một persona nào trong bốn người có mặt trong một lượt chơi **nhận
ra kỹ năng tồn tại như một thứ mình có thể chủ động dùng**. Hai người nhìn thấy dòng chữ và bỏ
qua nó; hai người không hề thấy. Đây là mệnh đề `done_when` của RR-03, và `red-routes.md` gọi
route này là **lý do sản phẩm tồn tại** — cái duy nhất phân biệt Duck Runner với một bản web
clone. Về mặt trải nghiệm, trong lần chạy này nó **không tồn tại**.

Trượt theo một cách khác hẳn dự đoán trong `red-routes.md`. Dự đoán là persona sẽ chết trước
khi nhặt đủ 18 xu. Chuyện thật: Hạnh **sống tới 202 m** — quãng dài nhất cả lần chạy do bàn
phím — và tường thuật của cô liệt kê rất chi tiết từng mốc mét ("*112, 127, 139, 152, 167,
179, rồi 198m*") mà **không nhắc tới thanh nạp hay nút kỹ năng một lần nào**.

**Dẫn chứng:**

- **p03 Hạnh, phiên 3, toàn bộ tường thuật** — bằng chứng là sự **vắng mặt** trong một tường
  thuật vốn rất chi tiết. Ghi chú của orchestrator phiên 3 xác nhận quan sát này: "*Hạnh sống
  tới 202 m và vẫn không hề thấy thanh nạp hay nút kỹ năng — cô không nhắc tới chúng một lần
  nào trong toàn bộ tường thuật, kể cả ở đoạn liệt kê rất chi tiết từng mốc mét.*"
- **p01 Mai, phiên 2** — thấy nhưng không kích được tò mò: "*thấy nút 'Tạm dừng', số mét đang
  tăng, có cái 'Dùng kỹ năng' với chữ 'ĐANG NẠP'*". Cô không hỏi nó là gì và không thử bấm.
  Ảnh: `anh/phien2-mai-hud-dang-nap-41m.png`, `anh/phien2-mai-hud-dang-nap-159m.png`.
- **p04 bà Liên, phiên 6** — thấy chữ, vẫn không có mô hình nào để gắn vào: "*thấy có chữ 'Tạm
  dừng' với 'Dùng kỹ năng' hiện ra, với số mét đang chạy lên (32… rồi 179…)*", rồi ngay sau
  đó: "*mình chạm mà không biết mình đang làm cái gì, cứ chạm đại vậy thôi.*"
  Ảnh: `anh/phien6-lien-cham-vao-man-choi.png`.
- **p06 Vũ, phiên 7** — người chơi giỏi nhất dàn, chủ động dò tìm mọi thứ (ArrowRight ×2
  nhanh, double-click CHƠI LẠI, ArrowUp ×2), và vẫn không chạm tới. Ghi chú orchestrator phiên
  7: "*Space và nút kỹ năng thì vẫn chưa persona nào chạm tới — kể cả người chơi giỏi nhất
  trong dàn.*"

**Bao nhiêu người vấp:** 4/4 persona đã ở trong một lượt chơi

**Ranh giới hai lớp:** đây là kết luận thuộc lớp **hiểu**, không thuộc lớp phản xạ. Hạnh sống
202 m nên "không kịp" không giải thích được gì ở đây, và Mai/bà Liên thì đã **đọc được** chữ
rồi mà vẫn không hành động. Báo cáo này **không** kết luận gì về việc 18 xu là nhiều hay ít,
hay kỹ năng có cứu được lượt không — hai câu đó không đo được trong lần chạy này.

**Hướng xử lý:** Vấn đề nằm ở chỗ "ĐANG NẠP" là một trạng thái **chưa dùng được** được hiển
thị suốt cả lượt, nên người chơi học được rằng đó là đồ trang trí trước khi kịp học rằng nó là
một cái nút. Hướng đi là ở **khoảnh khắc chuyển sang sẵn sàng** phải là một sự kiện người chơi
không bỏ lỡ được, chứ không phải ở việc làm nhãn to hơn. Chi tiết để người làm sản phẩm quyết.

---

### F-02 · High · Interaction Design (hậu quả của thao tác sai) · ISO 9241-11 (hài lòng)

**Ở đâu:** RR-01 / RR-02 — màn hình kết thúc lượt

**Chuyện gì xảy ra:** Màn kết thúc đưa ra con số mét nhưng **không nói người chơi vừa vấp vào
cái gì**. Hệ quả đo được: người chơi không rút ra được bài học nào cho lượt sau, nên chuỗi
thua biến thành ngẫu nhiên chứ không thành tiến bộ — và ở Mai, đó chính là lý do bỏ cuộc.

**Dẫn chứng:**

- **p01 Mai, phiên 1, ván 3** — câu sạch nhất, hoàn toàn thuộc lớp hiểu, không dính phản xạ:
  "*Không rõ là do trượt không ăn hay do mình vuốt hơi trễ.*" Và kết cục của phiên: "*bỏ cuộc
  sau ván thứ 4, ở mốc 48m, vì 2 lần liên tiếp chết mà không đoán được nguyên nhân/cách né
  đúng.*" Ảnh: `anh/phien1-mai-chet-48m-lan2.png` (ảnh duy nhất được lưu của phiên 1).
- **p04 bà Liên, phiên 6, ván 1 và 2** — "*Ủa, chơi gì đâu mà đã xong rồi? Mình có làm gì
  đâu.*" rồi "*Sao lần nào cũng thế này, có thấy con vịt con gà gì chạy đâu mà đã ra kết
  quả.*" Ảnh: `anh/phien6-lien-man-ket-thuc-1.png`, `anh/phien6-lien-man-ket-thuc-2.png`.
- **p03 Hạnh, phiên 3, ván 1** — "*Ơ, thua rồi à? Mình còn chưa kịp nhìn thấy cái gì cản đường
  mà đã hết game.*"

**Bao nhiêu người vấp:** 3/4 persona đã chơi một lượt

**Ranh giới hai lớp — đọc kỹ, vì đây là chỗ dễ sai nhất của cả báo cáo:** vế *"chưa kịp nhìn"*
trong câu của Hạnh là **artifact của độ trễ tool** và không được tính. Cái được tính là thứ
còn lại sau khi trừ nó đi: **sau khi lượt kết thúc, màn hình không cho người chơi biết nguyên
nhân**. Kiểm chứng rằng ranh giới này đúng: Mai ở ván 3 **có** nhìn thấy vật cản và **có** chủ
động chọn một thao tác ("*thấy một thanh chắn ngang thấp phía trước, đoán là phải 'cúi/trượt'
qua nên vuốt xuống*") — tức là không phải trường hợp "không kịp nhìn" — và cô **vẫn** không
biết mình sai ở đâu. Đó là một khoảng trống thông tin, không phải một khoảng trống thời gian.

Cũng phải nói ngược lại cho công bằng: báo cáo này **không** kết luận rằng game khó, rằng nhịp
sinh chướng ngại sai, hay rằng `REACTION_MIN_MS` cần đổi. Ba câu đó nằm ngoài quyền kết luận
của mọi persona trong lần chạy này.

**Hướng xử lý:** Thứ còn thiếu ở màn kết thúc là **nguyên nhân**, không phải thêm số liệu. Nói
cho người chơi biết họ vừa va vào cái gì (và, nếu đúng, rằng thao tác họ vừa chọn là thao tác
đúng nhưng muộn / là thao tác sai loại) là thứ biến một chuỗi thua thành một vòng học.

---

### F-03 · High · Trigger words · Visual hierarchy · LATCH (Location)

**Ở đâu:** RR-01 — dòng gợi ý điều khiển "VUỐT ĐỂ ĐỔI LÀN · NHẢY · TRƯỢT" ở **màn hình chính**

**Chuyện gì xảy ra:** Gợi ý điều khiển **có tồn tại**, nhưng nó nằm ở màn hình chính dưới dạng
chữ nhỏ — tức là ở nơi và vào lúc người chơi chưa cần tới nó — chứ không nằm trong vài giây
đầu của lượt chơi, lúc họ cần. Người duy nhất trong dàn thật sự phụ thuộc vào nó là người đã
lướt qua nó, và hậu quả là cô chơi hết ba ván mà không biết trên đời có thao tác vuốt.

`journeys.md` US-01 đã lường trước đúng rủi ro này (*"Người chơi không nhận ra vuốt được → cần
gợi ý cử chỉ ở vài giây đầu"*) — ghi chú orchestrator phiên 6 đối chiếu ra điểm này. Nên đây
là một rủi ro đã biết, nay có bằng chứng người dùng.

**Dẫn chứng:**

- **p04 bà Liên, phiên 6, bước đầu tiên** — "*Có dòng chữ nhỏ phía dưới nói gì về 'vuốt' với
  'làn' — mình lướt qua, không đọc kỹ, chữ nhỏ quá mà lại không quen.*"
- **p04 bà Liên, phiên 6, câu hỏi thêm (b)** — "*Không. Chỗ ghi 'VUỐT ĐỂ ĐỔI LÀN · NHẢY ·
  TRƯỢT' ở dưới màn hình chính có nói, nhưng chữ nhỏ và mình không để ý / không hiểu 'vuốt'
  nghĩa là làm gì trên máy… **Không có gì trên màn hình chỉ mình cụ thể từng bước phải bấm nút
  nào lúc đang chơi.***" Ảnh: `anh/phien6-lien-man-chinh-goi-y-vuot.png`,
  `anh/phien6-lien-cham-vao-man-choi.png`.

**Bao nhiêu người vấp:** 1/4 persona điện thoại-và-chơi-thử — **nhưng đây là persona trình độ
số thấp, và nó chặn hẳn `done_when` của RR-01**, red route số 1 và là tiêu chí thành công số 1
của dự án (*"chơi hết một lượt mà không hỏi cách chơi"*). Không nâng bậc vì chỉ một persona
vấp; giữ High vì mức chặn.

Một quan sát liên quan nhưng **không** được gộp làm bằng chứng thứ hai: Daniel (phiên 4) cũng
chưa bao giờ điều khiển nhân vật — "*Vì tôi không bấm phím mũi tên nên nhân vật tự đâm/rơi rất
nhanh*". Câu đó cho thấy anh **biết** phím mũi tên có tác dụng, nên không chứng minh được gợi
ý đã thất bại với anh. Ghi ra để lần sau hỏi thẳng.

**Hướng xử lý:** Chữ "vuốt" giả định người đọc đã có khái niệm cử chỉ; và vị trí của nó giả
định người ta đọc màn chính. Hướng đi là dạy bằng chính lượt chơi trong vài giây đầu thay vì
bằng một dòng chữ đặt trước đó — đúng nguyên tắc FTUE mà `persona-rules.md` §4.2 đã ghi.

---

### F-04 · High · Trigger words · ISO 9241-11 (hài lòng) · LATCH (Category)

**Ở đâu:** Ngoài Red Route — phát hiện của hai phiên mù. Chạm vào màn chính, cửa hàng, và màn
kết thúc.

**Chuyện gì xảy ra:** Những thứ game **cố ý không làm** (Non-Goal: không bảng xếp hạng, không
tài khoản, không đồng bộ, không mua bán bằng tiền thật) không được nói ra ở bất cứ đâu trên
UI. Quyết định không làm chúng là **đúng** — đây không phải lời kêu gọi làm bảng xếp hạng. Cái
hỏng là sự im lặng, và nó gây hại theo **hai hướng ngược nhau** ở hai người khác nhau: một
người **đi tìm thứ không có** rồi kết luận sản phẩm dở dang, một người **sợ thứ không có** rồi
không dám bấm.

**Dẫn chứng:**

- **p06 Vũ, phiên 7** — tốn 6–7 lần bấm qua 3 chỗ (Cài đặt, Cửa hàng, màn sau khi chết) rồi
  phải tự kiểm cả network request mới dám kết luận. Câu hỏi thêm (b): "*Không. Phải tự suy ra
  sau khi lục hết những chỗ hợp lý mà không thấy… **Chữ 'KỶ LỤC MỚI' dễ gây hiểu lầm ban đầu
  là có gì đó để so sánh**, nhưng nó chỉ là kỷ lục cá nhân lưu local.*" Và lúc thấy màn kết
  thúc: "***ghi kỷ lục mới mà không biết kỷ lục thế giới bao nhiêu thì ghi làm gì***". Kết
  luận cuối phiên: "***vậy chơi xong máy này thì mất, đổi máy khác là về lại 0 — chưa hoàn
  chỉnh***". Ảnh: `anh/phien7-vu-cai-dat.png`, `anh/phien7-vu-cua-hang.png`,
  `anh/phien7-vu-ky-luc-moi.png`.
- **p04 bà Liên, phiên 6, trong cửa hàng** — "***Thôi không có tiền thật đâu, chắc tiền trong
  trò chơi thôi, nhưng mà không chắc lắm.***" và ngay sau đó: "***Hơi lo lo nên bấm 'Quay lại'
  liền, không dám bấm vào chỗ mua.***" Ảnh: `anh/phien6-lien-cua-hang-con-thieu.png`.

**Bao nhiêu người vấp:** 2/6 persona — Medium (tốn thêm bước / gây khó chịu) **nâng một bậc →
High** vì hai persona cùng vấp, theo luật ở `lib/frameworks.md`.

Chi tiết đáng giữ: hai người này ở hai đầu đối nghịch của dàn (power user desktop vs. trình độ
số thấp trên điện thoại), tìm hai thứ khác nhau, và cùng vấp vào một nguyên nhân. Đó là dấu
hiệu mạnh nhất cho thấy đây không phải chuyện cá biệt.

Riêng cụm "**KỶ LỤC MỚI**" là một phát hiện *trigger words* độc lập nằm trong cùng gốc: chính
cụm từ đó gợi ý rằng có ai đó để so sánh.

**Hướng xử lý:** Rẻ nhất trong cả báo cáo. Một câu nói thẳng rằng tiến độ lưu trên máy này và
tiền là tiền trong game sẽ đóng cả hai hướng hại cùng lúc. Không cần làm thêm chức năng nào.

---

### F-05 · Medium · Visual hierarchy · Interaction Design

**Ở đâu:** RR-03 — khung chơi, làn phải, viewport desktop 1440×900

**Chuyện gì xảy ra:** Khi đổi sang làn phải, nhân vật rời khỏi khung nhìn, chỉ còn một mẩu
dính ở mép. Người chơi mất khả năng quan sát chính mình và phải đổi làn **để nhìn thấy nhân
vật của mình**, chứ không phải để né gì cả.

**Dẫn chứng:**

- **p03 Hạnh, phiên 3, ván 2** — "*hình nhân vật biến mất khỏi giữa màn hình, chỉ còn một mẩu
  hình đen lởm chởm dính ở rìa phải khung chơi*", và cô nghĩ ra thành lời: "***Ơ, nhân vật của
  mình đâu rồi? Sao chỉ thấy có nửa cái bóng dính ở mép màn hình vậy?***" Rồi: "*Bấm ArrowLeft,
  nhân vật quay về giữa, hiện đầy đủ hình trở lại — nhẹ cả người.*" Đây cũng là **lần quay lui
  duy nhất** của cả phiên.
- **Ảnh: KHÔNG CÓ.** Log phiên 3 ghi rõ khoảnh khắc này "*chỉ xem trực tiếp, không lưu file*".
  Ghi chú orchestrator phiên 3 gọi đây là "ứng viên phát hiện nặng, cần persona thứ hai xác
  nhận" và yêu cầu lần sau phải lưu bằng được.

**Bao nhiêu người vấp:** 1/3 persona desktop. **Chưa tái hiện**: Vũ (1920×1080) và Daniel
(1280×800) đều đổi làn mà không báo hiện tượng nào tương tự. Giữ ở Medium vì chỉ một nguồn,
không ảnh, và chỉ tốn một bước quay lui — nhưng đây là phát hiện duy nhất trong danh sách mà
**mức có thể tăng đáng kể nếu lần chạy sau tái hiện được**, vì mất quyền nhìn thấy nhân vật
của mình không phải chuyện thẩm mỹ.

**Hướng xử lý:** Cần tái hiện có chủ đích ở nhiều bề ngang trước, rồi mới quyết. Không đủ dữ
liệu để chỉ hướng.

---

### F-06 · Medium · Trigger words · ISO 9241-11 (hiệu quả, nhóm a11y)

**Ở đâu:** RR-01 / RR-03 — dòng gợi ý điều khiển hiển thị trên **desktop không cảm ứng**

**Chuyện gì xảy ra:** Trên viewport 1440×900 không `mobile`, không `touch`, dòng gợi ý vẫn là
"**VUỐT ĐỂ ĐỔI LÀN · NHẢY · TRƯỢT**" — từ vựng của một thiết bị mà người dùng đang không có.
Với persona chỉ dùng bàn phím, câu đầu tiên nảy ra trong đầu không phải "chơi thế nào" mà là
"**tôi có chơi được không**".

**Dẫn chứng:**

- **p03 Hạnh, phiên 3, bước 1** — "*Tôi thấy dòng 'VUỐT ĐỂ ĐỔI LÀN · NHẢY · TRƯỢT' — nghĩ
  ngay: '**Chết rồi, hướng dẫn này là cho người vuốt tay, còn mình gõ phím, không biết có ánh
  xạ sang phím mũi tên không hay là bó tay.**'*"
- **Ảnh: MẤT.** Xem §Đính chính của orchestrator, mục 1 — ảnh màn chính của phiên 3 đã bị
  phiên 7 ghi đè do trùng tên file. `anh/phien7-vu-cai-dat.png` **không** thay thế được: đó là
  màn Cài đặt của một phiên khác, không phải màn chính của Hạnh.
- **Quan sát độc lập của orchestrator** (không phải lời persona): ghi chú phiên 3 ghi rằng
  orchestrator cũng thấy đúng dòng đó trên một cửa sổ desktop trong lần dò dấu hiệu nhận biết
  ở đầu lần chạy. Đây là quan sát từ trình duyệt, không phải đọc code.

**Bao nhiêu người vấp:** 1/6 persona nói ra thành lời (+1 quan sát của orchestrator, không
tính là persona). Không nâng bậc. Giữ Medium chứ không hạ Low vì nó rơi đúng vào persona a11y
và đúng ở giây đầu tiên — với một người ít kiên quyết hơn Hạnh, đó là điểm đóng tab. Hạnh thì
thử phím mũi tên và thành công ngay, nên thực tế nó chỉ tốn một khoảnh khắc nghi ngờ.

**Hướng xử lý:** Vấn đề là từ vựng gợi ý không theo thiết bị đang dùng. Gộp chung gốc với
F-03: gợi ý điều khiển hiện chưa biết nó đang nói với ai và nói vào lúc nào.

---

### F-07 · Low · Trigger words

**Ở đâu:** RR-05 — nhãn nút "CÀI ĐẶT" ở màn hình chính

**Chuyện gì xảy ra:** Cùng một chữ, hai người, hai kết quả ngược hẳn nhau. Với người quen dùng
máy, "CÀI ĐẶT" là lối tắt tới đúng thứ họ cần trong một bước. Với người trình độ số thấp, "cài
đặt" là từ báo hiệu **nguy hiểm** và họ né.

**Dẫn chứng:**

- **p02 Tuấn, phiên 5, bước 1** — "***Cái nút CÀI ĐẶT chắc là chỗ để chỉnh âm thanh, thử vào
  đó xem trước khi bấm CHƠI.***" → đoán đúng ngay, xong việc trong 4 bước.
- **p04 bà Liên, phiên 6, gần cuối** — "*thấy nút 'CÀI ĐẶT' còn đó nhưng **mình không bấm —
  nghe chữ 'cài đặt' là mình ngại, sợ bấm vô rồi hỏng cái gì.***"

**Bao nhiêu người vấp:** 1/6 persona né (Tuấn không vấp — với anh nhãn này hoạt động hoàn
hảo). Không nâng bậc. Low vì không chặn gì: bà Liên không có nhu cầu tắt tiếng trong phiên
của mình.

**Hướng xử lý:** Chưa đủ để đổi gì. Ghi lại như một dữ kiện để đối chiếu ở lần chạy sau: nếu
một người thật nữa cũng né đúng nhãn này, nó lên Medium ngay.

---

### F-08 · Low · Interaction Design (phản hồi) — **chưa tái hiện, không được coi là lỗi**

**Ở đâu:** RR-04 — nút tròn góc trên bên trái trong lúc chơi (người chơi đoán là tạm dừng)

**Chuyện gì xảy ra:** Một cú bấm không làm gì cả, và người chơi **không có cách nào tự giải
thích** chuyện vừa xảy ra. Phải nói rõ phạm vi của mục này: **bản thân việc nút không phản hồi
KHÔNG được tính là phát hiện** — ghi chú orchestrator phiên 4 nêu rằng chữ persona dùng nghe
giống thông báo của công cụ tự động chứ không phải của game, và chưa persona nào khác thử bấm
tạm dừng để tái hiện. Cái **có** hiệu lực ngay và độc lập với nguyên nhân là phần cảm nhận.

**Dẫn chứng:**

- **p05 Daniel, phiên 4** — "*tôi bấm vào cái nút tròn góc trên bên trái đang chạy, tưởng nó
  là nút tạm dừng để tôi bình tĩnh nhìn lại — nhưng game báo lỗi không tương tác được, màn
  hình không đổi gì cả.*" và ở câu hỏi thêm (b): "***tôi không biết là do bấm sai chỗ, do hệ
  thống chặn, hay do bấm đúng lúc nó không nhận input — cái đó tôi chịu, không đoán được.***"
  Anh không thử lần hai.
- Đây cũng là **cú bấm không phản hồi duy nhất của toàn bộ 7 phiên** (xem §Những gì đi đúng,
  mục 9).

**Bao nhiêu người vấp:** 1/6 persona, chưa tái hiện. Low.

**Hướng xử lý:** Việc cần làm không phải sửa gì, mà là **tái hiện có chủ đích** ở lần chạy
sau — cho ít nhất hai persona bấm tạm dừng giữa lượt. Nếu tái hiện được thì đây là một phát
hiện khác hẳn về mức.

---

### F-09 · Low · (số đo, không phải trải nghiệm)

**Ở đâu:** Mọi màn hình — tải tài nguyên lúc mở trang, bản production trên GitHub Pages

**Chuyện gì xảy ra:** Cùng một ảnh nền được yêu cầu bằng **hai đường dẫn**, một đúng và một
thừa một tầng `assets/`; đường thừa trả về 404. Đây là **số đo đã xác nhận độc lập**, không
phải suy đoán, và **không** persona nào cảm nhận được nó — không ai than ảnh thiếu hay cảnh
xấu. Vì vậy nó xếp Low theo luật mức nghiêm trọng (không cản trở, không tốn thêm bước), dù nó
là khuyết tật cứng duy nhất được xác nhận trong cả lần chạy.

**Dẫn chứng:**

- **p05 Daniel, phiên 4, network log** — `reqid=24 GET .../assets/textures/jungle-screen.webp
  [404]`, "*(còn lại toàn bộ 25 request khác đều trả về [200])*".
- **p02 Tuấn, phiên 5, network log — rõ nhất, cùng một lần tải trang**:
  `reqid=21 .../textures/jungle-screen.webp [200]` **và**
  `reqid=23 .../assets/textures/jungle-screen.webp [404]`. Lặp lại y hệt sau khi tải lại trang.
- **p06 Vũ, phiên 7** — 404 xuất hiện **hai lần** trong một lần tải: `reqid=23` và `reqid=26`,
  cùng URL. Console: `[error] Failed to load resource… (0 args) [2 times]`.
- **p04 bà Liên, phiên 6** — cùng dòng console 404 trên điện thoại Slow 4G.
- **Kiểm lại bằng `curl` của orchestrator, không qua persona** (ghi trong log phiên 4):
  `/textures/jungle-screen.webp → 200` · `/assets/textures/jungle-screen.webp → 404` ·
  `/textures/jungle-far.webp → 200` · `/assets/textures/jungle-far.webp → 404`.
- Đối chiếu: phiên 1 và phiên 2 **không** ghi được lỗi này (phiên 1 console sạch; phiên 2 cả
  12 request đều 200) — nên nó không xuất hiện ở mọi đường vào.

**Bao nhiêu người vấp:** 0/6 persona cảm thấy gì. Duy nhất Vũ nhìn thấy nó vì anh tự mở nhật
ký: "*không văng lỗi gì thêm ngoài 2 dòng lỗi 404*".

**Hướng xử lý:** Không có. Báo cáo này chỉ nêu số đo. **Nguyên nhân kỹ thuật và cách sửa nằm
ngoài quyền của lần chạy này** — không persona nào và cả người viết báo cáo này đều chưa từng
nhìn thấy code.

---

## Những gì đi đúng

Mục này không có trong `report.tpl`, nhưng bỏ nó đi là đưa ra một bức tranh sai. Các kết quả
dưới đây có **cùng chất lượng dẫn chứng** với các phát hiện ở trên, và hai trong số chúng là
những phiên sạch nhất cả lần chạy.

**1. RR-05 đạt trọn vẹn, và đạt ở mức mạnh nhất có thể: người dùng TỰ KIỂM được.** p02 Tuấn,
phiên 5 — 7 lần bấm, "*Số lần bối rối thật sự: 0*", "*Số lần quay lui: 0*", "*Số lần bấm không
phản hồi: 0*". Anh tự nghĩ ra cách kiểm: "*tải lại trang từ đầu (giống như tắt máy mở lại)*" →
"***ô 'Tắt toàn bộ âm thanh' vẫn còn tick, không cần tôi tick lại***" → "***Vậy là nó nhớ rồi,
không phải chỉ tắt tạm lúc nãy thôi.***"

**2. Thứ tạo ra niềm tin không phải cái tick, mà là hai thanh trượt mờ đi.** Cùng phiên 5, và
persona nói thẳng ra: "*Ngay khi tôi bấm, hai cái thanh trượt kia mờ đi, không kéo được nữa*"
→ "***Nếu chỉ tick mà hai thanh kia vẫn sáng bình thường thì tôi sẽ nghi ngờ nó chưa làm gì
thật.***" Đây là lăng kính *Form design* — chỗ duy nhất còn lại trong game theo
`persona-rules.md` §4.5 — và nó đạt. Một phản hồi trạng thái làm đúng việc của nó, hiếm khi
được người dùng chỉ đích danh như vậy.

**3. Không có tiếng nào phát ra trước tương tác đầu tiên, và có bằng chứng khách quan do chính
người dùng tìm ra.** Tuấn, câu hỏi thêm (a): "*từ lúc mở trang tới lúc tick tắt tiếng, danh
sách file được tải chỉ có ảnh nền, font chữ, mã chương trình — **không có file âm thanh
nào**.*" Không ai gợi ý anh mở network log. Đây đúng là nỗi sợ lớn nhất của persona này
("*sợ nhất là bấm CHƠI cái phát ra tiếng ngay giữa phòng*") và nó không xảy ra.

**4. Hộp xác nhận xoá tiến độ nói đúng ba thứ sẽ mất.** Tuấn: "*Hiện ra một dòng chữ ngay
trong màn hình: 'Xoá kỷ lục, ví xu và nhân vật đã mua?' với hai nút 'HUỶ' và 'XOÁ'*" →
"***Đúng như tôi lo, cái này xoá luôn kỷ lục với đồ đã mua, chọn HUỶ thôi.***" Hỏi lại **trong
trang**, đủ thông tin để một người cẩn thận quyết mà không phải đoán.

**5. Cửa hàng đọc được hoàn toàn bằng hình — đây là tín hiệu dương mạnh nhất của cả lần chạy.**
Cửa hàng là màn dày chữ nhất trong game, và nó vượt bài kiểm khắc nghiệt nhất có thể đặt ra:
một người **không đọc được tiếng Việt**. p05 Daniel, phiên 4, câu hỏi thêm (a) — ba dấu hiệu
anh tự lần ra, **không cái nào là màu đơn thuần**: "*(1) **độ sáng/độ mờ của nút** — nút mua bị
mờ hẳn khi không đủ tiền; (2) **một nhãn nổi bật màu khác hẳn xuất hiện đúng một chỗ** trong
bốn ô — chỗ đó chắc là 'đang dùng'; (3) **hình dạng nút thay đổi sau khi mua** — từ nút kèm số
tiền thành nút ngắn hơn không có số. Ba cái đó đủ để lần ra chuyện gì đang xảy ra dù không đọc
được chữ.*"

**6. Giao dịch mất mát được duy nhất trong game tạo ra niềm tin, không tạo ra nghi ngờ.**
Daniel: "*con số tiền ở góc rớt từ 243 xuống 43 ngay lập tức*" → "***243 > 200 nên chắc mua
được ô thứ ba***" → và ở câu hỏi thêm (b): "***số tiền ở góc thay đổi ngay và đúng theo phép
trừ tôi tự nhẩm được (243 − 200 = 43), nên tôi tin chắc là mua thành công chứ không phải nút
chỉ đổi màu cho vui.***" Anh cũng phân biệt được mua và chọn: "***vậy là tôi vừa đổi nhân vật
đang dùng, chứ không phải chỉ mua cho có.***" RR-04 đạt đúng `min_steps` = 4.

**7. Cửa hàng chặn TRƯỚC khi bấm, không báo lỗi sau khi bấm — hai persona xác nhận độc lập.**
p04 bà Liên, phiên 6: "*nút 'MUA' nhưng nút đó mờ mờ, không bấm được, kèm chữ **CÒN THIẾU
72***" (ảnh `anh/phien6-lien-cua-hang-con-thieu.png`). p05 Daniel, phiên 4, không đọc được chữ
mà vẫn hiểu: "*ô thứ tư chắc quá giá nên nút mới bị mờ/khoá như vậy*". p06 Vũ, phiên 7, cũng
thấy cả ba đều khoá vì chưa đủ xu. Đây đúng thứ `journeys.md` US-04 đòi.

**8. Chơi lại ngay tại chỗ: 4/4 persona, không ai phải quay về màn chính.** p01 Mai, phiên 2,
số đo tự ghi: "***Số lần phải quay lại màn hình đầu để chơi tiếp: 0** — mỗi ván thua xong đều
có nút 'CHƠI LẠI' ngay tại chỗ.*" Cô chơi 7 ván. Quan trọng hơn con số: cô dừng vì **chán**,
không vì bí — "***không phải vì bấm không được gì, mà vì thua hoài không tiến bộ***". Bà Liên,
Hạnh và Vũ cũng đều tự tìm ra nút CHƠI LẠI mà không được nhắc.

**9. Gần như không có cú bấm nào rơi vào khoảng không.** Sáu trên bảy phiên tự ghi "số lần bấm
không phản hồi: **0**" (phiên 1, 2, 3, 5, 6, 7). Ngoại lệ duy nhất là nút tròn của Daniel
(F-08, chưa tái hiện). Vũ nói rõ kể cả thao tác cố tình phá: "*mọi nút đều phản hồi ngay, **kể
cả nút CHƠI LẠI bấm đúp**.*"

**10. Tiêu điểm bàn phím thấy được ở mọi màn hình persona a11y chạm tới.** p03 Hạnh, phiên 3:
"*Việc đầu tiên tôi luôn làm: bấm Tab xem có viền sáng không. Bấm phát đầu tiên, **viền xanh
ngọc hiện quanh nút 'CHƠI' luôn** — mừng, nghĩ '**may quá, trang này dùng được.**'*" Và ở câu
hỏi thêm: "***Không có màn hình nào bấm Tab mà không thấy gì sáng lên** — suốt buổi không gặp
trường hợp 'Tab vào khoảng không'.*" Bốn phím mũi tên đều ăn, xác nhận độc lập bởi Vũ phiên 7:
"*ArrowUp để nhảy, ArrowLeft/ArrowRight đổi làn, ArrowDown trượt — **có phản hồi ngay***."

**11. Trên Slow 4G, màn hình không bao giờ trắng trơn — ở đúng người dễ bỏ đi nhất vì nó.**
p04 bà Liên, phiên 6, câu hỏi thêm (a): "*Mình không thấy màn hình trắng trơn lần nào — chụp
mấy tấm liên tiếp ngay sau khi mở thì đã thấy có chữ, có số, có nút hiện ra rồi, không phải
đợi lâu và **không có cảnh 'trắng xoá' làm mình tưởng máy hỏng**.*" Đây là tín hiệu **định
tính**, không phải số đo thay cho `NFR-PERF-07` — không có mili giây nào được đo.

**12. Xu vào ví dù thua, và người chơi tự nhận ra rồi thấy được an ủi.** p01 Mai, phiên 2:
"*kỷ lục vẫn 206m (chưa phá được), nhưng **xu đã tăng từ 12 lên 27** — cái này thấy vui vui vì
**ít ra cũng có cái để 'lời' lại sau mấy ván thua**.*" Không ai chỉ cho cô chỗ nhìn con số đó.

**13. Bấm đúp CHƠI LẠI không tạo hai lượt chồng nhau.** p06 Vũ, phiên 7, câu hỏi thêm (c):
"***double-click nút CHƠI LẠI — không vào hai lượt chồng nhau, chỉ tính một lượt***" (chạy tới
59m, ví lên 2 xu). Đây là rủi ro `journeys.md` US-02 đã lường trước, và nó không xảy ra.
**Nhưng đây là một lần thử của một người, không phải bằng chứng thay cho test** — ghi chú
orchestrator phiên 7 nói đúng như vậy.

---

## Không phát hiện được gì ở

- **RR-05 · Tắt tiếng, và tin rằng nó nhớ** — **không một phát hiện nào**, ở bất kỳ mức nào.
  Phiên 5 là phiên sạch nhất cả lần chạy: 0 bối rối, 0 quay lui, 0 bấm không phản hồi,
  `min_steps` đạt đúng. Toàn bộ nội dung của route này nằm ở §Những gì đi đúng, mục 1–4.
- **RR-02 · Chơi lại ngay** — **không phát hiện nào về chính cơ chế chơi lại**. 4/4 persona tự
  tìm ra nút, 0 lần phải vòng qua màn chính, tỉ lệ hiệu suất đúng 1,0×. Sự không hài lòng mà
  Mai bày tỏ ở phiên 2 ("*thua hoài không tiến bộ*") là về **tiến bộ và độ khó**, nằm ngoài
  quyền kết luận của lần chạy này và nằm ngoài `done_when` của route.
- **RR-04 · Đổi nhân vật** — không phát hiện nào **trong phạm vi đã kiểm**: mua, trừ tiền,
  chọn, quay ra đều trơn. Nhưng xem §Chưa phủ được, mục 1: rủi ro nặng nhất mà `journeys.md`
  US-04 lường trước thì **chưa phiên nào chạm tới**, nên "không phát hiện được gì" ở đây hẹp
  hơn nó nghe.
- **Đường lỗi WebGL, ba power-up, xoá tiến độ tới cùng** — cố ý nằm ngoài phạm vi theo
  `red-routes.md` §Cố ý KHÔNG phải Red Route. Không tính là khoảng trống.

---

## Chưa phủ được

Mục này cũng không có trong `report.tpl`. Nó tồn tại để lần chạy sau không phải dò lại, và để
năm người chơi thật không tiêu lượt thử của mình vào chỗ đã biết.

1. **Bấm MUA hai lần liên tiếp có trừ tiền hai lần không.** Rủi ro nặng nhất mà `journeys.md`
   US-04 đã lường trước, và **không phiên nào phủ được**, vì nó rơi đúng vào khe giữa hai
   persona: **Vũ có phản xạ bấm trùng nhưng ví 0 xu nên nút MUA bị khoá**; **Daniel có 240 xu
   nhưng không có phản xạ bấm trùng**. **Việc phải làm cho lần sau: một phiên có cả ví nạp sẵn
   lẫn luật bấm trùng.**
2. **Kỹ năng khi thanh nạp đã đầy.** Không persona nào nhặt đủ 18 xu trong một lượt, nên câu
   "bấm kỹ năng thì chuyện gì xảy ra" **hoàn toàn chưa được kiểm** — kể cả phần hình ảnh. F-01
   chỉ nói về việc **nhận ra** kỹ năng, không nói gì về việc dùng nó.
3. **Phím Space.** Chưa persona nào bấm, kể cả persona chỉ-bàn-phím và persona power user. Vì
   vậy câu "toàn bộ vòng chơi chơi được bằng bàn phím" (`NFR-A11Y-06`) **chưa được chứng minh
   trọn vẹn**, dù bốn phím mũi tên đã có hai nguồn độc lập.
4. **Cửa hàng và Cài đặt bằng bàn phím.** Hạnh chỉ kiểm Tab ở màn chính và màn kết thúc. Vũ có
   vào hai màn đó nhưng bằng chuột. Hai màn dày tương tác nhất **chưa có dữ liệu a11y nào**.
5. **Nút tạm dừng.** Chỉ có một cú bấm mơ hồ của Daniel (F-08). Mai (phiên 2) và bà Liên
   (phiên 6) đều **nhìn thấy** chữ "Tạm dừng" trong lúc chơi mà không bấm. Cần ít nhất hai
   persona bấm có chủ đích.
6. **Vuốt trên cảm ứng như một cơ chế đã xác nhận** chỉ có **một** nguồn: Mai, phiên 1. Ở phiên
   2, hai ván xa nhất của cô dùng **phím mũi tên trên viewport điện thoại** — ghi chú
   orchestrator phiên 2 loại hai ván đó khỏi mọi bằng chứng về vuốt. Bà Liên không thử vuốt lần
   nào theo đúng luật hành vi của persona. Nên "vuốt hoạt động tốt trên điện thoại" **chưa đủ
   nguồn**.
7. **Mạng chậm** chỉ có **một** phiên (bà Liên, Slow 4G) và chỉ định tính. Không có mili giây
   nào.
8. **Nhân vật biến mất ở làn phải** (F-05): một phiên, không ảnh, hai persona desktop khác
   không tái hiện.
9. **Bản working tree.** Cả 7 phiên chạy trên bản production GitHub Pages. Nếu `main` có commit
   chưa deploy, lần chạy này không mô tả working tree — và không kiểm được điều đó từ phía
   trình duyệt.

---

## Ghi chú về chính lần chạy này

**1. Câu bắt buộc, chép nguyên từ `SKILL.md` §1.** Persona điều khiển bằng tool call, mỗi call
mất hàng trăm ms, còn game chạy 60fps. **Persona không thể chơi giỏi và sẽ chết sớm.** Kết
luận về **hiểu hay không hiểu** có hiệu lực; kết luận về **độ khó, nhịp sinh chướng ngại,
`REACTION_MIN_MS`** **không** có hiệu lực và không được viết ra. Hạng mục đó vẫn nằm ở
`docs/04-state/backlog.md` §Việc tiếp theo với ưu tiên cao, và **lần chạy này không đóng được
nó**. Nó chỉ thu hẹp việc đó lại: năm người chơi thật không nên phải tiêu lượt thử của mình
vào những thứ persona đã tìm ra ở trên.

**2. Những câu đã bị loại bỏ có chủ đích.** Ba câu sau đây **không** trở thành phát hiện, dù
chúng nghe rất nặng, vì chúng là artifact của phép đo chứ không phải của sản phẩm:
- Mai, phiên 1: "*chưa kịp nhìn rõ đã chết*" và "*chưa kịp làm gì mà chết rồi à*";
- Mai, phiên 2: "*mình cứ nhìn vào lúc nó đã thua rồi*" và "*mới bấm chơi cái đã thua luôn á*";
- Hạnh, phiên 3: vế "*chưa kịp nhìn thấy*" trong câu của cô.

Chúng được giữ trong log làm bối cảnh, và phần **hiểu** còn lại sau khi trừ chúng đi là thứ đã
thành F-02. Một báo cáo dùng ba câu trên để kết luận "game quá khó" sẽ trông rất thuyết phục
và sẽ sai.

**3. Ghi chú của orchestrator ở cuối mỗi log là quan sát của người điều phối, không phải lời
người chơi.** Báo cáo này dẫn chúng ở F-01, F-05, F-06, F-09 và §Chưa phủ được, và ở mỗi chỗ
đều nói rõ nguồn.

**4. Đếm theo người, không theo phiên.** Mai có hai phiên (RR-01, RR-02) nhưng tính là **một**
persona ở luật nâng bậc. Vì vậy hai phiên của cô, dù rất khớp nhau, **không tự nâng được bậc
cho bất cứ phát hiện nào** — F-02 lên High là nhờ bà Liên và Hạnh, không nhờ phiên 2.

**5. Chạy tuần tự, một phiên một lúc.** Công cụ hạng 2 là một instance trình duyệt, một
profile, và `localStorage` dùng chung theo origin — hai phiên song song sẽ giẫm lên ví xu và
kỷ lục của nhau. Trần "4 phiên đồng thời" của `lib/orchestration.md` hạ xuống **1**. Không cắt
phạm vi, chỉ giãn thời gian.

**6. Phiên 1 chạy bằng agent `general-purpose`, các phiên 2–7 bằng `ux-persona`.** Lý do:
dispatch `ux-persona` ban đầu trả về `Agent type 'ux-persona' not found`. Hệ quả phải biết khi
đọc phiên 1: agent đó **không bị giới hạn tool**, tức về nguyên tắc đọc được source của chính
game; tính mù được giữ bằng một luật đặt ở đầu brief, nhưng đó là lời dặn, không phải hàng
rào. Cả 7 phiên đều bị ép `model: sonnet`.

**7. Một lỗi thiết kế phiên đã được ghi nhận và trừ vào kết quả.** Phiên 2: Mai là persona
**điện thoại, một tay**, nhưng dùng **phím mũi tên** ở hai ván xa nhất. Brief khoá viewport mà
không khoá thiết bị đầu vào. Hai ván đó không phải trải nghiệm điện thoại và đã bị loại khỏi
mọi kết luận về vuốt. Từ phiên 3 trở đi, brief khoá thiết bị đầu vào theo persona và các
persona tuân thủ (Hạnh không lách sang chuột lần nào; bà Liên không thử vuốt lần nào; Daniel
không dịch nghĩa một chữ tiếng Việt nào).

**8. Ảnh bị thiếu ở hai chỗ đắt nhất.** Phiên 1 chỉ lưu **1/6** ảnh — mất cả khoảnh khắc "khối
chắn gần sát đầu nhân vật". Phiên 3 **không lưu** ảnh nhân vật biến mất khỏi khung hình, đúng
cái ảnh mà F-05 cần để lên mức. Brief các lần sau phải yêu cầu **lưu file với tên cụ thể**,
không chỉ "chụp màn hình". Các phiên 2, 4, 5, 6, 7 lưu đầy đủ (12 · 10 · 8 · 12 · 11 ảnh).

**9. Công cụ trình duyệt tụt xuống hạng 2 là lựa chọn có chủ đích, được ghi trước khi chạy.**
`chrome-devtools-mcp` mất một số tiện ích của hạng 1 nhưng có hai thứ hạng 1 không có và lần
chạy này bắt buộc phải có: throttle mạng (nếu thiếu, bà Liên trở thành một persona hoàn toàn
khác) và giả lập cảm ứng thật (nếu thiếu, hai persona điện thoại thực chất đang vuốt bằng
chuột trên desktop). Cả hai kiểu hỏng đó đều tạo ra báo cáo **vẫn trông hợp lý**.

**10. Về lỗi 404:** báo cáo nêu nó như một **số đo đã xác nhận** (4 phiên + `curl` của
orchestrator). **Không** suy đoán nguyên nhân kỹ thuật và **không** đề xuất cách sửa — người
viết báo cáo này chưa từng nhìn thấy code của dự án, và điều đó áp dụng cho toàn bộ báo cáo.

**11. Hạn chế của chính bước đọc log.** `ux-expert` không mở được các file hồ sơ persona trong
`references/personas/` (chỉ có tool `Read`, không đoán ra quy ước đặt tên file). Đặc tả từng
persona dùng trong báo cáo được lấy từ header của mỗi log (thiết bị, mạng, luật ngôn ngữ, luật
hành vi, `patience_threshold`, fixture) và từ `persona-rules.md` §4. Nếu hồ sơ persona chứa
trường nào mâu thuẫn với cách báo cáo mô tả họ, **hồ sơ đúng và báo cáo sai**.

**12. Dàn persona là proto-persona, chưa dựng từ nghiên cứu thật.** `persona-rules.md` §2 nói
rõ điều này và nói rõ hệ quả: khi năm người thật chơi thử, việc đầu tiên là **sửa dàn persona
theo họ**, không phải viết thêm persona mới. Báo cáo này là giả thuyết được kiểm bằng máy,
không phải nghiên cứu người dùng.

---

## Đính chính của orchestrator

Hai chỗ trong bản `ux-expert` trả về đã được sửa trước khi lưu. Ghi ra để không ai phải đoán
vì sao báo cáo lệch bản gốc.

**1. Hai ảnh bị ghi đè do trùng tên file giữa các phiên.** Persona lưu ảnh vào cùng một thư
mục tạm, và ba phiên dùng trùng quy ước đánh số. Đối chiếu theo thời gian sửa file:

| Tên file | Phiên tưởng là | Thực tế là |
| --- | --- | --- |
| `p01-mo-trang.png` | phiên 3 (Hạnh, màn chính 1440) | **phiên 7** (Vũ, 1920) — ghi đè lúc 08:05 |
| `p02-cai-dat.png` | phiên 5 (Tuấn, màn Cài đặt) | **phiên 7** (Vũ, màn Cài đặt) — ghi đè lúc 08:05 |

Hệ quả: dẫn chứng ảnh của **F-06** đã bị đổi thành "MẤT", và mục 1 · 4 trong §Những gì đi đúng
bỏ tham chiếu ảnh `p02-cai-dat` (các ảnh còn lại của Tuấn — `p03-da-tick-tat-tieng`,
`p04-hop-xac-nhan-xoa`, `p07-kiem-tra-sau-reload` — **không** bị ảnh hưởng và vẫn nguyên vẹn
trong `runs/`). Không phát hiện Critical/High nào mất dẫn chứng ảnh.

**Việc phải sửa cho lần sau:** brief phải bắt tên file mang tiền tố phiên (`p03-rr03-…`), chứ
không chỉ "đặt tên rõ ràng". Đây là lỗi của orchestrator, không phải của persona.

**2. Ảnh cam kết vào repo chỉ gồm ảnh của phát hiện Critical/High**, theo
`lib/orchestration.md` §Báo cáo đi đâu — 11 file trong `anh/`, đổi tên theo phiên để không
trùng nữa. **Toàn bộ 54 ảnh thô** của cả 7 phiên được giữ ở
`.claude/skills/ux-persona-review/runs/2026-09-11-run1/anh-tho/` — thư mục đó gitignored, nên
chúng **chỉ tồn tại trên máy này**. Ai cần dẫn chứng ảnh ngoài danh sách đã cam kết thì phải
lấy trước khi máy đó bị dọn.
