export default function Logo({ size = 'md', onClick }) {
  const sizes = {
    sm: { width: 120, height: 28, font: 14 },
    md: { width: 150, height: 36, font: 18 },
    lg: { width: 190, height: 46, font: 24 },
  }
  const s = sizes[size] || sizes.md

  return (
    <svg
      width={s.width}
      height={s.height}
      viewBox={`0 0 ${s.width} ${s.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      aria-label="Turing Catalog Logo"
    >
      {/* Chip body */}
      <rect x="2" y="8" width={s.height - 16} height={s.height - 16} rx="4" fill="#00e5a0" />
      <rect x="6" y="12" width={s.height - 24} height={s.height - 24} rx="2" fill="#1a2332" />

      {/* Chip pins — top */}
      <rect x={s.height * 0.28} y="2"  width="3" height="6" rx="1" fill="#00e5a0" />
      <rect x={s.height * 0.48} y="2"  width="3" height="6" rx="1" fill="#00e5a0" />

      {/* Chip pins — bottom */}
      <rect x={s.height * 0.28} y={s.height - 8} width="3" height="6" rx="1" fill="#00e5a0" />
      <rect x={s.height * 0.48} y={s.height - 8} width="3" height="6" rx="1" fill="#00e5a0" />

      {/* Chip pins — left */}
      <rect x="2" y={s.height * 0.30} width="6" height="3" rx="1" fill="#00e5a0" />
      <rect x="2" y={s.height * 0.52} width="6" height="3" rx="1" fill="#00e5a0" />

      {/* Dot matrix inside chip */}
      <circle cx={s.height * 0.38} cy={s.height * 0.38} r="2"   fill="#00e5a0" />
      <circle cx={s.height * 0.57} cy={s.height * 0.38} r="2"   fill="#00e5a0" opacity="0.6" />
      <circle cx={s.height * 0.38} cy={s.height * 0.62} r="2"   fill="#00e5a0" opacity="0.6" />
      <circle cx={s.height * 0.57} cy={s.height * 0.62} r="2"   fill="#00e5a0" opacity="0.4" />

      {/* TURING text */}
      <text
        x={s.height + 8}
        y={s.height * 0.68}
        fontFamily="'Inter', 'Segoe UI', sans-serif"
        fontWeight="800"
        fontSize={s.font}
        letterSpacing="1"
        fill="white"
      >
        TURING
      </text>
    </svg>
  )
}
