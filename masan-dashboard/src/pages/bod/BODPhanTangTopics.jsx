import { T } from "../../constants/theme";

const COLS = "1.8fr 1fr 1.5fr 1fr 1fr";

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

// winScore and nsrVal match the Cambridge Analytica tab for cross-reference
const TOPIC_CHANNEL_MATRIX = [
  { group: "Thương hiệu & Quảng cáo",  tier: 3, channels: "Facebook, Tiktok, Youtube",      effScore: 91, winScore: 87, nsrVal:  60 },
  { group: "Cổ phiếu, chứng khoán",    tier: 1, channels: "News, Forum, Social",             effScore: 88, winScore: 80, nsrVal:  45 },
  { group: "Doanh thu & Lợi nhuận",    tier: 1, channels: "News, Linkedin, Facebook",        effScore: 84, winScore: 72, nsrVal:  44 },
  { group: "Ban lãnh đạo",             tier: 1, channels: "News, Facebook, Youtube",         effScore: 79, winScore: 42, nsrVal:  25 },
  { group: "Giá cả & Khuyến mãi",      tier: 3, channels: "Facebook, E-commerce, Tiktok",   effScore: 76, winScore: 68, nsrVal:  30 },
  { group: "Chất lượng Sản phẩm",      tier: 2, channels: "Social, Forum, Facebook",        effScore: 68, winScore: 38, nsrVal:  12 },
  { group: "Hỗ trợ & Dịch vụ K.Hàng",  tier: 2, channels: "Facebook, Forum, Threads",       effScore: 61, winScore: 28, nsrVal:  -8 },
  { group: "Tuyển dụng & Nhân sự",     tier: 2, channels: "Linkedin, Facebook, News",       effScore: 58, winScore: 18, nsrVal:  -1 },
];

function WinBar({ score }) {
  const color = score >= 60 ? T.positive : score >= 40 ? "#E67E22" : T.negative;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ flex: 1, height: 6, background: "#EAF0F8", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: score + "%", height: "100%", background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 24, textAlign: "right" }}>{score}</span>
    </div>
  );
}

