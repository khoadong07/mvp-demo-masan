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
import COMP from "../../data/comp.json";
import RAW from "../../data/raw.json";
import ARTICLES_POOL from "../../data/articlesPool.json";

const HIGHLIGHT_LIMIT = 120;
const PAGE_SIZE = 6;
const NSR_PAGE_SIZE = 6;

// Brand-specific articles shown in right panel when NSR tab is active
const NSR_BRAND_ARTICLES = [
  {
    brand: "Masan Group",
    items: [
      { title: "MSN tăng 3.2% sau khi ĐHCĐ phê duyệt kế hoạch mua lại cổ phiếu quỹ", site: "cafebiz.vn", channel: "News", date: "13/06/2026", sentiment: "Positive" },
      { title: "Omachi ra mắt dòng mì cao cấp 'Omachi Premium' — giá 32.000đ/gói", site: "tiktok.com", channel: "Tiktok", date: "12/06/2026", sentiment: "Positive" },
      { title: "WinMart vẫn chưa lãi: lỗ lũy kế vượt 14.500 tỷ đồng", site: "vnexpress.net", channel: "News", date: "11/06/2026", sentiment: "Negative" },
      { title: "CEO Danny Le: 'Masan sẽ lọt top 5 thương hiệu FMCG châu Á vào 2030'", site: "linkedin.com", channel: "Social", date: "10/06/2026", sentiment: "Positive" },
      { title: "Chin-su bị khiếu nại về hàm lượng muối — Masan cam kết điều chỉnh công thức", site: "facebook.com", channel: "Facebook", date: "09/06/2026", sentiment: "Neutral" },
    ],
  },
  {
    brand: "Vinamilk",
    items: [
      { title: "Vinamilk xuất khẩu 250 triệu USD — tăng trưởng 25% so với cùng kỳ năm ngoái", site: "vnexpress.net", channel: "News", date: "13/06/2026", sentiment: "Positive" },
      { title: "Cổ phiếu VNM đạt đỉnh 3 năm — P/E hấp dẫn nhất trong nhóm FMCG niêm yết", site: "cafef.vn", channel: "News", date: "12/06/2026", sentiment: "Positive" },
      { title: "Vinamilk Organic Green Farm: sữa tươi 100% hữu cơ chuẩn EU ra mắt thị trường", site: "facebook.com", channel: "Facebook", date: "11/06/2026", sentiment: "Positive" },
      { title: "Người tiêu dùng bình chọn Vinamilk là thương hiệu sữa yêu thích nhất Việt Nam 2026", site: "votop.vn", channel: "Social", date: "10/06/2026", sentiment: "Positive" },
    ],
  },
  {
    brand: "Vingroup",
    items: [
      { title: "Vingroup báo lãi Q1/2026 tăng 42% — VinHomes và Vinhomes Ocean Park dẫn dắt tăng trưởng", site: "vnexpress.net", channel: "News", date: "13/06/2026", sentiment: "Positive" },
      { title: "VinFast giao 18.000 xe trong tháng 5 — tăng 165% so với cùng kỳ năm trước", site: "baomoi.com", channel: "News", date: "12/06/2026", sentiment: "Positive" },
      { title: "VIC được nâng hạng tín nhiệm lên BB+ — khối ngoại mua ròng 780 tỷ đồng", site: "cafef.vn", channel: "News", date: "11/06/2026", sentiment: "Positive" },
      { title: "Vinpearl mở rộng 8 resort mới tại Việt Nam và Singapore trong năm 2026", site: "facebook.com", channel: "Facebook", date: "10/06/2026", sentiment: "Positive" },
    ],
  },
  {
    brand: "Hòa Phát",
    items: [
      { title: "Lợi nhuận Hòa Phát Q1/2026 giảm 38% — thép nhập khẩu từ Trung Quốc gây áp lực lớn", site: "vnexpress.net", channel: "News", date: "13/06/2026", sentiment: "Negative" },
      { title: "HPG giảm 15% từ đỉnh tháng 3 — quỹ ngoại cắt giảm tỷ trọng đáng kể", site: "cafef.vn", channel: "News", date: "12/06/2026", sentiment: "Negative" },
      { title: "Công ty con Hòa Phát bị phạt 2.4 tỷ đồng vì ô nhiễm môi trường tại Đình Vũ", site: "tuoitre.vn", channel: "News", date: "11/06/2026", sentiment: "Negative" },
      { title: "Ngành thép 2026: áp lực từ Trung Quốc khiến doanh nghiệp nội địa co cụm đầu tư", site: "forum.vn", channel: "Forum", date: "10/06/2026", sentiment: "Negative" },
    ],
  },
  {
    brand: "MWG Thế Giới Di Động",
    items: [
      { title: "Thế Giới Di Động tăng trưởng 18% tại chuỗi Điện Máy Xanh — phục hồi rõ rệt", site: "vnexpress.net", channel: "News", date: "13/06/2026", sentiment: "Positive" },
      { title: "MWG mở 150 điểm Bách Hóa Xanh trong Q2 — chiến lược thâm nhập thị trường nông thôn", site: "cafebiz.vn", channel: "News", date: "12/06/2026", sentiment: "Positive" },
      { title: "Nhà đầu tư lo ngại áp lực từ Shopee Mall và Lazada lên mảng online của MWG", site: "social.vn", channel: "Social", date: "11/06/2026", sentiment: "Negative" },
      { title: "CEO MWG: 'Chúng tôi không cạnh tranh với Shopee, chúng tôi bổ sung cho nhau'", site: "facebook.com", channel: "Facebook", date: "10/06/2026", sentiment: "Positive" },
    ],
  },
];

