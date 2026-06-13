import { useState, useEffect } from "react";
import { T } from "../../constants/theme";
import { ArticleGrid } from "../../components/common/ArticleGrid";
import { Pagination } from "../../components/common/Pagination";

const PAGE_SIZE = 6;

export function BODFeaturedNews({ articles, title, onReset }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = articles.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [articles]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: T.navyDark }}>{title || "Tin nổi bật"}</div>
        {onReset && (
          <button onClick={onReset} style={{ border: "1px solid " + T.border, background: "transparent", cursor: "pointer", fontSize: 11, color: T.textSub, padding: "3px 8px", borderRadius: 5 }}>
            ✕ Xóa lọc
          </button>
        )}
      </div>
      {articles.length === 0
        ? <div style={{ fontSize: 13, color: T.textLight, padding: "24px 0", textAlign: "center" }}>Không có bài viết phù hợp</div>
        : <ArticleGrid articles={pageItems} />
      }
      <Pagination total={totalPages} current={current} onChange={setPage} />
    </div>
  );
}
