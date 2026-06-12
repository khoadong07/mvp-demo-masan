import { useState, useMemo, useEffect } from "react";
import { T } from "../../constants/theme";
import { META, MAIN_CHANNELS } from "../../constants/meta";
import { Card } from "../../components/common/Card";
import { TabBar } from "../../components/common/TabBar";
import { ArticleGrid } from "../../components/common/ArticleGrid";
import { Pagination } from "../../components/common/Pagination";
import { FilterBar } from "../../components/layout/FilterBar";
import { SoVChart } from "../../components/charts/SoVChart";
import { useFC } from "../../context/FilterContext";
import { shuffle } from "../../utils/aggregation";
import { XuHuongChart } from "./XuHuongChart";
import { NSRChart } from "./NSRChart";
import { KenhMiniChart } from "./KenhMiniChart";
import { KenhDetailTab } from "./KenhDetailTab";
import RAW from "../../data/raw.json";
import ARTICLES_POOL from "../../data/articlesPool.json";

const HIGHLIGHT_LIMIT = 120;
const PAGE_SIZE = 6;

export function TongQuanPage() {
  const [tab, setTab] = useState("xu-huong");
  const [page, setPage] = useState(1);
  const fc = useFC();
  const highlighted = useMemo(() => {
    if (!fc) return RAW.articles;
    const { applied, peak } = fc;
    const matches = a => {
      if (applied.channel >= 0 && a.channel !== META.channels[applied.channel]) return false;
      if (applied.sentiment >= 0 && a.sentiment !== META.sentiments[applied.sentiment]) return false;
      if (applied.label >= 0 && a.label !== META.labels[applied.label]) return false;
      return true;
    };
    const pool = ARTICLES_POOL.filter(matches);
    if (!pool.length) return shuffle(ARTICLES_POOL).slice(0, HIGHLIGHT_LIMIT);
    const dayPool = pool.filter(a => a.day === peak);
    const rest = pool.filter(a => a.day !== peak);
    return [...shuffle(dayPool), ...shuffle(rest)].slice(0, HIGHLIGHT_LIMIT);
  }, [fc && fc.applied, fc && fc.peak]);
  useEffect(() => setPage(1), [highlighted]);
  const totalPages = Math.max(1, Math.ceil(highlighted.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = highlighted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const tabs = [{ k: "xu-huong", l: "Xu hướng thảo luận" }, { k: "nsr", l: "Net Sentiment Rate" }, { k: "sov", l: "Search of Volume (SoV)" }, { k: "kenh", l: "Kênh thảo luận" }, ...MAIN_CHANNELS.map(c => ({ k: "ch-" + c.toLowerCase(), l: c }))];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <FilterBar />
      <div style={{ flex: 1, overflow: "auto", background: T.bg, padding: "18px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16, minHeight: "100%" }}>
          {/* Left chart panel */}
          <Card style={{ padding: "20px 22px", display: "flex", flexDirection: "column" }}>
            <TabBar tabs={tabs} active={tab} onSelect={setTab} />
            {tab === "xu-huong" && <XuHuongChart />}
            {tab === "nsr" && <NSRChart />}
            {tab === "sov" && <SoVChart />}
            {tab === "kenh" && <KenhMiniChart />}
            {MAIN_CHANNELS.map(c => tab === "ch-" + c.toLowerCase() && <KenhDetailTab key={c} channel={c} />)}
          </Card>
          {/* Right: Tin nổi bật */}
          <Card style={{ padding: "18px 20px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.navyDark, marginBottom: 14, flexShrink: 0 }}>Tin nổi bật</div>
            <ArticleGrid articles={pageItems} />
            <Pagination total={totalPages} current={current} onChange={setPage} />
          </Card>
        </div>
      </div>
    </div>
  );
}
