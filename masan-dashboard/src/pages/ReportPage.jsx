import { useMemo, useState } from "react";
import { T } from "../constants/theme";
import { META } from "../constants/meta";
import { Pagination } from "../components/common/Pagination";

const pad2 = n => String(n).padStart(2, "0");
const fmtSlash = d => `${pad2(d.getUTCDate())}/${pad2(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
const fmtDash = d => `${pad2(d.getUTCDate())}-${pad2(d.getUTCMonth() + 1)}-${d.getUTCFullYear()}`;
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);

const REF = new Date(Date.UTC(2026, 3, 30));
const PAGE_SIZE = 8;
const POST_TYPES = ["Tất cả", "Bài viết", "Video", "Story/Reels", "Livestream", "Bình luận"];

function buildReports() {
  const out = [];
  for (let i = 0; i < 60; i++) {
    const d = addDays(REF, -i);
    out.push({ type: `Báo cáo truyền thông ngày ${fmtSlash(d)}`, topic: "Masan Group", start: d, end: d });
  }
  for (let i = 0; i < 12; i++) {
    const end = addDays(REF, -i * 7);
    const start = addDays(end, -6);
    out.push({ type: `Báo cáo truyền thông tuần ${fmtSlash(start)} - ${fmtSlash(end)}`, topic: "Masan Group", start, end });
  }
  for (let m = 4; m >= 1; m--) {
    const start = new Date(Date.UTC(2026, m - 1, 1));
    const end = new Date(Date.UTC(2026, m, 0));
    out.push({ type: `Báo cáo truyền thông tháng ${pad2(m)}/2026`, topic: "Masan Group", start, end });
  }
  out.push({ type: "Báo cáo truyền thông Q1/2026", topic: "Masan Group", start: new Date(Date.UTC(2026, 0, 1)), end: new Date(Date.UTC(2026, 2, 31)) });
  out.push({ type: "Báo cáo truyền thông Q2/2026", topic: "Masan Group", start: new Date(Date.UTC(2026, 3, 1)), end: new Date(Date.UTC(2026, 5, 30)) });
  return out.map(r => ({ ...r, cover: `Từ ${fmtDash(r.start)} 00:00:00 đến ${fmtDash(r.end)} 23:59:59` }));
}

const REPORTS = buildReports();

export function ReportPage() {
  const [draft, setDraft] = useState({ dateFrom: "2026-03-23", dateTo: "2026-04-22", keyword: "" });
  const [applied, setApplied] = useState(null);
  const [channel, setChannel] = useState(-1);
  const [topic, setTopic] = useState(-1);
  const [label, setLabel] = useState(-1);
  const [sentiment, setSentiment] = useState(-1);
  const [postType, setPostType] = useState(0);
  const [page, setPage] = useState(1);

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const search = () => { setApplied({ ...draft }); setPage(1); };

  const rows = useMemo(() => {
    if (!applied) return REPORTS;
    const from = new Date(applied.dateFrom), to = new Date(applied.dateTo);
    const kw = applied.keyword.trim().toLowerCase();
    return REPORTS.filter(r => r.start <= to && r.end >= from && (!kw || r.type.toLowerCase().includes(kw)));
  }, [applied]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageRows = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const selSt = { padding: "5px 10px", border: "1px solid " + T.border, borderRadius: 7, fontSize: 12, background: "#fff", color: T.textPrimary, cursor: "pointer", height: 30, outline: "none" };
  const inSt = { padding: "4px 8px", border: "1px solid " + T.border, borderRadius: 7, fontSize: 12, background: "#EBF2FA", color: T.navy, fontWeight: 600, height: 30, outline: "none" };
  const gridCols = "40px minmax(0,2.2fr) minmax(0,1fr) minmax(0,2.2fr) 120px";

  return (
    <div style={{ flex: 1, overflow: "auto", background: T.bg, padding: "18px 20px" }}>
      {/* Filter bar */}
      <div style={{ background: T.white, border: "1px solid " + T.border, borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: T.textSub, fontWeight: 600 }}>Từ</span>
          <input type="date" value={draft.dateFrom} onChange={e => set("dateFrom", e.target.value)} style={inSt} />
          <span style={{ fontSize: 11, color: T.textSub, fontWeight: 600 }}>Đến</span>
          <input type="date" value={draft.dateTo} onChange={e => set("dateTo", e.target.value)} style={inSt} />
          <select value={channel} onChange={e => setChannel(+e.target.value)} style={selSt}>
            <option value={-1}>Kênh</option>
            {META.channels.map((c, i) => <option key={c} value={i}>{c}</option>)}
          </select>
          <select value={topic} onChange={e => setTopic(+e.target.value)} style={selSt}>
            <option value={-1}>Đối thủ</option>
            {META.topics.slice(1).map((t, i) => <option key={t} value={i + 1}>{t}</option>)}
          </select>
          <select value={label} onChange={e => setLabel(+e.target.value)} style={selSt}>
            <option value={-1}>Chủ đề</option>
            {META.labels.map((l, i) => <option key={l} value={i}>{l}</option>)}
          </select>
          <select value={sentiment} onChange={e => setSentiment(+e.target.value)} style={selSt}>
            <option value={-1}>Sentiment</option>
            {META.sentiments.map((s, i) => <option key={s} value={i}>{s}</option>)}
          </select>
          <button onClick={search} style={{ padding: "5px 18px", background: T.btnSearch, color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", height: 30 }}>Tìm kiếm</button>
          <button style={{ padding: "5px 18px", background: T.btnDownload, color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", height: 30 }}>Tải dữ liệu</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <select value={postType} onChange={e => setPostType(+e.target.value)} style={selSt}>
            {POST_TYPES.map((p, i) => <option key={p} value={i}>{i === 0 ? "Hình thức đăng tải" : p}</option>)}
          </select>
          <input type="text" placeholder="Từ khóa quan tâm..." value={draft.keyword} onChange={e => set("keyword", e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: "5px 12px", border: "1px solid " + T.border, borderRadius: 7, fontSize: 12, color: T.textPrimary, height: 30, outline: "none" }} />
        </div>
      </div>

      {/* Reports table */}
      <div style={{ background: T.white, border: "1px solid " + T.border, borderRadius: 12, padding: "16px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 12, padding: "0 4px 10px", borderBottom: "1px solid " + T.border, fontSize: 12, fontWeight: 700, color: T.textSub }}>
          <span /><span>Report type</span><span>Topic Name</span><span>Data cover</span><span />
        </div>
        {pageRows.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: gridCols, gap: 12, alignItems: "center", padding: "12px 4px", borderBottom: "1px solid " + T.border }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary }}>{(current - 1) * PAGE_SIZE + i + 1}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.type}</span>
            <span style={{ fontSize: 12, color: T.textSub, fontStyle: "italic" }}>{r.topic}</span>
            <span style={{ fontSize: 12, color: T.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.cover}</span>
            <button style={{ padding: "6px 14px", background: T.navy, color: "#fff", border: "none", borderRadius: 7, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, cursor: "pointer", justifySelf: "end" }}>TẢI XUỐNG</button>
          </div>
        ))}
        {pageRows.length === 0 && <div style={{ padding: "30px 0", textAlign: "center", color: T.textSub, fontSize: 13 }}>Không tìm thấy báo cáo phù hợp</div>}
        <Pagination total={totalPages} current={current} onChange={setPage} />
      </div>
    </div>
  );
}
