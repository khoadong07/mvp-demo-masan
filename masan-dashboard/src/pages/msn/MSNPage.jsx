import { useState } from "react";
import { T, fmt, pct, nsr } from "../../constants/theme";
import { Card } from "../../components/common/Card";
import { Stat } from "../../components/common/Stat";
import { TabBar } from "../../components/common/TabBar";
import { FilterBar } from "../../components/layout/FilterBar";
import { SoVChart } from "../../components/charts/SoVChart";
import { MSNDienBien } from "./MSNDienBien";
import { SacThaiComp } from "./SacThaiComp";
import { ChuDeComp } from "./ChuDeComp";
import { NguonComp } from "./NguonComp";
import RAW from "../../data/raw.json";

export function MSNPage() {
  const [tab, setTab] = useState("dien-bien");
  const s = RAW.summary;
  const nsrV = nsr(s.positive, s.negative, s.total);
  const tabs = [{ k: "dien-bien", l: "Diễn biến thảo luận" }, { k: "kenh", l: "Tỷ lệ theo kênh" }, { k: "sac-thai", l: "Sắc thái" }, { k: "chu-de", l: "Chủ đề nổi bật" }, { k: "nguon", l: "Top nguồn đăng" }];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <FilterBar />
      <div style={{ flex: 1, overflow: "auto", background: T.bg, padding: "18px 20px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <Stat label="Tổng thảo luận MSN" value={fmt(s.total)} sub="01/01 – 31/05/2026" />
          <Stat label="Tích cực" value={fmt(s.positive)} sub={pct(s.positive, s.total)} color={T.positive} />
          <Stat label="Tiêu cực" value={fmt(s.negative)} sub={pct(s.negative, s.total)} color={T.negative} />
          <Stat label="Trung lập" value={fmt(s.neutral)} sub={pct(s.neutral, s.total)} color={T.neutral} />
          <Stat label="NSR" value={nsrV + "%"} color={+nsrV >= 0 ? T.positive : T.negative} />
          <Stat label="Tương tác" value={fmt(s.total_interactions)} />
        </div>
        <Card style={{ padding: "20px 22px" }}>
          <TabBar tabs={tabs} active={tab} onSelect={setTab} />
          {tab === "dien-bien" && <MSNDienBien />}
          {tab === "kenh" && <SoVChart />}
          {tab === "sac-thai" && <SacThaiComp />}
          {tab === "chu-de" && <ChuDeComp />}
          {tab === "nguon" && <NguonComp />}
        </Card>
      </div>
    </div>
  );
}
