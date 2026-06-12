import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { T } from "../../constants/theme";
import { RangeToggle, BODHeaderNav } from "./BODRangeNav";
import { BODFeaturedNews } from "./BODFeaturedNews";
import { SENTIMENT_24H, SENTIMENT_7D, BOD_ARTICLES } from "./bodData";

const RING_COLORS = {
  "Threads": "#BDC3C7",
  "E-commerce": "#F1C40F",
  "Youtube": "#E74C3C",
  "Social": "#9B59B6",
  "Facebook": "#2D6CDF",
  "Forums": "#F5A28A",
  "Tiktok": "#111111",
};

const CHANNEL_RATIO = [
  { name: "Threads", value: 9.7 },
  { name: "E-commerce", value: 6.6 },
  { name: "Youtube", value: 6.6 },
  { name: "Social", value: 13.2 },
  { name: "Facebook", value: 62.0 },
  { name: "Forums", value: 1.6 },
  { name: "Tiktok", value: 0.4 },
];

const RADIAN = Math.PI / 180;

const renderLabel = ({ cx, cy, midAngle, outerRadius, name, value, index }) => {
  const stagger = index % 2 === 0 ? 24 : 48;
  const lineEnd = outerRadius + stagger;
  const r = lineEnd + 12;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  const anchor = x > cx ? "start" : "end";
  return (
    <g>
      <line x1={cx + (outerRadius + 2) * Math.cos(-midAngle * RADIAN)} y1={cy + (outerRadius + 2) * Math.sin(-midAngle * RADIAN)}
        x2={cx + lineEnd * Math.cos(-midAngle * RADIAN)} y2={cy + lineEnd * Math.sin(-midAngle * RADIAN)}
        stroke={T.textLight} strokeWidth="1" />
      <text x={x} y={y} textAnchor={anchor} dominantBaseline="middle" fontSize="11" fontWeight="600" fill={T.textPrimary}>
        {name}: {value.toFixed(1)}%
      </text>
    </g>
  );
};

export function BODChannelRatio({ setTab }) {
  const [range, setRange] = useState("24h");
  const total = range === "24h" ? SENTIMENT_24H.total : SENTIMENT_7D.total;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div>
        <RangeToggle range={range} setRange={setRange} />
        <BODHeaderNav active="ty-le-kenh" setTab={setTab} />
        <div style={{ position: "relative" }}>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart margin={{ top: 24, right: 90, bottom: 24, left: 90 }}>
              <Pie data={CHANNEL_RATIO} dataKey="value" nameKey="name" cx="50%" cy="50%"
                startAngle={90} endAngle={-270} isAnimationActive={false}
                innerRadius={62} outerRadius={96} labelLine={false} label={renderLabel}>
                {CHANNEL_RATIO.map((e, i) => <Cell key={i} fill={RING_COLORS[e.name]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v + "%", n]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid " + T.border }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: T.navyDark }}>{total}</div>
            <div style={{ fontSize: 12, color: T.textSub }}>Buzz</div>
          </div>
        </div>
      </div>
      <BODFeaturedNews articles={BOD_ARTICLES} />
    </div>
  );
}
