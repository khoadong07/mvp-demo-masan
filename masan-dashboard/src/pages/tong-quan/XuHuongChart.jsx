import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { T, fmt } from "../../constants/theme";
import { CT } from "../../components/common/CT";
import COMP from "../../data/comp.json";

const BCOLORS = { "Masan Group": "#143F72", "Vingroup": "#27AE60", "MWG Thế Giới Di Động": "#E67E22", "Hòa Phát": "#9B59B6", "Vinamilk": "#E74C3C" };

export function XuHuongChart() {
  const data = COMP.trend_comp;
  const brands = COMP.comp_summary.map(c => c.name);
  const isMain = n => n === "Masan Group";
  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center" }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAF0F8" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={{ stroke: T.border }} />
          <YAxis tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={false} tickFormatter={fmt} />
          <Tooltip content={<CT />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          {brands.map(k => (
            <Line key={k} type="monotone" dataKey={k}
              stroke={BCOLORS[k] || "#95A5A6"}
              strokeWidth={isMain(k) ? 2.5 : 1.5}
              dot={isMain(k) ? { r: 3, fill: BCOLORS[k] } : false}
              activeDot={{ r: 5 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
