import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { T, fmt } from "../../constants/theme";
import { CT } from "../../components/common/CT";
import RAW from "../../data/raw.json";

export function ChuDeComp() {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart data={RAW.top_labels.slice(0, 12)} layout="vertical" margin={{ left: 200, right: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EAF0F8" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={{ stroke: T.border }} tickFormatter={fmt} />
        <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: T.textPrimary }} width={195} tickLine={false} axisLine={false} />
        <Tooltip content={<CT />} />
        <Bar dataKey="count" name="Thảo luận" fill={T.navy} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
