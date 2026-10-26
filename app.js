const $ = (s) => document.querySelector(s);
const T = {
  zh: { banner: '模拟交易演示 · 非交易所 · 非投资建议 / Paper demo · Not an exchange · Not advice', other: 'English',
    bal: '我的模拟余额', fake: '全部是假钱，只用来练习', dep: '第一步：选怎么充值（模拟）', card: '💳 银行卡', btc: '₿ 比特币',
    amt: '第二步：输入金额', go: '确认充值', arrived: '钱到账了！', newbal: '新余额', again: '再充一次', adv: '高级细节（可不看）',
    advCard: '模拟流程：授权 → 清算 → 入账。实际不会扣任何卡，不收集卡号。', advBtc: '模拟流程：生成演示地址 → 等待链上确认（假装 1 次）→ 入账。不显示真实钱包地址，不要发送任何比特币。',
    step2wait: '正在处理，请稍等…', it: '说出你的想法', ph: '比如：我觉得美联储下个月降息，押 50 块', parse: '看懂我的意思',
    ex: ['我觉得美联储下个月降息，押 50 块', '比特币年底到不了10万，押20块', 'buy $100 of Tesla if it dips'],
    market: '市场', side: '方向', amount: '金额', fee: '手续费', price: '示例价格', qty: '份数', cond: '条件', dip: (p) => `跌 ${p}% 再买`,
    yes: '会发生 (YES)', no: '不会发生 (NO)', buy: '买入', sell: '卖出', confirm: '确认下单（模拟）', cancel: '取消',
    e_empty: '请先写点什么', e_no_market: '没认出是哪个市场。', dym: '你是不是想说：', tryEx: '可以这样写，点一下试试：', fx: '示例汇率：1 美元 = 7.2 元', wait: (st) => `通常要等约 ${st.median} 天；14 天内买到的机会约 ${Math.round(st.in14 * 100)}%（没买到就退钱）`, e_no_amount: '没看到金额，加一句“押 50 块”', e_funds: '余额不够，先充值',
    mk: '事件市场', sample: '示例数据', stocks: '股票（示例价格）', chance: '概率',
    radar: '🔍 价差雷达（练习套利）', rIntro: '同一件事，两个平台价格不同。两边各买一边，结果出来总能拿回 $1/对。下面算的是扣掉两边手续费后的结果（$100 练习）。',
    va: '平台A YES', vb: '平台B YES', spread: '价差', net: '扣费后', practice: '练习套利', pf: '我的持仓', none: '还没有持仓', feesPaid: '已付手续费', pl: '盈亏（按示例价格）', reset: '全部重置',
    feesT: '💰 收费说明（透明）', feesB: '我们只收一种看得见的费用：每笔成交金额的 0.30%（30 bps）。$100 收 $0.30。没有隐藏费用，不卖你的订单流（无 PFOF），不赚差价。这是演示，实际不收任何钱。',
    done: '已下单（模拟）', ifRight: '猜对了，你赚', ifWrong: '猜错了，你亏', ifUp: '如果涨 10%', ifDown: '如果跌 10%',
    skip: '跳过', nextStep: '下一步', start: '开始玩', tourAgain: '再看一次教程',
    tour: [['欢迎！这里全是假钱', '这是一个练习用的模拟游戏，不是交易所，不会用到你的真钱。'], ['① 先充一点假钱', '选银行卡或比特币，输入金额，余额马上到账（都是假的）。'], ['② 用一句话说出你的想法', '比如“我觉得美联储下个月降息，押 50 块”。我们会算好手续费，并告诉你猜对赚多少、猜错亏多少。'], ['③ 看看你的成绩', '在“我的持仓”里看赚了还是亏了。点“下一天”，价格会变。']], orderPlaced: '已挂单：等价格跌下来自动买入（模拟），14 天没跌到就退钱',  expired: '挂单 14 天没成交，钱已退回', day: '演示第几天：', next: '⏭ 下一天（价格会变）', waitDip: (x) => `等价格跌到 ${x} 再买`, arbDone: '已记录练习套利' },
  en: { banner: 'Paper demo · Not an exchange · Not advice / 模拟交易演示 · 非交易所 · 非投资建议', other: '中文',
    bal: 'My practice balance', fake: 'All fake money, just for practice', dep: 'Step 1: pick how to add money (pretend)', card: '💳 Bank card', btc: '₿ Bitcoin',
    amt: 'Step 2: type an amount', go: 'Add money', arrived: 'Money arrived!', newbal: 'New balance', again: 'Add more', adv: 'Advanced details (optional)',
    advCard: 'Simulated: authorize → clear → credit. No card is charged and no card number is collected.', advBtc: 'Simulated: demo address → wait for 1 pretend confirmation → credit. No real wallet address is shown; do not send any bitcoin.',
    step2wait: 'Working on it, one moment…', it: 'Tell us your idea', ph: 'e.g. buy $100 of Tesla if it dips', parse: 'Understand me',
    ex: ['I think the Fed cuts rates next month, bet $50', 'Bitcoin will not hit 100k, bet $20', 'buy $100 of Tesla if it dips'],
    market: 'Market', side: 'Side', amount: 'Amount', fee: 'Fee', price: 'Example price', qty: 'Shares', cond: 'Condition', dip: (p) => `buy after a ${p}% dip`,
    yes: 'Will happen (YES)', no: 'Won\'t happen (NO)', buy: 'Buy', sell: 'Sell', confirm: 'Confirm (paper)', cancel: 'Cancel',
    e_empty: 'Type something first', e_no_market: 'Could not tell which market.', dym: 'Did you mean:', tryEx: 'Try writing it like this (tap one):', fx: 'Example rate: 1 USD = 7.2 CNY', wait: (st) => `Usually waits about ${st.median} day(s); about ${Math.round(st.in14 * 100)}% chance it buys within 14 days (else refunded)`, e_no_amount: 'No amount found. Add "bet $50"', e_funds: 'Not enough balance. Add money first',
    mk: 'Event markets', sample: 'Example data', stocks: 'Stocks (example prices)', chance: 'chance',
    radar: '🔍 Price-gap radar (practice arb)', rIntro: 'Same event, two venues, different prices. Buy one side on each and you always get $1 per pair back. Numbers below are after both fees ($100 practice).',
    va: 'Venue A YES', vb: 'Venue B YES', spread: 'Gap', net: 'After fees', practice: 'Practice arb', pf: 'My positions', none: 'No positions yet', feesPaid: 'Fees paid', pl: 'P&L (example prices)', reset: 'Reset all',
    feesT: '💰 Fees (transparent)', feesB: 'One visible fee only: 0.30% (30 bps) of each trade. $100 costs $0.30. No hidden fees, no selling your orders (no PFOF), no spread markup. This is a demo, nothing is actually charged.',
    done: 'Order placed (paper)', ifRight: 'If you are right, you win', ifWrong: 'If you are wrong, you lose', ifUp: 'If it goes up 10%', ifDown: 'If it goes down 10%',
    skip: 'Skip', nextStep: 'Next', start: 'Let\'s go', tourAgain: 'Show tutorial again',
    tour: [['Welcome! Everything here is fake money', 'This is a practice game, not an exchange. Your real money is never used.'], ['① Add some pretend money', 'Pick bank card or bitcoin, type an amount, and the balance shows up (all pretend).'], ['② Say your idea in one sentence', 'Like "buy $100 of Tesla if it dips". We show the fee and how much you could win or lose.'], ['③ Check your score', 'See wins and losses in My positions. Tap Next day and prices move.']], orderPlaced: 'Order waiting: buys automatically if the price dips within 14 days, else refunded (paper)', expired: 'Order not filled in 14 days, money returned', day: 'Demo day:', next: '⏭ Next day (prices move)', waitDip: (x) => `buys when price ≤ ${x}`, arbDone: 'Practice arb recorded' },
};
const S = Object.assign({ lang: 'zh', balance: 0, positions: [], feesPaid: 0, orders: [], dayOffset: 0 }, JSON.parse(localStorage.getItem('pm') || '{}'));
let tourStep = 0, dep = { step: 1, method: null }, pending = null, msg = '';
const save = () => localStorage.setItem('pm', JSON.stringify(S));
const t = () => T[S.lang];
const mc = (usd, c, local) => c === 'CNY' ? `¥${(local != null ? local : usd * Core.FX_CNY).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span class="muted">≈ ${money(usd)}</span>` : money(usd);
const money = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nm = (o) => S.lang === 'zh' ? o.zh : o.en;
const find = (id) => [...Core.MARKETS, ...Core.STOCKS].find(x => x.id === id);
const today = () => Core.dayNum(new Date()) + (S.dayOffset || 0);
const cur = (id) => Core.priceAt(find(id), today());
const sidePrice = (id, side) => { const m = find(id), p = cur(id); return m.price > 1 ? p : Core.round2(side === 'no' ? 1 - p : p); };
const mark = (p) => sidePrice(p.market, p.side);
function fillOrders() { S.orders = (S.orders || []).filter(o => { const px = cur(o.market), st = Core.orderStatus(o, px, today()); if (st === 'wait') return true;
  if (st === 'expire') { S.balance = Core.round2(S.balance + o.amount); msg = '↩ ' + t().expired; return false; }
  const fee = Core.fee(o.amount); S.feesPaid = Core.round2(S.feesPaid + fee);
  S.positions.push({ market: o.market, kind: 'stock', side: 'buy', amount: o.amount, currency: o.currency, amountIn: o.amountIn, qty: Core.round2((o.amount - fee) / px), price: px }); return false; }); save(); }

