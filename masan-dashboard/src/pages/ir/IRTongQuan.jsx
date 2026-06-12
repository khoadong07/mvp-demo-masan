import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { T, fmt, pct } from "../../constants/theme";
import RAW from "../../data/raw.json";

export function IRTongQuan() {
  const ir = RAW.ir;
  const d = [{ n: "Tích cực", v: ir.sentiment.Positive || 0, c: T.positive }, { n: "Trung lập", v: ir.sentiment.Neutral || 0, c: T.neutral }, { n: "Tiêu cực", v: ir.sentiment.Negative || 0, c: T.negative }];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={d} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={85} label={({ n, percent }) => Math.round(percent * 100) + "%"}>{d.map((e, i) => <Cell key={i} fill={e.c} />)}</Pie><Tooltip formatter={(v, n) => [fmt(v), n]} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} /></PieChart></ResponsiveContainer>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>{d.map((x, i) => (<div key={i} style={{ background: "#F7FAFD", borderLeft: "4px solid " + x.c, borderRadius: 6, padding: "10px 14px" }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 12, fontWeight: 600, color: x.c }}>{x.n}</span><span style={{ fontSize: 18, fontWeight: 800, color: x.c }}>{fmt(x.v)}</span></div><div style={{ fontSize: 11, color: T.textSub, marginTop: 2 }}>{pct(x.v, ir.total)}</div></div>))}</div>
    </div>
  );
}
