import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { T, fmt } from "../../constants/theme";
import { CT } from "../../components/common/CT";
import RAW from "../../data/raw.json";

export function NegChuDe() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={RAW.negative.topics} layout="vertical" margin={{ left: 200, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAF0F8" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={{ stroke: T.border }} tickFormatter={fmt} />
          <YAxis type="category" dataKey="topic" tick={{ fontSize: 11, fill: T.textPrimary }} width={195} tickLine={false} axisLine={false} />
          <Tooltip content={<CT />} />
          <Bar dataKey="count" name="Tin tiêu cực" fill={T.negative} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ maxHeight: 320, overflow: "auto" }}>{RAW.negative.topics.map((t, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderBottom: "1px solid " + T.border, background: i % 2 === 0 ? T.white : "#FEF9F9" }}><span style={{ width: 22, height: 22, borderRadius: 4, background: T.negative + "22", color: T.negative, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span><span style={{ flex: 1, fontSize: 12 }}>{t.topic}</span><span style={{ fontSize: 13, fontWeight: 700, color: T.negative }}>{fmt(t.count)}</span></div>))}</div>
    </div>
  );
}
