import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { T } from "../../constants/theme";
import { CT } from "../../components/common/CT";
import { RangeToggle, BODHeaderNav } from "./BODRangeNav";
import { BODFeaturedNews } from "./BODFeaturedNews";
import { TREND_24H, TREND_7D, BOD_ARTICLES } from "./bodData";

export function BODDienBien({ setTab }) {
  const [range, setRange] = useState("24h");
  const data = range === "24h" ? TREND_24H : TREND_7D;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div>
        <RangeToggle range={range} setRange={setRange} />
        <BODHeaderNav active="dien-bien" setTab={setTab} />
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EAF0F8" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={{ stroke: T.border }} />
            <YAxis tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<CT />} />
            <Bar dataKey="Positive" name="Tích cực" fill={T.positive} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Negative" name="Tiêu cực" fill={T.negative} radius={[4, 4, 0, 0]} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <BODFeaturedNews articles={BOD_ARTICLES} />
    </div>
  );
}
