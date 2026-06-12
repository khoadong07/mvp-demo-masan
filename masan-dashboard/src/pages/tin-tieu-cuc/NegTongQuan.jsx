import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { T, fmt, pct, CH_COLOR } from "../../constants/theme";
import RAW from "../../data/raw.json";

export function NegTongQuan() {
  const n = RAW.negative;
  const chData = Object.entries(n.by_channel || {}).map(([k, v]) => ({ name: k, count: v })).sort((a, b) => b.count - a.count);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <div>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart><Pie data={chData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => percent > .03 ? name + " " + Math.round(percent * 100) + "%" : ""} labelLine={false}>
            {chData.map((e, i) => <Cell key={i} fill={CH_COLOR[e.name] || "#95A5A6"} />)}
          </Pie><Tooltip formatter={(v, n) => [fmt(v), n]} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} /></PieChart>
        </ResponsiveContainer>
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
