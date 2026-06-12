export const T = {
  bg: "#F0F5FA",
  navy: "#143F72",
  navyDark: "#0D2444",
  white: "#FFFFFF",
  border: "#D5E3F0",
  cardBorder: "#E3EDF7",
  textPrimary: "#1A2B4A",
  textSub: "#6E7F99",
  textLight: "#9AAABF",
  peach: "#FDC094",
  positive: "#27AE60",
  negative: "#E74C3C",
  neutral: "#8899AA",
  btnSearch: "#143F72",
  btnDownload: "#2E7EC7",
};

export const CH_COLOR = { Facebook: "#1877F2", Tiktok: "#111", Youtube: "#FF0000", News: "#F39C12", Social: "#8E44AD", Forum: "#16A085", Threads: "#333", Other: "#95A5A6" };

export const fmt = n => n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : String(n || 0);
export const pct = (n, t) => t ? ((n / t) * 100).toFixed(1) + "%" : "0%";
export const nsr = (p, n, t) => t ? (((p - n) / t) * 100).toFixed(1) : "0";
export const fmtW = s => { if (!s) return ""; const p = s.split("-"); return (p[2] || "") + "/" + (p[1] || ""); };
export const fmtM = s => { if (!s) return ""; const [, m] = s.split("-"); return ["", "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"][+m] || s; };
