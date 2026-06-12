import { T } from "../constants/theme";
import { Card } from "../components/common/Card";
import { FilterBar } from "../components/layout/FilterBar";

export function ChienDichPage() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <FilterBar />
      <div style={{ flex: 1, overflow: "auto", background: T.bg, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Card style={{ padding: "48px 40px", textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📢</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.navyDark, marginBottom: 8 }}>Chiến dịch</div>
          <div style={{ fontSize: 13, color: T.textSub, lineHeight: 1.7 }}>Tính năng đang phát triển. Vui lòng quay lại sau.</div>
        </Card>
      </div>
    </div>
  );
}
