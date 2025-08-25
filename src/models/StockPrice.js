import mongoose from 'mongoose';

/**
 * Simple OHLCV candle storage by symbol & date (daily).
 */
const candleSchema = new mongoose.Schema({
  symbol: { type: String, index: true },
  date: { type: Date, index: true },
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  volume: Number,
}, { _id: false });

const stockPriceSchema = new mongoose.Schema({
  symbol: { type: String, index: true },
  candles: [candleSchema],
}, { timestamps: true });

stockPriceSchema.index({ symbol: 1 });

export default mongoose.model('StockPrice', stockPriceSchema);
