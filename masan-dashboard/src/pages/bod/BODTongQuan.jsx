import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { T, fmt, CH_COLOR } from "../../constants/theme";
import { CT } from "../../components/common/CT";
import RAW from "../../data/raw.json";

const BOD_LIST = [
  { n: "Nguyễn Đăng Quang", t: "Chủ tịch HĐQT", ab: "NQ" },
  { n: "Danny Le", t: "Tổng Giám đốc", ab: "DL" },
  { n: "Michael Hung Nguyen", t: "Phó Chủ tịch", ab: "MH" },
  { n: "Trương Công Thắng", t: "CEO Masan Consumer", ab: "TT" },
  { n: "Nguyễn Thiều Quang", t: "CEO WinCommerce", ab: "TQ" },
];

export function BODTongQuan() {
  const b = RAW.bod;
  const chData = Object.entries(b.by_channel || {}).map(([k, v]) => ({ name: k, count: v })).sort((a, b) => b.count - a.count);
  return (
    <div>
      <div style={{ background: T.peach, borderRadius: 8, padding: "14px 18px", marginBottom: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#7A3A00", marginBottom: 8 }}>Ban lãnh đạo Masan Group</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {BOD_LIST.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.65)", borderRadius: 8, padding: "8px 12px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.navy, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{p.ab}</div>
              <div><div style={{ fontSize: 12, fontWeight: 700, color: T.navyDark }}>{p.n}</div><div style={{ fontSize: 10, color: T.textSub }}>{p.t}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart><Pie data={[{ n: "Tích cực", v: b.sentiment.Positive || 0 }, { n: "Trung lập", v: b.sentiment.Neutral || 0 }, { n: "Tiêu cực", v: b.sentiment.Negative || 0 }]} dataKey="v" nameKey="n" cx="50%" cy="50%" outerRadius={80} label={({ n, percent }) => Math.round(percent * 100) + "%"}><Cell fill={T.positive} /><Cell fill={T.neutral} /><Cell fill={T.negative} /></Pie><Tooltip formatter={(v, n) => [fmt(v), n]} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} /></PieChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chData}><CartesianGrid strokeDasharray="3 3" stroke="#EAF0F8" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={{ stroke: T.border }} /><YAxis tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={false} tickFormatter={fmt} /><Tooltip content={<CT />} /><Bar dataKey="count" name="Bài đăng" radius={[4, 4, 0, 0]}>{chData.map((e, i) => <Cell key={i} fill={CH_COLOR[e.name] || "#95A5A6"} />)}</Bar></BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
