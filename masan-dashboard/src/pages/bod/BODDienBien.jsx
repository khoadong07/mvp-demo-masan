import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { T } from "../../constants/theme";
import { CT } from "../../components/common/CT";
import { RangeToggle, BODHeaderNav } from "./BODRangeNav";
import { BODFeaturedNews } from "./BODFeaturedNews";
import { filterBodArticles } from "./bodData";
import { useBodData } from "./useBodData";
import { useFC } from "../../context/FilterContext";

const SENT_VI = { Positive: "Tích cực", Negative: "Tiêu cực" };
const SENT_KEYS = ["Positive", "Negative"];

function getNewsTitle(hiddenKeys, clickFilter, range, data) {
  const visibleSents = SENT_KEYS.filter(k => !hiddenKeys.has(k));
  if (clickFilter?.sentiment && !hiddenKeys.has(clickFilter.sentiment)) {
    const timeStr = clickFilter.day !== undefined
      ? (range === "24h" ? "Hôm nay" : (data.find(d => d.day === clickFilter.day)?.time || ""))
      : "";
    return `Tin nổi bật: ${SENT_VI[clickFilter.sentiment]}${timeStr ? " — " + timeStr : ""}`;
  }
  if (visibleSents.length === 1) return `Tin nổi bật: ${SENT_VI[visibleSents[0]]}`;
  return "Tin nổi bật";
}

export function BODDienBien({ setTab }) {
  const [range, setRange] = useState("24h");
  const [clickFilter, setClickFilter] = useState(null);
  const [hiddenKeys, setHiddenKeys] = useState(new Set());
  const fc = useFC();
  const bodData = useBodData();

  const data = range === "24h" ? bodData.trend24h : range === "7d" ? bodData.trend7d : bodData.trend30d;

  const toggleLegend = (payload) => {
    const key = payload.dataKey;
    setHiddenKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    if (clickFilter?.sentiment === key) setClickFilter(null);
  };

  const articles = useMemo(() => {
    const visibleSents = SENT_KEYS.filter(k => !hiddenKeys.has(k));
    let sent = null;
    if (clickFilter?.sentiment && !hiddenKeys.has(clickFilter.sentiment)) {
      sent = clickFilter.sentiment;
    } else if (visibleSents.length === 1) {
      sent = visibleSents[0];
    }
    const cf = (sent || clickFilter?.day !== undefined) ? { sentiment: sent, day: clickFilter?.day } : null;
    return filterBodArticles(fc?.applied, cf);
  }, [fc?.applied, clickFilter, hiddenKeys]);

  const hasFilter = clickFilter !== null || hiddenKeys.size > 0;
  const resetAll = () => { setClickFilter(null); setHiddenKeys(new Set()); };

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
            <Legend
              iconType="circle" iconSize={8}
              wrapperStyle={{ fontSize: 11, cursor: "pointer" }}
              onClick={toggleLegend}
            />
            <Bar dataKey="Positive" name="Tích cực" fill={T.positive} radius={[4, 4, 0, 0]}
              hide={hiddenKeys.has("Positive")} style={{ cursor: "pointer" }}
              onClick={d => setClickFilter({ day: d.day, sentiment: "Positive" })} />
            <Bar dataKey="Negative" name="Tiêu cực" fill={T.negative} radius={[4, 4, 0, 0]}
              hide={hiddenKeys.has("Negative")} style={{ cursor: "pointer" }}
              onClick={d => setClickFilter({ day: d.day, sentiment: "Negative" })} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <BODFeaturedNews
        articles={articles}
        title={getNewsTitle(hiddenKeys, clickFilter, range, data)}
        onReset={hasFilter ? resetAll : undefined}
      />
    </div>
  );
}
