import { T } from "../../constants/theme";

const TITLES = {
  "dien-bien": "Diễn biến tin Tích cực & Tiêu cực theo thời gian",
  "ty-le": "Tỷ trọng tin Tích cực & Tiêu cực",
  "ty-le-kenh": "Tỷ lệ phân bổ theo kênh",
  "top-nguon": "Top nguồn đăng",
};

function pill(active) {
  return {
    padding: "7px 16px",
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

function NavBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid " + T.border, background: T.white, color: T.textSub, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {children}
    </button>
  );
}

export function RangeToggle({ range, setRange }) {
  return (
    <div style={{ display: "inline-flex", background: T.bg, borderRadius: 8, padding: 3, marginBottom: 18 }}>
      <button onClick={() => setRange("24h")} style={pill(range === "24h")}>Trong vòng 24h</button>
      <button onClick={() => setRange("7d")} style={pill(range === "7d")}>Trong vòng 7 ngày</button>
    </div>
  );
}

const VIEWS = ["dien-bien", "ty-le", "ty-le-kenh", "top-nguon"];
const SENTIMENT_PAIR = ["dien-bien", "ty-le"];
const CHANNEL_PAIR = ["ty-le-kenh", "top-nguon"];

export function BODHeaderNav({ active, setTab }) {
  const idx = VIEWS.indexOf(active);
  const prev = VIEWS[(idx - 1 + VIEWS.length) % VIEWS.length];
  const next = VIEWS[(idx + 1) % VIEWS.length];
  const pair = SENTIMENT_PAIR.includes(active) ? SENTIMENT_PAIR : CHANNEL_PAIR;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <NavBtn onClick={() => setTab?.(prev)}>‹</NavBtn>
      {pair.map((k, i) => {
        const isActive = k === active;
        return (
          <div key={k} onClick={() => !isActive && setTab?.(k)}
            style={{ fontSize: 14, fontWeight: isActive ? 800 : 600, color: isActive ? T.navyDark : T.textLight, cursor: isActive ? "default" : "pointer", whiteSpace: "nowrap", marginLeft: i === 1 ? "auto" : 0 }}>
            {TITLES[k]}
          </div>
        );
      })}
      <NavBtn onClick={() => setTab?.(next)}>›</NavBtn>
    </div>
  );
}
