import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { T, fmt, pct } from "../../constants/theme";
import RAW from "../../data/raw.json";

function PieLegend({ items, hidden, onToggle }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", justifyContent: "center", marginTop: 6 }}>
      {items.map(item => {
        const isHidden = hidden.has(item.n);
        return (
          <div key={item.n} onClick={() => onToggle(item.n)}
            style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", opacity: isHidden ? 0.35 : 1, fontSize: 11 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: isHidden ? "transparent" : item.c, border: "2px solid " + item.c, flexShrink: 0 }} />
            <span style={{ color: T.textPrimary, textDecoration: isHidden ? "line-through" : "none" }}>{item.n}</span>
          </div>
        );
      })}
    </div>
  );
}

export function IRTongQuan() {
  const [hiddenKeys, setHiddenKeys] = useState(new Set());
  const ir = RAW.ir;
  const allData = [
    { n: "Tích cực", v: ir.sentiment.Positive || 0, c: T.positive },
    { n: "Trung lập", v: ir.sentiment.Neutral || 0, c: T.neutral },
    { n: "Tiêu cực", v: ir.sentiment.Negative || 0, c: T.negative },
  ];
  const d = allData.filter(e => !hiddenKeys.has(e.n));

  const toggleKey = (name) => {
    setHiddenKeys(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={d} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={85}
              label={({ percent }) => Math.round(percent * 100) + "%"}>
              {d.map((e, i) => <Cell key={i} fill={e.c} />)}
            </Pie>
            <Tooltip formatter={(v, n) => [fmt(v), n]} />
          </PieChart>
        </ResponsiveContainer>
        <PieLegend items={allData} hidden={hiddenKeys} onToggle={toggleKey} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
        {allData.map((x, i) => (
          <div key={i} style={{ background: "#F7FAFD", borderLeft: "4px solid " + x.c, borderRadius: 6, padding: "10px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: x.c }}>{x.n}</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: x.c }}>{fmt(x.v)}</span>
            </div>
            <div style={{ fontSize: 11, color: T.textSub, marginTop: 2 }}>{pct(x.v, ir.total)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
