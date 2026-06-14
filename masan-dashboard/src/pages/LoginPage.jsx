import { T } from "../constants/theme";

export function LoginPage({ onLogin }) {
  return (
    <div style={{ height: "100vh", background: "linear-gradient(135deg,#0D2444 0%,#143F72 60%,#1A5FA8 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: T.white, borderRadius: 20, padding: "44px 40px", width: 420, boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src="/image.svg" alt="Masan Group" style={{ height: 64, objectFit: "contain", margin: "0 auto 20px", display: "block" }} />
          <div style={{ fontSize: 20, fontWeight: 700, color: T.navyDark }}>Social Listening Dashboard</div>
        </div>
        {[["Email", "admin@masangroup.com", "text"], ["Mật khẩu", "••••••••", "password"]].map(([l, ph, t]) => (
          <div key={l} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>{l}</div>
            <input type={t} placeholder={ph} style={{ width: "100%", padding: "10px 14px", border: "1px solid " + T.border, borderRadius: 8, fontSize: 14, boxSizing: "border-box" }} />
          </div>
        ))}
        <button onClick={onLogin} style={{ width: "100%", padding: 12, background: T.navy, color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>Đăng nhập</button>
      </div>
    </div>
  );
}
