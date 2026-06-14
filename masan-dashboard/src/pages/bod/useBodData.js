import { useMemo } from "react";
import { useFC } from "../../context/FilterContext";

const BASE_MAX_DAY = 119;

const TIME_SLOTS = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];

// ── 30d: primary source of truth ──────────────────────────────────────────────
// 4-week pattern: steady wk1 → earnings spike day15-16 → minor crisis day18-19 → recovery
// Sum P=958, Sum N=588  →  avg ~32P/day, ~20N/day
const MOCK_30D_P = [
  22, 35, 48, 31, 18,  8, 12,   // wk1
  28, 52, 44, 38, 25, 11,  9,   // wk2
  67, 83, 45, 32, 19,  7, 15,   // wk3 (ĐHCĐ spike)
  41, 58, 42, 35, 28, 13, 10,   // wk4
  37, 45,                        // days 29-30
];
const MOCK_30D_N = [
  15, 22, 31, 24, 18,  5,  8,
  19, 28, 35, 22, 18,  7,  6,
  21, 19, 42, 28, 31,  4,  9,
  25, 18, 31, 22, 15,  6,  8,
  29, 22,
];

// ── 7d: last 7 days of the 30d array (indices 23-29) ─────────────────────────
// Sum P=210, Sum N=133  →  consistent with 30d (7/30 ≈ 23%)
const MOCK_7D_P = MOCK_30D_P.slice(-7);   // [42,35,28,13,10,37,45]
const MOCK_7D_N = MOCK_30D_N.slice(-7);   // [31,22,15, 6, 8,29,22]

// ── 24h: last day (day 30) distributed across 8 × 3h time slots ──────────────
// Day 30 total: P=45, N=22  →  consistent with 7d (one day ≈ 7d/7 = 30, slightly above avg = recent activity)
const MOCK_24H_P = [ 3,  2,  2,  6,  8,  7, 11,  6];  // sum=45
const MOCK_24H_N = [ 4,  2,  1,  4,  5,  3,  2,  1];  // sum=22

function sum(arr) { return arr.reduce((a, b) => a + b, 0); }

// Seeded per-point variance: returns multiplier in [0.75, 1.25]
// seed=0 means no variance (initial/reset state)
export function varyFactor(seed, idx) {
  if (seed === 0) return 1;
  const x = Math.sin(seed * 127.1 + idx * 311.7) * 43758.5453;
  return 0.75 + (x - Math.floor(x)) * 0.5;
}

function dayLabel(day) {
  const dt = new Date("2026-01-01");
  dt.setDate(dt.getDate() + day);
  return String(dt.getDate()).padStart(2, "0") + "/" + String(dt.getMonth() + 1).padStart(2, "0");
}

const P24_BASE  = sum(MOCK_24H_P);
const N24_BASE  = sum(MOCK_24H_N);
const P7D_BASE  = sum(MOCK_7D_P);
const N7D_BASE  = sum(MOCK_7D_N);
const P30D_BASE = sum(MOCK_30D_P);
const N30D_BASE = sum(MOCK_30D_N);

// Channel distributions — counts scaled to match buzz totals (24h≈200, 7d≈1029, 30d≈4638)
const CHANNEL_24H = [
  { name: "Facebook", count:  90, value: 45.0 },
  { name: "Social",   count:  50, value: 25.0 },
  { name: "Tiktok",   count:  30, value: 15.0 },
  { name: "News",     count:  20, value: 10.0 },
  { name: "Forum",    count:  10, value:  5.0 },
];
const CHANNEL_7D = [
  { name: "Facebook", count:  412, value: 40.0 },
  { name: "Social",   count:  288, value: 28.0 },
  { name: "Tiktok",   count:  185, value: 18.0 },
  { name: "News",     count:  124, value: 12.0 },
  { name: "Forum",    count:   21, value:  2.0 },
];
const CHANNEL_30D = [
  { name: "Facebook", count: 1806, value: 39.0 },
  { name: "Social",   count: 1297, value: 28.0 },
  { name: "Tiktok",   count:  927, value: 20.0 },
  { name: "News",     count:  463, value: 10.0 },
  { name: "Forum",    count:   93, value:  2.0 },
  { name: "Threads",  count:   46, value:  1.0 },
];

// Sentiment filter scale factors
const SENT_SCALE = [0.55, 0.28, 0.17]; // Positive-only, Negative-only, Neutral-only
// Channel filter scale factors (index matches META.channels)
const CH_SCALE = [0.39, 0.28, 0.20, 0.10, 0.02, 0.02, 0.02, 0.02, 0.02];

const EMPTY_SENT = { Positive: 0, Negative: 0, Neutral: 0, total: 0 };
const EMPTY = {
  trend24h:  TIME_SLOTS.map(t => ({ time: t, Positive: 0, Negative: 0, day: 0 })),
  trend7d:   Array.from({ length: 7  }, (_, i) => ({ time: "--/--", Positive: 0, Negative: 0, day: i })),
  trend30d:  Array.from({ length: 30 }, (_, i) => ({ time: "--/--", Positive: 0, Negative: 0, day: i })),
  sentiment24h: EMPTY_SENT, sentiment7d: EMPTY_SENT, sentiment30d: EMPTY_SENT,
  channel24h: [], channel7d: [], channel30d: [],
  maxDay: 0,
};

