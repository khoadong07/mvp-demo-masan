import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { T } from "../../constants/theme";
import { CT } from "../../components/common/CT";

const COLS = "2fr 1fr 1fr 1fr 1fr 1fr 1fr";

const DIMENSIONS = ["Độ phủ (Reach)", "Tương quan sắc thái (Sentiment Affinity)", "Mức độ tương tác (Engagement Depth)", "Liên quan chủ đề (Topic Relevance)", "Ảnh hưởng mạng lưới (Network Influence)"];
const KEYS = ["reach", "affinity", "engagement", "relevance", "network"];

const INFLUENCE_SCORES = [
  { name: "Tiếng Dân News", reach: 88, affinity: 45, engagement: 72, relevance: 80, network: 68 },
  { name: "Báo Đầu Tư", reach: 70, affinity: 78, engagement: 50, relevance: 88, network: 75 },
  { name: "KOL Tài chính A", reach: 55, affinity: 60, engagement: 85, relevance: 65, network: 90 },
  { name: "Page Cộng đồng MSN", reach: 65, affinity: 82, engagement: 90, relevance: 60, network: 55 },
];

const RADAR_COLORS = [T.navy, T.positive, "#9B59B6", "#F1C40F"];

const RADAR_DATA = DIMENSIONS.map((dim, i) => {
  const row = { dimension: dim };
  INFLUENCE_SCORES.forEach(s => { row[s.name] = s[KEYS[i]]; });
  return row;
});

export function BODCambridgeAnalytica() {
  const rows = INFLUENCE_SCORES.map(s => ({
    ...s,
    totalScore: Math.round((s.reach + s.affinity + s.engagement + s.relevance + s.network) / 5),
  })).sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div>
      <div style={{ background: T.bg, borderRadius: 10, padding: "14px 18px", marginBottom: 24, fontSize: 13, color: T.textSub, lineHeight: 1.6 }}>
        <b style={{ color: T.navyDark }}>Tham khảo: Mô hình chấm điểm Cambridge Analytica (OCEAN)</b>
        <br />
        Cambridge Analytica (2014-2018) xây dựng hồ sơ tâm lý người dùng dựa trên mô hình OCEAN (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism) — chấm điểm 5 chỉ số tính cách từ dữ liệu hành vi & tương tác mạng xã hội, sau đó kết hợp thành điểm tổng hợp để dự đoán mức độ ảnh hưởng & khả năng phản hồi của từng nhóm đối tượng với nội dung truyền thông. Phương pháp gây tranh cãi do thu thập dữ liệu không minh bạch, nhưng nguyên lý <b>chấm điểm đa chiều (multi-dimensional scoring)</b> vẫn là tham khảo hữu ích cho phân tích truyền thông hợp pháp, dựa trên dữ liệu công khai (public social listening).
      </div>

      <div style={{ fontSize: 15, fontWeight: 800, color: T.navyDark, marginBottom: 6 }}>Đề xuất: Masan Audience/Influence Score</div>
      <div style={{ fontSize: 12.5, color: T.textSub, marginBottom: 18 }}>Mô hình điểm ảnh hưởng tổng hợp, điều chỉnh cho phân tích sentiment thương hiệu — dựa trên dữ liệu công khai từ social listening, không thu thập dữ liệu cá nhân.</div>

      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={RADAR_DATA} outerRadius={120}>
          <PolarGrid stroke="#EAF0F8" />
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: T.textSub }} />
          <PolarRadiusAxis tick={{ fontSize: 9, fill: T.textLight }} domain={[0, 100]} />
          {INFLUENCE_SCORES.map((s, i) => (
            <Radar key={s.name} name={s.name} dataKey={s.name} stroke={RADAR_COLORS[i]} fill={RADAR_COLORS[i]} fillOpacity={0.15} />
          ))}
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Tooltip content={<CT />} />
        </RadarChart>
      </ResponsiveContainer>

      <div style={{ fontSize: 15, fontWeight: 800, color: T.navyDark, marginBottom: 14, marginTop: 24 }}>Bảng xếp hạng nguồn theo Audience/Influence Score</div>
      <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, fontSize: 12, color: T.textSub, paddingBottom: 10, borderBottom: "1px solid " + T.border }}>
        <div>Nguồn</div>
        <div>Reach</div>
        <div>Sentiment Affinity</div>
        <div>Engagement</div>
        <div>Topic Relevance</div>
        <div>Network Influence</div>
        <div>Tổng điểm</div>
      </div>
      {rows.map((r, i) => {
        const top = i === 0;
        const color = top ? T.textPrimary : T.textLight;
        return (
          <div key={r.name} style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, alignItems: "center", padding: "12px 0", borderBottom: "1px solid " + T.border }}>
            <div style={{ fontSize: 13, fontWeight: top ? 800 : 600, color }}>{r.name}</div>
            <div style={{ fontSize: 13, color }}>{r.reach}</div>
            <div style={{ fontSize: 13, color }}>{r.affinity}</div>
            <div style={{ fontSize: 13, color }}>{r.engagement}</div>
            <div style={{ fontSize: 13, color }}>{r.relevance}</div>
            <div style={{ fontSize: 13, color }}>{r.network}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.navyDark }}>{r.totalScore}</div>
          </div>
        );
      })}
    </div>
  );
}