function NsrTrend({ val }) {
  const pos = val > 0;
  const zero = val === 0;
  const color = zero ? T.textLight : pos ? T.positive : T.negative;
  const arrow = zero ? "→" : pos ? "↑" : "↓";
  return (
    <span style={{ fontSize: 12, fontWeight: 700, color }}>
      {arrow} {pos ? "+" : ""}{val}%
    </span>
  );
}

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

      {/* ── Scoring methodology ── */}
      <div style={{ background: T.bg, borderRadius: 10, padding: "18px 20px", marginBottom: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: T.navyDark, marginBottom: 14 }}>Cách tính điểm</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
          {/* Winning Score formula */}
          <div style={{ background: T.white, borderRadius: 8, padding: "14px 16px", border: "1px solid " + T.border }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.navyDark, marginBottom: 8 }}>Winning Score (WS)</div>
            <div style={{ fontFamily: "monospace", fontSize: 12.5, color: T.navy, background: "#F0F4FA", borderRadius: 6, padding: "8px 12px", marginBottom: 10, lineHeight: 1.7 }}>
              WS = <b>(Tổng tin / Tổng toàn nhãn)</b> × 50<br />
              &nbsp;&nbsp;&nbsp;&nbsp; + <b>NSR</b> × 0.5
            </div>
            <div style={{ fontSize: 11.5, color: T.textSub, lineHeight: 1.6 }}>
              Thang điểm <b>0–100</b>. Kết hợp độ phủ thảo luận (tổng tin chiếm bao nhiêu % toàn nhãn) với sắc thái cảm xúc (NSR = % tích cực - % tiêu cực).
            </div>
          </div>

          {/* Điểm kênh formula */}
          <div style={{ background: T.white, borderRadius: 8, padding: "14px 16px", border: "1px solid " + T.border }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.navyDark, marginBottom: 8 }}>Điểm kênh hiệu quả (KH)</div>
            <div style={{ fontFamily: "monospace", fontSize: 12.5, color: T.navy, background: "#F0F4FA", borderRadius: 6, padding: "8px 12px", marginBottom: 10, lineHeight: 1.7 }}>
              KH = <b>Độ phủ</b> × 40%<br />
              &nbsp;&nbsp;&nbsp; + <b>Tương tác</b> × 35%<br />
              &nbsp;&nbsp;&nbsp; + <b>Liên quan chủ đề</b> × 25%
            </div>
            <div style={{ fontSize: 11.5, color: T.textSub, lineHeight: 1.6 }}>
              Đo mức độ phù hợp của một kênh với từng nhóm topic: kênh có độ phủ rộng, tương tác cao và nội dung đúng chủ đề sẽ được điểm cao hơn.
            </div>
          </div>
        </div>

        {/* Component breakdown table */}
        <div style={{ fontSize: 12, fontWeight: 700, color: T.textSub, marginBottom: 8 }}>Thành phần chỉ số</div>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 2fr 1fr 2fr", gap: 0, fontSize: 11.5 }}>
          {/* header */}
          {["Thành phần", "Định nghĩa", "Trọng số", "Nguồn dữ liệu"].map(h => (
            <div key={h} style={{ padding: "7px 10px", background: "#EEF2F7", fontWeight: 700, color: T.textSub, borderBottom: "2px solid " + T.border }}>{h}</div>
          ))}
          {[
            ["Tổng tin",           "Số lượng bài viết đề cập topic trong kỳ",            "50% (WS)",  "Social listening"],
            ["NSR",                "(Tin tích cực − Tin tiêu cực) / Tổng tin × 100",      "50% (WS)",  "Sentiment classification"],
            ["Độ phủ kênh",        "Số tin trên kênh / Tổng tin toàn kênh",               "40% (KH)",  "Channel analytics"],
            ["Tương tác",          "Avg likes + shares + comments so với benchmark",      "35% (KH)",  "Platform API"],
            ["Liên quan chủ đề",   "Tỷ lệ tin được gắn đúng nhãn topic / tổng tin kênh", "25% (KH)",  "Label accuracy model"],
          ].map(([name, def, w, src], i) => {
            const bg = i % 2 === 0 ? T.white : "#FAFBFD";
            return [
              <div key={name + "n"} style={{ padding: "8px 10px", background: bg, borderBottom: "1px solid " + T.border, fontWeight: 600, color: T.textPrimary }}>{name}</div>,
              <div key={name + "d"} style={{ padding: "8px 10px", background: bg, borderBottom: "1px solid " + T.border, color: T.textSub }}>{def}</div>,
              <div key={name + "w"} style={{ padding: "8px 10px", background: bg, borderBottom: "1px solid " + T.border, fontWeight: 700, color: T.navy }}>{w}</div>,
              <div key={name + "s"} style={{ padding: "8px 10px", background: bg, borderBottom: "1px solid " + T.border, color: T.textLight }}>{src}</div>,
            ];
          })}
        </div>

        {/* Tier priority note */}
        <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ fontSize: 11.5, color: T.textSub, fontWeight: 600 }}>Hệ số ưu tiên Tier:</div>
          {[["Tier 1", "×1.5", "#FEE8E6", T.negative], ["Tier 2", "×1.0", "#EEF2F7", "#5D6D7E"], ["Tier 3", "×0.8", "#E8F8EE", T.positive]].map(([t, m, bg, c]) => (
            <span key={t} style={{ background: bg, color: c, borderRadius: 6, padding: "4px 10px", fontSize: 11.5, fontWeight: 700 }}>
              {t} — ưu tiên phản hồi {m}
            </span>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 15, fontWeight: 800, color: T.navyDark, marginBottom: 14 }}>Phân tầng đánh giá hiệu quả: Topic × Kênh × Winning Score</div>
      <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, fontSize: 12, color: T.textSub, paddingBottom: 10, borderBottom: "1px solid " + T.border }}>
        <div>Nhóm Topic</div>
        <div>Tier</div>
        <div>Kênh hiệu quả (Top 3)</div>
        <div>Winning Score</div>
        <div>Xu hướng NSR</div>
      </div>
      {TOPIC_CHANNEL_MATRIX.map((r, i) => {
        const top = i === 0;
        const color = top ? T.textPrimary : T.textLight;
        const tag = TIER_TAG[r.tier];
        return (
          <div key={r.group} style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, alignItems: "center", padding: "12px 0", borderBottom: "1px solid " + T.border }}>
            <div style={{ fontSize: 13, fontWeight: top ? 800 : 600, color }}>{r.group}</div>
            <div><span style={{ background: tag.bg, color: tag.c, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>Tier {r.tier}</span></div>
            <div style={{ fontSize: 12, color }}>{r.channels}</div>
            <WinBar score={r.winScore} />
            <NsrTrend val={r.nsrVal} />
          </div>
        );
      })}

      <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: 11, color: T.textSub }}>
        {[[T.positive, "Winning Score ≥ 60 — Đang thắng thế"], ["#E67E22", "40–59 — Trung bình"], [T.negative, "< 40 — Cần cải thiện"]].map(([c, l]) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: c, flexShrink: 0 }} />{l}
          </span>
        ))}
      </div>

      <div style={{ background: T.bg, borderRadius: 10, padding: "14px 18px", marginTop: 16, fontSize: 12.5, color: T.textSub, lineHeight: 1.6 }}>
        Ví dụ áp dụng: tin về <b style={{ color: T.textPrimary }}>Cổ phiếu, chứng khoán</b> / <b style={{ color: T.textPrimary }}>Doanh thu & Lợi nhuận</b> nên ưu tiên đăng tải qua News, Forum tài chính, LinkedIn — nơi NSR và độ tin cậy cao; trong khi tin <b style={{ color: T.textPrimary }}>Thương hiệu & Quảng cáo</b> hiệu quả nhất trên Facebook, TikTok, YouTube. Winning Score và Influence Score của từng topic được trực quan hóa ở tab <b style={{ color: T.navyDark }}>Cambridge Analytica →</b>
      </div>
    </div>
  );
}
