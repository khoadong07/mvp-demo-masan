import { useState } from "react";
import { FilterProvider } from "./context/FilterContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { LoginPage } from "./pages/LoginPage";
import { TongQuanPage } from "./pages/tong-quan/TongQuanPage";
import { ChienDichPage } from "./pages/ChienDichPage";
import { ReportPage } from "./pages/ReportPage";
import { ChiTietPage } from "./pages/ChiTietPage";
import { BODPage } from "./pages/bod/BODPage";
import { MSNPage } from "./pages/msn/MSNPage";
import { TinTieuCucPage } from "./pages/tin-tieu-cuc/TinTieuCucPage";
import { IRPage } from "./pages/ir/IRPage";

const PAGE_TITLES = { "tong-quan": "Tổng quan", "chien-dich": "Chiến dịch", "report": "Reports", "chi-tiet": "Chi tiết thảo luận", "bod": "Ban lãnh đạo (BOD)", "msn": "Masan Group — MSN", "tin-tieu-cuc": "Tin tiêu cực", "ir": "Investor Relations (IR)" };

export default function App() {
  const [page, setPage] = useState("login");
  const [collapsed, setCollapsed] = useState(false);

  if (page === "login") return <LoginPage onLogin={() => setPage("tong-quan")} />;

  return (
    <FilterProvider>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          <Header title={PAGE_TITLES[page]} />
          {page === "tong-quan" && <TongQuanPage />}
          {page === "chien-dich" && <ChienDichPage />}
          {page === "report" && <ReportPage />}
          {page === "chi-tiet" && <ChiTietPage />}
          {page === "bod" && <BODPage />}
          {page === "msn" && <MSNPage />}
          {page === "tin-tieu-cuc" && <TinTieuCucPage />}
          {page === "ir" && <IRPage />}
        </div>
      </div>
    </FilterProvider>
  );
}
