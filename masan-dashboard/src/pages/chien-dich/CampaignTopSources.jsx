import { useState } from "react";
import { T } from "../../constants/theme";
import { Pagination } from "../../components/common/Pagination";

const CHANNEL_FILTERS = ["Facebook", "Youtube", "TikTok", "Báo điện tử", "Forum", "Social Sites", "Threads"];

const COLS = "2fr 1fr 1fr 1fr 1fr";

export function CampaignTopSources({ sources }) {
  const [channel, setChannel] = useState("Youtube");
  const [page, setPage] = useState(1);

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", gap: 22, marginBottom: 18, overflowX: "auto" }}>
        {CHANNEL_FILTERS.map(c => (
          <div key={c} onClick={() => setChannel(c)}
            style={{ fontSize: 13, fontWeight: channel === c ? 800 : 600, color: channel === c ? T.navyDark : T.textLight, cursor: "pointer", whiteSpace: "nowrap" }}>
            {c}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, fontSize: 12, color: T.textSub, paddingBottom: 10, borderBottom: "1px solid " + T.border }}>
        <div>Name</div>
        <div>Bài đăng</div>
        <div>Interactions</div>
        <div>Số lượng tin</div>
        <div>Views</div>
      </div>

      {sources.map((s, i) => {
        const top = i === 0;
        const color = top ? T.textPrimary : T.textLight;
        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, alignItems: "center", padding: "14px 0", borderBottom: "1px solid " + T.border }}>
            <div style={{ fontSize: 13, fontWeight: top ? 800 : 600, color }}>{s.name}</div>
            <div>
              <a href={s.url || undefined} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontStyle: "italic", textDecoration: "underline", color: T.textLight }}>Link</a>
            </div>
            <div style={{ fontSize: 13, color }}>{s.interactions.toLocaleString()}</div>
            <div style={{ fontSize: 13, color }}>{s.posts}</div>
            <div style={{ fontSize: 13, color }}>{s.views}</div>
          </div>
        );
      })}

      <Pagination total={10} current={page} onChange={setPage} />
    </div>
  );
}
