import { useMemo } from "react";
import { useFC } from "../../context/FilterContext";
import { META } from "../../constants/meta";
import POOL from "../../data/articlesPool.json";

const DATE_FROM = "2026-04-23";
const DATE_TO = "2026-05-22";
const TOTAL_DAYS = 30;

export function useCampaignData(campaign) {
  const fc = useFC();

  return useMemo(() => {
    const applied = fc?.applied ?? {};

    // Date factor: how many campaign days are within the selected range
    const df = applied.dateFrom ?? DATE_FROM;
    const dt = applied.dateTo ?? DATE_TO;
    const effFrom = df > DATE_FROM ? df : DATE_FROM;
    const effTo = dt < DATE_TO ? dt : DATE_TO;
    const days = Math.max(0, Math.round((new Date(effTo) - new Date(effFrom)) / 86400000) + 1);
    const dateFactor = Math.min(1, days / TOTAL_DAYS);

    // Channel factor
    const chIdx = applied.channel ?? -1;
    const chName = chIdx >= 0 ? META.channels[chIdx] : null;
    const chFactor = chName ? (campaign.channelShares[chName] ?? 0.02) : 1;

    // Label factor
    const lblIdx = applied.label ?? -1;
    const lblName = lblIdx >= 0 ? META.labels[lblIdx] : null;
    const lblFactor = lblName ? (campaign.labelShares[lblName] ?? 0.04) : 1;

    // Sentiment filter
    const sentIdx = applied.sentiment ?? -1;
    const sentName = sentIdx >= 0 ? META.sentiments[sentIdx] : null;

    // Scale
    const scale = dateFactor * chFactor * lblFactor;
    const baseNeu = Math.max(0, campaign.baseTotal - campaign.baseNegative - campaign.basePositive);

    let pos = sentName === "Negative" || sentName === "Neutral" ? 0 : Math.round(campaign.basePositive * scale);
    let neg = sentName === "Positive" || sentName === "Neutral" ? 0 : Math.round(campaign.baseNegative * scale);
    let neu = sentName === "Positive" || sentName === "Negative" ? 0 : Math.round(baseNeu * scale);
    if (sentName === "Neutral") neu = Math.round(campaign.baseTotal * scale);

    pos = Math.max(0, pos);
    neg = Math.max(0, neg);
    neu = Math.max(0, neu);
    const total = pos + neg + neu;
    const positivePct = total > 0 ? Math.round(pos / total * 1000) / 10 : 0;
    const negativePct = total > 0 ? Math.round(neg / total * 1000) / 10 : 0;
    const neutralPct = total > 0 ? Math.round((100 - positivePct - negativePct) * 10) / 10 : 100;

    // Scale trendStats by full scale factor
    const trendStats = {
      mxh: Math.round(campaign.trendStats.mxh * scale),
      baichi: Math.round(campaign.trendStats.baichi * scale),
      khac: Math.round(campaign.trendStats.khac * scale),
    };

    // Filter trendData by date range, scale per-point values by chFactor * lblFactor
    const pointScale = chFactor * lblFactor;
    const trendData = campaign.trendData
      .filter(d => {
        const [day, mon] = d.date.split("/");
        const fullDate = `2026-${mon}-${day}`;
        return fullDate >= df && fullDate <= dt;
      })
      .map(d => ({
        ...d,
        mxh: Math.round(d.mxh * pointScale),
        baichi: Math.round(d.baichi * pointScale),
        khac: Math.round(d.khac * pointScale),
      }));

    // Scale channelRatio total, keep breakdown percentages unchanged
    const channelRatio = {
      total: Math.round(campaign.channelRatio.total * scale),
      breakdown: campaign.channelRatio.breakdown,
    };

    // Scale topics counts
    const topics = campaign.topics.map(t => ({
      ...t,
      count: Math.max(0, Math.round(t.count * scale)),
    }));

    // Scale topSources stats
    const topSources = campaign.topSources.map(s => ({
      ...s,
      interactions: Math.round(s.interactions * scale),
      posts: Math.max(1, Math.round(s.posts * scale)),
      views: Math.round(s.views * scale),
    }));

    // Filter articles from pool
    let arts = POOL.filter(a =>
      a.title && a.content &&
      a.date >= DATE_FROM && a.date <= DATE_TO
    );
    if (chName) arts = arts.filter(a => a.channel === chName);
    if (sentName) arts = arts.filter(a => a.sentiment === sentName);
    if (lblName) arts = arts.filter(a => a.label === lblName);
    if (df > DATE_FROM) arts = arts.filter(a => a.date >= df);
    if (dt < DATE_TO) arts = arts.filter(a => a.date <= dt);

    // Deduplicate
    const seen = new Set();
    arts = arts
      .filter(a => seen.has(a.title) ? false : (seen.add(a.title), true))
      .sort((a, b) => b.date.localeCompare(a.date));

    // THISO shows oldest first
    if (campaign.id === "thiso") arts = [...arts].reverse();

    return {
      ...campaign,
      negative: neg,
      positive: pos,
      total,
      positivePct,
      negativePct,
      neutralPct,
      noNegativeNote: neg === 0,
      trendStats,
      trendData,
      channelRatio,
      topics,
      topSources,
      articles: arts,
    };
  }, [fc?.applied, campaign]);
}
