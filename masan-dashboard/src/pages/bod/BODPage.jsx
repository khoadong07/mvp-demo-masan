import { useState } from "react";
import { T } from "../../constants/theme";
import { Card } from "../../components/common/Card";
import { FilterBar } from "../../components/layout/FilterBar";
import { BODDienBien } from "./BODDienBien";
import { BODTyLe } from "./BODTyLe";
import { BODChannelRatio } from "./BODChannelRatio";
import { BODTopSources } from "./BODTopSources";

export function BODPage() {
  const [tab, setTab] = useState("dien-bien");
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <FilterBar />
      <div style={{ flex: 1, overflow: "auto", background: T.bg, padding: "18px 20px" }}>
        <Card style={{ padding: "20px 22px" }}>
          {tab === "dien-bien" && <BODDienBien setTab={setTab} />}
          {tab === "ty-le" && <BODTyLe setTab={setTab} />}
          {tab === "ty-le-kenh" && <BODChannelRatio setTab={setTab} />}
          {tab === "top-nguon" && <BODTopSources setTab={setTab} />}
        </Card>
      </div>
    </div>
  );
}
