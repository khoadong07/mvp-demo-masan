import B64_DATA from "../data/allRowsB64.json";
import { META } from "../constants/meta";

export function decodeRows(b64) {
  const bin = atob(b64);
  const rows = new Array(bin.length / 6 | 0);
  for (let i = 0, r = 0; i < bin.length; i += 6, r++) {
    rows[r] = [bin.charCodeAt(i) | (bin.charCodeAt(i + 1) << 8), bin.charCodeAt(i + 2), bin.charCodeAt(i + 3), bin.charCodeAt(i + 4), bin.charCodeAt(i + 5) === 255 ? -1 : bin.charCodeAt(i + 5)];
  }
  return rows;
}

export function dateToDayOff(s) {
  const base = new Date("2026-01-01"), d = new Date(s);
  return Math.round((d - base) / 86400000);
}

export function dayToWeek(d) {
  const dt = new Date("2026-01-01");
  dt.setDate(dt.getDate() + d);
  const y = dt.getFullYear(), soy = new Date(y, 0, 1);
  const wk = Math.ceil(((dt - soy) / 86400000 + soy.getDay() + 1) / 7);
  return `${y}-W${String(wk).padStart(2, "0")}`;
}

export function dayToMonth(d) {
  const dt = new Date("2026-01-01");
  dt.setDate(dt.getDate() + d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
}

export function computeAgg(rows) {
  const sum = { total: 0, positive: 0, negative: 0, neutral: 0, total_interactions: 0 };
  const wk = {}, mo = {}, byCh = new Array(9).fill(0), byLbl = new Array(16).fill(0);
  for (const [day, ti, ci, si, li] of rows) {
    sum.total++;
    if (si === 0) sum.positive++; else if (si === 1) sum.negative++; else sum.neutral++;
    const w = dayToWeek(day);
    if (!wk[w]) wk[w] = { week: w, total: 0, Positive: 0, Negative: 0, Neutral: 0 };
    wk[w].total++;
    if (si === 0) wk[w].Positive++; else if (si === 1) wk[w].Negative++; else wk[w].Neutral++;
    const m = dayToMonth(day);
    if (!mo[m]) mo[m] = { month: m, total: 0, positive: 0, negative: 0, neutral: 0 };
    mo[m].total++;
    if (si === 0) mo[m].positive++; else if (si === 1) mo[m].negative++; else mo[m].neutral++;
    if (ci >= 0 && ci < 9) byCh[ci]++;
    if (li >= 0 && li < 16) byLbl[li]++;
  }
  const nsr_monthly = Object.values(mo).sort((a, b) => a.month < b.month ? -1 : 1).map(m => {
    const n = m.total > 0 ? +((m.positive - m.negative) / m.total * 100).toFixed(1) : 0;
    return { ...m, nsr: n };
  });
  const trend_weekly = Object.values(wk).sort((a, b) => a.week < b.week ? -1 : 1);
  const channels_obj = {};
  META.channels.forEach((c, i) => { if (byCh[i] > 0) channels_obj[c] = { total: byCh[i] }; });
  const top_labels = META.labels.map((l, i) => ({ label: l, count: byLbl[i] })).filter(x => x.count > 0).sort((a, b) => b.count - a.count);
  return { summary: sum, trend_weekly, nsr_monthly, channels: channels_obj, top_labels };
}

export function peakDay(rows) {
  if (!rows.length) return -1;
  const counts = new Map();
  for (const [day] of rows) counts.set(day, (counts.get(day) || 0) + 1);
  let best = -1, max = -1;
  for (const [day, c] of counts) if (c > max) { max = c; best = day; }
  return best;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const ALL_ROWS = decodeRows(B64_DATA);
