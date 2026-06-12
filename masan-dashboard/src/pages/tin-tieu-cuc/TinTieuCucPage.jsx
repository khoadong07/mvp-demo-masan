import { useState } from "react";
import { T, fmt, pct } from "../../constants/theme";
import { Card } from "../../components/common/Card";
import { Stat } from "../../components/common/Stat";
import { TabBar } from "../../components/common/TabBar";
import { FilterBar } from "../../components/layout/FilterBar";
import { NegTongQuan } from "./NegTongQuan";
import { NegDienBien } from "./NegDienBien";
import { NegLevel } from "./NegLevel";
import { NegChuDe } from "./NegChuDe";
import { NegBaiViet } from "./NegBaiViet";
import RAW from "../../data/raw.json";

export function TinTieuCucPage() {
  const [tab, setTab] = useState("tong-quan");
  const n = RAW.negative;
  const tabs = [{ k: "tong-quan", l: "Tổng quan" }, { k: "dien-bien", l: "Diễn biến" }, { k: "level", l: "Theo Level" }, { k: "chu-de", l: "Chủ đề" }, { k: "bai-viet", l: "Danh sách bài" }];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <FilterBar />
      <div style={{ flex: 1, overflow: "auto", background: T.bg, padding: "18px 20px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <Stat label="Tổng tin tiêu cực" value={fmt(n.total)} color={T.negative} />
          <Stat label="Tỷ lệ tiêu cực" value={pct(n.total, RAW.summary.total)} color={T.negative} />
          <Stat label="Level 3 (Cao)" value={fmt(n.by_level["3"] || 0)} color="#C0392B" />
          <Stat label="Level 2 (TB)" value={fmt(n.by_level["2"] || 0)} color={T.negative} />
          <Stat label="Level 1 (Thấp)" value={fmt(n.by_level["1"] || 0)} color="#E67E22" />
        </div>
        <Card style={{ padding: "20px 22px" }}>
          <TabBar tabs={tabs} active={tab} onSelect={setTab} />
          {tab === "tong-quan" && <NegTongQuan />}
          {tab === "dien-bien" && <NegDienBien />}
          {tab === "level" && <NegLevel />}
          {tab === "chu-de" && <NegChuDe />}
          {tab === "bai-viet" && <NegBaiViet />}
        </Card>
      </div>
    </div>
  );
}
