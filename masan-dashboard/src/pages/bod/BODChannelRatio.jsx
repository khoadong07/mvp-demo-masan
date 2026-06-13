import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { T } from "../../constants/theme";
import { RangeToggle, BODHeaderNav } from "./BODRangeNav";
import { BODFeaturedNews } from "./BODFeaturedNews";
import { filterBodArticles } from "./bodData";
import { useBodData } from "./useBodData";
import { useFC } from "../../context/FilterContext";

const RING_COLORS = {
  "Facebook": "#2D6CDF",
  "Social":   "#9B59B6",
  "Tiktok":   "#111111",
  "News":     "#F39C12",
  "Youtube":  "#E74C3C",
  "Forum":    "#F5A28A",
  "Threads":  "#BDC3C7",
  "Linkedin": "#0A66C2",
  "E-commerce": "#F1C40F",
};

const RADIAN = Math.PI / 180;

const renderLabel = ({ cx, cy, midAngle, outerRadius, name, value, index }) => {
  const stagger = index % 2 === 0 ? 24 : 48;
  const lineEnd = outerRadius + stagger;
  const r = lineEnd + 12;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  const anchor = x > cx ? "start" : "end";
  return (
    <g>
      <line x1={cx + (outerRadius + 2) * Math.cos(-midAngle * RADIAN)} y1={cy + (outerRadius + 2) * Math.sin(-midAngle * RADIAN)}
        x2={cx + lineEnd * Math.cos(-midAngle * RADIAN)} y2={cy + lineEnd * Math.sin(-midAngle * RADIAN)}
        stroke={T.textLight} strokeWidth="1" />
      <text x={x} y={y} textAnchor={anchor} dominantBaseline="middle" fontSize="11" fontWeight="600" fill={T.textPrimary}>
        {name}: {value.toFixed(1)}%
      </text>
    </g>
  );
};

function PieLegend({ items, hiddenKeys, onToggle }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", fontSize: 11, cursor: "pointer", marginTop: 6 }}>
      {items.map(({ name, color }) => {
        const hidden = hiddenKeys.has(name);
        return (
          <span key={name} onClick={() => onToggle(name)}
            style={{ display: "flex", alignItems: "center", gap: 5, opacity: hidden ? 0.35 : 1, userSelect: "none" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
              background: hidden ? "transparent" : color,
              outline: hidden ? "1.5px solid " + color : "none",
            }} />
            <span style={{ textDecoration: hidden ? "line-through" : "none" }}>{name}</span>
          </span>
        );
      })}
    </div>
  );
}

export function BODChannelRatio({ setTab }) {
  const [range, setRange] = useState("24h");
  const [clickFilter, setClickFilter] = useState(null);
  const [hiddenKeys, setHiddenKeys] = useState(new Set());
  const fc = useFC();
  const bodData = useBodData();

  const rawData = range === "24h" ? bodData.channel24h : range === "7d" ? bodData.channel7d : bodData.channel30d;

  const toggleLegend = (name) => {
    setHiddenKeys(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
    if (clickFilter?.channel === name) setClickFilter(null);
  };

  const channelData = rawData.filter(e => !hiddenKeys.has(e.name));
  const visibleTotal = channelData.reduce((s, e) => s + e.count, 0);

  const legendItems = rawData.map(e => ({ name: e.name, color: RING_COLORS[e.name] || "#999" }));

  const articles = useMemo(() => {
    const visibleChannels = rawData.filter(e => !hiddenKeys.has(e.name)).map(e => e.name);
    let channel = null;
    if (clickFilter?.channel && !hiddenKeys.has(clickFilter.channel)) {
      channel = clickFilter.channel;
    } else if (visibleChannels.length === 1) {
      channel = visibleChannels[0];
    }
    return filterBodArticles(fc?.applied, channel ? { channel } : null);
  }, [fc?.applied, clickFilter, hiddenKeys, rawData]);

  const visibleChannels = rawData.filter(e => !hiddenKeys.has(e.name)).map(e => e.name);
  let newsTitle = "Tin nổi bật";
  if (clickFilter?.channel && !hiddenKeys.has(clickFilter.channel)) {
    newsTitle = `Tin nổi bật: ${clickFilter.channel}`;
  } else if (visibleChannels.length === 1) {
    newsTitle = `Tin nổi bật: ${visibleChannels[0]}`;
  }

  const hasFilter = clickFilter !== null || hiddenKeys.size > 0;
  const resetAll = () => { setClickFilter(null); setHiddenKeys(new Set()); };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div>
        <RangeToggle range={range} setRange={setRange} />
        <BODHeaderNav active="ty-le-kenh" setTab={setTab} />
        <div style={{ position: "relative" }}>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart margin={{ top: 24, right: 90, bottom: 24, left: 90 }}>
              <Pie data={channelData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                startAngle={90} endAngle={-270} isAnimationActive={false}
                innerRadius={62} outerRadius={96} labelLine={false} label={channelData.length ? renderLabel : false}
                style={{ cursor: "pointer" }}
                onClick={entry => setClickFilter({ channel: entry.name })}>
                {channelData.map((e, i) => <Cell key={i} fill={RING_COLORS[e.name] || "#999"} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v + "%", n]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid " + T.border }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: T.navyDark }}>{visibleTotal}</div>
            <div style={{ fontSize: 12, color: T.textSub }}>Buzz</div>
          </div>
        </div>
        {legendItems.length > 0 && <PieLegend items={legendItems} hiddenKeys={hiddenKeys} onToggle={toggleLegend} />}
      </div>
      <BODFeaturedNews
        articles={articles}
        title={newsTitle}
        onReset={hasFilter ? resetAll : undefined}
      />
    </div>
  );
}
