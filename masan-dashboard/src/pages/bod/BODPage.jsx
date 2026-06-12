import { useState } from "react";
import { T } from "../../constants/theme";
import { TabBar } from "../../components/common/TabBar";
import { FilterBar } from "../../components/layout/FilterBar";
import { BODTongQuan } from "./BODTongQuan";
import { BODMoHinhDanhGia } from "./BODMoHinhDanhGia";

const TABS = [
  { k: "tong-quan", l: "Tổng quan" },
  { k: "mo-hinh-danh-gia", l: "Mô hình đánh giá" },
];

export function BODPage() {
  const [tab, setTab] = useState("tong-quan");
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <FilterBar />
      <div style={{ flex: 1, overflow: "auto", background: T.bg, padding: "18px 20px" }}>
        <TabBar tabs={TABS} active={tab} onSelect={setTab} />
        {tab === "tong-quan" && <BODTongQuan />}
        {tab === "mo-hinh-danh-gia" && <BODMoHinhDanhGia />}
      </div>
    </div>
  );
}
