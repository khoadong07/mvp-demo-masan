import { T } from "../../constants/theme";

function ChevronDown() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="#6E7F99" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}

function Dropdown({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid " + T.border, borderRadius: 8, padding: "6px 14px", cursor: "pointer", background: "#F7FAFD", maxWidth: 240 }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: T.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      <ChevronDown />
    </div>
  );
}

export function Header({ title }) {
  return (
    <div style={{ background: T.white, borderBottom: "1px solid " + T.border, height: 64, display: "flex", alignItems: "center", padding: "0 24px", flexShrink: 0 }}>
      {/* Title */}
      <div style={{ fontSize: 20, fontWeight: 700, color: T.navyDark, flex: 1 }}>{title}</div>
      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <Dropdown label="Masan Group (HOSE: MSN)" />
        <div style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid " + T.border, borderRadius: 8, padding: "5px 10px", cursor: "pointer", background: "#F7FAFD" }}>
          <span style={{ fontSize: 16 }}>🇻🇳</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>VN</span>
          <ChevronDown />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <img src="https://i.pravatar.cc/36?img=11" alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
          <div><div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>Kyle</div><div style={{ fontSize: 11, color: T.textSub }}>Admin</div></div>
          <ChevronDown />
        </div>
      </div>
    </div>
  );
}
