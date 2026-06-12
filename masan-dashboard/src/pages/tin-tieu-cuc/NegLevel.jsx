import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { T, fmt, pct } from "../../constants/theme";
import { CT } from "../../components/common/CT";
import RAW from "../../data/raw.json";

export function NegLevel() {
  const n = RAW.negative;
  const d = [{ name: "Level 3", v: n.by_level["3"] || 0, c: "#C0392B" }, { name: "Level 2", v: n.by_level["2"] || 0, c: T.negative }, { name: "Level 1", v: n.by_level["1"] || 0, c: "#E67E22" }, { name: "N/A", v: n.by_level["None"] || 0, c: T.neutral }];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={d}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAF0F8" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: T.textPrimary }} tickLine={false} axisLine={{ stroke: T.border }} />
          <YAxis tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={false} tickFormatter={fmt} />
          <Tooltip content={<CT />} />
          <Bar dataKey="v" name="Số bài" radius={[4, 4, 0, 0]}>{d.map((e, i) => <Cell key={i} fill={e.c} />)}</Bar>
        </BarChart>
      </ResponsiveContainer>
      <div>{d.map((x, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: "1px solid " + T.border }}><div style={{ width: 10, height: 10, borderRadius: 2, background: x.c, flexShrink: 0 }} /><span style={{ flex: 1, fontSize: 12 }}>{x.name}</span><span style={{ fontSize: 18, fontWeight: 700, color: x.c }}>{fmt(x.v)}</span><span style={{ fontSize: 11, color: T.textSub }}>{pct(x.v, RAW.negative.total)}</span></div>))}</div>
    </div>
  );
}
