import { useState } from "react";
import { T } from "../../constants/theme";
import { Pagination } from "../../components/common/Pagination";

const CHANNEL_FILTERS = ["Báo điện tử", "Youtube", "TikTok", "Forum", "Trang tin tức", "Social Sites"];

const BAR_MAX = 3500;
const COLS = "1fr 60px 1fr 70px";

export function CampaignTopics({ topics }) {
  const [channel, setChannel] = useState(CHANNEL_FILTERS[0]);
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

      <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 16, alignItems: "center", paddingBottom: 10, borderBottom: "1px solid " + T.border }}>
        <div />
        <div style={{ gridColumn: "2 / 4", fontSize: 12, color: T.textSub }}>Số nội dung thu nhập</div>
        <div style={{ fontSize: 12, color: T.textSub, textAlign: "right" }}>% toàn bộ</div>
      </div>

      {topics.map((t, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: COLS, gap: 16, alignItems: "center", padding: "12px 0", borderBottom: "1px solid " + T.border }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>{t.name}</div>
          <div style={{ fontSize: 13, color: T.textPrimary }}>{t.count}</div>
          <div style={{ height: 8, borderRadius: 4, background: "#E3EDF7", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(100, (t.count / BAR_MAX) * 100)}%`, background: T.navyDark, borderRadius: 4 }} />
          </div>
          <div style={{ fontSize: 13, color: T.textSub, textAlign: "right" }}>{t.pct}%</div>
        </div>
      ))}

      <Pagination total={10} current={page} onChange={setPage} />
    </div>
  );
}
