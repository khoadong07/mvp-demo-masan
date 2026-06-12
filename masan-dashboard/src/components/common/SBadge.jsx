import { T } from "../../constants/theme";

export function SBadge({ s }) {
  const m = {
    Positive: { bg: "#E8F8EE", c: T.positive, l: "Tích cực" },
    Negative: { bg: "#FEE8E6", c: T.negative, l: "Tiêu cực" },
    Neutral: { bg: "#EEF2F7", c: "#5D6D7E", l: "Trung lập" },
  };
  const v = m[s] || m.Neutral;
  return <span style={{ background: v.bg, color: v.c, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{v.l}</span>;
}
