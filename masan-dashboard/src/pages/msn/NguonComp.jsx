import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { T, fmt } from "../../constants/theme";
import { CT } from "../../components/common/CT";
import RAW from "../../data/raw.json";

export function NguonComp() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={RAW.top_sites.slice(0, 10)} layout="vertical" margin={{ left: 130, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAF0F8" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={{ stroke: T.border }} tickFormatter={fmt} />
          <YAxis type="category" dataKey="site" tick={{ fontSize: 11, fill: T.textPrimary }} width={125} tickLine={false} axisLine={false} />
          <Tooltip content={<CT />} />
          <Bar dataKey="count" name="Bài đăng" fill={T.navy} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ maxHeight: 340, overflow: "auto" }}>
        {RAW.top_sites.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderBottom: "1px solid " + T.border, background: i % 2 === 0 ? T.white : "#F7FAFD" }}>
            <span style={{ fontSize: 11, color: T.navy, fontWeight: 700, width: 18, textAlign: "center" }}>{i + 1}</span>
            <span style={{ flex: 1, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.site}</span>
            <span style={{ fontSize: 12, fontWeight: 700 }}>{fmt(s.count)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