function filterChannels(list, chIdx) {
  if (chIdx < 0) return list;
  const name = list[chIdx]?.name ?? null;
  return name ? list.filter(c => c.name === name) : list;
}

export function useBodData() {
  const fc = useFC();
  return useMemo(() => {
    const applied = fc?.applied ?? {};
    const sentIdx = applied.sentiment ?? -1;
    const chIdx   = applied.channel   ?? -1;
    const seed    = fc?.randomSeed ?? 0;

    let scale = 1.0;
    if (sentIdx >= 0 && sentIdx < SENT_SCALE.length) scale *= SENT_SCALE[sentIdx];
    if (chIdx   >= 0 && chIdx   < CH_SCALE.length)   scale *= CH_SCALE[chIdx];

    const scv = (n, idx) => Math.max(0, Math.round(n * scale * varyFactor(seed, idx)));
    const maxDay = BASE_MAX_DAY;
    const neu = (p, n) => Math.round((p + n) * 2.0);

    // trend24h: idx 0-15
    const trend24h = TIME_SLOTS.map((time, i) => ({
      time, day: maxDay,
      Positive: scv(MOCK_24H_P[i], i * 2),
      Negative: scv(MOCK_24H_N[i], i * 2 + 1),
    }));
    // trend7d: idx 20-33
    const trend7d = Array.from({ length: 7 }, (_, i) => ({
      time: dayLabel(maxDay - 6 + i), day: maxDay - 6 + i,
      Positive: scv(MOCK_7D_P[i], 20 + i * 2),
      Negative: scv(MOCK_7D_N[i], 20 + i * 2 + 1),
    }));
    // trend30d: idx 40-99
    const trend30d = Array.from({ length: 30 }, (_, i) => ({
      time: dayLabel(maxDay - 29 + i), day: maxDay - 29 + i,
      Positive: scv(MOCK_30D_P[i], 40 + i * 2),
      Negative: scv(MOCK_30D_N[i], 40 + i * 2 + 1),
    }));

    // sentiment aggregates: idx 100-105
    const P24  = scv(P24_BASE, 100);  const N24  = scv(N24_BASE, 101);
    const P7d  = scv(P7D_BASE, 102);  const N7d  = scv(N7D_BASE, 103);
    const P30d = scv(P30D_BASE, 104); const N30d = scv(N30D_BASE, 105);

    // channel data with variance: idx 110+
    const applyChannelVariance = (list, baseIdx) => {
      const varied = list.map((c, i) => ({
        ...c,
        count: scv(c.count, baseIdx + i),
      }));
      const total = varied.reduce((s, c) => s + c.count, 0);
      return varied.map(c => ({
        ...c,
        value: total > 0 ? Math.round(c.count / total * 1000) / 10 : 0,
      }));
    };

    return {
      trend24h, trend7d, trend30d,
      sentiment24h: { Positive: P24,  Negative: N24,  Neutral: neu(P24,N24),   total: P24+N24+neu(P24,N24)   },
      sentiment7d:  { Positive: P7d,  Negative: N7d,  Neutral: neu(P7d,N7d),   total: P7d+N7d+neu(P7d,N7d)   },
      sentiment30d: { Positive: P30d, Negative: N30d, Neutral: neu(P30d,N30d), total: P30d+N30d+neu(P30d,N30d) },
      channel24h: applyChannelVariance(filterChannels(CHANNEL_24H, chIdx), 110),
      channel7d:  applyChannelVariance(filterChannels(CHANNEL_7D,  chIdx), 120),
      channel30d: applyChannelVariance(filterChannels(CHANNEL_30D, chIdx), 130),
      maxDay,
    };
  }, [fc?.applied, fc?.randomSeed]);
}

export function useBodSentimentForPeriod(period) {
  const fc = useFC();
  return useMemo(() => {
    const applied = fc?.applied ?? {};
    const sentIdx = applied.sentiment ?? -1;
    const chIdx   = applied.channel   ?? -1;
    const seed    = fc?.randomSeed ?? 0;

    let scale = 1.0;
    if (sentIdx >= 0 && sentIdx < SENT_SCALE.length) scale *= SENT_SCALE[sentIdx];
    if (chIdx   >= 0 && chIdx   < CH_SCALE.length)   scale *= CH_SCALE[chIdx];

    const start = Math.max(0, 30 - period);
    // idx 140-141 so they don't collide with useBodData indices
    const P   = Math.max(0, Math.round(sum(MOCK_30D_P.slice(start)) * scale * varyFactor(seed, 140)));
    const N   = Math.max(0, Math.round(sum(MOCK_30D_N.slice(start)) * scale * varyFactor(seed, 141)));
    const Neu = Math.round((P + N) * 2.0);
    return { Positive: P, Negative: N, Neutral: Neu, total: P + N + Neu };
  }, [fc?.applied, fc?.randomSeed, period]);
}
