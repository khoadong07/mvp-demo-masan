import { useState, useMemo } from "react";
import { T } from "../../constants/theme";
import { Pagination } from "../../components/common/Pagination";
import { RangeToggle, BODHeaderNav } from "./BODRangeNav";
import { BODFeaturedNews } from "./BODFeaturedNews";
import { filterBodArticles } from "./bodData";
import { useFC } from "../../context/FilterContext";
import { varyFactor } from "./useBodData";

const CHANNEL_FILTERS = ["Facebook", "Youtube", "TikTok", "Báo điện tử", "Forum", "Social Sites", "Threads"];
const CHANNEL_MAP = {
  "Facebook": "Facebook", "Youtube": "Youtube", "TikTok": "Tiktok",
  "Báo điện tử": "News", "Forum": "Forum", "Social Sites": "Social", "Threads": "Threads",
};

const COLS = "2fr 1fr 1fr 1fr 1fr";

const TOP_SOURCES = [
  { name: "Tiếng Dân News", interactions: 48271, posts: 2572, views: 19482637, url: "" },
  { name: "thoibao.de", interactions: 35684, posts: 1609, views: 12857391, url: "" },
  { name: "Chứng khoán lướt sóng thần", interactions: 71953, posts: 1033, views: 15374928, url: "" },
  { name: "CỘNG ĐỒNG ĐẦU TƯ CHỨNG KHOÁN VIỆT", interactions: 24718, posts: 554, views: 8764521, url: "" },
  { name: "F189: DIỄN ĐÀN CHỨNG KHOÁN,TIỀN SỐ,TÀI SẢN MÃ HÓA-Vietnam Investment Forum", interactions: 63842, posts: 540, views: 10492876, url: "" },
];

export function BODTopSources({ setTab }) {
  const [range, setRange] = useState("24h");
  const [channel, setChannel] = useState("Facebook");
  const [page, setPage] = useState(1);
  const fc = useFC();
  const seed = fc?.randomSeed ?? 0;

  const articles = useMemo(
    () => filterBodArticles(fc?.applied, { channel: CHANNEL_MAP[channel] }),
    [fc?.applied, channel]
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div>
        <RangeToggle range={range} setRange={setRange} />
        <BODHeaderNav active="top-nguon" setTab={setTab} />

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

        {TOP_SOURCES.map((s, i) => {
          const top = i === 0;
          const color = top ? T.textPrimary : T.textLight;
          const interactions = Math.round(s.interactions * varyFactor(seed, 300 + i * 3));
          const posts = Math.max(1, Math.round(s.posts * varyFactor(seed, 300 + i * 3 + 1)));
          const views = Math.round(s.views * varyFactor(seed, 300 + i * 3 + 2));
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, alignItems: "center", padding: "14px 0", borderBottom: "1px solid " + T.border }}>
              <div style={{ fontSize: 13, fontWeight: top ? 800 : 600, color }}>{s.name}</div>
              <div>
                <a href={s.url || undefined} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontStyle: "italic", textDecoration: "underline", color: T.textLight }}>Link</a>
              </div>
              <div style={{ fontSize: 13, color }}>{interactions.toLocaleString()}</div>
              <div style={{ fontSize: 13, color }}>{posts}</div>
              <div style={{ fontSize: 13, color }}>{views.toLocaleString()}</div>
            </div>
          );
        })}

        <Pagination total={10} current={page} onChange={setPage} />
      </div>
      <BODFeaturedNews articles={articles} title={`Tin nổi bật: ${channel}`} />
    </div>
  );
}
