# Phiên 2 · p01 Mai · RR-02 — Chơi lại ngay, không quay về màn chính

- **emulate:** `390x844x3,mobile,touch` · Fast 4G
- **Fixture:** ví nạp sẵn **kỷ lục 206 m · 12 xu** (đúng bối cảnh US-02: *"biết kỷ lục cũ của
  mình"*). Con số 206 lấy từ chính ván hay nhất của phiên 1.
- **Tool:** chrome-devtools-mcp · agent **`ux-persona`** (có giới hạn tool — từ phiên này trở đi)
- **Thời lượng:** 374.9 s · **58 tool call** · persona tự đếm **~20 thao tác**, **7 ván**
- **Kết quả:** **ĐẠT `done_when`** — *"Số lần phải quay lại màn hình đầu để chơi tiếp: **0**"*.
  Dừng vì **chán**, không vì bí.

---

## 1. Chuyện đã xảy ra (nguyên văn persona)

Mở link lên là thấy ngay một con vịt với cảnh rừng, số "206" và chữ "m" to đùng ở góc, với
"12" nhỏ hơn bên cạnh (chắc là mét chạy được nhiều nhất với số xu, kiểu game chạy vô tận nào
cũng có). Có 3 nút: CHƠI, CỬA HÀNG, CÀI ĐẶT. Không đọc gì thêm, bấm luôn CHƠI vì nó to nhất.

Ngó lại màn hình thì... đã thấy bảng "kết thúc" rồi, ghi 52m. Trong đầu nghĩ: **"Ủa gì vậy,
mới bấm chơi cái đã thua luôn á, còn chưa kịp thấy con vịt chạy kiểu gì mà."** Bấm CHƠI LẠI,
y chang, lại thua ngay tắp lự (57m). Thử vuốt tay ngay sau khi bấm chơi lại — vẫn thua nhanh y
vậy (55m), nghĩ **"hay là vuốt không ăn thua gì hết, tay mình vuốt trật chỗ chăng?"**

Bấm CHƠI LẠI lần nữa, lần này canh coi có gì hiện ra không thì bắt được lúc đang chạy thiệt —
thấy nút "Tạm dừng", số mét đang tăng, có cái **"Dùng kỹ năng" với chữ "ĐANG NẠP"**. À hoá ra
lúc nãy mình cứ nhìn vào lúc nó đã thua rồi. Vuốt trái một cái — thua ở 49m, chưa thấy ăn thua
rõ ràng.

Chơi lại lần nữa, lần này bấm nhảy (mũi tên lên) rồi liên tục đổi bên trái/phải — tự nhiên
chạy xa hẳn: 159m rồi 198m! Trong đầu mừng rơn **"ê ê sắp hơn kỷ lục 206 rồi, ráng chút nữa!"**
— nhưng cuối cùng vẫn thua ở 198m, thiếu có 8m là hòa/hơn kỷ lục cũ. Tiếc ơi là tiếc.

Chơi thêm 3 ván nữa cố gỡ, nhưng cả 3 đều thua rất nhanh (48m, 49m, 49m) — y như hồi đầu,
không xa hơn được chút nào. Nghĩ **"ơ sao lại thua nhanh vậy nữa, hồi nãy chạy xa vậy mà."**
Sau 3 ván thua liên tiếp và ngắn ngủn như vậy, thấy chán, bấm nút "VỀ MÀN CHÍNH" rồi dừng,
không chơi tiếp nữa. Về màn hình đầu thì kỷ lục vẫn 206m (chưa phá được), nhưng **xu đã tăng
từ 12 lên 27** — cái này thấy vui vui vì ít ra cũng có cái để "lời" lại sau mấy ván thua.

Cảm giác mỗi lần ván kết thúc: mấy ván đầu và ván 198m thì **rất muốn chơi tiếp**, vì cái số
mét với số xu cứ tăng lên là thấy có động lực gỡ. Nhưng ba ván thua nhanh liên tiếp ở cuối làm
mất hứng hẳn, thấy chán nên dừng — **không phải vì bấm không được gì, mà vì thua hoài không
tiến bộ**.

## 2. Con số (nguyên văn persona)

- Số ván đã chơi: **7 ván**.
- Số thao tác chính (bấm nút/vuốt/né): khoảng **20 lần**.
- **Số lần phải quay lại màn hình đầu để chơi tiếp: 0** — mỗi ván thua xong đều có nút
  "CHƠI LẠI" ngay tại chỗ, không cần quay về màn chính.
- Số lần bấm mà màn hình không phản hồi gì: **0**.
- Kết quả: **chơi xong theo ý muốn (không phải bỏ cuộc vì bí)**, dừng vì chán sau chuỗi 3 ván
  thua liên tiếp và ngắn. Kỷ lục không phá được (vẫn 206m, gần nhất là 198m).

## 3. Đính kèm thô

12 ảnh trong scratchpad của phiên: `p01-home` · `p02-after-choi` (52m) ·
`p03-gameover-attempt3` (55m) · `p04-immediate-after-choilai` ·
`p05-midrun-41m` · `p06-gameover-afterswipe` (49m) · `p07-midrun-159m` ·
`p08-gameover-198m-suytiec` · `p09-gameover-48m` · `p10-gameover-49m-2ndinrow` ·
`p11-gameover-49m-3rdinrow-chan` · `p12-vemanchinh-cuoicung`

```
## Console messages
<no console messages found>
```

Network, lúc quay về màn chính lần cuối — **12 request, tất cả 200**:

```
reqid=24 GET .../web-game-duck-runner/ [200]
reqid=25 GET https://fonts.googleapis.com/css2?family=Bricolage+Grotesque… [200]
reqid=26 GET .../assets/index-DfDrHdDk.js [200]
reqid=27 GET .../assets/index-BZTPIKBq.css [200]
reqid=28..32 GET https://fonts.gstatic.com/… (5 file woff2) [200]
reqid=33 GET .../textures/jungle-far.webp [200]
reqid=34 GET .../textures/jungle-screen.webp [200]
reqid=35 GET .../favicon.svg [200]
```

---

## Ghi chú của orchestrator (không phải lời persona)

**Một lỗi hợp lệ của phiên, phải trừ vào kết quả:** Mai là persona **điện thoại, một tay**,
nhưng ở ván 159 m / 198 m cô **dùng phím mũi tên** (*"bấm nhảy (mũi tên lên)"*). Trên điện
thoại thật không có phím mũi tên. Nên **hai ván xa nhất của phiên này không phải trải nghiệm
điện thoại**, và không được dùng làm bằng chứng cho bất cứ điều gì về vuốt. Brief các phiên
sau phải khoá thiết bị đầu vào theo persona, không chỉ khoá viewport.

**Khớp với phiên 1, nhưng là cùng một persona** — theo luật xếp hạng ở `lib/frameworks.md`,
nâng bậc cần **từ 2 persona trở lên** cùng vấp, nên hai phiên của Mai **chỉ tính là một**.
Chờ persona khác xác nhận.

**Phân biệt hai thứ đang trộn vào nhau ở đoạn "chưa kịp thấy con vịt chạy":**

- *"mình cứ nhìn vào lúc nó đã thua rồi"* — **artifact của độ trễ tool**, đúng như `SKILL.md`
  §1 dự đoán. **Không phải phát hiện.**
- *"thua rồi mà không biết vì cái gì"* (cả hai phiên) — về **hiểu**, không về phản xạ. Dùng được.

**Tín hiệu dương, hiếm nên phải ghi:** ví tăng 12 → 27 xu và persona **tự nhận ra** điều đó rồi
thấy được an ủi — *"ít ra cũng có cái để lời lại sau mấy ván thua"*. Đó đúng là thứ
`invariants.md` §11 bảo vệ (xu vào ví dù thua).

**Liên quan RR-03:** Mai **có nhìn thấy** "Dùng kỹ năng" và chữ "ĐANG NẠP" trong lúc chơi,
nhưng không hỏi nó là gì và không thử bấm.