const BRAND_COLORS = Object.fromEntries(COMP.comp_summary.map(b => [b.name, b.color]));

export function TongQuanPage() {
  const [tab, setTab] = useState("xu-huong");
  const [page, setPage] = useState(1);
  // NSR brand visibility — lifted here so the right panel can react
  const [nsrHidden, setNsrHidden] = useState(new Set());
  const [nsrPage, setNsrPage] = useState(1);
  const fc = useFC();

  const handleNsrToggle = (name) => {
    setNsrHidden(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
    setNsrPage(1);
  };

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

  // NSR brand articles filtered by visible brands
  const nsrArticles = useMemo(() =>
    NSR_BRAND_ARTICLES
      .filter(ba => !nsrHidden.has(ba.brand))
      .flatMap(ba => ba.items.map(item => ({ ...item, brand: ba.brand, brandColor: BRAND_COLORS[ba.brand] ?? "#999" }))),
    [nsrHidden]
  );
  const nsrTotalPages = Math.max(1, Math.ceil(nsrArticles.length / NSR_PAGE_SIZE));
  const nsrCurrent = Math.min(nsrPage, nsrTotalPages);
  const nsrPageItems = nsrArticles.slice((nsrCurrent - 1) * NSR_PAGE_SIZE, nsrCurrent * NSR_PAGE_SIZE);

  const tabs = [
    { k: "xu-huong", l: "Xu hướng thảo luận" },
    { k: "nsr",      l: "Net Sentiment Rate" },
    { k: "sov",      l: "Search of Volume (SoV)" },
    { k: "kenh",     l: "Kênh thảo luận" },
    ...MAIN_CHANNELS.map(c => ({ k: "ch-" + c.toLowerCase(), l: c })),
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <FilterBar />
      <div style={{ flex: 1, overflow: "auto", background: T.bg, padding: "18px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 16, minHeight: "100%" }}>

          {/* Left: chart panel */}
          <Card style={{ padding: "20px 22px", display: "flex", flexDirection: "column" }}>
            <TabBar tabs={tabs} active={tab} onSelect={setTab} />
            {tab === "xu-huong" && <XuHuongChart />}
            {tab === "nsr"      && <NSRChart hiddenKeys={nsrHidden} onToggle={handleNsrToggle} />}
            {tab === "sov"      && <SoVChart />}
            {tab === "kenh"     && <KenhMiniChart />}
            {MAIN_CHANNELS.map(c => tab === "ch-" + c.toLowerCase() && <KenhDetailTab key={c} channel={c} />)}
          </Card>

          {/* Right: Tin nổi bật — brand articles when NSR tab active, general otherwise */}
          <Card style={{ padding: "18px 20px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexShrink: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.navyDark }}>Tin nổi bật</div>
              {tab === "nsr" && (
                <div style={{ fontSize: 11, color: T.textLight }}>
                  {nsrHidden.size > 0
                    ? `${COMP.comp_summary.length - nsrHidden.size}/${COMP.comp_summary.length} thương hiệu`
                    : "Tất cả thương hiệu"}
                  {" · "}{nsrArticles.length} bài
                </div>
              )}
            </div>

            {tab === "nsr" ? (
              nsrArticles.length === 0 ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                  color: T.textLight, fontSize: 13 }}>
                  Bật thương hiệu ở biểu đồ để xem tin
                </div>
              ) : (
                <>
                  <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                    {nsrPageItems.map((a, i) => (
                      <div key={i} style={{ background: T.bg, borderRadius: 10, padding: "11px 14px", borderLeft: "3px solid " + a.brandColor }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: a.brandColor, flexShrink: 0 }} />
                          <span style={{ fontSize: 10, fontWeight: 700, color: a.brandColor }}>{a.brand}</span>
                          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, borderRadius: 4, padding: "1px 6px", flexShrink: 0,
                            color:      a.sentiment === "Positive" ? T.positive : a.sentiment === "Negative" ? T.negative : "#8E9DBB",
                            background: a.sentiment === "Positive" ? "#E8F8EE"  : a.sentiment === "Negative" ? "#FEE8E6"  : "#EEF2F7" }}>
                            {a.sentiment === "Positive" ? "Tích cực" : a.sentiment === "Negative" ? "Tiêu cực" : "Trung lập"}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary, lineHeight: 1.45, marginBottom: 6 }}>
                          {a.title}
                        </div>
                        <div style={{ display: "flex", gap: 8, fontSize: 11, color: T.textLight }}>
                          <span>{a.site}</span><span>·</span>
                          <span>{a.channel}</span><span>·</span>
                          <span>{a.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Pagination total={nsrTotalPages} current={nsrCurrent} onChange={setNsrPage} />
                </>
              )
            ) : (
              <>
                <ArticleGrid articles={pageItems} />
                <Pagination total={totalPages} current={current} onChange={setPage} />
              </>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
}
