import { T, fmt } from "../../constants/theme";
import COMP from "../../data/comp.json";

export function NSRChart() {
  const brands = COMP.comp_summary;
  const maxX = Math.max(...brands.map(b => b.total)) * 1.15;
  const W = 540, H = 300, PAD = { l: 52, r: 20, t: 24, b: 64 };
  const cW = W - PAD.l - PAD.r, cH = H - PAD.t - PAD.b;
  const sx = x => PAD.l + (x / maxX) * cW;
  const sy = y => PAD.t + (1 - ((y + 5) / 120)) * cH;
  const yTicks = [0, 20, 40, 60, 80];
  const xTicksK = [0, 10, 20, 30, 40, 50];
  const bubbleR = b => Math.max(18, Math.min(42, Math.sqrt(b.total / 49702) * 36));
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 8 }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H + 24}`} style={{ overflow: "visible", maxWidth: 640 }}>
        {yTicks.map(y => (
          <g key={y}>
            <line x1={PAD.l} y1={sy(y)} x2={PAD.l + cW} y2={sy(y)} stroke="#EAF0F8" strokeWidth="1" />
            <text x={PAD.l - 6} y={sy(y) + 4} textAnchor="end" fontSize="10" fill="#9AAABF">{y}%</text>
          </g>
        ))}
        {xTicksK.filter(x => x * 1000 <= maxX * 1.05).map(x => (
          <g key={x}>
            <line x1={sx(x * 1000)} y1={PAD.t} x2={sx(x * 1000)} y2={PAD.t + cH} stroke="#EAF0F8" strokeWidth="1" />
            <text x={sx(x * 1000)} y={PAD.t + cH + 14} textAnchor="middle" fontSize="10" fill="#9AAABF">{x > 0 ? x + "K" : "0"}</text>
          </g>
        ))}
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + cH} stroke="#D5E3F0" strokeWidth="1" />
        <line x1={PAD.l} y1={PAD.t + cH} x2={PAD.l + cW} y2={PAD.t + cH} stroke="#D5E3F0" strokeWidth="1" />
        <defs><linearGradient id="wkg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E74C3C" /><stop offset="100%" stopColor="#27AE60" />
        </linearGradient></defs>
        <rect x={PAD.l} y={PAD.t + cH + 30} width={cW} height={9} rx="4.5" fill="url(#wkg)" />
        <text x={PAD.l + 3} y={PAD.t + cH + 26} fontSize="9" fill="#E74C3C" fontWeight="700">NOT WELL-KNOWN</text>
        <text x={PAD.l + cW - 3} y={PAD.t + cH + 26} fontSize="9" fill="#27AE60" fontWeight="700" textAnchor="end">WELL-KNOWN</text>
        {brands.map((b, i) => {
          const cx = sx(b.total), cy = sy(b.nsr), r = bubbleR(b);
          const above = cy > PAD.t + 60;
          const lx = cx, ly = above ? cy - r - 6 : cy + r + 16;
          const anchor = cx < PAD.l + cW * 0.5 ? "start" : cx > PAD.l + cW * 0.75 ? "end" : "middle";
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill={b.color} fillOpacity="0.85" />
              <text x={lx} y={above ? ly : ly - 9} textAnchor={anchor} fontSize="10" fontWeight="700" fill={b.color}>{b.name}</text>
              <text x={lx} y={above ? ly + 12 : ly + 3} textAnchor={anchor} fontSize="9" fill={T.textSub}>Total: {fmt(b.total)}</text>
              <text x={lx} y={above ? ly + 23 : ly + 14} textAnchor={anchor} fontSize="9" fill={T.textSub}>NSR: {b.nsr}%</text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginTop: 4 }}>
        {brands.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: b.color }} />
            <span style={{ color: T.textPrimary }}>{b.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
