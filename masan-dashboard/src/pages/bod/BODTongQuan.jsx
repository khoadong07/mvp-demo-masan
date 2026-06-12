import { useState } from "react";
import { T } from "../../constants/theme";
import { Card } from "../../components/common/Card";
import { BODDienBien } from "./BODDienBien";
import { BODTyLe } from "./BODTyLe";
import { BODChannelRatio } from "./BODChannelRatio";
import { BODTopSources } from "./BODTopSources";
import { BODHotTopics } from "./BODHotTopics";
import { BODSentimentStats } from "./BODSentimentStats";
import { BODPeriodToggle } from "./BODPeriodToggle";

export function BODTongQuan() {
  const [tab, setTab] = useState("dien-bien");
  const [period, setPeriod] = useState(7);

  return (
    <div>
      <Card style={{ padding: "20px 22px" }}>
        {tab === "dien-bien" && <BODDienBien setTab={setTab} />}
        {tab === "ty-le" && <BODTyLe setTab={setTab} />}
        {tab === "ty-le-kenh" && <BODChannelRatio setTab={setTab} />}
        {tab === "top-nguon" && <BODTopSources setTab={setTab} />}
      </Card>

      <Card style={{ padding: "20px 22px", marginTop: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: T.navyDark }}>Hot topics cần chú ý</div>
          <BODPeriodToggle period={period} setPeriod={setPeriod} />
        </div>
        <BODHotTopics period={period} />
      </Card>

      <Card style={{ padding: "20px 22px", marginTop: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: T.navyDark, marginBottom: 14 }}>Thống kê sentiment đi kèm ({period} ngày qua)</div>
        <BODSentimentStats period={period} />
      </Card>
    </div>
  );
}
