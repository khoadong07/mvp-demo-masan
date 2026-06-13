import { useState } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { T } from "../../constants/theme";
import { CT } from "../../components/common/CT";

// ─── Topic-level data: links Phân tầng Topics (Tier) → Winning Score → OCEAN Influence Score ───
// winScore: from keyword/topic performance analysis (same values as Phân tầng Topics tab)
// inf:      OCEAN composite for the dominant sources covering this topic (0–100)
const TOPIC_MATRIX = [
  { g: "Cổ phiếu, chứng khoán",     tier: 1, win: 80, inf: 88, total: 2800, nsr:  45, lbl: "Cổ phiếu" },
  { g: "Thương hiệu & Quảng cáo",   tier: 3, win: 87, inf: 73, total: 3200, nsr:  60, lbl: "Thương hiệu" },
  { g: "Doanh thu & Lợi nhuận",     tier: 1, win: 72, inf: 78, total: 1920, nsr:  44, lbl: "Doanh thu" },
  { g: "Ban lãnh đạo",              tier: 1, win: 42, inf: 72, total: 1023, nsr:  25, lbl: "Ban lãnh đạo" },
  { g: "Giá cả & Khuyến mãi",       tier: 3, win: 68, inf: 45, total: 1450, nsr:  30, lbl: "Giá cả & KM" },
  { g: "Chất lượng Sản phẩm",       tier: 2, win: 38, inf: 55, total: 1200, nsr:  12, lbl: "Chất lượng" },
  { g: "Hỗ trợ & Dịch vụ K.Hàng",  tier: 2, win: 28, inf: 38, total: 860,  nsr:  -8, lbl: "Hỗ trợ DVKH" },
  { g: "Tuyển dụng & Nhân sự",      tier: 2, win: 18, inf: 25, total: 540,  nsr:  -1, lbl: "Tuyển dụng" },
];

const TIER_COLOR = { 1: "#E74C3C", 2: "#5D6D7E", 3: "#27AE60" };

