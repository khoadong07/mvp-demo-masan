import { T, fmt, pct, nsr } from "../../constants/theme";
import { Stat } from "../../components/common/Stat";
import { bodSentimentForLastDays } from "./bodData";

const SEGMENTS = [
  { key: "Positive", label: "Tích cực", color: T.positive },
  { key: "Negative", label: "Tiêu cực", color: T.negative },
  { key: "Neutral", label: "Trung lập", color: T.neutral },
];

export function BODSentimentStats({ period }) {
  const { Positive, Negative, Neutral, total } = bodSentimentForLastDays(period);
  const nsrVal = parseFloat(nsr(Positive, Negative, total));

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <Stat label="Tổng tin" value={fmt(total)} sub={period + " ngày qua"} />
        <Stat label="Tích cực" value={fmt(Positive)} sub={pct(Positive, total)} color={T.positive} />
        <Stat label="Tiêu cực" value={fmt(Negative)} sub={pct(Negative, total)} color={T.negative} />
        <Stat label="NSR" value={nsrVal + "%"} color={nsrVal >= 0 ? T.positive : T.negative} />
      </div>

      <div style={{ height: 8, borderRadius: 4, overflow: "hidden", display: "flex", background: "#E3EDF7" }}>
        {SEGMENTS.map(s => {
          const count = { Positive, Negative, Neutral }[s.key];
          return <div key={s.key} style={{ height: "100%", width: (total ? (count / total) * 100 : 0) + "%", background: s.color }} />;
        })}
      </div>

      <div style={{ display: "flex", gap: 20, marginTop: 10, fontSize: 12, color: T.textSub }}>
        {SEGMENTS.map(s => {
          const count = { Positive, Negative, Neutral }[s.key];
          return (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
              <span>{s.label} {fmt(count)} ({pct(count, total)})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
