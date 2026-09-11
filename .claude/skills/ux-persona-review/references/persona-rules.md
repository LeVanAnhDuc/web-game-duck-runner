# Rule tạo persona — bản đã chưng cho Duck Runner

**Fetch ngày 2026-09-11.** Nguồn và trạng thái từng nguồn ghi ở §Nguồn cuối file. Đây **không
phải** bản seed offline; bản seed đã bị ghi đè.

Ba mục đầu là rule chung của nghề. Mục 4 là phần riêng của domain này — game casual chơi
trên trình duyệt — và là mục quyết định dàn persona khác gì so với một CRUD app.

## 1. Phân loại (Cooper — goal-directed design)

| Loại | Nghĩa | Trong Duck Runner |
| --- | --- | --- |
| primary | người sản phẩm được thiết kế cho. Không phục vụ được họ là hỏng | người xem portfolio mở link, chơi 1–3 phút, không đọc hướng dẫn (`overview.md` §3) |
| secondary | dùng được, cần thêm vài thứ | người chơi casual quay lại phá kỷ lục của chính mình |
| served | chịu ảnh hưởng nhưng không trực tiếp dùng | người tuyển dụng đọc README rồi mới mở link |
| negative | người sản phẩm **không** nhắm tới. Có mặt để phát hiện đang phục vụ nhầm ai | người tìm bảng xếp hạng toàn cầu, tài khoản, đồng bộ nhiều máy — toàn bộ đều là Non-Goal |

Negative persona ở đây có một việc rất cụ thể: xác nhận các Non-Goal trong `overview.md` §4
**được thể hiện rõ ra ngoài UI**. Một Non-Goal đúng đắn mà không nói cho người dùng biết vẫn
tạo ra thất vọng — người chơi tìm mãi một cái nút không tồn tại thì đó là lỗi UX thật, dù
quyết định không làm chức năng đó là đúng.

## 2. Persona phải bám hành vi, không bám nhân khẩu học

NN/g: chỉ giữ chi tiết nào **đổi được một quyết định thiết kế** — *"if it would not affect the
final design or help make any decision easier, remove it"*. Chi tiết vô can không chỉ vô dụng,
nó **lấn chỗ** của chi tiết có ích: *"overwhelm the relevant ones and make them harder to
remember"*.

"Nữ, 28 tuổi, thích du lịch" không dự đoán được hành vi nào. "Quen bấm nút Back của trình
duyệt thay vì nút quay lại trong trang" thì có — nó đổi hẳn cách đánh giá màn cửa hàng.

NN/g cũng nói persona đúng phải dựng từ **nghiên cứu thật**. Dàn dưới đây **không có** —
chưa ai chơi thử. Nên mỗi persona ở đây là **proto-persona**: giả thuyết về người chơi, viết
ra để bị phản chứng. Hệ quả bắt buộc: khi 5 người thật chơi thử
(`backlog.md` §Việc tiếp theo), việc đầu tiên là **sửa dàn persona theo họ**, không phải viết
thêm persona mới.

## 3. Trường bắt buộc

| Trường | Vì sao bắt buộc |
| --- | --- |
| bối cảnh, nghề nghiệp | quyết định persona mở link ở đâu, còn bao nhiêu kiên nhẫn |
| trình độ số | quyết định mức chịu đựng với thuật ngữ |
| thiết bị + điều kiện mạng | đổi thẳng thành viewport và network throttle — không đặt được là phiên vô nghĩa |
| nhu cầu tiếp cận | dàn **bắt buộc** có ít nhất một người chỉ dùng bàn phím hoặc thị lực kém |
| động cơ, nỗi sợ | định hướng cái persona chú ý tới |
| `patience_threshold` | 2–6 bước bế tắc liên tiếp thì bỏ cuộc — điều kiện dừng thật của phiên |
| ngôn ngữ | game chỉ có tiếng Việt (`NFR-I18N-01`, Non-Goal đa ngôn ngữ) → xem mục 4.4 |
| **kinh nghiệm game** | riêng của domain này. Xem mục 4.1 |

### Kích thước dàn