function render() {
  const L = t(); document.documentElement.lang = S.lang; $('#banner').textContent = L.banner; $('#lang').textContent = L.other;
  $('#bal').innerHTML = `<div class="muted">${L.bal}</div><div class="big" id="balance">${money(S.balance)}</div>${S.lang === 'zh' ? `<div class="muted" style="text-align:center">≈ ¥${(S.balance * Core.FX_CNY).toFixed(2)}（${L.fx}）</div>` : ''}<div class="muted" style="text-align:center">${L.fake}</div>`;
  // deposit
  let d = '';
  if (dep.step === 1) d = `<h2>${L.dep}</h2><div class="row"><button id="mCard">${L.card}</button><button id="mBtc">${L.btc}</button></div>`;
  else if (dep.step === 2) d = `<h2>${L.amt}</h2><div class="big" id="amtShow">$0</div><input id="amt" type="number" inputmode="decimal" min="1" placeholder="100">
    <div class="row" style="margin-top:8px"><button class="alt" id="dBack">←</button><button class="green" id="dGo">${L.go}</button></div><p id="dMsg" class="muted"></p>`;
  else d = `<div class="check">✅</div><h2 style="text-align:center">${L.arrived}</h2><p style="text-align:center">${L.newbal}: <b>${money(S.balance)}</b></p><button class="alt" id="dAgain">${L.again}</button>`;
  d += `<details style="margin-top:10px"><summary>${L.adv}</summary><p class="muted">${dep.method === 'btc' ? L.advBtc : L.advCard}</p></details>`;
  $('#deposit').innerHTML = d;
  // intent
  let c = '';
  if (pending) {
    const p = pending; const sideTxt = L[p.side]; const M = (x) => mc(x, p.currency, x === p.amount ? p.amountIn : null);
    c = `<div class="card" id="intentCard"><div class="item"><span>${L.market}</span><b>${nm(p)}</b></div><div class="item"><span>${L.side}</span><b>${sideTxt}</b></div>
    <div class="item"><span>${L.amount}</span><b>${M(p.amount)}</b></div><div class="item"><span>${L.fee}</span><b>${p.feeBps} bps = ${M(p.fee)}</b></div>
    <div class="item"><span>${L.price} <span class="tag">${L.sample}</span></span><b>${p.kind === 'stock' ? money(p.price) : Math.round(p.price * 100) + '¢'}</b></div>
    <div class="item"><span>${L.qty}</span><b>${p.qty}</b></div>${p.condition ? `<div class="item"><span>${L.cond}</span><b>${L.dip(p.condition.pct)} (≤ ${money(p.target)})</b></div><p class="muted" id="waitTxt">${L.wait(Core.dipStats(find(p.market), p.condition.pct, today()))}</p>` : ''}${p.currency === 'CNY' ? `<p class="muted" id="fxNote">${L.fx}</p>` : ''}
    ${(() => { const o = Core.outcome(p); return `<div class="item" id="wl" style="background:#f8fafc"><span>${p.kind === 'event' ? L.ifRight : L.ifUp}<br>${p.kind === 'event' ? L.ifWrong : L.ifDown}</span><b><span style="color:#16a34a">${p.kind === 'event' ? '+' + M(o.win) : (o.up >= 0 ? '+' : '−') + M(Math.abs(o.up))}</span><br><span class="err">${p.kind === 'event' ? '−' + M(o.lose) : (o.down >= 0 ? '+' : '−') + M(Math.abs(o.down))}</span></b></div>`; })()}
    <div class="row" style="margin-top:10px"><button class="alt" id="iCancel">${L.cancel}</button><button class="green" id="iConfirm">${L.confirm}</button></div></div>`;
  }
  $('#intent').innerHTML = `<h2>${L.it}</h2><textarea id="itext" rows="2" placeholder="${L.ph}"></textarea><div class="chips">${L.ex.map(e => `<button class="ex">${e}</button>`).join('')}</div>
    <button id="iParse" style="margin-top:8px;width:100%">${L.parse}</button><p id="iMsg" class="${msg.startsWith('✓') ? '' : 'err'}">${msg}</p>${c}`;
  // markets
  $('#markets').innerHTML = `<h2>${L.mk} <span class="tag">${L.sample}</span></h2>` + Core.MARKETS.map(m => `<div class="item"><span>${nm(m)}</span><b>${Math.round(cur(m.id) * 100)}% ${L.chance}</b></div>`).join('')
    + `<h2 style="margin-top:14px">${L.stocks} <span class="tag">${L.sample}</span></h2>` + Core.STOCKS.map(s => `<div class="item"><span>${nm(s)} (${s.id})</span><b class="sp">${money(cur(s.id))}</b></div>`).join('') + `<div class="row" style="margin-top:10px"><span class="muted" id="dayLbl">${L.day} ${S.dayOffset || 0}</span><button class="alt" id="nextDay">${L.next}</button></div>`;
  // radar
  $('#radar summary').textContent = L.radar;
  $('#radarBody').innerHTML = `<p class="muted">${L.rIntro} <span class="tag">${L.sample}</span></p>` + Core.VENUES.map((v, i) => { const r = Core.arb(v.a, v.b, 100);
    return `<div class="card"><b>${nm(find(v.id))}</b><div class="muted">${L.va} ${Math.round(v.a * 100)}¢ · ${L.vb} ${Math.round(v.b * 100)}¢ · ${L.spread} ${Math.round(r.spread * 100)}¢</div>
    <div>${L.net}: <b class="${r.net > 0 ? '' : 'err'}">${money(r.net)}</b> <span class="muted">(${money(r.gross)} − ${money(r.fees)})</span></div><button class="alt arb" data-i="${i}" style="margin-top:6px">${L.practice}</button></div>`; }).join('');
  // portfolio
  const totPl = S.positions.reduce((a, p) => a + Core.pnl(p, mark(p)), 0);
  $('#portfolio').innerHTML = `<h2>${L.pf}</h2>` + (S.positions.length ? S.positions.map(p => `<div class="item pos"><span>${nm(find(p.market))} · ${L[p.side] || p.side}<br><span class="muted">${mc(p.amount, p.currency, p.amountIn)} · ${p.qty} ${L.qty}</span></span><b>${money(Core.pnl(p, mark(p)))}</b></div>`).join('') : `<p class="muted">${L.none}</p>`)
    + (S.orders || []).map((o, i) => `<div class="item order"><span>⏳ ${nm(find(o.market))} · ${money(o.amount)}<br><span class="muted">${L.waitDip(money(o.target))} · ${L.wait(Core.dipStats(find(o.market), o.pct, o.day))}</span></span><button class="alt cancelOrder" data-i="${i}">${L.cancel}</button></div>`).join('')
    + `<div class="item"><span>${L.feesPaid}</span><b id="feesPaid">${money(S.feesPaid)}</b></div><div class="item"><span>${L.pl}</span><b>${money(totPl)}</b></div><div class="row"><button class="alt" id="reset">${L.reset}</button><button class="alt" id="tourAgain">${L.tourAgain}</button></div>`;
  let tour = document.getElementById('tour');
  if (!S.tour) { if (!tour) { tour = document.createElement('div'); tour.id = 'tour'; document.body.appendChild(tour); }
    const st = L.tour[tourStep]; tour.innerHTML = `<div class="tbox"><div class="muted">${tourStep + 1} / ${L.tour.length}</div><h2>${st[0]}</h2><p>${st[1]}</p>
    <div class="row"><button class="alt" id="tSkip">${L.skip}</button><button class="green" id="tNext">${tourStep === L.tour.length - 1 ? L.start : L.nextStep}</button></div></div>`; }
  else if (tour) tour.remove();
  $('#fees summary').textContent = L.feesT; $('#feesBody').innerHTML = `<p>${L.feesB}</p>`;
}