// ─── 4-Quadrant Bubble Chart ───
function TopicBubbleChart({ data }) {
  const W = 600, H = 310;
  const PAD = { l: 52, r: 18, t: 34, b: 54 };
  const cW = W - PAD.l - PAD.r;   // 530
  const cH = H - PAD.t - PAD.b;   // 222
  const sx = x => PAD.l + (x / 100) * cW;
  const sy = y => PAD.t + (1 - y / 100) * cH;
  const maxTotal = Math.max(...data.map(d => d.total));
  const br = d => Math.max(9, Math.min(22, Math.sqrt(d.total / maxTotal) * 22));
  const TX = sx(60), TY = sy(60);

  const QUADS = [
    { x: TX, y: PAD.t, w: W - PAD.r - TX,  h: TY - PAD.t,      fill: "#E8F8EE", lbl: "Thắng kép — Đang dẫn dắt",         lx: W - PAD.r - 6, ly: PAD.t + 13,   ta: "end",   c: "#27AE60" },
    { x: PAD.l, y: PAD.t, w: TX - PAD.l,   h: TY - PAD.t,      fill: "#FEF9E7", lbl: "Ảnh hưởng cao, cần tăng Winning",   lx: TX - 6,        ly: PAD.t + 13,   ta: "end",   c: "#E67E22" },
    { x: TX, y: TY, w: W - PAD.r - TX,     h: H - PAD.b - TY,  fill: "#EBF5FB", lbl: "Thắng mạnh, chưa lan rộng",         lx: W - PAD.r - 6, ly: H - PAD.b - 8, ta: "end",   c: "#2980B9" },
    { x: PAD.l, y: TY, w: TX - PAD.l,      h: H - PAD.b - TY,  fill: "#FDECEA", lbl: "Cần cải thiện / Rủi ro",            lx: PAD.l + 6,     ly: H - PAD.b - 8, ta: "start", c: "#E74C3C" },
  ];

  const xTicks = [0, 25, 50, 75, 100];
  const yTicks = [0, 25, 50, 75, 100];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      {/* Quadrant backgrounds + labels */}
      {QUADS.map((q, i) => (
        <g key={i}>
          <rect x={q.x} y={q.y} width={q.w} height={q.h} fill={q.fill} />
          <text x={q.lx} y={q.ly} textAnchor={q.ta} fontSize="9" fontWeight="700" fill={q.c}>{q.lbl}</text>
        </g>
      ))}

      {/* Threshold lines */}
      <line x1={TX} y1={PAD.t} x2={TX} y2={H - PAD.b} stroke="#C8D6E5" strokeWidth="1.5" strokeDasharray="5 3" />
      <line x1={PAD.l} y1={TY} x2={W - PAD.r} y2={TY} stroke="#C8D6E5" strokeWidth="1.5" strokeDasharray="5 3" />
      <text x={TX + 4} y={PAD.t + 11} fontSize="8" fill="#AAB7C4">WS=60</text>
      <text x={PAD.l + 4} y={TY - 4} fontSize="8" fill="#AAB7C4">IS=60</text>

      {/* Axes */}
      <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="#D5E3F0" strokeWidth="1" />
      <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="#D5E3F0" strokeWidth="1" />

      {/* X-axis */}
      {xTicks.map(x => (
        <text key={x} x={sx(x)} y={H - PAD.b + 14} textAnchor="middle" fontSize="9" fill="#9AAABF">{x}</text>
      ))}
      <text x={PAD.l + cW / 2} y={H - 5} textAnchor="middle" fontSize="10" fill="#9AAABF" fontWeight="600">Winning Score →</text>

      {/* Y-axis */}
      {yTicks.map(y => (
        <text key={y} x={PAD.l - 6} y={sy(y) + 4} textAnchor="end" fontSize="9" fill="#9AAABF">{y}</text>
      ))}
      <text x={13} y={PAD.t + cH / 2} textAnchor="middle" fontSize="10" fill="#9AAABF" fontWeight="600"
        transform={`rotate(-90,13,${PAD.t + cH / 2})`}>OCEAN Influence Score →</text>

      {/* Bubbles — largest rendered first so smaller ones sit on top */}
      {[...data].sort((a, b) => b.total - a.total).map(d => {
        const cx = sx(d.win), cy = sy(d.inf), r = br(d);
        const color = TIER_COLOR[d.tier];
        const above = d.inf > 58;
        const ly = above ? cy - r - 6 : cy + r + 13;
        const lta = d.win > 72 ? "end" : d.win < 35 ? "start" : "middle";
        return (
          <g key={d.g}>
            <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.72} stroke={color} strokeWidth="1.5" />
            <text x={cx} y={ly} textAnchor={lta} fontSize="9.5" fontWeight="700" fill={color}>{d.lbl}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Source-level OCEAN scores (existing) ───
const COLS_SRC = "2fr 1fr 1fr 1fr 1fr 1fr 1fr";
const DIMENSIONS = ["Độ phủ (Reach)", "Sentiment Affinity", "Engagement Depth", "Topic Relevance", "Network Influence"];
const KEYS = ["reach", "affinity", "engagement", "relevance", "network"];

const INFLUENCE_SCORES = [
  { name: "Tiếng Dân News",     reach: 88, affinity: 45, engagement: 72, relevance: 80, network: 68 },
  { name: "Báo Đầu Tư",         reach: 70, affinity: 78, engagement: 50, relevance: 88, network: 75 },
  { name: "KOL Tài chính A",    reach: 55, affinity: 60, engagement: 85, relevance: 65, network: 90 },
  { name: "Page Cộng đồng MSN", reach: 65, affinity: 82, engagement: 90, relevance: 60, network: 55 },
];

const RADAR_COLORS = [T.navy, T.positive, "#9B59B6", "#F1C40F"];

const RADAR_DATA = DIMENSIONS.map((dim, i) => {
  const row = { dimension: dim };
  INFLUENCE_SCORES.forEach(s => { row[s.name] = s[KEYS[i]]; });
  return row;
});

// ─── Combined topic table ───
const COLS_TOPIC = "1.8fr 1fr 1fr 1fr 1fr";
const TIER_TAG = { 1: { bg: "#FEE8E6", c: "#E74C3C" }, 2: { bg: "#EEF2F7", c: "#5D6D7E" }, 3: { bg: "#E8F8EE", c: "#27AE60" } };

export function BODCambridgeAnalytica() {
  const [hiddenKeys, setHiddenKeys] = useState(new Set());

  const toggleLegend = (payload) => {
    const key = payload.value;
    setHiddenKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const srcRows = INFLUENCE_SCORES.map(s => ({
    ...s,
    totalScore: Math.round((s.reach + s.affinity + s.engagement + s.relevance + s.network) / 5),
  })).sort((a, b) => b.totalScore - a.totalScore);

  const topicRows = [...TOPIC_MATRIX].sort((a, b) => b.win - a.win);

  return (
    <div>
      {/* Reference box */}
      <div style={{ background: T.bg, borderRadius: 10, padding: "14px 18px", marginBottom: 22, fontSize: 13, color: T.textSub, lineHeight: 1.6 }}>
        <b style={{ color: T.navyDark }}>Tham khảo: Mô hình chấm điểm Cambridge Analytica (OCEAN)</b><br />
        Cambridge Analytica xây dựng hồ sơ tâm lý người dùng dựa trên 5 chỉ số OCEAN — chấm điểm từ dữ liệu hành vi & tương tác mạng xã hội, kết hợp thành điểm tổng hợp để dự đoán mức độ ảnh hưởng. Masan áp dụng nguyên lý <b>chấm điểm đa chiều</b> cho từng topic & nguồn, trên cơ sở dữ liệu public social listening (không thu thập dữ liệu cá nhân).
      </div>

      {/* ── Section 1: Topic Correlation Map ── */}
      <div style={{ fontSize: 15, fontWeight: 800, color: T.navyDark, marginBottom: 6 }}>Bản đồ tương quan: Winning Score × OCEAN Influence Score</div>
      <div style={{ fontSize: 12.5, color: T.textSub, marginBottom: 14, lineHeight: 1.6 }}>
        8 nhóm topic từ <b style={{ color: T.textPrimary }}>Phân tầng Topics</b> được định vị theo Winning Score (trục X) và Influence Score tổng hợp từ mô hình OCEAN (trục Y). Kích thước bong bóng = tổng tin; màu sắc theo Tier (
        <span style={{ color: "#E74C3C", fontWeight: 700 }}>●</span> Tier 1 ·
        <span style={{ color: "#5D6D7E", fontWeight: 700 }}> ●</span> Tier 2 ·
        <span style={{ color: "#27AE60", fontWeight: 700 }}> ●</span> Tier 3).
      </div>
      <TopicBubbleChart data={TOPIC_MATRIX} />

      {/* ── Section 2: Topic × Score table ── */}
      <div style={{ fontSize: 15, fontWeight: 800, color: T.navyDark, marginTop: 22, marginBottom: 14 }}>Bảng tổng hợp: Topic × Tier × Winning Score × Influence</div>
      <div style={{ display: "grid", gridTemplateColumns: COLS_TOPIC, gap: 12, fontSize: 12, color: T.textSub, paddingBottom: 10, borderBottom: "1px solid " + T.border }}>
        <div>Nhóm Topic</div><div>Tier</div><div>Winning Score</div><div>OCEAN Influence</div><div>NSR tổng thể</div>
      </div>
      {topicRows.map((r, i) => {
        const top = i === 0;
        const color = top ? T.textPrimary : T.textLight;
        const tag = TIER_TAG[r.tier];
        const tc = TIER_COLOR[r.tier];
        const nsrPos = r.nsr >= 0;
        return (
          <div key={r.g} style={{ display: "grid", gridTemplateColumns: COLS_TOPIC, gap: 12, alignItems: "center", padding: "11px 0", borderBottom: "1px solid " + T.border }}>
            <div style={{ fontSize: 13, fontWeight: top ? 800 : 600, color }}>{r.g}</div>
            <div><span style={{ background: tag.bg, color: tag.c, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>Tier {r.tier}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 48, height: 5, background: "#EAF0F8", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: r.win + "%", height: "100%", background: tc }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: tc }}>{r.win}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 48, height: 5, background: "#EAF0F8", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: r.inf + "%", height: "100%", background: T.navy }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>{r.inf}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: nsrPos ? T.positive : T.negative }}>
              {nsrPos ? "↑ +" : "↓ "}{r.nsr}%
            </span>
          </div>
        );
      })}

      {/* ── Section 3: Source OCEAN Profile (existing RadarChart) ── */}
      <div style={{ fontSize: 15, fontWeight: 800, color: T.navyDark, marginTop: 28, marginBottom: 6 }}>Masan Audience/Influence Score — Hồ sơ nguồn (OCEAN)</div>
      <div style={{ fontSize: 12.5, color: T.textSub, marginBottom: 18, lineHeight: 1.6 }}>Điểm OCEAN tổng hợp theo từng nguồn/KOL đang tác động đến chủ đề <b style={{ color: T.textPrimary }}>Ban lãnh đạo</b>. Influence Score trong bản đồ ở trên được tính trung bình từ các nguồn này.</div>

      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={RADAR_DATA} outerRadius={110}>
          <PolarGrid stroke="#EAF0F8" />
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: T.textSub }} />
          <PolarRadiusAxis tick={{ fontSize: 9, fill: T.textLight }} domain={[0, 100]} />
          {INFLUENCE_SCORES.map((s, i) => (
            <Radar key={s.name} name={s.name} dataKey={s.name} stroke={RADAR_COLORS[i]} fill={RADAR_COLORS[i]}
              fillOpacity={0.15} hide={hiddenKeys.has(s.name)} />
          ))}
          <Legend wrapperStyle={{ fontSize: 11, cursor: "pointer" }} onClick={toggleLegend} />
          <Tooltip content={<CT />} />
        </RadarChart>
      </ResponsiveContainer>

      <div style={{ fontSize: 15, fontWeight: 800, color: T.navyDark, marginBottom: 14, marginTop: 20 }}>Bảng xếp hạng nguồn theo Audience/Influence Score</div>
      <div style={{ display: "grid", gridTemplateColumns: COLS_SRC, gap: 12, fontSize: 12, color: T.textSub, paddingBottom: 10, borderBottom: "1px solid " + T.border }}>
        <div>Nguồn</div><div>Reach</div><div>Affinity</div><div>Engagement</div><div>Relevance</div><div>Network</div><div>Tổng điểm</div>
      </div>
      {srcRows.map((r, i) => {
        const top = i === 0;
        const color = top ? T.textPrimary : T.textLight;
        return (
          <div key={r.name} style={{ display: "grid", gridTemplateColumns: COLS_SRC, gap: 12, alignItems: "center", padding: "12px 0", borderBottom: "1px solid " + T.border }}>
            <div style={{ fontSize: 13, fontWeight: top ? 800 : 600, color }}>{r.name}</div>
            <div style={{ fontSize: 13, color }}>{r.reach}</div>
            <div style={{ fontSize: 13, color }}>{r.affinity}</div>
            <div style={{ fontSize: 13, color }}>{r.engagement}</div>
            <div style={{ fontSize: 13, color }}>{r.relevance}</div>
            <div style={{ fontSize: 13, color }}>{r.network}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.navyDark }}>{r.totalScore}</div>
          </div>
        );
      })}
    </div>
  );
}
