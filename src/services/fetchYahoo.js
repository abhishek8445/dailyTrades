import axios from 'axios';

/**
 * Fetch daily candles from Yahoo Finance YQL style endpoint.
 * Symbol examples: 'TCS.NS', 'RELIANCE.NS', 'SBIN.NS', or 'AAPL'.
 */
export async function fetchDailyCandles(symbol, range = '6mo', interval = '1d') {
  if (process.env.OFFLINE === 'true') {
    // Return mock data: 120 days of synthetic candles
    const today = new Date();      
    const candles = [];
    let price = 100 + Math.random() * 50;
    for (let i = 0; i < 120; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - (120 - i));
      const change = (Math.random() - 0.5) * 2;
      const open = price;
      const close = Math.max(1, price + change);
      const high = Math.max(open, close) + Math.random();
      const low = Math.min(open, close) - Math.random();
      const volume = Math.floor(1e6 + Math.random() * 5e6);
      candles.push({ date: d.toISOString(), open, high, low, close, volume });
      price = close;
    }
    return candles;
  }

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;
  const { data } = await axios.get(url);

  const result = data?.chart?.result?.[0];
  const timestamps = result?.timestamp || [];
  const ind = result?.indicators?.quote?.[0] || {};
  const candles = timestamps.map((ts, i) => ({
    date: new Date(ts * 1000).toISOString(),
    open: ind.open?.[i] ?? null,
    high: ind.high?.[i] ?? null,
    low: ind.low?.[i] ?? null,
    close: ind.close?.[i] ?? null,
    volume: ind.volume?.[i] ?? null,
  })).filter(c => c.close != null);
  return candles;
}
