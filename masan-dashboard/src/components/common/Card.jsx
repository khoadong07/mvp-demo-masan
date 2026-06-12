import { T } from "../../constants/theme";

export function Card({ children, style }) {
  return <div style={{ background: T.white, borderRadius: 12, border: "1px solid " + T.cardBorder, boxShadow: "0 1px 4px rgba(20,63,114,.06)", ...style }}>{children}</div>;
}
