import { ALL_ROWS, dateToDayOff } from "../../utils/aggregation";
import { META } from "../../constants/meta";
import ARTICLES_POOL from "../../data/articlesPool.json";

const BOD_LABEL_IDX = 10; // META.labels[10] === "Ban lãnh đạo"

export const TREND_24H = [
  { time: "00:00:00", Positive: 30, Negative: 43 },
  { time: "03:00:00", Positive: 34, Negative: 21 },
  { time: "06:00:00", Positive: 11, Negative: 6 },
  { time: "09:00:00", Positive: 18, Negative: 30 },
  { time: "12:00:00", Positive: 43, Negative: 34 },
  { time: "15:00:00", Positive: 14, Negative: 19 },
  { time: "18:00:00", Positive: 31, Negative: 16 },
  { time: "21:00:00", Positive: 3, Negative: 8 },
];

export const SENTIMENT_24H = { Positive: 85, Negative: 20, Neutral: 149, total: 254 };

function dayLabel(day) {
  const dt = new Date("2026-01-01");
  dt.setDate(dt.getDate() + day);
  return String(dt.getDate()).padStart(2, "0") + "/" + String(dt.getMonth() + 1).padStart(2, "0");
}

export const bodByDay = (() => {
  const map = new Map();
  let maxDay = 0;
  for (const [day, , , si, li] of ALL_ROWS) {
    if (li !== BOD_LABEL_IDX) continue;
    if (day > maxDay) maxDay = day;
    const e = map.get(day) || { Positive: 0, Negative: 0, Neutral: 0 };
    if (si === 0) e.Positive++; else if (si === 1) e.Negative++; else e.Neutral++;
    map.set(day, e);
  }
  return { map, maxDay };
})();

const LAST_7_DAYS = Array.from({ length: 7 }, (_, i) => bodByDay.maxDay - 6 + i)
  .map(d => ({ day: d, ...(bodByDay.map.get(d) || { Positive: 0, Negative: 0, Neutral: 0 }) }));

export const TREND_7D = LAST_7_DAYS.map(e => ({ time: dayLabel(e.day), Positive: e.Positive, Negative: e.Negative }));

export const SENTIMENT_7D = { Positive: 340, Negative: 83, Neutral: 600, total: 1023 };

export const BOD_ARTICLES = ARTICLES_POOL
  .filter(a => a.label === "Ban lãnh đạo" && a.title && a.content)
  .sort((a, b) => b.date.localeCompare(a.date));

export function bodSentimentForLastDays(n) {
  const { map, maxDay } = bodByDay;
  const totals = { Positive: 0, Negative: 0, Neutral: 0 };
  for (let d = maxDay - n + 1; d <= maxDay; d++) {
    const e = map.get(d);
    if (e) { totals.Positive += e.Positive; totals.Negative += e.Negative; totals.Neutral += e.Neutral; }
  }
  totals.total = totals.Positive + totals.Negative + totals.Neutral;
  return totals;
}

export const BOD_HOT_TOPICS = [
  { topic: "Tin đồn nhân sự cấp cao", base: { Positive: 2, Negative: 19, Neutral: 6 } },
  { topic: "Phát ngôn xử lý khủng hoảng", base: { Positive: 3, Negative: 15, Neutral: 5 } },
  { topic: "Tái cấu trúc & sáp nhập", base: { Positive: 4, Negative: 11, Neutral: 8 } },
  { topic: "Chính sách lương & đãi ngộ", base: { Positive: 6, Negative: 9, Neutral: 11 } },
  { topic: "ĐHCĐ - phản hồi cổ đông", base: { Positive: 9, Negative: 7, Neutral: 13 } },
  { topic: "Phát ngôn lãnh đạo về chiến lược", base: { Positive: 11, Negative: 5, Neutral: 16 } },
  { topic: "Hình ảnh lãnh đạo trên truyền thông", base: { Positive: 13, Negative: 3, Neutral: 10 } },
  { topic: "Tầm nhìn phát triển bền vững (ESG)", base: { Positive: 15, Negative: 2, Neutral: 14 } },
];

const SENT_NAME = ["Positive", "Negative", "Neutral"];

export function filterBodArticles(applied, clickFilter) {
  let list = BOD_ARTICLES;

  if (applied) {
    const fd = dateToDayOff(applied.dateFrom);
    const td = dateToDayOff(applied.dateTo);
    const narrowed = list.filter(a => {
      if (a.day < fd || a.day > td) return false;
      if (applied.sentiment >= 0 && a.sentiment !== SENT_NAME[applied.sentiment]) return false;
      if (applied.channel >= 0 && a.channel !== META.channels[applied.channel]) return false;
      return true;
    });
    if (narrowed.length) list = narrowed;
  }

  if (clickFilter) {
    const narrowed = list.filter(a => {
      if (clickFilter.sentiment && a.sentiment !== clickFilter.sentiment) return false;
      if (clickFilter.channel && a.channel !== clickFilter.channel) return false;
      if (clickFilter.day !== undefined && a.day !== clickFilter.day) return false;
      return true;
    });
    return narrowed.length ? narrowed : list;
  }

  return list;
}
