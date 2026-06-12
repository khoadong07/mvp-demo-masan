import { T } from "../../constants/theme";
import { GaugeChart } from "../../components/charts/GaugeChart";

function StatBadge({ tone, emoji, value, label }) {
  const c = tone === "negative" ? T.negative : T.positive;
  const bg = tone === "negative" ? "#FDEDEB" : "#E9F7EF";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{emoji}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: c, lineHeight: 1.1 }}>{value.toLocaleString()}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: c }}>{label}</div>
    </div>
  );
}

function SummaryText({ total, neutralPct, positivePct, negativePct, noNegativeNote }) {
  const fmtPct = v => v == null ? "...%" : v + "%";
  return (
    <div style={{ fontSize: 13.5, lineHeight: 1.9, color: T.textPrimary }}>
      Tổng số lượng thảo luận của chiến dịch là <b>{total == null ? "...." : total.toLocaleString()}</b>. Trong đó lượng thảo luận Trung lập chiếm <b>{fmtPct(neutralPct)}</b>, thảo luận Tích cực chiếm <b>{fmtPct(positivePct)}</b>
      {noNegativeNote ? ", không ghi nhận thảo luận tiêu cực liên quan đến chiến dịch" : <>, thảo luận tiêu cực chiếm <b>{fmtPct(negativePct)}</b></>}
    </div>
  );
}

export function CampaignOverview({ campaign }) {
  return (
    <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
      <div style={{ width: 220, flexShrink: 0 }}>
        <GaugeChart positive={campaign.positive} negative={campaign.negative} gradId={`gauge-${campaign.id}`} />
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px", marginTop: -8 }}>
          <StatBadge tone="negative" emoji="😠" value={campaign.negative} label="Tiêu cực" />
          <StatBadge tone="positive" emoji="😊" value={campaign.positive} label="Tích cực" />
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 240 }}>
        <SummaryText total={campaign.total} neutralPct={campaign.neutralPct} positivePct={campaign.positivePct} negativePct={campaign.negativePct} noNegativeNote={campaign.noNegativeNote} />
      </div>
    </div>
  );
}
