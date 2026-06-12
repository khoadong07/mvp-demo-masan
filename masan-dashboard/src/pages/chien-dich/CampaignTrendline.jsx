import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { T } from "../../constants/theme";
import { CT } from "../../components/common/CT";

const COLORS = { mxh: T.navyDark, baichi: "#E8923C", khac: T.negative };

function StatBox({ value, label, color }) {
  return (
    <div style={{ flex: 1, textAlign: "center", minWidth: 0 }}>
      <div style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1.2 }}>{value.toLocaleString()}</div>
      <div style={{ fontSize: 12, color: T.textSub, marginTop: 4 }}>{label}</div>
    </div>
  );
}

export function CampaignTrendline({ stats, data }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", marginBottom: 12 }}>
        <StatBox value={stats.mxh} label="Bài đăng trên MXH" color={COLORS.mxh} />
        <StatBox value={stats.baichi} label={'"Báo chí, tin tức"'} color={COLORS.baichi} />
        <StatBox value={stats.khac} label={'"Nguồn khác" (Diễn đàn & Social site)'} color={COLORS.khac} />
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAF0F8" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={{ stroke: T.border }} />
          <YAxis domain={[0, 1000]} tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={false} />
          <Tooltip content={<CT />} />
          <Line type="monotone" dataKey="mxh" name="Bài đăng trên MXH" stroke={COLORS.mxh} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="baichi" name="Báo chí, tin tức" stroke={COLORS.baichi} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="khac" name="Nguồn khác" stroke={COLORS.khac} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
