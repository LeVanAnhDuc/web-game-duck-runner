# Phiên 6 · p04 Bà Liên · **phiên mù** (không có Red Route, không có mục tiêu)

- **emulate:** `360x740x2,mobile,touch` · **Slow 4G**
- **Luật hành vi:** không biết "vuốt" là một cách điều khiển; mặc định **chạm**. Persona tuân
  thủ — không thử vuốt lần nào trong cả phiên.
- **Tool:** chrome-devtools-mcp · agent `ux-persona`
- **Thời lượng:** 256.7 s · **37 tool call** · persona tự đếm **~12 lần bấm/chạm**
- **Kết quả:** không có `done_when` (phiên mù). **Không bỏ cuộc vì bế tắc** — dừng vì
  *"thấy hiểu đủ rồi và đây không phải thứ mình hay dùng"*.

---

## 1. Chuyện đã xảy ra (nguyên văn persona)

Con gái gửi cái link, nói "bà xem thử đi". Mình mở lên bằng điện thoại. Chờ một chút — không
biết máy có đang tải hay không, cứ chờ.

Rồi thấy hiện lên: một cái tên gì đó bằng chữ in hoa "DUCK RUNNER" (mình không đọc được nghĩa,
tưởng là tên trò chơi), một dòng chữ nhỏ, số "0" với chữ "m" bên cạnh, và ba cái nút. **Có
dòng chữ nhỏ phía dưới nói gì về "vuốt" với "làn" — mình lướt qua, không đọc kỹ, chữ nhỏ quá
mà lại không quen.**

*"À, chắc đây là game gì đó. Con gửi cho xem game hả? Mà nút to nhất chắc là bấm vào chơi
được đây."*

Bấm vào nút "CHƠI". Chưa kịp hiểu chuyện gì thì màn hình đã đổi qua cái khác, ghi "KỶ LỤC
MỚI", số "50" với chữ "m"...

*"**Ủa, chơi gì đâu mà đã xong rồi? Mình có làm gì đâu.**"*

Tò mò bấm "CHƠI LẠI" xem có khác không. Vẫn y như vậy — 63m, lại hai nút đó.

*"**Sao lần nào cũng thế này, có thấy con vịt con gà gì chạy đâu mà đã ra kết quả.**"*

Bấm "VỀ MÀN CHÍNH" quay lại... Bấm "CHƠI" lần nữa, lần này thử **chạm ngay vào giữa màn hình**
xem có làm gì được không — thấy có chữ "Tạm dừng" với "Dùng kỹ năng" hiện ra, với số mét đang
chạy lên (32… rồi 179…). Chạm thêm một cái nữa thì lại quay về màn "KỶ LỤC MỚI" (189m), tiền
tăng lên 8.

*"Chạm vào đó nó cũng chạy được lâu hơn, **nhưng mình chạm mà không biết mình đang làm cái gì,
cứ chạm đại vậy thôi.**"*

Thấy còn 8 đồng gì đó, tò mò bấm vào "CỬA HÀNG" xem trong đó bán gì — nghĩ chắc như tiệm tạp
hoá vậy. Vào trong thấy có mấy hình người, mỗi người có giá tiền (80, 200, 360) và nút "MUA"
nhưng nút đó **mờ mờ, không bấm được**, kèm chữ "CÒN THIẾU 72"…

*"Mua gì cũng không đủ tiền. **Thôi không có tiền thật đâu, chắc tiền trong trò chơi thôi,
nhưng mà không chắc lắm.**"*

**Hơi lo lo nên bấm "Quay lại" liền, không dám bấm vào chỗ mua.** Quay về màn hình chính, thấy
nút "CÀI ĐẶT" còn đó nhưng **mình không bấm — nghe chữ "cài đặt" là mình ngại, sợ bấm vô rồi
hỏng cái gì.**

Đến đây mình thấy đủ rồi — chơi ba lần đều giống nhau, **không hiểu mình phải làm gì trong lúc
"chơi"**… Nên mình dừng ở đây.

## 2. Con số (nguyên văn persona)

- **~12 lần bấm/chạm thật sự** (CHƠI ×3, CHƠI LẠI ×1, VỀ MÀN CHÍNH ×2, chạm vào màn chơi ×2,
  CỬA HÀNG ×1, Quay lại ×1).
- Số lần quay lui: **2**. **Số lần bấm mà không thấy gì xảy ra: 0.**
- Kết quả: **không bỏ cuộc vì bế tắc** — dừng vì thấy hiểu đủ rồi và đây không phải thứ mình
  hay dùng.
- **Chờ lúc đầu không lâu, có vẻ hiện ra khá nhanh dù mạng chậm.**

## 3. Đính kèm thô

