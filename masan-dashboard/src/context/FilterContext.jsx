import { createContext, useContext, useState, useMemo } from "react";
import { ALL_ROWS, dateToDayOff, computeAgg, peakDay } from "../utils/aggregation";

const DEFAULT_FILTERS = { dateFrom: "2026-01-01", dateTo: "2026-05-31", channel: -1, topic: -1, label: -1, sentiment: -1 };

export const FilterCtx = createContext(null);

export function FilterProvider({ children }) {
  const [draft, setDraft] = useState(DEFAULT_FILTERS);
  const [applied, setApplied] = useState(DEFAULT_FILTERS);

  const applyFilters = () => setApplied({ ...draft });
  const resetFilters = () => { setDraft(DEFAULT_FILTERS); setApplied(DEFAULT_FILTERS); };

  const filteredRows = useMemo(() => {
    const fd = dateToDayOff(applied.dateFrom), td = dateToDayOff(applied.dateTo);
    return ALL_ROWS.filter(([day, ti, ci, si, li]) => {
      if (day < fd || day > td) return false;
      if (applied.channel >= 0 && ci !== applied.channel) return false;
      if (applied.topic >= 0 && ti !== applied.topic) return false;
      if (applied.label >= 0 && li !== applied.label) return false;
      if (applied.sentiment >= 0 && si !== applied.sentiment) return false;
      return true;
    });
  }, [applied]);

  const agg = useMemo(() => computeAgg(filteredRows), [filteredRows]);
  const peak = useMemo(() => peakDay(filteredRows), [filteredRows]);

  return (
    <FilterCtx.Provider value={{ draft, setDraft, applyFilters, resetFilters, agg, applied, filteredRows, peak }}>
      {children}
    </FilterCtx.Provider>
  );
}

export const useFC = () => useContext(FilterCtx);
