import { T } from "../../constants/theme";

const COLS = "2fr 1fr 1.6fr 1fr";

const TIERS = [
  {
    title: "Tier 1 — Topic chiến lược",
    body: "Các nhãn ảnh hưởng trực tiếp đến hình ảnh thương hiệu & giá cổ phiếu: Cổ phiếu, chứng khoán, Doanh thu & Lợi nhuận, Ban lãnh đạo. Theo dõi liên tục, ưu tiên xử lý khủng hoảng trong 24h.",
  },
  {
    title: "Tier 2 — Topic vận hành",
    body: "Các nhãn liên quan trải nghiệm & vận hành: Chất lượng Sản phẩm, Hỗ trợ & Dịch vụ K.Hàng, Kênh Phân phối & Hậu cần, Trải nghiệm sử dụng, Tuyển dụng & Nhân sự. Theo dõi theo tuần, phản hồi trong 48-72h.",
  },
  {
    title: "Tier 3 — Topic thương hiệu & thị trường",
    body: "Các nhãn về định vị & truyền thông: Thương hiệu & Quảng cáo, Giá cả & Khuyến mãi, So sánh thương hiệu, Bao bì & Đóng gói, Hương vị, Nguồn gốc & Thành phần. Theo dõi theo chiến dịch, đo hiệu quả truyền thông.",
  },
];

const TIER_TAG = {
  1: { bg: "#FEE8E6", c: T.negative },
  2: { bg: "#EEF2F7", c: "#5D6D7E" },
  3: { bg: "#E8F8EE", c: T.positive },
};

const TOPIC_CHANNEL_MATRIX = [
  { group: "Thương hiệu & Quảng cáo", tier: 3, channels: "Facebook, Tiktok, Youtube", score: 91 },
  { group: "Cổ phiếu, chứng khoán", tier: 1, channels: "News, Forum, Social", score: 88 },
  { group: "Doanh thu & Lợi nhuận", tier: 1, channels: "News, Linkedin, Facebook", score: 84 },
  { group: "Ban lãnh đạo", tier: 1, channels: "News, Facebook, Youtube", score: 79 },
  { group: "Giá cả & Khuyến mãi", tier: 3, channels: "Facebook, E-commerce, Tiktok", score: 76 },
  { group: "Chất lượng Sản phẩm", tier: 2, channels: "Social, Forum, Facebook", score: 68 },
  { group: "Hỗ trợ & Dịch vụ K.Hàng", tier: 2, channels: "Facebook, Forum, Threads", score: 61 },
  { group: "Tuyển dụng & Nhân sự", tier: 2, channels: "Linkedin, Facebook, News", score: 58 },
];

export function BODPhanTangTopics() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
        {TIERS.map(t => (
          <div key={t.title} style={{ background: T.bg, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontWeight: 800, color: T.navyDark, fontSize: 14, marginBottom: 6 }}>{t.title}</div>
            <div style={{ fontSize: 12.5, color: T.textSub, lineHeight: 1.6 }}>{t.body}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 15, fontWeight: 800, color: T.navyDark, marginBottom: 14 }}>Phân tầng đánh giá hiệu quả: Topic × Kênh hiệu quả</div>
      <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, fontSize: 12, color: T.textSub, paddingBottom: 10, borderBottom: "1px solid " + T.border }}>
        <div>Nhóm Topic</div>
        <div>Tier</div>
        <div>Kênh hiệu quả nhất (Top 3)</div>
        <div>Điểm hiệu quả</div>
      </div>
      {TOPIC_CHANNEL_MATRIX.map((r, i) => {
        const top = i === 0;
        const color = top ? T.textPrimary : T.textLight;
        const tag = TIER_TAG[r.tier];
        return (
          <div key={r.group} style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, alignItems: "center", padding: "12px 0", borderBottom: "1px solid " + T.border }}>
            <div style={{ fontSize: 13, fontWeight: top ? 800 : 600, color }}>{r.group}</div>
            <div><span style={{ background: tag.bg, color: tag.c, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>Tier {r.tier}</span></div>
            <div style={{ fontSize: 13, color }}>{r.channels}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.navyDark }}>{r.score}</div>
          </div>
        );
      })}

      <div style={{ background: T.bg, borderRadius: 10, padding: "16px 18px", marginTop: 16, fontSize: 12.5, color: T.textSub, lineHeight: 1.6 }}>
        Ví dụ áp dụng: tin về Cổ phiếu, chứng khoán / Doanh thu & Lợi nhuận nên ưu tiên đăng tải qua News, Forum tài chính, LinkedIn — nơi NSR và độ tin cậy cao; trong khi tin Thương hiệu & Quảng cáo (brand campaign) hiệu quả nhất trên Facebook, TikTok, YouTube — nơi tốc độ lan tỏa & tương tác cao.
      </div>
    </div>
  );
}
