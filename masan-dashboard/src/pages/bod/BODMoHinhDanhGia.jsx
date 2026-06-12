import { useState } from "react";
import { Card } from "../../components/common/Card";
import { TabBar } from "../../components/common/TabBar";
import { BODWinningScore } from "./BODWinningScore";
import { BODPhanTangTopics } from "./BODPhanTangTopics";
import { BODCambridgeAnalytica } from "./BODCambridgeAnalytica";

const TABS = [
  { k: "winning-score", l: "Winning Score" },
  { k: "phan-tang", l: "Phân tầng Topics" },
  { k: "cambridge", l: "Cambridge Analytica" },
];

export function BODMoHinhDanhGia() {
  const [tab, setTab] = useState("winning-score");
  return (
    <Card style={{ padding: "20px 22px" }}>
      <TabBar tabs={TABS} active={tab} onSelect={setTab} />
      {tab === "winning-score" && <BODWinningScore />}
      {tab === "phan-tang" && <BODPhanTangTopics />}
      {tab === "cambridge" && <BODCambridgeAnalytica />}
    </Card>
  );
}
