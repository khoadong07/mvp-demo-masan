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
      { title: "MSN tăng 3.2% sau khi ĐHCĐ phê duyệt kế hoạch mua lại cổ phiếu quỹ", content: "Hội đồng cổ đông thường niên Masan Group vừa thông qua kế hoạch mua lại 50 triệu cổ phiếu quỹ, tương đương 3.5% vốn lưu hành. Cổ phiếu MSN ngay lập tức tăng 3.2% sau thông báo, đạt mức 98.400 đồng/cổ phiếu.", site: "cafebiz.vn", channel: "News", date: "13/06/2026", sentiment: "Positive" },
      { title: "Omachi ra mắt dòng mì cao cấp 'Omachi Premium' — giá 32.000đ/gói", content: "Masan Consumer chính thức tung dòng sản phẩm Omachi Premium với bao bì cao cấp, sợi mì làm từ lúa mì Nhật Bản và gói nước dùng đặc chế. Đây là bước đi nhằm khai thác phân khúc premium đang tăng trưởng mạnh tại các đô thị lớn.", site: "tiktok.com", channel: "Tiktok", date: "12/06/2026", sentiment: "Positive" },
      { title: "WinMart vẫn chưa lãi: lỗ lũy kế vượt 14.500 tỷ đồng", content: "Mảng bán lẻ WinCommerce tiếp tục ghi nhận khoản lỗ lũy kế vượt 14.500 tỷ đồng tính đến hết quý 1/2026. Ban lãnh đạo Masan khẳng định đang theo đúng lộ trình và kỳ vọng WinMart đạt điểm hòa vốn vào cuối năm 2026.", site: "vnexpress.net", channel: "News", date: "11/06/2026", sentiment: "Negative" },
      { title: "CEO Danny Le: 'Masan sẽ lọt top 5 thương hiệu FMCG châu Á vào 2030'", content: "Trong bài đăng trên LinkedIn, CEO Danny Le chia sẻ tầm nhìn đưa Masan trở thành một trong năm tập đoàn FMCG hàng đầu châu Á vào năm 2030 nhờ chiến lược Point of Life — kết nối tiêu dùng thiết yếu, tài chính và dịch vụ số trên một nền tảng.", site: "linkedin.com", channel: "Social", date: "10/06/2026", sentiment: "Positive" },
      { title: "Chin-su bị khiếu nại về hàm lượng muối — Masan cam kết điều chỉnh công thức", content: "Một số hội nhóm sức khỏe trên Facebook phản ánh hàm lượng natri trong tương ớt Chin-su vượt khuyến nghị của WHO. Đại diện Masan Consumer cho biết đang nghiên cứu điều chỉnh công thức giảm muối mà không ảnh hưởng đến hương vị đặc trưng.", site: "facebook.com", channel: "Facebook", date: "09/06/2026", sentiment: "Neutral" },
    ],
  },
  {
    brand: "Vinamilk",
    items: [
      { title: "Vinamilk xuất khẩu 250 triệu USD — tăng trưởng 25% so với cùng kỳ năm ngoái", content: "Vinamilk công bố doanh thu xuất khẩu 5 tháng đầu năm 2026 đạt 250 triệu USD, tăng 25% so với cùng kỳ năm ngoái. Thị trường Trung Đông và châu Phi tiếp tục là động lực tăng trưởng chính nhờ sản phẩm sữa đặc và sữa bột.", site: "vnexpress.net", channel: "News", date: "13/06/2026", sentiment: "Positive" },
      { title: "Cổ phiếu VNM đạt đỉnh 3 năm — P/E hấp dẫn nhất trong nhóm FMCG niêm yết", content: "VNM chạm ngưỡng 98.000 đồng trong phiên sáng, mức cao nhất kể từ tháng 6/2023. Với P/E forward khoảng 18 lần, cổ phiếu Vinamilk đang được nhiều quỹ ngoại đánh giá hấp dẫn hơn so với nhóm FMCG khu vực.", site: "cafef.vn", channel: "News", date: "12/06/2026", sentiment: "Positive" },
      { title: "Vinamilk Organic Green Farm: sữa tươi 100% hữu cơ chuẩn EU ra mắt thị trường", content: "Dòng sữa tươi hữu cơ mới của Vinamilk được sản xuất từ trang trại đạt chứng nhận hữu cơ châu Âu tại Lâm Đồng, không kháng sinh, không hormone tăng trưởng. Sản phẩm nhắm đến phân khúc gia đình trẻ và người tiêu dùng có ý thức về sức khỏe.", site: "facebook.com", channel: "Facebook", date: "11/06/2026", sentiment: "Positive" },
      { title: "Người tiêu dùng bình chọn Vinamilk là thương hiệu sữa yêu thích nhất Việt Nam 2026", content: "Theo khảo sát thường niên của VoTop với hơn 50.000 người tham gia, Vinamilk tiếp tục dẫn đầu danh mục thương hiệu sữa được yêu thích nhất, năm thứ tám liên tiếp. Điểm nhận diện thương hiệu đạt 94%, cao nhất toàn ngành.", site: "votop.vn", channel: "Social", date: "10/06/2026", sentiment: "Positive" },
    ],
  },
  {
    brand: "Vingroup",
    items: [
      { title: "Vingroup báo lãi Q1/2026 tăng 42% — VinHomes và Vinhomes Ocean Park dẫn dắt tăng trưởng", content: "Tập đoàn Vingroup ghi nhận lợi nhuận sau thuế quý 1/2026 tăng 42% so với cùng kỳ, đạt 4.200 tỷ đồng. Mảng bất động sản VinHomes đóng góp 68% tổng doanh thu, trong đó Vinhomes Ocean Park 2 và 3 ghi nhận tốc độ bán hàng vượt kế hoạch.", site: "vnexpress.net", channel: "News", date: "13/06/2026", sentiment: "Positive" },
      { title: "VinFast giao 18.000 xe trong tháng 5 — tăng 165% so với cùng kỳ năm trước", content: "VinFast công bố sản lượng giao xe tháng 5/2026 đạt 18.000 chiếc, tăng 165% so với tháng 5/2025. Mô hình VF 3 và VF 5 dẫn dắt doanh số tại thị trường trong nước; thị trường Mỹ đóng góp thêm 2.400 xe trong tháng.", site: "baomoi.com", channel: "News", date: "12/06/2026", sentiment: "Positive" },
      { title: "VIC được nâng hạng tín nhiệm lên BB+ — khối ngoại mua ròng 780 tỷ đồng", content: "Fitch Ratings nâng hạng tín nhiệm dài hạn của Vingroup từ BB lên BB+, với triển vọng ổn định, nhờ cải thiện dòng tiền từ mảng bất động sản và giảm nợ vay. Khối ngoại mua ròng 780 tỷ đồng cổ phiếu VIC ngay sau thông tin được công bố.", site: "cafef.vn", channel: "News", date: "11/06/2026", sentiment: "Positive" },
      { title: "Vinpearl mở rộng 8 resort mới tại Việt Nam và Singapore trong năm 2026", content: "Vinpearl công bố kế hoạch khai trương 8 resort mới trong năm 2026, gồm 6 tại các tỉnh ven biển Việt Nam và 2 tại Singapore theo mô hình hợp tác quản lý. Tổng công suất phòng tăng thêm 4.200 phòng, nâng hệ thống lên 30 khách sạn toàn cầu.", site: "facebook.com", channel: "Facebook", date: "10/06/2026", sentiment: "Positive" },
    ],
  },
  {
    brand: "Hòa Phát",
    items: [
      { title: "Lợi nhuận Hòa Phát Q1/2026 giảm 38% — thép nhập khẩu từ Trung Quốc gây áp lực lớn", content: "Tập đoàn Hòa Phát báo lợi nhuận sau thuế quý 1/2026 giảm 38% xuống còn 1.850 tỷ đồng. Thép cuộn cán nóng nhập khẩu từ Trung Quốc với giá thấp hơn 15–20% tiếp tục gây sức ép lớn lên biên lợi nhuận của doanh nghiệp nội địa.", site: "vnexpress.net", channel: "News", date: "13/06/2026", sentiment: "Negative" },
      { title: "HPG giảm 15% từ đỉnh tháng 3 — quỹ ngoại cắt giảm tỷ trọng đáng kể", content: "Cổ phiếu HPG mất 15% giá trị kể từ đỉnh tháng 3/2026 trong bối cảnh triển vọng ngành thép xấu đi. Dragon Capital và một số quỹ ngoại đã giảm tỷ trọng, trong khi khối nội tiếp tục mua vào với kỳ vọng phục hồi trong nửa cuối năm.", site: "cafef.vn", channel: "News", date: "12/06/2026", sentiment: "Negative" },
      { title: "Công ty con Hòa Phát bị phạt 2.4 tỷ đồng vì ô nhiễm môi trường tại Đình Vũ", content: "Sở Tài nguyên và Môi trường Hải Phòng ra quyết định xử phạt 2.4 tỷ đồng đối với Hòa Phát Hải Phòng do vi phạm quy chuẩn xả thải khí và nước tại khu công nghiệp Đình Vũ. Đây là lần thứ hai trong hai năm công ty bị xử phạt vì lỗi tương tự.", site: "tuoitre.vn", channel: "News", date: "11/06/2026", sentiment: "Negative" },
      { title: "Ngành thép 2026: áp lực từ Trung Quốc khiến doanh nghiệp nội địa co cụm đầu tư", content: "Báo cáo ngành thép tháng 6 cho thấy hầu hết doanh nghiệp nội địa đang hoãn hoặc giảm quy mô đầu tư mới. Hòa Phát, Pomina và Thép Thủ Đức đều xác nhận điều chỉnh kế hoạch sản xuất xuống 10–20% so với đầu năm để bảo vệ dòng tiền.", site: "forum.vn", channel: "Forum", date: "10/06/2026", sentiment: "Negative" },
    ],
  },
  {
    brand: "MWG Thế Giới Di Động",
    items: [
      { title: "Thế Giới Di Động tăng trưởng 18% tại chuỗi Điện Máy Xanh — phục hồi rõ rệt", content: "Chuỗi Điện Máy Xanh ghi nhận doanh thu tháng 5/2026 tăng 18% so với cùng kỳ, nhờ nhu cầu mua sắm điện tử và điện lạnh phục hồi mạnh theo chu kỳ mùa hè. Ban lãnh đạo MWG kỳ vọng chuỗi này sẽ vượt kế hoạch cả năm vào cuối quý 3.", site: "vnexpress.net", channel: "News", date: "13/06/2026", sentiment: "Positive" },
      { title: "MWG mở 150 điểm Bách Hóa Xanh trong Q2 — chiến lược thâm nhập thị trường nông thôn", content: "Thế Giới Di Động đẩy mạnh mở rộng Bách Hóa Xanh với mục tiêu 150 điểm mới trong quý 2/2026, tập trung vào các tỉnh miền Tây và Tây Nguyên. Mô hình cửa hàng mini 80–120m² được điều chỉnh cho phù hợp sức mua và thói quen người tiêu dùng nông thôn.", site: "cafebiz.vn", channel: "News", date: "12/06/2026", sentiment: "Positive" },
      { title: "Nhà đầu tư lo ngại áp lực từ Shopee Mall và Lazada lên mảng online của MWG", content: "Một số nhà phân tích và nhà đầu tư bày tỏ lo ngại về khả năng cạnh tranh của MWG trên kênh thương mại điện tử khi Shopee Mall và Lazada đang đẩy mạnh trợ giá tại danh mục điện tử tiêu dùng, phân khúc vốn là thế mạnh của chuỗi Thế Giới Di Động.", site: "social.vn", channel: "Social", date: "11/06/2026", sentiment: "Negative" },
      { title: "CEO MWG: 'Chúng tôi không cạnh tranh với Shopee, chúng tôi bổ sung cho nhau'", content: "Phát biểu tại hội nghị nhà đầu tư quý 2, CEO MWG khẳng định chiến lược omnichannel cho phép công ty tận dụng sức mạnh của cả kênh online lẫn offline. Ông cho rằng dịch vụ hậu mãi, bảo hành và trải nghiệm mua sắm trực tiếp vẫn là lợi thế khó thay thế.", site: "facebook.com", channel: "Facebook", date: "10/06/2026", sentiment: "Positive" },
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
                  <ArticleGrid articles={nsrPageItems} />
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
