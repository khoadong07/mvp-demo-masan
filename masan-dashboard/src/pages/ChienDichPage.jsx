import { T } from "../constants/theme";
import { FilterBar } from "../components/layout/FilterBar";
import { CampaignCard } from "./chien-dich/CampaignCard";
import { CAMPAIGNS } from "../data/campaigns";

export function ChienDichPage() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <FilterBar />
      <div style={{ flex: 1, overflow: "auto", background: T.bg, padding: "18px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {CAMPAIGNS.map(c => <CampaignCard key={c.id} campaign={c} />)}
        </div>
      </div>
    </div>
  );
}
