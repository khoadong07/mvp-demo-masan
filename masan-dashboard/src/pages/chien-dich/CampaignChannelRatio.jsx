import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { T } from "../../constants/theme";

const RING_COLORS = {
  "Forums": "#1A2B4A",
  "Facebook Pages": "#4A90D9",
  "Facebook Group": T.navyDark,
  "Facebook Users": "#F2785C",
  "News": "#E0483B",
  "Social Sites": "#F4A9A1",
  "Youtube": "#C0392B",
  "Tiktok": "#111111",
};

const ORDER = ["Forums", "Facebook Pages", "Facebook Group", "Facebook Users", "News", "Social Sites", "Youtube", "Tiktok"];

const RADIAN = Math.PI / 180;

export function CampaignChannelRatio({ channelRatio }) {
  const data = ORDER.map(name => ({ name, value: channelRatio.breakdown[name] }));

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

  return (
    <div style={{ position: "relative", marginBottom: 20 }}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart margin={{ top: 30, right: 90, bottom: 30, left: 90 }}>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
            startAngle={90} endAngle={-270}
            innerRadius={62} outerRadius={96} labelLine={false} label={renderLabel}>
            {data.map((e, i) => <Cell key={i} fill={RING_COLORS[e.name]} />)}
          </Pie>
          <Tooltip formatter={(v, n) => [v + "%", n]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid " + T.border }} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: T.navyDark }}>{channelRatio.total}</div>
        <div style={{ fontSize: 12, color: T.textSub }}>Buzz</div>
      </div>
    </div>
  );
}
