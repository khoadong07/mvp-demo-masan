import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { T, fmt, nsr } from "../../constants/theme";
import { CT } from "../../components/common/CT";
import { SBadge } from "../../components/common/SBadge";

const COLS = "1.5fr 1fr 1fr 1fr 1fr 1fr 1fr";

const WINNING_SCORE_KEYWORDS = [
  { keyword: "Omachi", total: 1842, positive: 1320, negative: 95 },
  { keyword: "Kokomi", total: 1205, positive: 740, negative: 180 },
  { keyword: "WinMart / WinCommerce", total: 2210, positive: 980, negative: 540 },
  { keyword: "Chin-su", total: 980, positive: 410, negative: 295 },
  { keyword: "Ban lãnh đạo Masan", total: 1023, positive: 340, negative: 83 },
  { keyword: "MeatLife", total: 760, positive: 290, negative: 310 },
  { keyword: "Masan High-Tech Materials", total: 540, positive: 180, negative: 165 },
];

const CONTENT_LINE_IMPACT = [
  { name: "Tin doanh thu & KQKD", impact: 78, nsrVal: 32 },
  { name: "Tin sản phẩm mới", impact: 65, nsrVal: 45 },
  { name: "Tin CSR / Cộng đồng", impact: 52, nsrVal: 58 },
  { name: "Tin nhân sự / lãnh đạo", impact: 47, nsrVal: -8 },
  { name: "Tin khủng hoảng / PR", impact: 41, nsrVal: -52 },
];

const TOTAL_ALL = WINNING_SCORE_KEYWORDS.reduce((s, k) => s + k.total, 0);

function classify(score) {
  if (score >= 60) return "Positive";
  if (score >= 40) return "Neutral";
  return "Negative";
}

export function BODWinningScore() {
  const rows = WINNING_SCORE_KEYWORDS.map(k => {
    const nsrVal = parseFloat(nsr(k.positive, k.negative, k.total));
    const winningScore = Math.max(0, Math.min(100, Math.round((k.total / TOTAL_ALL) * 50 + nsrVal * 0.5)));
    return { ...k, nsrVal, winningScore };
  }).sort((a, b) => b.winningScore - a.winningScore);

  return (
    <div>
      <div style={{ background: T.bg, borderRadius: 10, padding: "14px 18px", marginBottom: 22, fontSize: 13, color: T.textSub, lineHeight: 1.6 }}>
        <b style={{ color: T.navyDark }}>Winning Score</b> đo mức độ "thắng thế" của một từ khóa hoặc tuyến bài trong tổng thể truyền thông, kết hợp độ phủ (tổng tin), sắc thái cảm xúc (NSR) và mức độ ảnh hưởng đến điểm số chung.
        <br />
        Công thức đề xuất: <b>Winning Score = (Tổng tin / Tổng tin toàn nhãn) × 50 + NSR × 0.5</b>, thang điểm 0–100.
      </div>

      <div style={{ fontSize: 15, fontWeight: 800, color: T.navyDark, marginBottom: 14 }}>Winning Score theo từ khóa</div>
      <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, fontSize: 12, color: T.textSub, paddingBottom: 10, borderBottom: "1px solid " + T.border }}>
        <div>Từ khóa</div>
        <div>Tổng tin</div>
        <div>Tích cực</div>
        <div>Tiêu cực</div>
        <div>NSR</div>
        <div>Winning Score</div>
        <div>Xếp loại</div>
      </div>
      {rows.map((r, i) => {
        const top = i === 0;
        const color = top ? T.textPrimary : T.textLight;
        const nsrColor = r.nsrVal >= 0 ? T.positive : T.negative;
        return (
          <div key={r.keyword} style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, alignItems: "center", padding: "12px 0", borderBottom: "1px solid " + T.border }}>
            <div style={{ fontSize: 13, fontWeight: top ? 800 : 600, color }}>{r.keyword}</div>
            <div style={{ fontSize: 13, color }}>{fmt(r.total)}</div>
            <div style={{ fontSize: 13, color: T.positive }}>{fmt(r.positive)}</div>
            <div style={{ fontSize: 13, color: T.negative }}>{fmt(r.negative)}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: nsrColor }}>{r.nsrVal}%</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.navyDark }}>{r.winningScore}</div>
            <div><SBadge s={classify(r.winningScore)} /></div>
          </div>
        );
      })}

      <div style={{ fontSize: 15, fontWeight: 800, color: T.navyDark, marginBottom: 14, marginTop: 22 }}>Tuyến bài ảnh hưởng lớn đến Total Score & NSR</div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={CONTENT_LINE_IMPACT} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAF0F8" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={{ stroke: T.border }} />
          <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 11, fill: T.textSub }} tickLine={false} axisLine={false} />
          <Tooltip content={<CT />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="impact" name="Mức ảnh hưởng tới Total Score" fill={T.navy} radius={[0, 4, 4, 0]} />
          <Bar dataKey="nsrVal" name="NSR (%)" radius={[0, 4, 4, 0]}>
            {CONTENT_LINE_IMPACT.map((e, i) => <Cell key={i} fill={e.nsrVal >= 0 ? T.positive : T.negative} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
