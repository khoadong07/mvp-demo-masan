import { useState } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { T, fmt, fmtM } from "../../constants/theme";
import { CT } from "../../components/common/CT";
import RAW from "../../data/raw.json";

export function MSNDienBien() {
  const [hiddenKeys, setHiddenKeys] = useState(new Set());

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
      <div>
        <div style={{ fontSize: 12, color: T.textSub, marginBottom: 8 }}>Xu hướng theo tuần</div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={RAW.trend_weekly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EAF0F8" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={{ stroke: T.border }} />
            <YAxis tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={false} tickFormatter={fmt} />
            <Tooltip content={<CT />} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, cursor: "pointer" }} onClick={toggleLegend} />
            <Bar dataKey="total" name="Tổng" fill={T.navy + "22"} radius={[2, 2, 0, 0]} hide={hiddenKeys.has("total")} />
            <Line type="monotone" dataKey="Positive" name="Tích cực" stroke={T.positive} strokeWidth={2} dot={false} hide={hiddenKeys.has("Positive")} />
            <Line type="monotone" dataKey="Negative" name="Tiêu cực" stroke={T.negative} strokeWidth={2} dot={false} hide={hiddenKeys.has("Negative")} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div>
        <div style={{ fontSize: 12, color: T.textSub, marginBottom: 10 }}>NSR theo tháng</div>
        {RAW.nsr_monthly.map((e, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", borderRadius: 8, background: i % 2 === 0 ? "#F7FAFD" : "transparent" }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: T.textPrimary }}>{fmtM(e.month)}</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: e.nsr >= 0 ? T.positive : T.negative }}>{e.nsr > 0 ? "+" : ""}{e.nsr}%</span>
            <span style={{ fontSize: 11, color: T.textSub }}>{fmt(e.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
