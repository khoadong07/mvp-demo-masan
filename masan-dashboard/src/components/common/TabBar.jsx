import { T } from "../../constants/theme";

export function TabBar({ tabs, active, onSelect }) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid " + T.border, marginBottom: 18, overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch" }}>
      {tabs.map(t => (
        <button key={t.k} onClick={() => onSelect(t.k)}
          style={{ padding: "10px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: active === t.k ? 700 : 400, color: active === t.k ? T.navy : T.textSub, borderBottom: "2px solid " + (active === t.k ? T.navy : "transparent"), marginBottom: -1, transition: "all .15s", whiteSpace: "nowrap", flexShrink: 0 }}>
          {t.l}
        </button>
      ))}
      <span style={{ padding: "10px 8px", color: T.textSub, fontSize: 14, alignSelf: "center", flexShrink: 0 }}>›</span>
    </div>
  );
}
