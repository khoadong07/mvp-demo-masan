import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { T } from "../../constants/theme";
import COMP from "../../data/comp.json";

const ALL_CH = ["Facebook", "Social", "Tiktok", "News", "Youtube", "Forum", "Threads", "E-commerce"];
const CH_COLORS_KENH = {
  "E-commerce": "#FDC094",
  "Facebook": "#9DB8D9",
  "Forum": "#1A3A6B",
  "News": "#2C3E6B",
  "Social": "#7B68EE",
  "Threads": "#E74C3C",
  "Tiktok": "#FF6B35",
  "Youtube": "#27AE60",
};

function PctLabel(props) {
  const { x, y, width, height, pct } = props;
  if (!pct || pct < 3) return null;
  return (
    <text x={x + width / 2} y={y + height / 2 + 4} textAnchor="middle"
      fill="white" fontSize={10} fontWeight="600">
      {pct.toFixed(2)}%
    </text>
  );
}

export function KenhMiniChart() {
  const [hiddenKeys, setHiddenKeys] = useState(new Set());

  const toggleLegend = (payload) => {
    const key = payload.dataKey;
    setHiddenKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const data = COMP.comp_summary.map(b => ({
    name: b.name,
    ...Object.fromEntries(ALL_CH.map(ch => [ch, b.ch_pct?.[ch] || 0])),
  }));
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAF0F8" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: T.textPrimary, fontWeight: 500 }} tickLine={false} axisLine={{ stroke: T.border }} />
          <YAxis tickFormatter={v => v + "%"} tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={false} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
          <Tooltip formatter={(v, n) => [v.toFixed(2) + "%", n]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid " + T.border }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, cursor: "pointer" }} onClick={toggleLegend} />
          {ALL_CH.map(ch => (
            <Bar key={ch} dataKey={ch} name={ch} stackId="a" fill={CH_COLORS_KENH[ch] || "#95A5A6"}
              label={p => <PctLabel {...p} pct={data[p.index]?.[ch]} />}
              hide={hiddenKeys.has(ch)} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