5–7 người, **cố định giữa các lần chạy**. Đẻ persona mới mỗi lần chạy là tự tay phá bỏ thứ
đắt nhất mà skill này tạo ra: khả năng so sánh trước và sau khi sửa.

Bắt buộc có: ít nhất một persona tiếp cận (a11y), **đúng một** negative persona, ít nhất một
người dùng điện thoại trên mạng chậm.

### Jobs-To-Be-Done

Với mỗi persona, viết được một câu dạng: *khi \_\_\_, tôi muốn \_\_\_, để \_\_\_.*
Câu này là nguyên liệu sinh `goal_in_user_words` cho mỗi Red Route — diễn đạt bằng từ ngữ của
người dùng, không dùng từ ngữ của sản phẩm.

Với một game, JTBD gần như luôn là một **cảm giác**, không phải một kết quả: "khi đang chờ 3
phút, tôi muốn có cái gì bấm cho hết chán". Đừng bẻ nó thành "tôi muốn hoàn thành lượt chơi" —
không ai muốn thế.

## 4. Riêng domain: game casual trên trình duyệt

### 4.1 Kinh nghiệm game là trường phân hoá mạnh nhất, không phải trình độ số

Ở CRUD app, trình độ số dự đoán gần hết hành vi. Ở đây nó không đủ: một lập trình viên chưa
từng chơi runner nào và một học sinh cấp 2 đã chơi Subway Surfers 500 lượt sẽ **cư xử ngược
nhau** trước cùng một màn hình, và người có trình độ số cao là người bỡ ngỡ hơn.

Nên mỗi persona phải khai riêng: **đã chơi endless runner bao giờ chưa.** Người đã chơi mang
theo một mô hình sẵn (vuốt để đổi làn, chạy tự động, chết là hết) và sẽ **không đọc** hướng
dẫn; người chưa chơi không có mô hình đó và phải đoán từ hình ảnh.

Đây cũng là cái bẫy của chính dự án này: người viết game đã chơi runner, nên mọi thứ hiển
nhiên với họ.

### 4.2 Cửa sổ quyết định là **giây**, không phải phút

Nghiên cứu casual/hyper-casual: người chơi mất khoảng **7 giây** để quyết định game có đáng
không, và trong **30–60 giây** đầu thì quyết định ở lại hay bỏ. Onboarding tốt nhất là **học
bằng cách chơi**, không phải đọc — có game chỉ đưa đúng một dòng "swipe to shoot" và hết.

Khớp với tiêu chí thành công số 1 của dự án: *"chơi hết một lượt mà không hỏi cách chơi"*
(`overview.md` §6). Nên `patience_threshold` ở đây **thấp hơn** một CRUD app: 2–4 bước là
thường, không phải 4–6. Người ta không nợ một game casual sự kiên nhẫn nào.

Cái phải đo trong 10 giây đầu: persona có hiểu **mình đang điều khiển cái gì** không, và có
biết **thao tác nào có thật** không.

### 4.3 Tiếp cận trong game khác tiếp cận trong web (Game Accessibility Guidelines, tầng basic)

Guideline tầng basic nào **áp được** vào game này, và persona nào chịu trách nhiệm phát hiện:

| Guideline (nguyên văn) | Trong Duck Runner | NFR/FR liên quan |
| --- | --- | --- |
| *"Allow controls to be remapped / reconfigured"* | **không có.** Bàn phím cứng ở mũi tên/WASD/Space | — (khoảng trống thật) |
| *"Include an option to adjust the game speed"* | **không có.** Tốc độ tăng dần có trần, không đổi được | — |
| *"Ensure interactive elements / virtual controls are large and well spaced"* | vùng bấm ≥ 44×44px | `NFR-A11Y-03` |
| *"Provide high contrast between text/UI and background"* | HUD chồng trên cảnh 3D | `NFR-A11Y-01` · `NFR-A11Y-07` |
| *"Ensure no essential information is conveyed by a fixed colour alone"* | nhân vật phân biệt bằng **hình bóng**, không bằng màu (`ADR-0009`) | `NFR-A11Y-07` |
| *"Allow the game to be started without the need to navigate through multiple levels of menus"* | một nút CHƠI ở màn đầu | `FR-11` |
| *"Use simple clear language"* | "Ủi", "Chậm", "Bay", "Ví", "Thanh nạp" | `glossary.md` |

