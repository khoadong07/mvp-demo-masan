import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { T, fmt } from "../../constants/theme";
import COMP from "../../data/comp.json";

export function SoVChart() {
  const [hiddenKeys, setHiddenKeys] = useState(new Set());
  const allData = COMP.comp_summary;
  const total = COMP.total_all;
  const data = allData.filter(d => !hiddenKeys.has(d.name));

  const toggleKey = (name) => {
    setHiddenKeys(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const RADIAN = Math.PI / 180;
  const renderLabel = ({ cx, cy, midAngle, outerRadius, name, percent, fill, index }) => {
    if (percent < 0.01) return null;
    const stagger = index % 2 === 0 ? 22 : 40;
    const lineEnd = outerRadius + stagger;
    const r = lineEnd + 14;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    const pctStr = (percent * 100).toFixed(2) + "%";
    const anchor = x > cx ? "start" : "end";
    return (
      <g>
        <line x1={cx + (outerRadius + 4) * Math.cos(-midAngle * RADIAN)} y1={cy + (outerRadius + 4) * Math.sin(-midAngle * RADIAN)}
          x2={cx + lineEnd * Math.cos(-midAngle * RADIAN)} y2={cy + lineEnd * Math.sin(-midAngle * RADIAN)}
          stroke={fill} strokeWidth="1.5" />
        <text x={x} y={y - 7} textAnchor={anchor} fontSize="10" fontWeight="700" fill={T.textPrimary}>{name}</text>
        <text x={x} y={y + 6} textAnchor={anchor} fontSize="10" fontWeight="700" fill={fill}>{pctStr}</text>
      </g>
    );
  };

  return (
    <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "center", minWidth: 0 }}>
      <div style={{ position: "relative", flex: "1 1 320px", minWidth: 0, maxWidth: 420 }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart margin={{ top: 30, right: 46, bottom: 30, left: 46 }}>
            <Pie data={data} dataKey="total" nameKey="name" cx="50%" cy="50%"
              innerRadius={64} outerRadius={100} labelLine={false} label={renderLabel}>
              {data.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip formatter={(v, n) => [fmt(v) + " bài", n]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid " + T.border }} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: T.navyDark }}>{fmt(total)}</div>
          <div style={{ fontSize: 10, color: T.textSub }}>tổng thảo luận</div>
        </div>
      </div>
      <div style={{ flex: "0 1 160px", minWidth: 140, display: "flex", flexDirection: "column", gap: 14 }}>
        {allData.map((d, i) => {
          const isHidden = hiddenKeys.has(d.name);
          return (
            <div key={i} onClick={() => toggleKey(d.name)}
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", opacity: isHidden ? 0.35 : 1 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: isHidden ? "transparent" : d.color, border: "2px solid " + d.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: T.textPrimary, fontWeight: 500, textDecoration: isHidden ? "line-through" : "none" }}>{d.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
