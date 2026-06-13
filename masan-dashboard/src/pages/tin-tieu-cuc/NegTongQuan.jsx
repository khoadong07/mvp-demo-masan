import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { T, fmt, pct, CH_COLOR } from "../../constants/theme";
import RAW from "../../data/raw.json";

function PieLegend({ items, hidden, onToggle }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", justifyContent: "center", marginTop: 6 }}>
      {items.map(item => {
        const isHidden = hidden.has(item.name);
        return (
          <div key={item.name} onClick={() => onToggle(item.name)}
            style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", opacity: isHidden ? 0.35 : 1, fontSize: 11 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: isHidden ? "transparent" : item.color, border: "2px solid " + item.color, flexShrink: 0 }} />
            <span style={{ color: T.textPrimary, textDecoration: isHidden ? "line-through" : "none" }}>{item.name}</span>
          </div>
        );
      })}
    </div>
  );
}

export function NegTongQuan() {
  const [hiddenKeys, setHiddenKeys] = useState(new Set());
  const n = RAW.negative;
  const allData = Object.entries(n.by_channel || {}).map(([k, v]) => ({ name: k, count: v, color: CH_COLOR[k] || "#95A5A6" })).sort((a, b) => b.count - a.count);
  const chData = allData.filter(e => !hiddenKeys.has(e.name));

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
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={chData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90}
              label={({ name, percent }) => percent > .03 ? name + " " + Math.round(percent * 100) + "%" : ""} labelLine={false}>
              {chData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip formatter={(v, n) => [fmt(v), n]} />
          </PieChart>
        </ResponsiveContainer>
        <PieLegend items={allData} hidden={hiddenKeys} onToggle={toggleKey} />
      </div>
      <div>
        {[{ lv: "3", l: "Level 3 — Nguy hiểm", c: "#C0392B" }, { lv: "2", l: "Level 2 — Trung bình", c: T.negative }, { lv: "1", l: "Level 1 — Thấp", c: "#E67E22" }].map(({ lv, l, c }) => {
          const val = n.by_level[lv] || 0;
          return (
            <div key={lv} style={{ background: "#FEF9F9", borderLeft: "4px solid " + c, borderRadius: 6, padding: "10px 14px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: c }}>{l}</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: c }}>{fmt(val)}</span>
              </div>
              <div style={{ fontSize: 11, color: T.textSub, marginTop: 2 }}>{pct(val, n.total)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
