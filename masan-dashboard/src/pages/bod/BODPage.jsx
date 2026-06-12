import { useState } from "react";
import { T, fmt, pct, nsr } from "../../constants/theme";
import { Card } from "../../components/common/Card";
import { Stat } from "../../components/common/Stat";
import { TabBar } from "../../components/common/TabBar";
import { FilterBar } from "../../components/layout/FilterBar";
import { BODTongQuan } from "./BODTongQuan";
import { BODDienBien } from "./BODDienBien";
import { BODTyLe } from "./BODTyLe";
import { BODNguon } from "./BODNguon";
import RAW from "../../data/raw.json";

export function BODPage() {
  const [tab, setTab] = useState("tong-quan");
  const b = RAW.bod;
  const tabs = [{ k: "tong-quan", l: "Tổng quan BOD" }, { k: "dien-bien", l: "Diễn biến tiêu cực" }, { k: "ty-le", l: "Tỷ trọng Tích/Tiêu" }, { k: "nguon", l: "Top nguồn tin" }];
  const nsrV = nsr(b.sentiment.Positive || 0, b.sentiment.Negative || 0, b.total);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <FilterBar />
      <div style={{ flex: 1, overflow: "auto", background: T.bg, padding: "18px 20px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <Stat label="Tổng thảo luận BOD" value={fmt(b.total)} color={T.navy} />
          <Stat label="Tích cực" value={fmt(b.sentiment.Positive || 0)} sub={pct(b.sentiment.Positive || 0, b.total)} color={T.positive} />
          <Stat label="Tiêu cực" value={fmt(b.sentiment.Negative || 0)} sub={pct(b.sentiment.Negative || 0, b.total)} color={T.negative} />
          <Stat label="NSR BOD" value={nsrV + "%"} color={+nsrV >= 0 ? T.positive : T.negative} />
        </div>
        <Card style={{ padding: "20px 22px" }}>
          <TabBar tabs={tabs} active={tab} onSelect={setTab} />
          {tab === "tong-quan" && <BODTongQuan />}
          {tab === "dien-bien" && <BODDienBien setTab={setTab} />}
          {tab === "ty-le" && <BODTyLe setTab={setTab} />}
          {tab === "nguon" && <BODNguon />}
        </Card>
      </div>
    </div>
  );
}
