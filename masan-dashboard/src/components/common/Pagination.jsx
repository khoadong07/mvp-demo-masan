import { T } from "../../constants/theme";

function PgBtn({ children, active, disabled, onClick }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid " + (active ? "#143F72" : T.border), background: active ? T.navy : "transparent", color: active ? "#fff" : T.textSub, fontSize: 12, cursor: disabled ? "default" : "pointer", fontWeight: active ? 700 : 400, display: "flex", alignItems: "center", justifyContent: "center", opacity: disabled ? 0.4 : 1 }}>
      {children}
    </button>
  );
}

function pageList(total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  return [1, 2, 3, 4, "...", total - 2, total - 1, total];
}

export function Pagination({ total = 10, current = 1, onChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, paddingTop: 14, marginTop: 6, borderTop: "1px solid " + T.border }}>
      <PgBtn disabled={current <= 1} onClick={() => onChange?.(Math.max(1, current - 1))}>‹</PgBtn>
      {pageList(total).map((p, i) => (
        <PgBtn key={i} active={p === current} disabled={p === "..."} onClick={() => typeof p === "number" && onChange?.(p)}>{p}</PgBtn>
      ))}
      <PgBtn disabled={current >= total} onClick={() => onChange?.(Math.min(total, current + 1))}>›</PgBtn>
    </div>
  );
}
