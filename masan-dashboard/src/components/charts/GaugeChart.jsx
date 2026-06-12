export function GaugeChart({ positive = 0, negative = 0, gradId = "gauge" }) {
  const totalPN = positive + negative;
  const ratio = totalPN > 0 ? positive / totalPN : 0.5;
  const value = Math.min(92, Math.max(8, ratio * 100));
  const angle = 180 * (1 - value / 100);

  const cx = 100, cy = 102, r = 64;
  const rotation = 90 - angle;

  return (
    <svg viewBox="0 0 200 120" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E74C3C" />
          <stop offset="50%" stopColor="#F4C542" />
          <stop offset="100%" stopColor="#27AE60" />
        </linearGradient>
      </defs>
      <path d={`M ${cx - r - 14} ${cy} A ${r + 14} ${r + 14} 0 0 1 ${cx + r + 14} ${cy}`}
        stroke={`url(#${gradId})`} strokeWidth="20" fill="none" strokeLinecap="round" />
      <g transform={`rotate(${rotation} ${cx} ${cy})`}>
        <polygon points={`${cx},${cy - (r + 14)} ${cx - 11},${cy - (r - 22)} ${cx + 11},${cy - (r - 22)}`} fill="#2E8B57" />
      </g>
    </svg>
  );
}
