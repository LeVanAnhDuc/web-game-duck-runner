# Phiên 7 · p06 Vũ · **phiên mù** (power user desktop, negative persona)

- **emulate:** `1920x1080x1`, không throttle
- **Tool:** chrome-devtools-mcp · agent `ux-persona`
- **Thời lượng:** 244.4 s · **45 tool call** · persona tự đếm **~20 hành động**
- **Kết quả:** không có `done_when` (phiên mù). **Bỏ cuộc** đúng ngưỡng sau khi lục đủ 3 chỗ
  hợp lý mà không tìm thấy thứ mình muốn.

---

## 1. Chuyện đã xảy ra (nguyên văn persona)

Mở link, thấy trang đen với chữ "DUCK RUNNER"… Nghĩ ngay: *"đây chắc là game chạy vô tận kiểu
Subway Surfers, để xem có leaderboard không"*.

Bấm CÀI ĐẶT trước — chỉ có tắt âm thanh, hai thanh trượt, và nút "XOÁ TIẾN ĐỘ" (không đụng
vào theo rào an toàn). **Không có đăng nhập, không có gì liên quan tài khoản.** Nghĩ: *"vậy
đăng nhập chắc nằm ở cửa hàng hoặc màn chơi rồi"*.

Quay lại, bấm CỬA HÀNG — thấy 3 nhân vật để mua bằng xu (Thợ ủi 80, Kẻ lượn 200, Kẻ trôi 360),
đều bị khoá vì chưa đủ xu. **Không có tab bảng xếp hạng, không có nút "so với người chơi khác"
nào cả.**

Quay lại màn chính, bấm CHƠI. Bấm ArrowUp để nhảy, ArrowLeft/ArrowRight đổi làn, ArrowDown
trượt — **có phản hồi ngay**. Thử bấm ArrowRight hai lần liên tiếp thật nhanh xem có bị nhảy
vọt 2 làn cùng lúc không — không thấy gì bất thường, **có vẻ nó chỉ nhận lần cuối cùng**.

Chạy được một đoạn thì va vào chướng ngại, màn hình hiện "KỶ LỤC MỚI — 49m"… Nghĩ: *"chữ KỶ
LỤC MỚI này chắc chỉ so với chính máy mình thôi, chứ làm gì có ai để so — không thấy tên ai
khác cả"*. Bực nhẹ: ***"ghi kỷ lục mới mà không biết kỷ lục thế giới bao nhiêu thì ghi làm
gì"***.

Thử **bấm đúp vào nút CHƠI LẠI** xem có bug vào 2 lượt chơi chồng nhau không. Kết quả: **chỉ
tính là một lượt chơi bình thường** (chạy tới 59m, ví lên 2 xu) — không thấy hiện tượng lạ,
không văng lỗi gì thêm ngoài 2 dòng lỗi 404 (nhưng lỗi đó là do ảnh nền tải sai đường dẫn từ
lúc load trang, không phải do bấm đúp).

Về màn chính… **Kiểm tra luôn danh sách request mạng — toàn bộ chỉ là tải file tĩnh từ GitHub
Pages và Google Fonts, không có request nào gọi tới server** để lấy bảng xếp hạng hay tài khoản.

Chơi thêm một lượt, thử bấm ArrowUp hai lần liên tiếp thật nhanh xem có nhảy đúp không — không
thấy hiệu ứng gì khác thường.

Tới đây thì kết luận: game này không có bảng xếp hạng, không có đăng nhập, tất cả chỉ lưu trên
máy mình. Nghĩ: ***"vậy chơi xong máy này thì mất, đổi máy khác là về lại 0 — chưa hoàn
chỉnh"***. Dừng lại, không tìm nữa.

## 2. Con số (nguyên văn persona)

- **~20 hành động**, dưới 5 phút thao tác thực tế. Số lần quay lui: **2**.
- **Số lần bấm vào chỗ không phản hồi: 0** — mọi nút đều phản hồi ngay, **kể cả nút CHƠI LẠI
  bấm đúp**.
- Kết quả: **bỏ cuộc** tìm bảng xếp hạng/đăng nhập sau khi đã kiểm đủ 3 chỗ hợp lý.

## 3. Đính kèm thô

11 ảnh đã lưu: `p01-mo-trang` · `p02-cai-dat` · `p03-cua-hang` · `p04-bat-dau-choi` ·
`p05-nhay` · **`p06-bam-doi-lan-nhanh`** · `p07-choi-tiep` · `p08-game-over-ky-luc-moi` ·
**`p09-double-click-choi-lai`** · `p10-man-chinh-sau-choi` · **`p11-double-jump-thu`**

