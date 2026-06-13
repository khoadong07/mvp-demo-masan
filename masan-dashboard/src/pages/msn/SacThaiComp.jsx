import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { T, fmt, pct, fmtM } from "../../constants/theme";
import { CT } from "../../components/common/CT";
import RAW from "../../data/raw.json";

export function SacThaiComp() {
  const [hiddenKeys, setHiddenKeys] = useState(new Set());
  const s = RAW.summary;
  const d = [{ n: "Tích cực", v: s.positive, c: T.positive }, { n: "Trung lập", v: s.neutral, c: T.neutral }, { n: "Tiêu cực", v: s.negative, c: T.negative }];

  const toggleLegend = (payload) => {
    const key = payload.dataKey;
    setHiddenKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={RAW.nsr_monthly}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAF0F8" vertical={false} />
          <XAxis dataKey="month" tickFormatter={fmtM} tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={{ stroke: T.border }} />
          <YAxis tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={false} tickFormatter={fmt} />
          <Tooltip content={<CT />} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, cursor: "pointer" }} onClick={toggleLegend} />
          <Bar dataKey="positive" name="Tích cực" stackId="a" fill={T.positive} hide={hiddenKeys.has("positive")} />
          <Bar dataKey="neutral" name="Trung lập" stackId="a" fill={T.neutral} hide={hiddenKeys.has("neutral")} />
          <Bar dataKey="negative" name="Tiêu cực" stackId="a" fill={T.negative} hide={hiddenKeys.has("negative")} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
        {d.map((x, i) => (
          <div key={i} style={{ background: "#F7FAFD", borderLeft: "4px solid " + x.c, borderRadius: 6, padding: "10px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: x.c }}>{x.n}</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: x.c }}>{fmt(x.v)}</span>
            </div>
            <div style={{ fontSize: 11, color: T.textSub, marginTop: 2 }}>{pct(x.v, s.total)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
