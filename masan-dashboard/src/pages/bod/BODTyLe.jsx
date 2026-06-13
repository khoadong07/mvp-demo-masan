import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { T, fmt } from "../../constants/theme";
import { RangeToggle, BODHeaderNav } from "./BODRangeNav";
import { BODFeaturedNews } from "./BODFeaturedNews";
import { filterBodArticles } from "./bodData";
import { useBodData } from "./useBodData";
import { useFC } from "../../context/FilterContext";

const SENT_ITEMS = [
  { name: "Tiêu cực", key: "Negative", color: T.negative },
  { name: "Tích cực", key: "Positive", color: T.positive },
  { name: "Trung lập", key: "Neutral",  color: T.neutral  },
];

const RADIAN = Math.PI / 180;

const renderLabel = ({ cx, cy, midAngle, outerRadius, name, index }) => {
  const stagger = index % 2 === 0 ? 20 : 36;
  const lineEnd = outerRadius + stagger;
  const r = lineEnd + 14;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  const anchor = x > cx ? "start" : "end";
  return (
    <g>
      <line x1={cx + (outerRadius + 2) * Math.cos(-midAngle * RADIAN)} y1={cy + (outerRadius + 2) * Math.sin(-midAngle * RADIAN)}
        x2={cx + lineEnd * Math.cos(-midAngle * RADIAN)} y2={cy + lineEnd * Math.sin(-midAngle * RADIAN)}
        stroke={T.textLight} strokeWidth="1" />
      <text x={x} y={y} textAnchor={anchor} dominantBaseline="middle" fontSize="13" fontWeight="700" fill={T.textPrimary}>{name}</text>
    </g>
  );
};

function PieLegend({ items, hiddenKeys, onToggle }) {
  return (
    <div style={{ display: "flex", gap: 14, justifyContent: "center", fontSize: 11, cursor: "pointer", marginTop: 6 }}>
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

export function BODTyLe({ setTab }) {
  const [range, setRange] = useState("24h");
  const [clickFilter, setClickFilter] = useState(null);
  const [hiddenKeys, setHiddenKeys] = useState(new Set());
  const fc = useFC();
  const bodData = useBodData();

  const s = range === "24h" ? bodData.sentiment24h : range === "7d" ? bodData.sentiment7d : bodData.sentiment30d;

  const toggleLegend = (name) => {
    const item = SENT_ITEMS.find(i => i.name === name);
    if (!item) return;
    setHiddenKeys(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
    if (clickFilter?.sentiment === item.key) setClickFilter(null);
  };

  const data = SENT_ITEMS
    .filter(item => !hiddenKeys.has(item.name) && s[item.key] > 0)
    .map(item => ({ name: item.name, value: s[item.key], color: item.color }));

  const visibleTotal = data.reduce((acc, e) => acc + e.value, 0);

  const articles = useMemo(() => {
    const visibleEN = SENT_ITEMS.filter(i => !hiddenKeys.has(i.name)).map(i => i.key);
    let sent = null;
    if (clickFilter?.sentiment && visibleEN.includes(clickFilter.sentiment)) {
      sent = clickFilter.sentiment;
    } else if (visibleEN.length === 1) {
      sent = visibleEN[0];
    }
    return filterBodArticles(fc?.applied, sent ? { sentiment: sent } : null);
  }, [fc?.applied, clickFilter, hiddenKeys]);

  const SENT_EN_TO_VI = { Positive: "Tích cực", Negative: "Tiêu cực", Neutral: "Trung lập" };
  const visibleEN = SENT_ITEMS.filter(i => !hiddenKeys.has(i.name)).map(i => i.key);
  let newsTitle = "Tin nổi bật";
  if (clickFilter?.sentiment && visibleEN.includes(clickFilter.sentiment)) {
    newsTitle = `Tin nổi bật: ${SENT_EN_TO_VI[clickFilter.sentiment]}`;
  } else if (visibleEN.length === 1) {
    newsTitle = `Tin nổi bật: ${SENT_EN_TO_VI[visibleEN[0]]}`;
  }

  const hasFilter = clickFilter !== null || hiddenKeys.size > 0;
  const resetAll = () => { setClickFilter(null); setHiddenKeys(new Set()); };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div>
        <RangeToggle range={range} setRange={setRange} />
        <BODHeaderNav active="ty-le" setTab={setTab} />
        <div style={{ position: "relative" }}>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart margin={{ top: 24, right: 80, bottom: 24, left: 80 }}>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
                startAngle={90} endAngle={-270} isAnimationActive={false}
                innerRadius={62} outerRadius={96} labelLine={false} label={data.length ? renderLabel : false}
                style={{ cursor: "pointer" }}
                onClick={entry => {
                  const item = SENT_ITEMS.find(i => i.name === entry.name);
                  if (item) setClickFilter({ sentiment: item.key });
                }}>
                {data.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [fmt(v), n]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid " + T.border }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: T.navyDark }}>{fmt(visibleTotal)}</div>
            <div style={{ fontSize: 12, color: T.textSub }}>Buzz</div>
          </div>
        </div>
        <PieLegend items={SENT_ITEMS} hiddenKeys={hiddenKeys} onToggle={toggleLegend} />
      </div>
      <BODFeaturedNews
        articles={articles}
        title={newsTitle}
        onReset={hasFilter ? resetAll : undefined}
      />
    </div>
  );
}
