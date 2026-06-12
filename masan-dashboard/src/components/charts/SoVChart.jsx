import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { T, fmt } from "../../constants/theme";
import COMP from "../../data/comp.json";

export function SoVChart() {
  const data = COMP.comp_summary;
  const total = COMP.total_all;
  const RADIAN = Math.PI / 180;
  const renderLabel = ({ cx, cy, midAngle, outerRadius, name, percent, fill }) => {
    if (percent < 0.01) return null;
    const r = outerRadius + 30;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    const pctStr = (percent * 100).toFixed(2) + "%";
    const anchor = x > cx ? "start" : "end";
    return (
      <g>
        <line x1={cx + (outerRadius + 4) * Math.cos(-midAngle * RADIAN)} y1={cy + (outerRadius + 4) * Math.sin(-midAngle * RADIAN)}
          x2={cx + (outerRadius + 18) * Math.cos(-midAngle * RADIAN)} y2={cy + (outerRadius + 18) * Math.sin(-midAngle * RADIAN)}
          stroke={fill} strokeWidth="1.5" />
        <text x={x} y={y - 7} textAnchor={anchor} fontSize="10" fontWeight="700" fill={T.textPrimary}>{name}</text>
        <text x={x} y={y + 6} textAnchor={anchor} fontSize="10" fontWeight="700" fill={fill}>{pctStr}</text>
      </g>
    );
  };
  const CenterLabel = ({ viewBox }) => {
    const { cx, cy } = viewBox || { cx: 0, cy: 0 };
    return (
      <g>
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="24" fontWeight="900" fill={T.navyDark}>{fmt(total)}</text>
        <text x={cx} y={cy + 13} textAnchor="middle" fontSize="10" fill={T.textSub}>tổng thảo luận</text>
      </g>
    );
  };
  return (
    <div style={{ flex: 1, display: "flex", gap: 24, alignItems: "center", justifyContent: "center" }}>
      <div style={{ flex: "0 0 auto" }}>
        <ResponsiveContainer width={480} height={360}>
          <PieChart margin={{ top: 40, right: 80, bottom: 40, left: 80 }}>
            <Pie data={data} dataKey="total" nameKey="name" cx="50%" cy="50%"
              innerRadius={80} outerRadius={130} labelLine={false} label={renderLabel}>
              {data.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Pie data={[{ v: 1 }]} dataKey="v" cx="50%" cy="50%" innerRadius={0} outerRadius={0}
              label={<CenterLabel />} labelLine={false} fill="transparent" />
            <Tooltip formatter={(v, n) => [fmt(v) + " bài", n]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid " + T.border }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: T.textPrimary, fontWeight: 500 }}>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
