import { useMemo } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { T, fmt, pct, nsr } from "../../constants/theme";
import { META } from "../../constants/meta";
import { Stat } from "../../components/common/Stat";
import { CT } from "../../components/common/CT";
import { useFC } from "../../context/FilterContext";
import { computeAgg } from "../../utils/aggregation";
import RAW_CHANNELS from "../../data/rawChannels.json";

export function KenhDetailTab({ channel }) {
  const fc = useFC();
  const ci = META.channels.indexOf(channel);
  const d_base = RAW_CHANNELS[channel] || { total: 0, Positive: 0, Negative: 0, Neutral: 0, trend_weekly: [], top_sites: [] };
  // When filter is active, compute from filtered rows for this channel
  const d = useMemo(() => {
    if (!fc || !fc.filteredRows) return d_base;
    const chRows = fc.filteredRows.filter(r => r[2] === ci);
    if (chRows.length === 0) return d_base;
    const a = computeAgg(chRows);
    return { total: a.summary.total, Positive: a.summary.positive, Negative: a.summary.negative, Neutral: a.summary.neutral, trend_weekly: a.trend_weekly, top_sites: d_base.top_sites };
  }, [fc && fc.filteredRows, ci]);
  if (!d || d.total === 0) return <div style={{ padding: 40, textAlign: "center", color: T.textSub }}>Không có dữ liệu cho kênh này</div>;
  const total = d.total;
  const nsrV = nsr(d.Positive || 0, d.Negative || 0, total);
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <Stat label={"Tổng — " + channel} value={fmt(total)} color={T.navy} />
        <Stat label="Tích cực" value={fmt(d.Positive || 0)} sub={pct(d.Positive || 0, total)} color={T.positive} />
        <Stat label="Tiêu cực" value={fmt(d.Negative || 0)} sub={pct(d.Negative || 0, total)} color={T.negative} />
        <Stat label="Trung lập" value={fmt(d.Neutral || 0)} sub={pct(d.Neutral || 0, total)} color={T.neutral} />
        <Stat label="NSR" value={nsrV + "%"} color={+nsrV >= 0 ? T.positive : T.negative} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 20 }}>
        <div>
          <div style={{ fontSize: 12, color: T.textSub, marginBottom: 8 }}>Xu hướng theo tuần</div>
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={d.trend_weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAF0F8" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 9, fill: T.textSub }} tickLine={false} axisLine={{ stroke: T.border }} interval={2} />
              <YAxis tick={{ fontSize: 10, fill: T.textSub }} tickLine={false} axisLine={false} tickFormatter={fmt} />
              <Tooltip content={<CT />} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="total" name="Tổng" fill={T.navy + "22"} radius={[2, 2, 0, 0]} />
              <Line type="monotone" dataKey="Positive" name="Tích cực" stroke={T.positive} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Negative" name="Tiêu cực" stroke={T.negative} strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div style={{ fontSize: 12, color: T.textSub, marginBottom: 8 }}>Top nguồn — {channel}</div>
          <div style={{ maxHeight: 280, overflow: "auto", border: "1px solid " + T.border, borderRadius: 8 }}>
            {d.top_sites.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderBottom: "1px solid " + T.border, background: i % 2 === 0 ? T.white : "#F7FAFD" }}>
                <span style={{ fontSize: 11, color: T.navy, fontWeight: 700, width: 18, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.site}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, flexShrink: 0 }}>{fmt(s.count)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
