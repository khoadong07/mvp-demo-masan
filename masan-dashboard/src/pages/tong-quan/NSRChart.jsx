import { useState } from "react";
import { T, fmt } from "../../constants/theme";
import COMP from "../../data/comp.json";

export function NSRChart({ hiddenKeys: hiddenKeysProp, onToggle }) {
  const [internalHidden, setInternalHidden] = useState(new Set());
  const [tooltip, setTooltip] = useState(null); // { x, y, brand }

  const hiddenKeys = hiddenKeysProp ?? internalHidden;
  const toggleKey = onToggle ?? ((name) => {
    setInternalHidden(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  });

  const brands = COMP.comp_summary;
  const maxTotal = Math.max(...brands.map(b => b.total));
  const maxX = maxTotal * 1.15;
  const W = 520, H = 310, PAD = { l: 52, r: 20, t: 24, b: 64 };
  const cW = W - PAD.l - PAD.r, cH = H - PAD.t - PAD.b;
  const sx = x => PAD.l + (x / maxX) * cW;
  // Y range: -25 (bottom) to +55 (top), 80-unit span
  const sy = y => PAD.t + (1 - ((y + 25) / 80)) * cH;
  const yTicks  = [-20, 0, 20, 40];
  const xTicksK = [0, 10, 20, 30, 40, 50];
  const bubbleR = b => Math.max(14, Math.min(38, Math.sqrt(b.total / maxTotal) * 38));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 8 }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H + 24}`} style={{ overflow: "visible" }}>
        {/* Y grid + labels */}
        {yTicks.map(y => (
          <g key={y}>
            <line x1={PAD.l} y1={sy(y)} x2={PAD.l + cW} y2={sy(y)}
              stroke={y === 0 ? "#B8CAD9" : "#EAF0F8"} strokeWidth={y === 0 ? "1.5" : "1"} />
            <text x={PAD.l - 6} y={sy(y) + 4} textAnchor="end" fontSize="10" fill="#9AAABF">{y}%</text>
          </g>
        ))}
        <text x={PAD.l - 6} y={sy(0) - 7} textAnchor="end" fontSize="9" fill="#9AAABF">NSR</text>

        {/* X grid + labels */}
        {xTicksK.filter(x => x * 1000 <= maxX * 1.05).map(x => (
          <g key={x}>
            <line x1={sx(x * 1000)} y1={PAD.t} x2={sx(x * 1000)} y2={PAD.t + cH} stroke="#EAF0F8" strokeWidth="1" />
            <text x={sx(x * 1000)} y={PAD.t + cH + 14} textAnchor="middle" fontSize="10" fill="#9AAABF">
              {x > 0 ? x + "K" : "0"}
            </text>
          </g>
        ))}

        {/* Axes */}
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + cH} stroke="#D5E3F0" strokeWidth="1" />
        <line x1={PAD.l} y1={PAD.t + cH} x2={PAD.l + cW} y2={PAD.t + cH} stroke="#D5E3F0" strokeWidth="1" />

        {/* Well-known gradient bar */}
        <defs>
          <linearGradient id="wkg3" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E74C3C" /><stop offset="100%" stopColor="#27AE60" />
          </linearGradient>
        </defs>
        <rect x={PAD.l} y={PAD.t + cH + 30} width={cW} height={9} rx="4.5" fill="url(#wkg3)" />
        <text x={PAD.l + 3}      y={PAD.t + cH + 26} fontSize="9" fill="#E74C3C" fontWeight="700">NOT WELL-KNOWN</text>
        <text x={PAD.l + cW - 3} y={PAD.t + cH + 26} fontSize="9" fill="#27AE60" fontWeight="700" textAnchor="end">WELL-KNOWN</text>

        {/* Bubbles — color only, no text labels; full info on hover */}
        {brands.map((b, i) => {
          const isHidden = hiddenKeys.has(b.name);
          const cx = sx(b.total), cy = sy(b.nsr), r = bubbleR(b);
          return (
            <g key={i} style={{ opacity: isHidden ? 0.12 : 1, cursor: "pointer" }}
              onMouseEnter={e => setTooltip({ x: e.clientX, y: e.clientY, brand: b })}
              onMouseMove={e  => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
              onMouseLeave={()  => setTooltip(null)}>
              <circle cx={cx} cy={cy} r={r} fill={b.color} fillOpacity="0.85" />
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={b.color} strokeWidth="2" strokeOpacity="0.4" />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginTop: 6 }}>
        {brands.map((b, i) => {
          const isHidden = hiddenKeys.has(b.name);
          return (
            <div key={i} onClick={() => toggleKey(b.name)}
              style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, cursor: "pointer",
                opacity: isHidden ? 0.35 : 1, userSelect: "none" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                background: isHidden ? "transparent" : b.color, border: "2px solid " + b.color }} />
              <span style={{ color: T.textPrimary, textDecoration: isHidden ? "line-through" : "none" }}>{b.name}</span>
            </div>
          );
        })}
      </div>

      {/* Hover tooltip — rendered as fixed so it escapes any overflow:hidden parent */}
      {tooltip && (
        <div style={{
          position: "fixed", left: tooltip.x + 14, top: tooltip.y - 100,
          background: "#fff", border: "1px solid " + T.border, borderRadius: 10,
          padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.13)",
          fontSize: 12, pointerEvents: "none", zIndex: 9999, minWidth: 168,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: tooltip.brand.color, flexShrink: 0 }} />
            <div style={{ fontWeight: 700, color: tooltip.brand.color, fontSize: 13 }}>{tooltip.brand.name}</div>
          </div>
          <div style={{ color: T.textSub, marginBottom: 2 }}>
            Tổng tin: <b style={{ color: T.textPrimary }}>{fmt(tooltip.brand.total)}</b>
          </div>
          <div style={{ color: T.textSub, marginBottom: 6 }}>
            NSR: <b style={{ color: tooltip.brand.nsr >= 0 ? T.positive : T.negative }}>
              {tooltip.brand.nsr > 0 ? "+" : ""}{tooltip.brand.nsr}%
            </b>
          </div>
          <div style={{ fontSize: 11, color: T.positive }}>↑ Tích cực: {fmt(tooltip.brand.Positive)}</div>
          <div style={{ fontSize: 11, color: T.negative }}>↓ Tiêu cực: {fmt(tooltip.brand.Negative)}</div>
          <div style={{ fontSize: 11, color: T.textLight }}>○ Trung lập: {fmt(tooltip.brand.Neutral)}</div>
        </div>
      )}
    </div>
  );
}
