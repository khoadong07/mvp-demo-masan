import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { T } from "../../constants/theme";
import { CT } from "../../components/common/CT";
import RAW from "../../data/raw.json";

export function BODDienBien() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={RAW.bod.neg_trend}><defs><linearGradient id="gBOD" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.negative} stopOpacity={.3} /><stop offset="95%" stopColor={T.negative} stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#EAF0F8" vertical={false} /><XAxis dataKey="date" tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={{ stroke: T.border }} /><YAxis tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={false} /><Tooltip content={<CT />} /><Area type="monotone" dataKey="count" name="Tiêu cực BOD" stroke={T.negative} fill="url(#gBOD)" strokeWidth={2} /></AreaChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={RAW.bod.trend}><CartesianGrid strokeDasharray="3 3" stroke="#EAF0F8" vertical={false} /><XAxis dataKey="date" tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={{ stroke: T.border }} /><YAxis tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={false} /><Tooltip content={<CT />} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} /><Area type="monotone" dataKey="Positive" name="Tích cực" stroke={T.positive} fill={T.positive + "22"} strokeWidth={1.5} /><Area type="monotone" dataKey="Negative" name="Tiêu cực" stroke={T.negative} fill={T.negative + "22"} strokeWidth={1.5} /></AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
