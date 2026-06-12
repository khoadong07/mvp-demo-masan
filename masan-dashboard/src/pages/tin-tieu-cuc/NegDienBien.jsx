import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { T } from "../../constants/theme";
import { CT } from "../../components/common/CT";
import RAW from "../../data/raw.json";

export function NegDienBien() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={RAW.negative.trend}>
        <defs><linearGradient id="gN" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.negative} stopOpacity={.3} /><stop offset="95%" stopColor={T.negative} stopOpacity={0} /></linearGradient></defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#EAF0F8" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={{ stroke: T.border }} />
        <YAxis tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={false} />
        <Tooltip content={<CT />} />
        <Area type="monotone" dataKey="count" name="Tin tiêu cực" stroke={T.negative} fill="url(#gN)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
