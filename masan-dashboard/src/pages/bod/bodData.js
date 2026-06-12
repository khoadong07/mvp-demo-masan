import { ALL_ROWS } from "../../utils/aggregation";
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

export const SENTIMENT_24H = { Positive: 8, Negative: 5, Neutral: 241, total: 254 };

function dayLabel(day) {
  const dt = new Date("2026-01-01");
  dt.setDate(dt.getDate() + day);
  return String(dt.getDate()).padStart(2, "0") + "/" + String(dt.getMonth() + 1).padStart(2, "0");
}

const bodByDay = (() => {
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

export const SENTIMENT_7D = LAST_7_DAYS.reduce((acc, e) => {
  acc.Positive += e.Positive; acc.Negative += e.Negative; acc.Neutral += e.Neutral; acc.total += e.Positive + e.Negative + e.Neutral;
  return acc;
}, { Positive: 0, Negative: 0, Neutral: 0, total: 0 });

export const BOD_ARTICLES = ARTICLES_POOL
  .filter(a => a.label === "Ban lãnh đạo" && a.title && a.content)
  .sort((a, b) => b.date.localeCompare(a.date));
