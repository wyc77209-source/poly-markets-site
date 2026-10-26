// Pure logic: markets, fee math, intent parser. Works in browser and node.
(function (root) {
  const FEE_BPS = 30; // visible commission: 30 bps = 0.30%
  const MARKETS = [
    { id: 'fed-cut', zh: '美联储下个月降息', en: 'Fed cuts rates next month', price: 0.62, kw: ['美联储', '降息', 'fed', 'rate cut', 'cut rates', 'interest'] },
    { id: 'btc-100k', zh: '比特币年底高于10万美元', en: 'Bitcoin above $100k by year end', price: 0.48, kw: ['比特币', 'btc', 'bitcoin', '10万', '100k'] },
    { id: 'rain-nyc', zh: '纽约明天下雨', en: 'Rain in New York tomorrow', price: 0.35, kw: ['下雨', '纽约', 'rain', 'new york', 'nyc'] },
    { id: 'world-cup', zh: '巴西赢得下届世界杯', en: 'Brazil wins next World Cup', price: 0.14, kw: ['巴西', '世界杯', 'brazil', 'world cup'] },
    { id: 'ai-gold', zh: 'AI 获得国际数学奥赛金牌', en: 'AI wins IMO gold medal', price: 0.71, kw: ['奥赛', '数学', 'imo', 'math olympiad', 'ai'] },
    { id: 'mars', zh: '2030年前人类登陆火星', en: 'Humans land on Mars before 2030', price: 0.09, kw: ['火星', 'mars'] },
    { id: 'oil-90', zh: '油价月底超过90美元', en: 'Oil above $90 at month end', price: 0.27, kw: ['油价', '石油', 'oil'] },
    { id: 'movie', zh: '新漫威电影首周票房破2亿', en: 'New Marvel film opens above $200M', price: 0.41, kw: ['漫威', '票房', 'marvel', 'box office', 'movie'] },
  ];
  const STOCKS = [
    { id: 'TSLA', zh: '特斯拉', en: 'Tesla', price: 250, kw: ['特斯拉', 'tesla', 'tsla'] },
    { id: 'AAPL', zh: '苹果', en: 'Apple', price: 190, kw: ['苹果', 'apple', 'aapl'] },
    { id: 'NVDA', zh: '英伟达', en: 'Nvidia', price: 120, kw: ['英伟达', 'nvidia', 'nvda'] },
  ];
  // Example cross-venue quotes (made up) for the radar
  const VENUES = [
    { id: 'fed-cut', a: 0.60, b: 0.66 }, { id: 'btc-100k', a: 0.47, b: 0.49 },
    { id: 'world-cup', a: 0.12, b: 0.17 }, { id: 'oil-90', a: 0.27, b: 0.28 },
  ];
  const round2 = (x) => Math.round(x * 100) / 100;
  const fee = (amount, bps = FEE_BPS) => round2(amount * bps / 10000);
  // Arb: buy YES at a, buy NO at (1-b) on other venue; payout 1 per pair.
  function arb(a, b, amount, bps = FEE_BPS) {
    const cost = a + (1 - b); // per pair
    const pairs = amount / cost;
    const gross = round2(pairs * 1 - amount);
    const fees = fee(amount, bps) * 2; // both legs
    return { spread: round2(b - a), gross, fees: round2(fees), net: round2(gross - fees) };
  }
  const CN_NUM = { 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10, 百: 100, 千: 1000, 万: 10000 };
  function cnToNum(s) {
    let total = 0, cur = 0;
    for (const ch of s) { const v = CN_NUM[ch]; if (v >= 10) { total += (cur || 1) * v; cur = 0; } else cur = v; }
    return total + cur;
  }
  function parseAmount(t) {
    let m = t.match(/[$¥￥]\s*(\d+(?:\.\d+)?)\s*(k|千|万)?/i) || t.match(/(\d+(?:\.\d+)?)\s*(k|千|万)?\s*(块|元|刀|美元|美金|dollars?|bucks|usd|rmb)/i)
      || t.match(/(?:押|买|bet|buy|put|下注)\s*(\d+(?:\.\d+)?)\s*(k|千|万)?/i);
    if (m) { let n = parseFloat(m[1]); const u = (m[2] || '').toLowerCase(); if (u === 'k' || u === '千') n *= 1000; if (u === '万') n *= 10000; return n; }
    m = t.match(/([一二两三四五六七八九十百千万]+)\s*(块|元|刀)/);
    if (m) return cnToNum(m[1]);
    m = t.match(/(\d+(?:\.\d+)?)/);
    return m ? parseFloat(m[1]) : null;
  }
  function findItem(t) {
    const l = t.toLowerCase();
    let best = null, score = 0;
    for (const it of [...STOCKS.map(s => ({ ...s, kind: 'stock' })), ...MARKETS.map(m => ({ ...m, kind: 'event' }))]) {
      const s = it.kw.filter(k => l.includes(k)).reduce((a, k) => a + k.length, 0);
      if (s > score) { score = s; best = it; }
    }
    return best;
  }
  // "Did you mean": char-overlap between each keyword (3+ chars) and same-length windows of the text.
  function overlap(a, b) { const m = {}; for (const c of a) m[c] = (m[c] || 0) + 1; let n = 0; for (const c of b) if (m[c] > 0) { m[c]--; n++; } return n / a.length; }
  function suggest(t) {
    const l = t.toLowerCase(), all = [...STOCKS, ...MARKETS], scored = [];
    for (const it of all) { let best = 0;
      for (const k of it.kw) { if ([...k].length < 3) continue; const ch = [...l];
        for (let i = 0; i + [...k].length <= ch.length; i++) best = Math.max(best, overlap(k, ch.slice(i, i + [...k].length).join(''))); }
      if (best >= 0.6) scored.push([best, it.id]); }
    scored.sort((a, b) => b[0] - a[0]);
    return scored.length ? scored.slice(0, 3).map(x => x[1]) : ['fed-cut', 'btc-100k', 'TSLA'];
  }
  function parseIntent(text) {
    const t = String(text || '').trim();
    if (!t) return { ok: false, error: 'empty' };
    const item = findItem(t);
    if (!item) return { ok: false, error: 'no_market', suggest: suggest(t) };
    const amount = parseAmount(t.replace(/10万|100k|\$?90|2亿|\$?200m|2030/gi, ' '));
    if (!amount || amount <= 0) return { ok: false, error: 'no_amount', market: item.id };
    const l = t.toLowerCase();
    const neg = /不会|不了|不到|不破|不超过|不可能|不降|不涨|不下|不赢|没有|反对|做空|卖空|short|won't|will not|not |no\b|against|sell/.test(l);
    let side;
    if (item.kind === 'stock') side = /short|sell|做空|卖空|卖/.test(l) ? 'sell' : 'buy';
    else side = neg ? 'no' : 'yes';
    const dip = item.kind === 'stock' && /dip|跌|回调|drops?/.test(l);
    const pct = (l.match(/(\d+(?:\.\d+)?)\s*%/) || [])[1];
    const price = item.kind === 'event' ? (side === 'yes' ? item.price : round2(1 - item.price)) : item.price;
    const f = fee(amount);
    return {
      ok: true, kind: item.kind, market: item.id, zh: item.zh, en: item.en, side, amount: round2(amount),
      price, condition: dip ? { type: 'dip', pct: pct ? +pct : 5 } : null,
      feeBps: FEE_BPS, fee: f, qty: round2((amount - f) / price),
    };
  }
  // Deterministic daily drift: same date => same price for everyone. Example data only.
  function hash(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; h = Math.imul(h, 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }
  function priceAt(item, day) { // mean-reverting walk over the last 40 days: moves daily, never runs away
    let dev = 0;
    for (let d = day - 40; d <= day; d++) dev = 0.7 * dev + (hash(item.id + ":" + d) - 0.5) * 0.24;
    if (item.price > 1) return round2(item.price * (1 + dev));
    return Math.min(0.97, Math.max(0.03, round2(item.price + dev * 0.8)));
  }
  const dayNum = (date) => Math.floor(date.getTime() / 86400000);
  // Pending dip order fills when price <= target.
  function dipTarget(price, pct) { return round2(price * (1 - pct / 100)); }
  function shouldFill(order, price) { return price <= order.target; }
  const ORDER_DAYS = 14; // unfilled dip orders expire and refund after 14 demo days
  function orderStatus(order, price, day) { if (shouldFill(order, price)) return 'fill'; return day - order.day >= ORDER_DAYS ? 'expire' : 'wait'; }
  function pnl(pos, markPrice) { return round2(pos.qty * markPrice - pos.amount); }
  const api = { FEE_BPS, MARKETS, STOCKS, VENUES, fee, arb, parseIntent, parseAmount, suggest, cnToNum, pnl, round2, priceAt, dayNum, dipTarget, shouldFill, hash, orderStatus, ORDER_DAYS };
  if (typeof module !== 'undefined') module.exports = api; else root.Core = api;
})(this);
