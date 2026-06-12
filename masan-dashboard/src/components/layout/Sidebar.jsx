import { T } from "../../constants/theme";

function MasanLogo({ collapsed }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: collapsed ? 0 : 8, overflow: "hidden", transition: "all .22s ease" }}>
      <svg width="36" height="36" viewBox="0 0 38 38" fill="none" style={{ flexShrink: 0 }}>
        <rect x="2" y="2" width="15" height="15" rx="2" fill="#1877C8" />
        <rect x="21" y="2" width="15" height="15" rx="2" fill="#1877C8" opacity=".75" />
        <rect x="2" y="21" width="15" height="15" rx="2" fill="#1877C8" opacity=".55" />
        <rect x="21" y="21" width="15" height="15" rx="2" fill="#1877C8" opacity=".35" />
      </svg>
      {!collapsed && <div style={{ lineHeight: 1.15, overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: T.navyDark, letterSpacing: 1.5 }}>MASAN</div>
        <div style={{ fontSize: 9, fontWeight: 500, color: T.textSub, letterSpacing: 2 }}>GROUP</div>
      </div>}
    </div>
  );
}

const NAV = [
  { k: "tong-quan", l: "Tổng quan", svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="10" width="4" height="11" /><rect x="10" y="6" width="4" height="15" /><rect x="17" y="3" width="4" height="18" /></svg> },
  { k: "chien-dich", l: "Chiến dịch", svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg> },
  { k: "report", l: "Reports", svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg> },
  { k: "chi-tiet", l: "Chi tiết thảo luận", svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><line x1="9" y1="10" x2="15" y2="10" /><line x1="9" y1="14" x2="13" y2="14" /></svg> },
  { k: "bod", l: "BOD", svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
];
// Hidden pages still accessible via page key but not in sidebar: msn, tin-tieu-cuc, ir

export function Sidebar({ page, setPage, collapsed, setCollapsed }) {
  return (
    <div style={{ width: collapsed ? 68 : 220, minWidth: collapsed ? 68 : 220, background: T.white, borderRight: "1px solid " + T.border, display: "flex", flexDirection: "column", paddingBottom: 16, gap: 2, flexShrink: 0, height: "100%", overflowY: "hidden", transition: "width .22s ease,min-width .22s ease" }}>
      {/* Logo + collapse toggle */}
      <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: collapsed ? "0 12px" : "0 12px 0 16px", borderBottom: "1px solid " + T.border, marginBottom: 10, flexShrink: 0, overflow: "hidden", transition: "padding .22s ease" }}>
        <MasanLogo collapsed={collapsed} />
        <button onClick={() => setCollapsed(!collapsed)} title={collapsed ? "Mở rộng" : "Thu gọn"}
          style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid " + T.border, background: "#F7FAFD", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: T.textSub, marginLeft: collapsed ? -2 : 4 }}>
          {collapsed
            ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            : <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          }
        </button>
      </div>
      {NAV.map(n => {
        const on = page === n.k;
        return (
          <button key={n.k} onClick={() => setPage(n.k)} title={collapsed ? n.l : undefined}
            style={{ margin: collapsed ? "4px auto" : "2px 10px", padding: collapsed ? "10px" : "10px 12px", width: collapsed ? 46 : undefined, borderRadius: 10, border: "none", cursor: "pointer", background: on ? T.navy : "transparent", color: on ? "#fff" : T.navy, display: "flex", alignItems: "center", gap: collapsed ? 0 : 10, transition: "background .15s,width .22s", textAlign: "left", justifyContent: collapsed ? "center" : undefined, flexShrink: 0 }}
            onMouseEnter={e => { if (!on) e.currentTarget.style.background = "#EBF2FA"; }}
            onMouseLeave={e => { if (!on) e.currentTarget.style.background = "transparent"; }}>
            <span style={{ width: 20, height: 20, display: "flex", flexShrink: 0, opacity: on ? 1 : .75 }}>{n.svg}</span>
            {!collapsed && <span style={{ fontSize: 13.5, fontWeight: on ? 700 : 500, whiteSpace: "nowrap" }}>{n.l}</span>}
          </button>
        );
      })}
    </div>
  );
}