12 ảnh đã lưu: `p01-vua-mo` · **`p02-cho-tai`** · **`p03-cho-tai-2`** · `p04-man-hinh-chinh` ·
`p05-sau-khi-bam-choi` · `p06-ket-qua` · `p07-choi-lai` · `p08-ve-man-chinh` ·
`p09-cham-vao-man-choi` · `p10-ket-qua-2` · **`p11-cua-hang`** · `p12-quay-lai-tu-cua-hang`

```
msgid=1 [error] Failed to load resource: the server responded with a status of 404 () (0 args)
```

## Trả lời hai câu hỏi thêm (nguyên văn)

**(a) Chờ bao lâu, màn hình trông thế nào?** *"Mình không thấy màn hình trắng trơn lần nào —
chụp mấy tấm liên tiếp ngay sau khi mở thì đã thấy có chữ, có số, có nút hiện ra rồi, không
phải đợi lâu và **không có cảnh 'trắng xoá' làm mình tưởng máy hỏng**."*

**(b) Có bao giờ hiểu phải làm gì không?** *"**Không.** Chỗ ghi 'VUỐT ĐỂ ĐỔI LÀN · NHẢY ·
TRƯỢT' ở dưới màn hình chính có nói, nhưng **chữ nhỏ và mình không để ý / không hiểu 'vuốt'
nghĩa là làm gì trên máy**, nên mình chỉ bấm và chạm thôi — mà chạm thì không rõ nó có tác
dụng gì cụ thể, chỉ thấy số mét chạy lên rồi tự dưng kết thúc. **Không có gì trên màn hình chỉ
mình cụ thể từng bước phải bấm nút nào lúc đang chơi.**"*

---

## Ghi chú của orchestrator (không phải lời persona)

**`FR-32` / `NFR-PERF-07` — tín hiệu định tính dương, và là thứ duy nhất lần chạy này có về
mạng chậm.** Trên Slow 4G, màn hình **không bao giờ trắng trơn**; persona chờ được và không
nghĩ máy hỏng. Đây **không phải** số đo thay cho `NFR-PERF-07` — không đo mili giây nào — mà
là điều kiện thất bại đã được loại trừ ở đúng người dễ bỏ đi nhất vì nó.

**Phát hiện mới, chưa persona nào khác chạm tới: sợ mất tiền thật.** *"Thôi không có tiền
thật đâu, chắc tiền trong trò chơi thôi, **nhưng mà không chắc lắm**"* → và cô **không dám bấm**.
`overview.md` §Non-Goals nói rõ *"không có mua bán bằng tiền thật"*, nhưng điều đó **không
được nói ra ở đâu trên UI**. Đúng cơ chế mà `persona-rules.md` §1 dự đoán cho negative persona
— chỉ có điều người tìm ra lại là một persona khác. Ở đây nó chặn hẳn một hành động.

**Né luôn CÀI ĐẶT vì cái tên.** *"Nghe chữ 'cài đặt' là mình ngại, sợ bấm vô rồi hỏng cái gì."*
Đối chiếu thẳng với phiên 5: cùng một nhãn đó dẫn Tuấn tới đúng thứ anh cần trong một bước.
Cùng một chữ, hai người, hai kết quả ngược nhau — lăng kính *trigger words*.

**"Không hiểu phải làm gì lúc đang chơi" giờ đã đủ điều kiện nâng bậc.** Ba persona khác nhau,
nguyên văn:
- Mai (phiên 1): *"chết rồi mà không hiểu vì sao"*
- Hạnh (phiên 3): *"Mình còn chưa kịp nhìn thấy cái gì cản đường mà đã hết game"*
- Bà Liên (phiên 6): *"Ủa, chơi gì đâu mà đã xong rồi? Mình có làm gì đâu"*

Luật ở `lib/frameworks.md` nâng một bậc khi ≥2 persona cùng vấp. **Nhưng phải tách hai lớp
trước khi xếp hạng**, và việc đó thuộc về `ux-expert`:
- phần *"không kịp nhìn"* — nhiễu bởi độ trễ tool, **không tính**;
- phần *"màn kết thúc không nói mình vừa vấp cái gì"* — thuần **hiểu**, tính đủ.

**Dòng gợi ý cử chỉ trượt ở đúng người cần nó nhất.** `journeys.md` US-01 đã lường trước:
*"Người chơi không nhận ra vuốt được → cần gợi ý cử chỉ ở vài giây đầu."* Gợi ý **có tồn tại**,
nhưng nằm ở **màn hình chính** dưới dạng chữ nhỏ, không nằm ở **vài giây đầu của lượt chơi**,
và bà Liên đọc lướt qua nó rồi chơi hết ba ván mà không biết vuốt.

**Cửa hàng: `FR-24` chặn đúng.** Nút MUA mờ kèm "CÒN THIẾU 72" khi không đủ xu — đúng thứ
`journeys.md` US-04 đòi (*"nút phải chặn trước, không để lỗi sau khi bấm"*). Khớp với quan sát
độc lập của Daniel ở phiên 4.
