import { useState } from "react";
import { T, fmt, CH_COLOR } from "../constants/theme";
import { META } from "../constants/meta";
import { Card } from "../components/common/Card";
import { SBadge } from "../components/common/SBadge";
import { FilterBar } from "../components/layout/FilterBar";
import RAW from "../data/raw.json";

const CH_ICON = { Facebook: "f", Youtube: "▶", Tiktok: "T", News: "N" };
const SENT_VI = { Positive: "Tích cực", Negative: "Tiêu cực", Neutral: "Trung lập" };
const CHANNELS = [...new Set(RAW.articles.map(a => a.channel))].sort();
const LABELS = [...new Set(RAW.articles.map(a => a.label).filter(Boolean))].sort();

function ChannelIcon({ channel, size = 24 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 6, background: CH_COLOR[channel] || CH_COLOR.Other, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.42, color: "#fff", fontWeight: 700, flexShrink: 0 }}>
      {CH_ICON[channel] || (channel || "?")[0]}
    </div>
  );
}

function LabelTag({ label }) {
  if (!label) return null;
  return <span style={{ background: "#F1ECFB", color: "#6C4FC4", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{label}</span>;
}

function InfoItem({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: T.textLight, marginBottom: 3, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 13, color: T.textPrimary, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
    </div>
  );
}

const selSt = { padding: "7px 12px", border: "1px solid " + T.border, borderRadius: 8, fontSize: 13, background: "#fff", color: T.textPrimary, cursor: "pointer", outline: "none" };

export function ChiTietPage() {
  const [q, setQ] = useState("");
  const [chF, setChF] = useState("all");
  const [sF, setSF] = useState("all");
  const [lF, setLF] = useState("all");
  const [detail, setDetail] = useState(null);
  const ql = q.toLowerCase();
  const filtered = RAW.articles.filter(a =>
    (!ql || a.title.toLowerCase().includes(ql) || a.site.toLowerCase().includes(ql) || a.content.toLowerCase().includes(ql)) &&
    (chF === "all" || a.channel === chF) &&
    (sF === "all" || a.sentiment === sF) &&
    (lF === "all" || a.label === lF)
  );

  if (detail) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <FilterBar />
      <div style={{ flex: 1, overflow: "auto", background: T.bg, padding: "18px 20px" }}>
        <button onClick={() => setDetail(null)} style={{ marginBottom: 14, padding: "6px 16px", background: T.navy, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Quay lại danh sách</button>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", borderBottom: "1px solid " + T.border, background: "#F7FAFD" }}>
            <ChannelIcon channel={detail.channel} size={32} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{detail.site}</div>
              <div style={{ fontSize: 11, color: T.textLight }}>{detail.channel} · {detail.date?.slice(0, 10)}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
              <LabelTag label={detail.label} />
              <SBadge s={detail.sentiment} />
            </div>
          </div>
          {/* Body */}
          <div style={{ padding: "22px 24px" }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: T.navyDark, marginBottom: 14, lineHeight: 1.5 }}>{detail.title || "(Không có tiêu đề)"}</div>
            <div style={{ fontSize: 13.5, color: T.textPrimary, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{detail.content}</div>
          </div>
          {/* Info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 18, padding: "16px 24px", borderTop: "1px solid " + T.border, background: "#F7FAFD" }}>
            <InfoItem label="Nguồn" value={detail.site} />
            <InfoItem label="Kênh" value={detail.channel} />
            <InfoItem label="Chủ đề" value={detail.label || "—"} />
            <InfoItem label="Tương tác" value={fmt(detail.interactions)} />
          </div>
          {detail.url && (
            <div style={{ padding: "14px 24px", borderTop: "1px solid " + T.border }}>
              <a href={detail.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", background: T.navy, color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Xem bài viết gốc ↗</a>
            </div>
          )}
        </Card>
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <FilterBar />
      <div style={{ flex: 1, overflow: "auto", background: T.bg, padding: "18px 20px" }}>
        <Card style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.navyDark }}>Chi tiết thảo luận</div>
            <span style={{ fontSize: 13, color: T.textSub }}>{filtered.length} bài</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm theo tiêu đề, nội dung, nguồn..." style={{ flex: 2, minWidth: 220, padding: "7px 12px", border: "1px solid " + T.border, borderRadius: 8, fontSize: 13, outline: "none" }} />
            <select value={chF} onChange={e => setChF(e.target.value)} style={selSt}>
              <option value="all">Tất cả kênh</option>
              {CHANNELS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <select value={sF} onChange={e => setSF(e.target.value)} style={selSt}>
              <option value="all">Tất cả sắc thái</option>
              {META.sentiments.map(o => <option key={o} value={o}>{SENT_VI[o] || o}</option>)}
            </select>
            <select value={lF} onChange={e => setLF(e.target.value)} style={selSt}>
              <option value="all">Tất cả chủ đề</option>
              {LABELS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ maxHeight: 600, overflow: "auto", border: "1px solid " + T.border, borderRadius: 10 }}>
            {filtered.map((a, i) => (
              <div key={i} onClick={() => setDetail(a)} style={{ display: "flex", gap: 12, padding: "13px 16px", borderBottom: "1px solid " + T.border, cursor: "pointer", background: i % 2 === 0 ? T.white : "#F7FAFD" }}
                onMouseEnter={e => e.currentTarget.style.background = "#EBF2FA"} onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? T.white : "#F7FAFD"}>
                <ChannelIcon channel={a.channel} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.navy }}>{a.site}</span>
                    <span style={{ fontSize: 11, color: T.textLight }}>{a.date?.slice(0, 10)}</span>
                    <SBadge s={a.sentiment} />
                    <LabelTag label={a.label} />
                    <span style={{ marginLeft: "auto", fontSize: 11, color: T.textSub, whiteSpace: "nowrap" }}>{fmt(a.interactions)} tương tác</span>
                  </div>
                  {a.title && <div style={{ fontSize: 13, fontWeight: 700, color: T.navyDark, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>}
                  <div style={{ fontSize: 12, color: T.textSub, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: a.title ? 2 : 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.content}</div>
                </div>
                <div style={{ alignSelf: "center", color: T.textLight, fontSize: 16, flexShrink: 0 }}>›</div>
              </div>
            ))}
            {filtered.length === 0 && <div style={{ padding: "40px 0", textAlign: "center", color: T.textSub, fontSize: 13 }}>Không tìm thấy thảo luận phù hợp</div>}
          </div>
        </Card>
      </div>
    </div>
  );
}