```
msgid=1 [error] Failed to load resource: the server responded with a status of 404 () (0 args) [2 times]
```

Network — **404 xuất hiện HAI lần trong một lần tải trang**:

```
reqid=20 GET .../textures/jungle-far.webp            [200]
reqid=21 GET .../textures/jungle-screen.webp         [200]
reqid=23 GET .../assets/textures/jungle-screen.webp  [404]
reqid=26 GET .../assets/textures/jungle-screen.webp  [404]
reqid=27 GET .../favicon.svg                         [304]
```

## Trả lời ba câu hỏi thêm (nguyên văn)

**(a) Tìm gì mà không thấy, tìm ở đâu, mất bao nhiêu lần bấm?** Tìm bảng xếp hạng / kỷ lục thế
giới / chỗ đăng nhập. Tìm ở **3 chỗ**: Cài đặt, Cửa hàng, và màn hình sau khi chết.
**Khoảng 6–7 lần bấm** để đi qua đủ 3 chỗ đó trước khi kết luận là không có.

**(b) Có gì nói cho biết là không có không?** **Không.** *"Phải tự suy ra sau khi lục hết
những chỗ hợp lý mà không thấy, và tự kiểm tra thêm network request để chắc chắn không có
server nào đứng sau. **Chữ 'KỶ LỤC MỚI' dễ gây hiểu lầm ban đầu là có gì đó để so sánh**,
nhưng nó chỉ là kỷ lục cá nhân lưu local."*

**(c) Bấm trùng / bấm nhanh có chỗ nào lạ không?** Thử **3 chỗ**: ArrowRight ×2 thật nhanh —
không có gì lạ; **double-click nút CHƠI LẠI — không vào hai lượt chồng nhau, chỉ tính một
lượt**; ArrowUp ×2 (thử nhảy đúp) — không có hiệu ứng khác thường.

---

## Ghi chú của orchestrator (không phải lời persona)

**Một rủi ro đã dự đoán trước: không tái hiện được.** `journeys.md` US-02 lường trước *"bấm
chơi lại quá nhanh khi lượt trước chưa dọn xong → hai lượt chồng nhau"*. Vũ thử đúng thao tác
đó và **không xảy ra**. Đây là kết quả âm có giá trị, nhưng là **một lần thử của một người** —
không phải bằng chứng thay cho test.

**Rủi ro còn lại CHƯA kiểm được.** `journeys.md` US-04 lường trước *"bấm mua hai lần → trừ
tiền hai lần"*. Vũ là persona duy nhất có phản xạ bấm trùng, nhưng phiên của anh **ví 0 xu**
nên nút MUA bị khoá, không bấm được. Còn Daniel (phiên 4) có tiền nhưng **không có phản xạ
bấm trùng**. **Không phiên nào phủ được ô này** — phải ghi vào báo cáo là khoảng trống, không
được im lặng.

**Negative persona làm đúng việc của nó.** Mọi thứ Vũ muốn đều nằm trong `overview.md`
§Non-Goals, và **quyết định không làm chúng vẫn hoàn toàn đúng**. Cái phát hiện được là ở chỗ
khác: **không có gì trên UI nói ra điều đó**, nên anh phải bỏ 6–7 lần bấm để tự suy ra, rồi
kết luận game *"chưa hoàn chỉnh"*. Cộng thêm một chi tiết cụ thể hơn: **chữ "KỶ LỤC MỚI" tự nó
gợi ý có ai đó để so sánh**. Đây là lăng kính *trigger words*, không phải lời kêu gọi làm bảng
xếp hạng.

**Giao nhau với bà Liên (phiên 6):** cùng một khoảng trống — điều game **cố ý không làm** thì
không được nói ra — gây hại theo hai kiểu ngược nhau: bà Liên **sợ mất tiền thật** nên không
dám bấm, Vũ **tưởng có bảng xếp hạng** nên đi tìm rồi thất vọng. Hai persona, hai hướng, một
nguyên nhân.

**404 lên tới hai lần mỗi lần tải trang.** Phiên 7 ghi được reqid=23 **và** reqid=26, cùng một
URL thừa tầng `assets/`. Tổng cộng đã thấy ở phiên 4, 5, 7 và bằng `curl` trực tiếp.

**Bàn phím trên desktop: đủ cả bốn thao tác.** Vũ xác nhận ArrowUp/Down/Left/Right đều **phản
hồi ngay**. Cộng với phiên 3 (Hạnh, chỉ bàn phím), `NFR-A11Y-06` phía bàn phím có hai nguồn
độc lập. **Space và nút kỹ năng thì vẫn chưa persona nào chạm tới** — kể cả người chơi giỏi
nhất trong dàn.
