#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";
import { META, MAIN_CHANNELS } from "../src/constants/meta.js";

XLSX.set_fs(fs);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(`Usage: node scripts/process-xlsx.mjs [input.xlsx] [--topic "MSN"] [--out src/data]

  input.xlsx   Discussion export with a "Data" sheet (columns: Topic, Title,
                Content, PublishedDate, Sentiment, SiteName, Channel, Labels1,
                Level, ...). Defaults to "../demo-new.xlsx".
  --topic      Main brand topic used for raw.json / rawChannels.json /
                allRowsB64.json / articlesPool.json. Defaults to "MSN".
  --out        Output directory for the generated *.json files.
                Defaults to "src/data".`);
  process.exit(0);
}

function flagValue(name, fallback) {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}

const INPUT = path.resolve(args[0] && !args[0].startsWith("--") ? args[0] : path.join(ROOT, "../demo-new.xlsx"));
const MAIN_TOPIC = flagValue("--topic", "MSN");
const OUT_DIR = path.resolve(ROOT, flagValue("--out", "src/data"));

const ARTICLE_LIMIT = 150;
const NEG_ARTICLE_LIMIT = 50;
const TOP_SITES_LIMIT = 20;
const CHANNEL_SITES_LIMIT = 15;
const COMP_SITES_LIMIT = 10;
const SITES_AGG_LIMIT = 10;
const POOL_PER_DAY = 10;
const POOL_TEXT_LIMIT = 200;

const TOPIC_META = {
  "MSN": { name: "Masan Group", color: "#143F72" },
  "Vingroup - MSN": { name: "Vingroup", color: "#27AE60" },
  "MWG": { name: "MWG Thế Giới Di Động", color: "#E67E22" },
  "Hòa Phát": { name: "Hòa Phát", color: "#9B59B6" },
  "Vinamilk - MSN": { name: "Vinamilk", color: "#E74C3C" },
};
const FALLBACK_COLORS = ["#16A085", "#8E44AD", "#D35400", "#2E7EC7", "#7F8C8D"];

const EPOCH = Date.UTC(2026, 0, 1);
const pad2 = n => String(n).padStart(2, "0");

