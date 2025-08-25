/**
 * Very simple risk/reward calc: use recent swing high/low window N.
 * R/R = (reward)/(risk) where reward = high - close, risk = close - low.
 */
export function riskRewardFromWindow(candles, window = 20) {
  if (!candles?.length) return null;
  const recent = candles.slice(-window);
  const highs = recent.map(c => c.high);
  const lows = recent.map(c => c.low);
  const closes = recent.map(c => c.close);
  const close = closes[closes.length - 1];
  const high = Math.max(...highs);
  const low = Math.min(...lows);
  const risk = Math.max(0.01, close - low); // avoid division by zero
  const reward = Math.max(0, high - close);
  const ratio = reward / risk;
  return { recentHigh: high, recentLow: low, close, risk, reward, ratio };
}
