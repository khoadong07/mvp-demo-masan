import { T, fmt } from "../../constants/theme";

export function CT({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #D5E3F0", borderRadius: 8, padding: "10px 14px", fontSize: 12, boxShadow: "0 4px 12px rgba(20,63,114,.1)" }}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: T.textPrimary }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, color: p.color }}>
          <span>{p.name}</span><b>{fmt(p.value)}</b>
        </div>
      ))}
    </div>
  );
}
