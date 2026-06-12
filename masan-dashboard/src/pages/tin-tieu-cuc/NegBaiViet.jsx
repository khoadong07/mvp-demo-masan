import { useState } from "react";
import { T } from "../../constants/theme";
import { SBadge } from "../../components/common/SBadge";
import RAW from "../../data/raw.json";

export function NegBaiViet() {
  const [q, setQ] = useState("");
  const [lv, setLv] = useState("all");
  const arts = RAW.negative.articles.filter(a => (!q || a.title.toLowerCase().includes(q.toLowerCase())) && (lv === "all" || String(a.level) === lv));
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm kiếm..." style={{ flex: 1, padding: "7px 12px", border: "1px solid " + T.border, borderRadius: 8, fontSize: 13 }} />
        <select value={lv} onChange={e => setLv(e.target.value)} style={{ padding: "7px 12px", border: "1px solid " + T.border, borderRadius: 8, fontSize: 13, background: "#fff" }}>
          <option value="all">Tất cả level</option><option value="3">Level 3</option><option value="2">Level 2</option><option value="1">Level 1</option>
        </select>
        <div style={{ padding: "7px 14px", background: "#FEF9F9", border: "1px solid " + T.negative + "33", borderRadius: 8, fontSize: 13, color: T.negative, fontWeight: 700 }}>{arts.length}</div>
      </div>
      <div style={{ maxHeight: 440, overflow: "auto", border: "1px solid " + T.border, borderRadius: 8 }}>
        {arts.map((a, i) => (<div key={i} style={{ padding: "12px 14px", borderBottom: "1px solid " + T.border, background: i % 2 === 0 ? T.white : "#FEF9F9" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 4 }}><SBadge s="Negative" /><span style={{ background: "#FEF3E7", color: "#E67E22", padding: "2px 7px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>Lv.{a.level || "N/A"}</span><span style={{ fontSize: 11, color: T.textSub }}>{a.channel}</span><span style={{ fontSize: 10, color: T.textLight, marginLeft: "auto" }}>{a.date?.slice(0, 10)}</span></div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
          <div style={{ fontSize: 11, color: T.textSub, marginTop: 2 }}>{a.site}</div>
        </div>))}
      </div>
    </div>
  );
}