Hai dòng đầu là **khoảng trống thật đã biết trước**, không phải phát hiện của lần chạy. Persona
a11y sẽ vấp vào chúng; báo cáo phải ghi là *đã biết*, và quyết định làm hay không là của người
làm sản phẩm — hai thứ đó đều kéo theo màn cài đặt mới và có thể phá `Non-Goal`.

Ngược lại, hai guideline mà web-a11y **không có mà game thì cần**, và không persona nào tự
nghĩ ra nếu không dặn: *tốc độ* và *đòi hỏi phản xạ*. Nhưng theo `SKILL.md` §1, persona **không
có quyền kết luận** về hai thứ này — độ trễ tool làm sai lệch. Persona a11y ghi lại **cảm giác**
("nhanh quá tôi không kịp nhìn"), báo cáo ghi lại nguyên văn, và **không** biến nó thành phát
hiện về độ khó.

### 4.4 Ngôn ngữ: chỉ có tiếng Việt, và đó là một biến

Game một ngôn ngữ (`overview.md` §Non-Goals). Nên `ngôn ngữ` không phải trường trang trí:
persona không đọc được tiếng Việt sẽ phải chơi **hoàn toàn bằng hình ảnh**. Dàn nên có một
người như vậy — nó test đúng thứ tiêu chí thành công số 1 đòi: hiểu được mà không cần đọc chữ.

### 4.5 Không có form, nên "form design" đổi nghĩa

`lib/frameworks.md` có lăng kính *Form design*. Game này **không có form nào** — không đăng
ký, không đăng nhập, không nhập liệu văn bản. Lăng kính đó không bỏ đi, mà chuyển sang thứ gần
nhất: **màn cài đặt** (`FR-29`) và **hộp xác nhận xoá tiến độ** (`resetConfirm`). Đó là chỗ
duy nhất người chơi đưa ra một lựa chọn có hậu quả và cần nhãn rõ ràng.

Persona nào cũng có thể vấp vào nó, nhưng chỉ một hành động thôi: **xoá tiến độ là hành động
không hoàn tác được**. Rào an toàn trong `ux-persona.md` cấm thao tác không hoàn tác — nên
persona được phép **mở** hộp xác nhận và kể lại nó đọc như thế nào, rồi **bấm HUỶ**. Không
persona nào được bấm XOÁ.

## Nguồn

| Nguồn | Trạng thái | Dùng cho mục |
| --- | --- | --- |
| NN/g — *Personas: Turn User Data Into User-Centered Design* (nngroup.com/articles/persona) | ✅ fetch được | 2 |
| Game Accessibility Guidelines, tầng basic (gameaccessibilityguidelines.com/basic) | ✅ fetch được | 4.3 |
| Nghiên cứu casual/hyper-casual FTUE (gamedesignskills.com · gamedeveloper.com · userpilot.com, qua tìm kiếm) | ✅ tổng hợp từ kết quả tìm kiếm | 4.2 |
| David Travis — *Red routes* (userfocus.co.uk/articles/redroutes.html) | ⚠️ **403 Forbidden.** Khái niệm lấy qua nguồn thứ cấp (thedecisionlab.com · rikwilliams.net): red route = việc **nhiều người làm** × **làm thường xuyên**, và bản 2006 gốc nói thêm rằng chỉ tần suất là không đủ — phải cộng mức **nghiêm trọng** của luồng | `red-routes.md` |
| Cooper — goal-directed personas, 4 loại | 📖 không fetch; kiến thức nền, khớp bản seed | 1 |
| Jobs-To-Be-Done | 📖 không fetch; kiến thức nền | 3 |

Hai dòng cuối và dòng Travis là chỗ file này **yếu nhất**. Chạy
`install.sh <project> --refresh-rules` rồi làm lại Bước 4 của máy phát nếu cần bản chắc hơn.
