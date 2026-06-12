import { T } from "../../constants/theme";

function pill(active) {
  return {
    padding: "7px 14px",
    borderRadius: 6,
    border: "none",
    fontSize: 12.5,
    fontWeight: active ? 700 : 500,
    color: active ? "#fff" : T.textSub,
    background: active ? T.navy : "transparent",
    boxShadow: "none",
    cursor: "pointer",
  };
}

const OPTIONS = [
  { v: 7, l: "7 ngày" },
  { v: 14, l: "14 ngày" },
  { v: 21, l: "21 ngày" },
  { v: 28, l: "28 ngày" },
];

export function BODPeriodToggle({ period, setPeriod }) {
  return (
    <div style={{ display: "inline-flex", background: T.bg, borderRadius: 8, padding: 3 }}>
      {OPTIONS.map(o => (
        <button key={o.v} onClick={() => setPeriod(o.v)} style={pill(period === o.v)}>{o.l}</button>
      ))}
    </div>
  );
}
