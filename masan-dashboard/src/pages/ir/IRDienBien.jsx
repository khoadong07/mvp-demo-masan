import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { T, fmt } from "../../constants/theme";
import { CT } from "../../components/common/CT";
import RAW from "../../data/raw.json";

export function IRDienBien() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={RAW.ir.trend_weekly}><CartesianGrid strokeDasharray="3 3" stroke="#EAF0F8" vertical={false} /><XAxis dataKey="week" tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={{ stroke: T.border }} /><YAxis tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={false} tickFormatter={fmt} /><Tooltip content={<CT />} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} /><Bar dataKey="total" name="Tổng" fill={T.navy + "22"} radius={[2, 2, 0, 0]} /><Line type="monotone" dataKey="Positive" name="Tích cực" stroke={T.positive} strokeWidth={2} dot={false} /><Line type="monotone" dataKey="Negative" name="Tiêu cực" stroke={T.negative} strokeWidth={2} dot={false} /></ComposedChart>
    </ResponsiveContainer>
  );
}
