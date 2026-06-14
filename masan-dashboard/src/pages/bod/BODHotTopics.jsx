import { T, fmt, nsr } from "../../constants/theme";
import { BOD_HOT_TOPICS } from "./bodData";
import { varyFactor } from "./useBodData";
import { useFC } from "../../context/FilterContext";

const COLS = "2fr 80px 80px 80px 80px 1fr";

export function BODHotTopics({ period }) {
  const scale = period / 7;
  const fc = useFC();
  const seed = fc?.randomSeed ?? 0;

  const rows = BOD_HOT_TOPICS.map((t, i) => {
    const Positive = Math.round(t.base.Positive * scale * varyFactor(seed, 200 + i * 3));
    const Negative = Math.round(t.base.Negative * scale * varyFactor(seed, 200 + i * 3 + 1));
    const Neutral  = Math.round(t.base.Neutral  * scale * varyFactor(seed, 200 + i * 3 + 2));
    const total = Positive + Negative + Neutral;
    const nsrVal = parseFloat(nsr(Positive, Negative, total));
    return { topic: t.topic, Positive, Negative, Neutral, total, nsrVal };
  }).sort((a, b) => a.nsrVal - b.nsrVal);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, fontSize: 12, color: T.textSub, paddingBottom: 10, borderBottom: "1px solid " + T.border }}>
        <div>Chủ đề</div>
        <div>Tổng tin</div>
        <div>Tích cực</div>
        <div>Tiêu cực</div>
        <div>NSR</div>
        <div>Mức độ</div>
      </div>

      {rows.map((r, i) => {
        const flagged = r.nsrVal < -30;
        const nsrColor = r.nsrVal >= 0 ? T.positive : T.negative;
        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, alignItems: "center", padding: "12px 0", borderBottom: "1px solid " + T.border }}>
            <div style={{ fontSize: 13, fontWeight: flagged ? 700 : 600, color: flagged ? T.textPrimary : T.textLight }}>
              {r.topic}
              {flagged && <span style={{ background: "#FEE8E6", color: T.negative, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600, marginLeft: 8 }}>Cần chú ý</span>}
            </div>
            <div style={{ fontSize: 13, color: T.textPrimary }}>{fmt(r.total)}</div>
            <div style={{ fontSize: 13, color: T.positive }}>{fmt(r.Positive)}</div>
            <div style={{ fontSize: 13, color: T.negative }}>{fmt(r.Negative)}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: nsrColor }}>{r.nsrVal}%</div>
            <div style={{ height: 8, borderRadius: 4, background: "#E3EDF7", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(100, Math.abs(r.nsrVal))}%`, background: nsrColor, borderRadius: 4 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
