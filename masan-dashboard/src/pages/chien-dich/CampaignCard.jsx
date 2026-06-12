import { useState } from "react";
import { T } from "../../constants/theme";
import { Card } from "../../components/common/Card";
import { Pagination } from "../../components/common/Pagination";
import { CampaignOverview } from "./CampaignOverview";
import { CampaignTrendline } from "./CampaignTrendline";
import { CampaignChannelRatio } from "./CampaignChannelRatio";
import { CampaignTopics } from "./CampaignTopics";
import { CampaignTopSources } from "./CampaignTopSources";

const CH_ICON_BG = { Facebook: "#1877F2", Tiktok: "#111", Youtube: "#FF0000", News: "#F39C12", Social: "#8E44AD", Forum: "#16A085", Threads: "#333" };
const CH_ICON_LABEL = { Facebook: "f", Youtube: "▶", Tiktok: "T", News: "N", Social: "S", Forum: "F", Threads: "@" };

const VIEWS = ["overview", "trendline", "channel-ratio", "topics", "top-sources"];
const TAB_LABELS = { trendline: "Trendline thảo luận", "channel-ratio": "Tỷ lệ thảo luận theo kênh", topics: "Chủ đề nổi bật", "top-sources": "Top nguồn đăng" };
const SUB_VIEWS = VIEWS.slice(1);

function NavBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid " + T.border, background: T.white, color: T.textSub, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {children}
    </button>
  );
}

function NewsItem({ a }) {
  return (
    <a href={a.url || undefined} target="_blank" rel="noopener noreferrer"
      style={{ display: "block", padding: "12px 0", borderBottom: "1px solid " + T.border, cursor: "pointer", textDecoration: "none", color: "inherit" }}
      onMouseEnter={e => e.currentTarget.querySelector(".ctitle").style.color = "#2563EB"}
      onMouseLeave={e => e.currentTarget.querySelector(".ctitle").style.color = T.navy}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
        <div style={{ width: 18, height: 18, borderRadius: 4, background: CH_ICON_BG[a.channel] || "#666", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", fontWeight: 700, flexShrink: 0 }}>
          {CH_ICON_LABEL[a.channel] || (a.channel || "?")[0]}
        </div>
        <span style={{ fontSize: 11, color: T.navy, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 130 }}>{a.site}</span>
        <span style={{ fontSize: 10, color: T.textLight, whiteSpace: "nowrap", flexShrink: 0 }}>{a.date?.slice(0, 10)}</span>
      </div>
      <div className="ctitle" style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 4, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", transition: "color .15s" }}>{a.title}</div>
      <div style={{ fontSize: 12, color: T.textSub, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.content}</div>
    </a>
  );
}

export function CampaignCard({ campaign }) {
  const [viewIdx, setViewIdx] = useState(0);
  const [page, setPage] = useState(1);
  const view = VIEWS[viewIdx];
  const goPrev = () => setViewIdx(i => (i - 1 + VIEWS.length) % VIEWS.length);
  const goNext = () => setViewIdx(i => (i + 1) % VIEWS.length);

  const perPage = 4;
  const totalPages = Math.max(1, Math.ceil(campaign.articles.length / perPage));
  const pageItems = campaign.articles.slice((page - 1) * perPage, page * perPage);

  return (
    <Card style={{ padding: "20px 24px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <NavBtn onClick={goPrev}>‹</NavBtn>
        {view === "overview" ? (
          <>
            <div style={{ fontSize: 15, fontWeight: 800, color: T.navyDark }}>{campaign.title}</div>
            <div style={{ marginLeft: "auto", fontSize: 12, color: T.textLight, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }} onClick={() => setViewIdx(1)}>Trendline thảo luận</div>
          </>
        ) : (
          <div style={{ display: "flex", gap: 22, flex: 1, overflowX: "auto" }}>
            {[0, 1, 2].map(offset => {
              const k = SUB_VIEWS[(viewIdx - 1 + offset) % SUB_VIEWS.length];
              return (
                <div key={k} onClick={() => setViewIdx(VIEWS.indexOf(k))}
                  style={{ fontSize: 14, fontWeight: view === k ? 800 : 600, color: view === k ? T.navyDark : T.textLight, cursor: "pointer", whiteSpace: "nowrap" }}>
                  {TAB_LABELS[k]}
                </div>
              );
            })}
          </div>
        )}
        <NavBtn onClick={goNext}>›</NavBtn>
      </div>

      {view === "overview" && <CampaignOverview campaign={campaign} />}
      {view === "trendline" && <CampaignTrendline stats={campaign.trendStats} data={campaign.trendData} />}
      {view === "channel-ratio" && <CampaignChannelRatio channelRatio={campaign.channelRatio} />}
      {view === "topics" && <CampaignTopics topics={campaign.topics} />}
      {view === "top-sources" && <CampaignTopSources sources={campaign.topSources} />}

      <div style={{ borderTop: "1px solid " + T.border, paddingTop: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: T.navyDark, marginBottom: 6 }}>Tin nổi bật</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          {pageItems.map((a, i) => <NewsItem key={i} a={a} />)}
        </div>
        <Pagination total={totalPages} current={page} onChange={setPage} />
      </div>
    </Card>
  );
}
