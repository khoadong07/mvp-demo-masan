import { useState } from "react";
import { T } from "../../constants/theme";
import { ArticleGrid } from "../../components/common/ArticleGrid";
import { Pagination } from "../../components/common/Pagination";

const PAGE_SIZE = 6;

export function BODFeaturedNews({ articles }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = articles.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: T.navyDark, marginBottom: 14 }}>Tin nổi bật</div>
      <ArticleGrid articles={pageItems} />
      <Pagination total={totalPages} current={current} onChange={setPage} />
    </div>
  );
}
