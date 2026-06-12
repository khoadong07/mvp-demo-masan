import { T } from "../../constants/theme";

const CH_ICON_BG = { Facebook: "#1877F2", Tiktok: "#111", Youtube: "#FF0000", News: "#F39C12", Social: "#8E44AD", Forum: "#16A085", Threads: "#333" };

export function ArticleGrid({ articles }) {
  const items = articles.slice(0, 6);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px", overflow: "auto", flex: 1 }}>
      {items.map((a, i) => (
        <a key={i} href={a.url || undefined} target="_blank" rel="noopener noreferrer"
          style={{ display: "block", padding: "12px 0", borderBottom: "1px solid " + T.border, cursor: "pointer", textDecoration: "none", color: "inherit" }}
          onMouseEnter={e => e.currentTarget.querySelector(".atitle").style.color = "#2563EB"}
          onMouseLeave={e => e.currentTarget.querySelector(".atitle").style.color = T.navy}>
          {/* Source row */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, background: CH_ICON_BG[a.channel] || "#666", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", fontWeight: 700, flexShrink: 0 }}>
              {a.channel === "Facebook" ? "f" : a.channel === "Youtube" ? "▶" : a.channel === "Tiktok" ? "T" : a.channel === "News" ? "N" : (a.channel || "?")[0]}
            </div>
            <span style={{ fontSize: 11, color: T.navy, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 90 }}>{a.site}</span>
            <span style={{ fontSize: 10, color: T.textLight, whiteSpace: "nowrap", flexShrink: 0 }}>{a.date?.slice(0, 10)}</span>
          </div>
          {/* Title */}
          <div className="atitle" style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 4, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", transition: "color .15s" }}>{a.title}</div>
          {/* Excerpt */}
          <div style={{ fontSize: 12, color: T.textSub, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{(a.content || a.description || "").slice(0, 100)}...</div>
        </a>
      ))}
    </div>
  );
}
