# DailyTrades Backend

## Setup
1. `cp .env.example .env` and fill values.
2. `npm install`
3. Start MongoDB locally (or point MONGO_URI to Atlas).
4. `npm run dev`

## Endpoints
- `POST /api/auth/register { email, password }`
- `POST /api/auth/login { email, password }` → `{ token }`
- `POST /api/stock/ingest/:symbol` (auth required) → cache candles in Mongo
- `GET /api/stock/:symbol/indicators` → candles, RSI(14), EMA(10/20/50/200), risk/reward
- `GET /api/stock/top500` → mock list of ~10 Indian large caps ranked by risk/reward

## Notes
- Data fetcher uses Yahoo endpoint. Set `OFFLINE=true` to use synthetic candles if rate limited.
