/**
 * Technical indicators: EMA and RSI (14 default).
 */

export function ema(values, period) {
  if (!values?.length || period <= 0) return [];
  const k = 2 / (period + 1);
  const result = [];
  let prev;
  values.forEach((v, i) => {
    if (i === 0) {
      prev = v;
      result.push(v);
    } else {
      const next = v * k + prev * (1 - k);
      result.push(next);
      prev = next;
    }
  });
  return result;
}

export function rsi(closes, period = 14) {
  if (closes.length < period + 1) return [];
  const gains = [];
  const losses = [];
  for (let i = 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    gains.push(Math.max(0, diff));
    losses.push(Math.max(0, -diff));
  }
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const rsiArr = new Array(period).fill(null);
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const value = 100 - (100 / (1 + rs));
    rsiArr.push(value);
  }
  return rsiArr;
}
