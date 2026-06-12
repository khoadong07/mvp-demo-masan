import { T } from "../../constants/theme";
import { Card } from "./Card";
import { FilterBar } from "../layout/FilterBar";

export function MaintenancePage({ title = "Chức năng đang được bảo trì" }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <FilterBar />
      <div style={{ flex: 1, overflow: "auto", background: T.bg, padding: "18px 20px" }}>
        <Card style={{ padding: "60px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, minHeight: 400 }}>
          <div style={{ fontSize: 40 }}>🛠️</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.navyDark }}>{title}</div>
          <div style={{ fontSize: 13, color: T.textSub, textAlign: "center", maxWidth: 420 }}>
            Trang này đang được bảo trì và cập nhật. Vui lòng quay lại sau.
          </div>
        </Card>
      </div>
    </div>
  );
}
