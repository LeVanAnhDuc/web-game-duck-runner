/**
 * Moi chuoi hien thi nam o day — NFR-I18N-01.
 *
 * Day CHUA phai i18n: game chay mot ngon ngu duy nhat (overview.md §Non-Goals).
 * Nhung gom chuoi lai la dieu kien de them ngon ngu sau ma khong phai di tim
 * chung trong tung component.
 */
export const S = {
  gameTitle: 'DUSKRUN',

  menu: {
    play: 'CHƠI',
    shop: 'CỬA HÀNG',
    settings: 'CÀI ĐẶT',
    best: 'Kỷ lục',
    wallet: 'Ví',
    hint: 'VUỐT ĐỂ ĐỔI LÀN · NHẢY · TRƯỢT',
    hintDesktop: 'MŨI TÊN ĐỂ DI CHUYỂN · SPACE DÙNG KỸ NĂNG',
  },

  hud: {
    pause: 'Tạm dừng',
    metres: 'm',
    skill: 'Dùng kỹ năng',
    skillReady: 'SẴN SÀNG',
    skillCharging: 'ĐANG NẠP',
    shield: 'Khiên',
    magnet: 'Nam châm',
    rush: 'Tua nhanh',
  },

  gameOver: {
    newRecord: 'KỶ LỤC MỚI',
    thisRun: 'LƯỢT NÀY',
    wallet: 'VÍ',
    retry: 'CHƠI LẠI',
    home: 'VỀ MÀN CHÍNH',
    best: 'Kỷ lục',
  },

  pause: {
    title: 'TẠM DỪNG',
    resume: 'CHƠI TIẾP',
    home: 'VỀ MÀN CHÍNH',
  },

  shop: {
    title: 'CỬA HÀNG',
    back: 'Quay lại',
    buy: 'MUA',
    equip: 'CHỌN',
    equipped: 'ĐANG DÙNG',
    owned: 'ĐÃ CÓ',
    short: (n: number) => `Còn thiếu ${n}`,
    skillLabel: 'Kỹ năng',
  },

  settings: {
    title: 'CÀI ĐẶT',
    back: 'Quay lại',
    music: 'Nhạc nền',
    sfx: 'Hiệu ứng âm thanh',
    mute: 'Tắt toàn bộ âm thanh',
    reducedMotion: 'Hệ thống đang bật giảm chuyển động — hiệu ứng trang trí đã tắt.',
    reset: 'XOÁ TIẾN ĐỘ',
    resetConfirm: 'Xoá kỷ lục, ví xu và nhân vật đã mua?',
    resetYes: 'XOÁ',
    resetNo: 'HUỶ',
  },

  loading: {
    title: 'ĐANG TẢI',
  },

  error: {
    title: 'Không chạy được đồ hoạ 3D',
    body: 'Trình duyệt này không bật WebGL, nên game không dựng được cảnh. Thường là do tăng tốc phần cứng đang tắt trong phần cài đặt của trình duyệt.',
    lost: 'Trình duyệt vừa thu hồi bộ nhớ đồ hoạ nên lượt chơi phải dừng. Thử lại thường là được.',
    retry: 'THỬ LẠI',
  },

  a11y: {
    canvas: 'Khu vực chơi. Dùng mũi tên trái phải để đổi làn, mũi tên lên để nhảy, mũi tên xuống để trượt.',
    coinIcon: 'xu',
  },
} as const

/** Dinh dang so cho de doc: 1482 -> "1 482". */
export const fmt = (n: number): string =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
