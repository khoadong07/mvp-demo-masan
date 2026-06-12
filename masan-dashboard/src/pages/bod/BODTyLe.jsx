import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { T, fmt } from "../../constants/theme";
import { RangeToggle, BODHeaderNav } from "./BODRangeNav";
import { BODFeaturedNews } from "./BODFeaturedNews";
import { SENTIMENT_24H, SENTIMENT_7D, BOD_ARTICLES } from "./bodData";

const RADIAN = Math.PI / 180;

const renderLabel = ({ cx, cy, midAngle, outerRadius, name, index }) => {
  const stagger = [20, 36, 24][index] ?? 20;
  const lineEnd = outerRadius + stagger;
  const r = lineEnd + 14;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  const anchor = x > cx ? "start" : "end";
  return (
    <g>
      <line x1={cx + (outerRadius + 2) * Math.cos(-midAngle * RADIAN)} y1={cy + (outerRadius + 2) * Math.sin(-midAngle * RADIAN)}
        x2={cx + lineEnd * Math.cos(-midAngle * RADIAN)} y2={cy + lineEnd * Math.sin(-midAngle * RADIAN)}
        stroke={T.textLight} strokeWidth="1" />
      <text x={x} y={y} textAnchor={anchor} dominantBaseline="middle" fontSize="13" fontWeight="700" fill={T.textPrimary}>{name}</text>
    </g>
  );
};

export function BODTyLe({ setTab }) {
  const [range, setRange] = useState("24h");
  const s = range === "24h" ? SENTIMENT_24H : SENTIMENT_7D;
  const data = [
    { name: "Tiêu cực", value: s.Negative, color: T.negative },
    { name: "Tích cực", value: s.Positive, color: T.positive },
    { name: "Trung lập", value: s.Neutral, color: T.neutral },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div>
        <RangeToggle range={range} setRange={setRange} />
        <BODHeaderNav active="ty-le" setTab={setTab} />
        <div style={{ position: "relative" }}>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart margin={{ top: 24, right: 80, bottom: 24, left: 80 }}>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
                startAngle={90} endAngle={-270} isAnimationActive={false}
                innerRadius={62} outerRadius={96} labelLine={false} label={renderLabel}>
                {data.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [fmt(v), n]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid " + T.border }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: T.navyDark }}>{fmt(s.total)}</div>
            <div style={{ fontSize: 12, color: T.textSub }}>Buzz</div>
          </div>
        </div>
      </div>
      <BODFeaturedNews articles={BOD_ARTICLES} />
    </div>
  );
}
