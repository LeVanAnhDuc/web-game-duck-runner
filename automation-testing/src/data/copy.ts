// Text the tests assert on, copied verbatim with its source path, so a copy change is fixed here, not in specs.
// Duck Runner ships one language (overview.md §Non-Goals): every UI string lives in client/src/data/strings.ts.

// client/src/data/strings.ts → S
export const copy = {
  // S.gameTitleLines / S.tagline
  titleLines: ["DUCK", "RUNNER"],
  tagline: "Ba làn. Một kỹ năng. Một con đường qua vực.",
  menu: {
    play: "CHƠI",
    shop: "CỬA HÀNG",
    settings: "CÀI ĐẶT",
    // S.menu.hint — the one hint the menu renders
    hint: "VUỐT ĐỂ ĐỔI LÀN · NHẢY · TRƯỢT",
  },
  hud: {
    pause: "Tạm dừng",
    metres: "m",
    skill: "Dùng kỹ năng",
    skillReady: "SẴN SÀNG",
    skillCharging: "ĐANG NẠP",
    // S.hud.magnet / S.hud.rush / S.hud.shield — effect chips; GameHost.effectLabels() adds " <seconds>s" to timed ones
    magnet: "Nam châm",
    rush: "Tua nhanh",
    shield: "Khiên",
  },
  gameOver: {
    newRecord: "KỶ LỤC MỚI",
    thisRun: "LƯỢT NÀY",
    wallet: "VÍ",
    retry: "CHƠI LẠI",
    home: "VỀ MÀN CHÍNH",
    best: "Kỷ lục",
  },
  pause: {
    title: "TẠM DỪNG",
    resume: "CHƠI TIẾP",
    home: "VỀ MÀN CHÍNH",
  },
  shop: {
    title: "CỬA HÀNG",
    back: "Quay lại",
    buy: "MUA",
    equip: "CHỌN",
    equipped: "ĐANG DÙNG",
    short: (n: number) => `Còn thiếu ${n}`,
    skillLabel: "Kỹ năng",
  },
  settings: {
    title: "CÀI ĐẶT",
    back: "Quay lại",
    music: "Nhạc nền",
    sfx: "Hiệu ứng âm thanh",
    mute: "Tắt toàn bộ âm thanh",
    reducedMotion: "Hệ thống đang bật giảm chuyển động — hiệu ứng trang trí đã tắt.",
    reset: "XOÁ TIẾN ĐỘ",
    resetConfirm: "Xoá kỷ lục, ví xu và nhân vật đã mua?",
    resetYes: "XOÁ",
    resetNo: "HUỶ",
  },
  account: {
    signIn: "Đăng nhập",
    signingIn: "Đang đăng nhập…",
    menuLabel: "Tài khoản Ducker ID",
    openProfile: "Mở hồ sơ Ducker ID",
    signOut: "Đăng xuất",
  },
  error: {
    title: "Không chạy được đồ hoạ 3D",
    body: "Trình duyệt này không bật WebGL, nên game không dựng được cảnh. Thường là do tăng tốc phần cứng đang tắt trong phần cài đặt của trình duyệt.",
    lost: "Trình duyệt vừa thu hồi bộ nhớ đồ hoạ nên lượt chơi phải dừng. Thử lại thường là được.",
    retry: "THỬ LẠI",
  },
  a11y: {
    canvas: "Khu vực chơi. Dùng mũi tên trái phải để đổi làn, mũi tên lên để nhảy, mũi tên xuống để trượt.",
  },
  // index.html <title>
  documentTitle: "Duck Runner",
} as const;

// client/src/data/strings.ts → fmt: thousands grouped with a plain space, 1482 → "1 482".
export function fmt(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const serverMessage = {} as const;
