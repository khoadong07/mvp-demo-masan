import { T } from "../../constants/theme";
import { META } from "../../constants/meta";
import { useFC } from "../../context/FilterContext";

export function FilterBar() {
  const fc = useFC();
  if (!fc) return null;
  const { draft, setDraft, applyFilters, resetFilters } = fc;
  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const selSt = { padding: "5px 10px", border: "1px solid " + T.border, borderRadius: 7, fontSize: 12, background: "#fff", color: T.textPrimary, cursor: "pointer", height: 30, outline: "none" };
  const inSt = { padding: "4px 8px", border: "1px solid " + T.border, borderRadius: 7, fontSize: 12, background: "#EBF2FA", color: T.navy, fontWeight: 600, height: 30, outline: "none" };
  const hasFilter = fc.applied.channel >= 0 || fc.applied.topic >= 0 || fc.applied.label >= 0 || fc.applied.sentiment >= 0 || fc.applied.dateFrom !== "2026-01-01" || fc.applied.dateTo !== "2026-05-31";
  return (
    <div style={{ background: T.white, borderBottom: "1px solid " + T.border, padding: "8px 20px", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", flexShrink: 0 }}>
      <span style={{ fontSize: 11, color: T.textSub, fontWeight: 600 }}>Từ</span>
      <input type="date" value={draft.dateFrom} onChange={e => set("dateFrom", e.target.value)} style={inSt} />
      <span style={{ fontSize: 11, color: T.textSub, fontWeight: 600 }}>Đến</span>
      <input type="date" value={draft.dateTo} onChange={e => set("dateTo", e.target.value)} style={inSt} />
      <select value={draft.channel} onChange={e => set("channel", +e.target.value)} style={selSt}>
        <option value={-1}>Tất cả kênh</option>
        {META.channels.map((c, i) => <option key={c} value={i}>{c}</option>)}
      </select>
      <select value={draft.topic} onChange={e => set("topic", +e.target.value)} style={selSt}>
        <option value={-1}>Tất cả đối thủ</option>
        {META.topics.slice(1).map((t, i) => <option key={t} value={i + 1}>{t}</option>)}
      </select>
      <select value={draft.label} onChange={e => set("label", +e.target.value)} style={selSt}>
        <option value={-1}>Tất cả chủ đề</option>
        {META.labels.map((l, i) => <option key={l} value={i}>{l}</option>)}
      </select>
      <select value={draft.sentiment} onChange={e => set("sentiment", +e.target.value)} style={selSt}>
        <option value={-1}>Tất cả sentiment</option>
        {META.sentiments.map((s, i) => <option key={s} value={i}>{s}</option>)}
      </select>
      <button onClick={applyFilters} style={{ padding: "5px 18px", background: T.btnSearch, color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer", height: 30 }}>Tìm kiếm</button>
      {hasFilter && <button onClick={resetFilters} style={{ padding: "5px 12px", background: "transparent", color: T.textSub, border: "1px solid " + T.border, borderRadius: 7, fontSize: 12, cursor: "pointer", height: 30 }}>✕ Reset</button>}
      {hasFilter && <span style={{ fontSize: 11, color: T.positive, fontWeight: 600, background: "#F0FDF4", padding: "3px 8px", borderRadius: 5 }}>● Đang lọc: {fc.agg.summary.total.toLocaleString()} bài</span>}
    </div>
  );
}
