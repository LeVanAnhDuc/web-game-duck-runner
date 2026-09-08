/**
 * Icon ve bang SVG noi tuyen — MASTER §9 cam emoji lam icon.
 * Mot bo duy nhat, hinh hoc theo luoi 24px, net 2px, dau tron.
 */
type Props = { size?: number; className?: string }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
})

export const IconPause = ({ size = 20 }: Props) => (
  <svg {...base(size)}>
    <rect x="7" y="5" width="3.5" height="14" rx="1" />
    <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
  </svg>
)

export const IconPlay = ({ size = 20 }: Props) => (
  <svg {...base(size)}>
    <path d="M7 4.8 19 12 7 19.2z" />
  </svg>
)

export const IconCoin = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8.5v7M10 10.5h3a1.5 1.5 0 0 1 0 3h-2a1.5 1.5 0 0 0 0 3h3" />
  </svg>
)

export const IconBolt = ({ size = 24 }: Props) => (
  <svg {...base(size)}>
    <path d="M13 2 4.5 13.5H11l-1 8.5 9-11.5h-6.5z" />
  </svg>
)

export const IconTrophy = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
    <path d="M7 6H4.5a2.5 2.5 0 0 0 2.5 4" />
    <path d="M17 6h2.5a2.5 2.5 0 0 1-2.5 4" />
    <path d="M12 14v4M8.5 21h7" />
  </svg>
)

export const IconRetry = ({ size = 20 }: Props) => (
  <svg {...base(size)}>
    <path d="M21 12a9 9 0 1 1-2.6-6.4" />
    <path d="M21 3v6h-6" />
  </svg>
)

export const IconHome = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5.5 9.5V20h13V9.5" />
  </svg>
)

export const IconCart = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" />
  </svg>
)

export const IconGear = ({ size = 18 }: Props) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
  </svg>
)

export const IconBack = ({ size = 20 }: Props) => (
  <svg {...base(size)}>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </svg>
)

export const IconWarn = ({ size = 40 }: Props) => (
  <svg {...base(size)}>
    <path d="M12 3.5 2.5 20h19z" />
    <path d="M12 9.5v5" />
    <circle cx="12" cy="17.6" r="0.9" fill="currentColor" stroke="none" />
  </svg>
)

export const IconShield = ({ size = 16 }: Props) => (
  <svg {...base(size)}>
    <path d="M12 3 5 6v6c0 4 3 7.4 7 9 4-1.6 7-5 7-9V6z" />
  </svg>
)

export const IconMagnet = ({ size = 16 }: Props) => (
  <svg {...base(size)}>
    <path d="M6 4H3v7a9 9 0 0 0 18 0V4h-3v7a6 6 0 0 1-12 0z" />
    <path d="M3 8h3M18 8h3" />
  </svg>
)

export const IconRush = ({ size = 16 }: Props) => (
  <svg {...base(size)}>
    <path d="M3 8h9M3 12h13M3 16h7" />
    <path d="m17 6 4 6-4 6" />
  </svg>
)
