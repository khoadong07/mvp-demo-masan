import { T } from "../../constants/theme";

export function Stat({ label, value, sub, color }) {
  return (
    <div style={{ background: T.white, border: "1px solid " + T.cardBorder, borderRadius: 10, padding: "14px 18px", flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 10, color: T.textSub, textTransform: "uppercase", letterSpacing: .5, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: color || T.navyDark, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: T.textLight, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}