document.addEventListener('input', (e) => { if (e.target.id === 'amt') $('#amtShow').textContent = money(+e.target.value || 0); });
document.addEventListener('click', (e) => {
  const id = e.target.id, L = t();
  if (id === 'lang') { S.lang = S.lang === 'zh' ? 'en' : 'zh'; save(); }
  else if (id === 'mCard' || id === 'mBtc') { dep = { step: 2, method: id === 'mCard' ? 'card' : 'btc' }; }
  else if (id === 'dBack' || id === 'dAgain') { dep = { step: 1, method: null }; }
  else if (id === 'dGo') { const a = Core.round2(+$('#amt').value); if (!(a > 0 && a <= 1e6)) return; $('#dMsg').textContent = L.step2wait; e.target.disabled = true;
    setTimeout(() => { S.balance = Core.round2(S.balance + a); save(); dep.step = 3; render(); }, 700); return; }
  else if (e.target.classList.contains('ex')) { $('#itext').value = e.target.textContent; return; }
  else if (id === 'iParse') { const r = Core.parseIntent($('#itext').value); const txt = $('#itext').value;
    if (!r.ok && r.suggest && !r.suggest.length) msg = L.e_no_market + '<br>' + L.tryEx + ' ' + L.ex.map(x => `<button class="alt ex" style="padding:6px 10px;margin:4px">${x}</button>`).join('');
    if (!r.ok && r.suggest && r.suggest.length) msg = L.e_no_market + '<br>' + L.dym + ' ' + r.suggest.map(id => `<button class="alt dym" data-id="${id}" style="padding:6px 10px;margin:4px">${nm(find(id))}</button>`).join('');
    if (r.ok) { r.price = sidePrice(r.market, r.side); r.qty = Core.round2((r.amount - r.fee) / r.price); if (r.condition) r.target = Core.dipTarget(r.price, r.condition.pct); pending = r; msg = ''; } else { pending = null; if (!r.suggest) msg = L['e_' + r.error]; } render(); $('#itext').value = txt; return; }
  else if (e.target.classList.contains('dym')) { const m = find(e.target.dataset.id), ta = $('#itext'), amt = Core.parseAmount(ta.value), cny = Core.currencyOf(ta.value) === 'CNY';
    ta.value = (S.lang === 'zh' ? m.zh : m.en) + (amt ? (S.lang === 'zh' ? (cny ? `，押 ${amt} 块` : `，押 $${amt}`) : (cny ? `, bet ${amt} yuan` : `, bet $${amt}`)) : ''); msg = ''; $('#iMsg').innerHTML = ''; $('#iParse').click(); return; }
  else if (id === 'iCancel') { pending = null; msg = ''; }
  else if (id === 'iConfirm') { const p = pending; if (p.amount > S.balance) { msg = L.e_funds; render(); return; }
    if (p.condition) { S.balance = Core.round2(S.balance - p.amount); S.orders.push({ market: p.market, amount: p.amount, currency: p.currency, amountIn: p.amountIn, pct: p.condition.pct, target: p.target, day: today() }); pending = null; msg = '✓ ' + L.orderPlaced; save(); fillOrders(); render(); return; }
    S.balance = Core.round2(S.balance - p.amount); S.feesPaid = Core.round2(S.feesPaid + p.fee);
    S.positions.push({ market: p.market, kind: p.kind, side: p.side, amount: p.amount, qty: p.qty, price: p.price, currency: p.currency, amountIn: p.amountIn }); pending = null; msg = '✓ ' + L.done; save(); }
  else if (e.target.classList.contains('arb')) { const v = Core.VENUES[+e.target.dataset.i]; const r = Core.arb(v.a, v.b, 100);
    if (S.balance < 100) { alert(L.e_funds); return; } S.balance = Core.round2(S.balance + r.net); S.feesPaid = Core.round2(S.feesPaid + r.fees); save(); alert(L.arbDone + ': ' + money(r.net)); }
  else if (id === 'tSkip' || (id === 'tNext' && tourStep === L.tour.length - 1)) { S.tour = 1; save(); }
  else if (id === 'tNext') { tourStep++; }
  else if (id === 'tourAgain') { S.tour = 0; tourStep = 0; save(); }
  else if (id === 'nextDay') { S.dayOffset = (S.dayOffset || 0) + 1; fillOrders(); }
  else if (e.target.classList.contains('cancelOrder')) { const o = S.orders.splice(+e.target.dataset.i, 1)[0]; S.balance = Core.round2(S.balance + o.amount); save(); }
  else if (id === 'reset') { localStorage.removeItem('pm'); Object.assign(S, { balance: 0, positions: [], feesPaid: 0, orders: [], dayOffset: 0 }); dep = { step: 1 }; pending = null; msg = ''; save(); }
  else return;
  render();
});
fillOrders(); render();
