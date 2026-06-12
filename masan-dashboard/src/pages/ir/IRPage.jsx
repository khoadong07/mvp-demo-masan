import { useState } from "react";
import { T, fmt, pct, nsr } from "../../constants/theme";
import { Card } from "../../components/common/Card";
import { Stat } from "../../components/common/Stat";
import { TabBar } from "../../components/common/TabBar";
import { FilterBar } from "../../components/layout/FilterBar";
import { IRTongQuan } from "./IRTongQuan";
import { IRDienBien } from "./IRDienBien";
import { IRNguon } from "./IRNguon";
import RAW from "../../data/raw.json";

export function IRPage() {
  const [tab, setTab] = useState("tong-quan");
  const ir = RAW.ir;
  const tabs = [{ k: "tong-quan", l: "Hoạt động IR" }, { k: "dien-bien", l: "Diễn biến thảo luận" }, { k: "nguon", l: "Top nguồn IR" }];
  const nsrV = nsr(ir.sentiment.Positive || 0, ir.sentiment.Negative || 0, ir.total);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <FilterBar />
      <div style={{ flex: 1, overflow: "auto", background: T.bg, padding: "18px 20px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <Stat label="Tổng thảo luận IR" value={fmt(ir.total)} sub="Cổ phiếu & Chứng khoán" color={T.navy} />
          <Stat label="Tích cực" value={fmt(ir.sentiment.Positive || 0)} sub={pct(ir.sentiment.Positive || 0, ir.total)} color={T.positive} />
          <Stat label="Tiêu cực" value={fmt(ir.sentiment.Negative || 0)} sub={pct(ir.sentiment.Negative || 0, ir.total)} color={T.negative} />
          <Stat label="NSR IR" value={nsrV + "%"} color={+nsrV >= 0 ? T.positive : T.negative} />
          <Stat label="Tỷ trọng / MSN" value={pct(ir.total, RAW.summary.total)} />
        </div>
        <Card style={{ padding: "20px 22px" }}>
          <TabBar tabs={tabs} active={tab} onSelect={setTab} />
          {tab === "tong-quan" && <IRTongQuan />}
          {tab === "dien-bien" && <IRDienBien />}
          {tab === "nguon" && <IRNguon />}
        </Card>
      </div>
    </div>
  );
}