function monthLabel(day) {
  const dt = new Date(EPOCH + day * 86400000);
  return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}`;
}
function weekLabelA(day) {
  return `2026-${pad2(1 + Math.floor(day / 7))}`;
}
function weekLabelB(day) {
  return `2026-W${pad2(Math.floor(day / 7))}`;
}

function toDateStr(v) {
  if (v instanceof Date) return `${v.getUTCFullYear()}-${pad2(v.getUTCMonth() + 1)}-${pad2(v.getUTCDate())}`;
  if (typeof v === "number") {
    const d = XLSX.SSF.parse_date_code(v);
    return `${d.y}-${pad2(d.m)}-${pad2(d.d)}`;
  }
  return String(v).slice(0, 10);
}

function loadRows(file) {
  const wb = XLSX.readFile(file, { cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const sheet = XLSX.utils.sheet_to_json(ws, { defval: null });
  return sheet.map(r => {
    const date = toDateStr(r.PublishedDate);
    const day = Math.round((Date.parse(date) - EPOCH) / 86400000);
    const sentiment = META.sentiments.includes(r.Sentiment) ? r.Sentiment : "None";
    const label = META.labels.includes(r.Labels1) ? r.Labels1 : null;
    const interactions = (r.Likes || 0) + (r.Shares || 0) + (r.Comments || 0) + (r.Interactions || 0);
    return {
      topic: r.Topic, channel: r.Channel, sentiment, label,
      level: r.Level ?? null, site: r.SiteName || "",
      title: r.Title || "", content: r.Content || r.Description || "",
      url: r.UrlComment || r.UrlTopic || "",
      date, day, interactions,
    };
  });
}

function countBy(rows, keyFn) {
  const m = new Map();
  for (const r of rows) {
    const k = keyFn(r);
    if (k == null || k === "") continue;
    m.set(k, (m.get(k) || 0) + 1);
  }
  return m;
}

function topSites(rows, limit) {
  return [...countBy(rows, r => r.site)]
    .map(([site, count]) => ({ site, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function buildAllRowsB64(rows) {
  const buf = Buffer.alloc(rows.length * 6);
  rows.forEach((r, i) => {
    const o = i * 6;
    buf.writeUInt16LE(r.day, o);
    buf[o + 2] = META.topics.indexOf(r.topic);
    buf[o + 3] = META.channels.indexOf(r.channel);
    buf[o + 4] = r.sentiment === "Positive" ? 0 : r.sentiment === "Negative" ? 1 : 2;
    const li = r.label ? META.labels.indexOf(r.label) : -1;
    buf[o + 5] = li === -1 ? 255 : li;
  });
  return buf.toString("base64");
}

function buildSummary(rows) {
  let positive = 0, negative = 0, total_interactions = 0;
  for (const r of rows) {
    if (r.sentiment === "Positive") positive++;
    else if (r.sentiment === "Negative") negative++;
    total_interactions += r.interactions;
  }
  return { total: rows.length, positive, negative, neutral: rows.length - positive - negative, total_interactions };
}

function buildTrendWeekly(rows) {
  const m = new Map();
  for (const r of rows) {
    const w = weekLabelA(r.day);
    if (!m.has(w)) m.set(w, { week: w, total: 0, Positive: 0, Negative: 0, Neutral: 0 });
    const e = m.get(w);
    e.total++;
    if (r.sentiment === "Positive") e.Positive++;
    else if (r.sentiment === "Negative") e.Negative++;
    else e.Neutral++;
  }
  return [...m.values()].sort((a, b) => a.week < b.week ? -1 : 1);
}

function buildTrendDaily(rows) {
  const m = new Map();
  for (const r of rows) {
    if (!m.has(r.date)) m.set(r.date, { date: r.date, total: 0, Positive: 0, Negative: 0, Neutral: 0 });
    const e = m.get(r.date);
    e.total++;
    if (r.sentiment === "Positive") e.Positive++;
    else if (r.sentiment === "Negative") e.Negative++;
    else e.Neutral++;
  }
  return [...m.values()].sort((a, b) => a.date < b.date ? -1 : 1);
}

function buildNsrMonthly(rows) {
  const m = new Map();
  for (const r of rows) {
    const mo = monthLabel(r.day);
    if (!m.has(mo)) m.set(mo, { month: mo, total: 0, positive: 0, negative: 0, neutral: 0 });
    const e = m.get(mo);
    e.total++;
    if (r.sentiment === "Positive") e.positive++;
    else if (r.sentiment === "Negative") e.negative++;
    else e.neutral++;
  }
  return [...m.values()].sort((a, b) => a.month < b.month ? -1 : 1)
    .map(e => ({ ...e, nsr: e.total ? +((e.positive - e.negative) / e.total * 100).toFixed(1) : 0 }));
}

function buildChannels(rows) {
  const m = new Map();
  for (const r of rows) {
    if (!m.has(r.channel)) m.set(r.channel, { total: 0, Positive: 0, Negative: 0, Neutral: 0, None: 0 });
    const e = m.get(r.channel);
    e.total++;
    e[r.sentiment]++;
  }
  const out = {};
  for (const ch of META.channels) {
    if (!m.has(ch)) continue;
    const e = m.get(ch);
    const o = { total: e.total, Positive: e.Positive, Negative: e.Negative, Neutral: e.Neutral };
    if (e.None > 0) o.None = e.None;
    out[ch] = o;
  }
  return out;
}

function buildChMonth(rows) {
  const chans = [...MAIN_CHANNELS, "E-commerce"];
  const m = new Map();
  for (const r of rows) {
    const mo = monthLabel(r.day);
    if (!m.has(mo)) {
      const e = { month: mo };
      chans.forEach(c => { e[c] = 0; });
      m.set(mo, e);
    }
    const e = m.get(mo);
    if (chans.includes(r.channel)) e[r.channel]++;
  }
  return [...m.values()].sort((a, b) => a.month < b.month ? -1 : 1);
}

function buildTopLabels(rows) {
  return [...countBy(rows, r => r.label)]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildArticlesPool(rows, perDay) {
  const byDay = new Map();
  for (const r of rows) {
    if (!byDay.has(r.day)) byDay.set(r.day, []);
    byDay.get(r.day).push(r);
  }
  const out = [];
  for (const [day, dayRows] of byDay) {
    for (const r of shuffle(dayRows).slice(0, perDay)) {
      out.push({
        day, date: r.date, title: r.title.slice(0, POOL_TEXT_LIMIT), content: r.content.slice(0, POOL_TEXT_LIMIT),
        site: r.site, channel: r.channel,
        sentiment: r.sentiment === "None" ? "Neutral" : r.sentiment,
        label: r.label || "", interactions: r.interactions, url: r.url,
      });
    }
  }
  return out.sort((a, b) => a.day - b.day);
}

function buildArticles(rows, limit) {
  return [...rows]
    .sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0)
    .slice(0, limit)
    .map(r => ({
      title: r.title, content: r.content, date: r.date, site: r.site, channel: r.channel,
      sentiment: r.sentiment === "None" ? "Neutral" : r.sentiment,
      label: r.label || "", level: r.level != null ? String(r.level) : "",
      interactions: r.interactions, url: r.url,
    }));
}

function buildNegative(rows) {
  const neg = rows.filter(r => r.sentiment === "Negative");
  const by_level = { 1: 0, 2: 0, 3: 0, None: 0 };
  for (const r of neg) {
    const lvl = r.level != null && r.level !== "" ? String(r.level) : "None";
    by_level[lvl] = (by_level[lvl] || 0) + 1;
  }
  const trend = [...countBy(neg, r => weekLabelA(r.day))]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date < b.date ? -1 : 1);
  const topics = [...countBy(neg, r => r.label)]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);
  return {
    total: neg.length,
    by_level,
    by_channel: Object.fromEntries(countBy(neg, r => r.channel)),
    trend,
    topics,
    articles: buildArticles(neg, NEG_ARTICLE_LIMIT),
  };
}

function buildBod(rows) {
  const bod = rows.filter(r => r.label === "Ban lãnh đạo");
  let positive = 0, negative = 0;
  const trendMap = new Map();
  for (const r of bod) {
    if (r.sentiment === "Positive") positive++;
    else if (r.sentiment === "Negative") negative++;
    const w = weekLabelA(r.day);
    if (!trendMap.has(w)) trendMap.set(w, { date: w, Positive: 0, Negative: 0, total: 0 });
    const e = trendMap.get(w);
    e.total++;
    if (r.sentiment === "Positive") e.Positive++;
    else if (r.sentiment === "Negative") e.Negative++;
  }
  const trend = [...trendMap.values()].sort((a, b) => a.date < b.date ? -1 : 1);
  return {
    total: bod.length,
    sentiment: { Neutral: bod.length - positive - negative, Positive: positive, Negative: negative },
    by_channel: Object.fromEntries(countBy(bod, r => r.channel)),
    trend,
    neg_trend: trend.map(e => ({ date: e.date, count: e.Negative })),
    top_sites: topSites(bod, 10),
  };
}

function buildIr(rows) {
  const ir = rows.filter(r => r.label === "Cổ phiếu, chứng khoán");
  let positive = 0, negative = 0;
  const trendMap = new Map();
  for (const r of ir) {
    if (r.sentiment === "Positive") positive++;
    else if (r.sentiment === "Negative") negative++;
    const w = weekLabelA(r.day);
    if (!trendMap.has(w)) trendMap.set(w, { week: w, total: 0, Positive: 0, Negative: 0 });
    const e = trendMap.get(w);
    e.total++;
    if (r.sentiment === "Positive") e.Positive++;
    else if (r.sentiment === "Negative") e.Negative++;
  }
  return {
    total: ir.length,
    sentiment: { Neutral: ir.length - positive - negative, Negative: negative, Positive: positive },
    trend_weekly: [...trendMap.values()].sort((a, b) => a.week < b.week ? -1 : 1),
    top_sites: topSites(ir, 10),
  };
}

function buildRaw(rows) {
  return {
    summary: buildSummary(rows),
    trend_weekly: buildTrendWeekly(rows),
    trend_daily: buildTrendDaily(rows),
    nsr_monthly: buildNsrMonthly(rows),
    channels: buildChannels(rows),
    ch_month: buildChMonth(rows),
    top_labels: buildTopLabels(rows),
    top_sites: topSites(rows, TOP_SITES_LIMIT),
    articles: buildArticles(rows, ARTICLE_LIMIT),
    negative: buildNegative(rows),
    bod: buildBod(rows),
    ir: buildIr(rows),
  };
}

function buildRawChannels(rows) {
  const out = {};
  for (const ch of META.channels) {
    const chRows = rows.filter(r => r.channel === ch);
    if (!chRows.length) continue;
    let positive = 0, negative = 0;
    const wkMap = new Map();
    for (const r of chRows) {
      if (r.sentiment === "Positive") positive++;
      else if (r.sentiment === "Negative") negative++;
      const w = weekLabelB(r.day);
      if (!wkMap.has(w)) wkMap.set(w, { week: w, total: 0, Positive: 0, Negative: 0 });
      const e = wkMap.get(w);
      e.total++;
      if (r.sentiment === "Positive") e.Positive++;
      else if (r.sentiment === "Negative") e.Negative++;
    }
    out[ch] = {
      total: chRows.length, Positive: positive, Negative: negative, Neutral: chRows.length - positive - negative,
      trend_weekly: [...wkMap.values()].sort((a, b) => a.week < b.week ? -1 : 1),
      top_sites: topSites(chRows, CHANNEL_SITES_LIMIT),
    };
  }
  return out;
}

function buildComp(allRows) {
  const totalAll = allRows.length;
  const order = [];
  for (const r of allRows) if (!order.includes(r.topic)) order.push(r.topic);
  if (order.length > 1 && order[0] !== MAIN_TOPIC && order.includes(MAIN_TOPIC)) {
    order.splice(order.indexOf(MAIN_TOPIC), 1);
    order.unshift(MAIN_TOPIC);
  }

  const comp_summary = order.map((topic, idx) => {
    const tRows = allRows.filter(r => r.topic === topic);
    let positive = 0, negative = 0;
    const channels = {};
    for (const r of tRows) {
      if (r.sentiment === "Positive") positive++;
      else if (r.sentiment === "Negative") negative++;
      channels[r.channel] = (channels[r.channel] || 0) + 1;
    }
    const total = tRows.length;
    const ch_pct = {};
    for (const c of META.channels) ch_pct[c] = +(((channels[c] || 0) / total) * 100).toFixed(2);
    const top_channels = Object.fromEntries(Object.entries(channels).sort((a, b) => b[1] - a[1]));
    const meta = TOPIC_META[topic] || { name: topic.replace(/ - MSN$/, ""), color: FALLBACK_COLORS[idx % FALLBACK_COLORS.length] };
    return {
      topic, name: meta.name, color: meta.color, total,
      Positive: positive, Negative: negative, Neutral: total - positive - negative,
      nsr: total ? +((positive - negative) / total * 100).toFixed(1) : 0,
      pct: +((total / totalAll) * 100).toFixed(2),
      channels, ch_pct, top_channels,
      top_sites: topSites(tRows, COMP_SITES_LIMIT),
    };
  });

  const nameByTopic = new Map(comp_summary.map(c => [c.topic, c.name]));
  const wkMap = new Map();
  for (const r of allRows) {
    const w = weekLabelA(r.day);
    if (!wkMap.has(w)) {
      const e = { week: w };
      comp_summary.forEach(c => { e[c.name] = 0; });
      wkMap.set(w, e);
    }
    wkMap.get(w)[nameByTopic.get(r.topic)]++;
  }
  const trend_comp = [...wkMap.values()].sort((a, b) => a.week < b.week ? -1 : 1);

  return { comp_summary, trend_comp, total_all: totalAll };
}

function buildSitesAgg(allRows) {
  const groups = new Map();
  for (const r of allRows) {
    if (!r.label || !r.site) continue;
    const ti = META.topics.indexOf(r.topic);
    const li = META.labels.indexOf(r.label);
    if (ti < 0 || li < 0) continue;
    const key = `${ti},${li}`;
    if (!groups.has(key)) groups.set(key, new Map());
    const m = groups.get(key);
    m.set(r.site, (m.get(r.site) || 0) + 1);
  }
  const out = {};
  for (const [key, m] of groups) {
    out[key] = [...m.entries()].map(([s, c]) => ({ s, c })).sort((a, b) => b.c - a.c).slice(0, SITES_AGG_LIMIT);
  }
  return out;
}

function writeJson(name, data) {
  const file = path.join(OUT_DIR, name);
  fs.writeFileSync(file, JSON.stringify(data));
  console.log(`  wrote ${name} (${(fs.statSync(file).size / 1024).toFixed(1)} KB)`);
}

function main() {
  if (!fs.existsSync(INPUT)) {
    console.error(`Input file not found: ${INPUT}\nPass the path to an .xlsx export as the first argument.`);
    process.exit(1);
  }
  console.log(`Reading ${INPUT} ...`);
  const allRows = loadRows(INPUT);
  console.log(`Loaded ${allRows.length} rows`);

  const mainRows = allRows.filter(r => r.topic === MAIN_TOPIC);
  if (!mainRows.length) {
    console.error(`No rows found for topic "${MAIN_TOPIC}"`);
    process.exit(1);
  }
  console.log(`Main topic "${MAIN_TOPIC}": ${mainRows.length} rows`);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  writeJson("raw.json", buildRaw(mainRows));
  writeJson("rawChannels.json", buildRawChannels(mainRows));
  writeJson("allRowsB64.json", buildAllRowsB64(mainRows));
  writeJson("comp.json", buildComp(allRows));
  writeJson("sitesAgg.json", buildSitesAgg(allRows));
  writeJson("articlesPool.json", buildArticlesPool(mainRows, POOL_PER_DAY));

  console.log(`Done. Output: ${OUT_DIR}`);
}

main();
