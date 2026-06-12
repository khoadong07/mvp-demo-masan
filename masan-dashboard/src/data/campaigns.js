import POOL from "./articlesPool.json";

const CAMPAIGN_DATE_FROM = "2026-04-23";
const CAMPAIGN_DATE_TO = "2026-05-22";

const campaignArticles = (() => {
  const seen = new Set();
  return POOL
    .filter(a => a.title && a.content && a.date >= CAMPAIGN_DATE_FROM && a.date <= CAMPAIGN_DATE_TO)
    .filter(a => (seen.has(a.title) ? false : (seen.add(a.title), true)))
    .map(a => ({ channel: a.channel, site: a.site, date: a.date, title: a.title, content: a.content, url: a.url }));
})();

const masanArticles = [...campaignArticles].sort((a, b) => b.date.localeCompare(a.date));
const thisoArticles = [...campaignArticles].sort((a, b) => a.date.localeCompare(b.date));

const TREND_DATES = ["23/04", "24/04", "25/04", "26/04", "27/04", "28/04", "29/04", "30/04", "01/05", "02/05", "03/05", "04/05", "05/05", "06/05", "07/05", "08/05", "09/05", "10/05", "11/05", "12/05", "13/05", "14/05", "15/05", "16/05", "17/05", "18/05", "19/05", "20/05", "21/05", "22/05"];

const TREND_RAW = [
  [450, 90, 100], [250, 80, 70], [80, 60, 50], [60, 50, 40], [130, 70, 60],
  [380, 110, 90], [280, 100, 80], [340, 130, 100], [330, 120, 95], [180, 90, 70],
  [90, 60, 50], [70, 50, 45], [130, 70, 60], [780, 230, 140], [320, 150, 110],
  [250, 110, 90], [150, 90, 70], [110, 70, 55], [130, 80, 65], [280, 230, 120],
  [270, 180, 100], [100, 100, 70], [60, 60, 45], [50, 40, 35], [45, 35, 30],
  [60, 45, 40], [90, 70, 55], [160, 200, 130], [170, 150, 110], [140, 100, 85],
];

const buildTrend = scale => TREND_DATES.map((date, i) => ({
  date,
  mxh: Math.round(TREND_RAW[i][0] * scale.mxh),
  baichi: Math.round(TREND_RAW[i][1] * scale.baichi),
  khac: Math.round(TREND_RAW[i][2] * scale.khac),
}));

const CHANNEL_RATIO_BREAKDOWN = { "Forums": 0.5, "Facebook Pages": 15.4, "Facebook Group": 33.2, "Facebook Users": 0.1, "News": 23.9, "Social Sites": 25.8, "Youtube": 0.4, "Tiktok": 0.8 };

const TOPICS = [
  { name: "Tình hình kinh doanh", count: 26, pct: 0.15 },
  { name: "Chứng khoán cổ phiếu", count: 800, pct: 4.47 },
  { name: "Đề cập chung", count: 371, pct: 2.07 },
  { name: "Hoạt động kinh doanh", count: 350, pct: 1.96 },
  { name: "Tuyển dụng - Nhân sự", count: 9, pct: 0.05 },
  { name: "Khác", count: 201, pct: 1.12 },
];

const TOP_SOURCES = [
  { name: "Dùng hàng Việt", interactions: 33686, posts: 7, views: 20641414, url: "" },
  { name: "YAN TV", interactions: 38790, posts: 5, views: 11461454, url: "" },
  { name: "Chứng khoán lướt sóng thần", interactions: 67957, posts: 4, views: 11920283, url: "" },
  { name: "Theanh28 Entertainment", interactions: 30632, posts: 3, views: 11640814, url: "" },
  { name: "Diễn đàn chứng khoán Việt Nam", interactions: 53962, posts: 2, views: 8969749, url: "" },
];

export const CAMPAIGNS = [
  {
    id: "masan",
    title: "Số lượng tin bài đề cập đến Masan Group",
    negative: 608,
    positive: 2860,
    total: 1707,
    neutralPct: 33.86,
    positivePct: 66.14,
    negativePct: 0,
    noNegativeNote: true,
    trendStats: { mxh: 5966, baichi: 1789, khac: 1419 },
    trendData: buildTrend({ mxh: 1, baichi: 1, khac: 1 }),
    channelRatio: { total: 1707, breakdown: CHANNEL_RATIO_BREAKDOWN },
    topics: TOPICS,
    topSources: TOP_SOURCES,
    articles: masanArticles,
  },
  {
    id: "thiso",
    title: "Số lượng tin bài đề cập đến THISO",
    negative: 2608,
    positive: 5860,
    total: 8468,
    neutralPct: 0,
    positivePct: 69.20,
    negativePct: 30.80,
    noNegativeNote: false,
    trendStats: { mxh: 4125, baichi: 1094, khac: 871 },
    trendData: buildTrend({ mxh: 0.69, baichi: 0.35, khac: 0.37 }),
    channelRatio: { total: 6972, breakdown: CHANNEL_RATIO_BREAKDOWN },
    topics: TOPICS,
    topSources: TOP_SOURCES,
    articles: thisoArticles,
  },
];
