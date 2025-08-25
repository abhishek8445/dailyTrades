import { Router } from 'express';
import StockPrice from '../models/StockPrice.js';
import { fetchDailyCandles } from '../services/fetchYahoo.js';
import { ema, rsi } from '../utils/indicators.js';
import { riskRewardFromWindow } from '../utils/riskReward.js';
import { requireAuth } from './auth.js';

const router = Router();

// Ingest/update candles and store in Mongo for caching
router.post('/ingest/:symbol', requireAuth, async (req, res) => {
  try {
    const { symbol } = req.params;
    const candles = await fetchDailyCandles(symbol);
    console.log(candles , '==============')
    let doc = await StockPrice.findOne({ symbol });
    if (!doc) doc = await StockPrice.create({ symbol, candles });
    else { doc.candles = candles; await doc.save(); }
    return res.json({ ok: true, symbol, count: candles.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// indicators: RSI + multiple EMAs
router.get('/:symbol/indicators', async (req, res) => {
  try {
    const { symbol } = req.params;
    let doc = await StockPrice.findOne({ symbol });
    let candles = doc?.candles;
    if (!candles?.length) {
      candles = await fetchDailyCandles(symbol);
    }
    const closes = candles.map(c => c.close);
    const ema10 = ema(closes, 10);
    const ema20 = ema(closes, 20);
    const ema50 = ema(closes, 50);
    const ema200 = ema(closes, 200);
    const rsi14 = rsi(closes, 14);
    const riskReward = riskRewardFromWindow(candles, 20);
    return res.json({ symbol, candles, ema: { ema10, ema20, ema50, ema200 }, rsi14, riskReward });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Top 500 mock endpoint (for demo) - replace with real NIFTY 500 universe if available
router.get('/top500', async (_req, res) => {
  try {
    const universe = ['RELIANCE.NS','TCS.NS','INFY.NS','HDFCBANK.NS','ICICIBANK.NS','SBIN.NS','BHARTIARTL.NS','HINDUNILVR.NS','ITC.NS','LT.NS'];
    const rows = await Promise.all(universe.map(async (symbol) => {
      let candles;
      try { candles = await fetchDailyCandles(symbol); } catch { candles = []; }
      const rr = riskRewardFromWindow(candles, 20) || { ratio: 0, close: null };
      return { symbol, ratio: rr.ratio, close: rr.close };
    }));
    const sorted = rows.sort((a,b) => (b.ratio||0) - (a.ratio||0)).slice(0, 500);
    res.json({ count: sorted.length, data: sorted });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
