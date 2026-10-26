const $ = (s) => document.querySelector(s);
const T = {
  zh: { banner: '模拟交易演示 · 非交易所 · 非投资建议 · Paper trading demo · Not an exchange · Not investment advice', other: 'English',
    bal: '我的模拟余额', fake: '全部是假钱，只用来练习', dep: '第一步：选怎么充值（模拟）', card: '💳 银行卡', btc: '₿ 比特币',
    amt: '第二步：输入金额', go: '确认充值', arrived: '钱到账了！', newbal: '新余额', again: '再充一次', adv: '高级细节（可不看）',
    advCard: '模拟流程：授权 → 清算 → 入账。实际不会扣任何卡，不收集卡号。', advBtc: '模拟流程：生成演示地址 → 等待链上确认（假装 1 次）→ 入账。不显示真实钱包地址，不要发送任何比特币。',
    step2wait: '正在处理，请稍等…', it: '说出你的想法', ph: '比如：我觉得美联储下个月降息，押 50 块', parse: '看懂我的意思',
    ex: ['我觉得美联储下个月降息，押 50 块', '比特币年底到不了10万，押20块', 'buy $100 of Tesla if it dips'],
    market: '市场', side: '方向', amount: '金额', fee: '手续费', price: '示例价格', qty: '份数', cond: '条件', dip: (p) => `跌 ${p}% 再买`,
    yes: '会发生 (YES)', no: '不会发生 (NO)', buy: '买入', sell: '卖出', confirm: '确认下单（模拟）', cancel: '取消',
    e_empty: '请先写点什么', e_no_market: '没认出是哪个市场，试试写“美联储”“比特币”“特斯拉”', e_no_amount: '没看到金额，加一句“押 50 块”', e_funds: '余额不够，先充值',
    mk: '事件市场', sample: '示例数据', stocks: '股票（示例价格）', chance: '概率',
    radar: '🔍 价差雷达（练习套利）', rIntro: '同一件事，两个平台价格不同。两边各买一边，结果出来总能拿回 $1/对。下面算的是扣掉两边手续费后的结果（$100 练习）。',
    va: '平台A YES', vb: '平台B YES', spread: '价差', net: '扣费后', practice: '练习套利', pf: '我的持仓', none: '还没有持仓', feesPaid: '已付手续费', pl: '盈亏（按示例价格）', reset: '全部重置',
    feesT: '💰 收费说明（透明）', feesB: '我们只收一种看得见的费用：每笔成交金额的 0.30%（30 bps）。$100 收 $0.30。没有隐藏费用，不卖你的订单流（无 PFOF），不赚差价。这是演示，实际不收任何钱。',
    done: '已下单（模拟）', arbDone: '已记录练习套利' },
  en: { banner: 'Paper trading demo · Not an exchange · Not investment advice · 模拟交易演示 · 非交易所 · 非投资建议', other: '中文',
    bal: 'My practice balance', fake: 'All fake money, just for practice', dep: 'Step 1: pick how to add money (pretend)', card: '💳 Bank card', btc: '₿ Bitcoin',
    amt: 'Step 2: type an amount', go: 'Add money', arrived: 'Money arrived!', newbal: 'New balance', again: 'Add more', adv: 'Advanced details (optional)',
    advCard: 'Simulated: authorize → clear → credit. No card is charged and no card number is collected.', advBtc: 'Simulated: demo address → wait for 1 pretend confirmation → credit. No real wallet address is shown; do not send any bitcoin.',
    step2wait: 'Working on it, one moment…', it: 'Tell us your idea', ph: 'e.g. buy $100 of Tesla if it dips', parse: 'Understand me',
    ex: ['I think the Fed cuts rates next month, bet $50', 'Bitcoin will not hit 100k, bet $20', 'buy $100 of Tesla if it dips'],
    market: 'Market', side: 'Side', amount: 'Amount', fee: 'Fee', price: 'Example price', qty: 'Shares', cond: 'Condition', dip: (p) => `buy after a ${p}% dip`,
    yes: 'Will happen (YES)', no: 'Won\'t happen (NO)', buy: 'Buy', sell: 'Sell', confirm: 'Confirm (paper)', cancel: 'Cancel',
    e_empty: 'Type something first', e_no_market: 'Could not tell which market. Try "Fed", "Bitcoin", "Tesla"', e_no_amount: 'No amount found. Add "bet $50"', e_funds: 'Not enough balance. Add money first',
    mk: 'Event markets', sample: 'Example data', stocks: 'Stocks (example prices)', chance: 'chance',
    radar: '🔍 Price-gap radar (practice arb)', rIntro: 'Same event, two venues, different prices. Buy one side on each and you always get $1 per pair back. Numbers below are after both fees ($100 practice).',
    va: 'Venue A YES', vb: 'Venue B YES', spread: 'Gap', net: 'After fees', practice: 'Practice arb', pf: 'My positions', none: 'No positions yet', feesPaid: 'Fees paid', pl: 'P&L (example prices)', reset: 'Reset all',
    feesT: '💰 Fees (transparent)', feesB: 'One visible fee only: 0.30% (30 bps) of each trade. $100 costs $0.30. No hidden fees, no selling your orders (no PFOF), no spread markup. This is a demo, nothing is actually charged.',
    done: 'Order placed (paper)', arbDone: 'Practice arb recorded' },
};
const S = Object.assign({ lang: 'zh', balance: 0, positions: [], feesPaid: 0 }, JSON.parse(localStorage.getItem('pm') || '{}'));
let dep = { step: 1, method: null }, pending = null, msg = '';
const save = () => localStorage.setItem('pm', JSON.stringify(S));
const t = () => T[S.lang];
const money = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nm = (o) => S.lang === 'zh' ? o.zh : o.en;
const find = (id) => [...Core.MARKETS, ...Core.STOCKS].find(x => x.id === id);
const mark = (p) => { const m = find(p.market); return p.kind === 'stock' ? m.price : (p.side === 'no' ? 1 - m.price : m.price); };

function render() {
  const L = t(); document.documentElement.lang = S.lang; $('#banner').textContent = L.banner; $('#lang').textContent = L.other;
  $('#bal').innerHTML = `<div class="muted">${L.bal}</div><div class="big" id="balance">${money(S.balance)}</div><div class="muted" style="text-align:center">${L.fake}</div>`;
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
    const p = pending; const sideTxt = L[p.side];
    c = `<div class="card" id="intentCard"><div class="item"><span>${L.market}</span><b>${nm(p)}</b></div><div class="item"><span>${L.side}</span><b>${sideTxt}</b></div>
    <div class="item"><span>${L.amount}</span><b>${money(p.amount)}</b></div><div class="item"><span>${L.fee}</span><b>${p.feeBps} bps = ${money(p.fee)}</b></div>
    <div class="item"><span>${L.price} <span class="tag">${L.sample}</span></span><b>${p.kind === 'stock' ? money(p.price) : Math.round(p.price * 100) + '¢'}</b></div>
    <div class="item"><span>${L.qty}</span><b>${p.qty}</b></div>${p.condition ? `<div class="item"><span>${L.cond}</span><b>${L.dip(p.condition.pct)}</b></div>` : ''}
    <div class="row" style="margin-top:10px"><button class="alt" id="iCancel">${L.cancel}</button><button class="green" id="iConfirm">${L.confirm}</button></div></div>`;
  }
  $('#intent').innerHTML = `<h2>${L.it}</h2><textarea id="itext" rows="2" placeholder="${L.ph}"></textarea><div class="chips">${L.ex.map(e => `<button class="ex">${e}</button>`).join('')}</div>
    <button id="iParse" style="margin-top:8px;width:100%">${L.parse}</button><p id="iMsg" class="${msg.startsWith('✓') ? '' : 'err'}">${msg}</p>${c}`;
  // markets
  $('#markets').innerHTML = `<h2>${L.mk} <span class="tag">${L.sample}</span></h2>` + Core.MARKETS.map(m => `<div class="item"><span>${nm(m)}</span><b>${Math.round(m.price * 100)}% ${L.chance}</b></div>`).join('')
    + `<h2 style="margin-top:14px">${L.stocks} <span class="tag">${L.sample}</span></h2>` + Core.STOCKS.map(s => `<div class="item"><span>${nm(s)} (${s.id})</span><b>${money(s.price)}</b></div>`).join('');
  // radar
  $('#radar summary').textContent = L.radar;
  $('#radarBody').innerHTML = `<p class="muted">${L.rIntro} <span class="tag">${L.sample}</span></p>` + Core.VENUES.map((v, i) => { const r = Core.arb(v.a, v.b, 100);
    return `<div class="card"><b>${nm(find(v.id))}</b><div class="muted">${L.va} ${Math.round(v.a * 100)}¢ · ${L.vb} ${Math.round(v.b * 100)}¢ · ${L.spread} ${Math.round(r.spread * 100)}¢</div>
    <div>${L.net}: <b class="${r.net > 0 ? '' : 'err'}">${money(r.net)}</b> <span class="muted">(${money(r.gross)} − ${money(r.fees)})</span></div><button class="alt arb" data-i="${i}" style="margin-top:6px">${L.practice}</button></div>`; }).join('');
  // portfolio
  const totPl = S.positions.reduce((a, p) => a + Core.pnl(p, mark(p)), 0);
  $('#portfolio').innerHTML = `<h2>${L.pf}</h2>` + (S.positions.length ? S.positions.map(p => `<div class="item pos"><span>${nm(find(p.market))} · ${L[p.side] || p.side}<br><span class="muted">${money(p.amount)} · ${p.qty} ${L.qty}</span></span><b>${money(Core.pnl(p, mark(p)))}</b></div>`).join('') : `<p class="muted">${L.none}</p>`)
    + `<div class="item"><span>${L.feesPaid}</span><b id="feesPaid">${money(S.feesPaid)}</b></div><div class="item"><span>${L.pl}</span><b>${money(totPl)}</b></div><button class="alt" id="reset">${L.reset}</button>`;
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
    if (r.ok) { pending = r; msg = ''; } else { pending = null; msg = L['e_' + r.error]; } render(); $('#itext').value = txt; return; }
  else if (id === 'iCancel') { pending = null; msg = ''; }
  else if (id === 'iConfirm') { const p = pending; if (p.amount > S.balance) { msg = L.e_funds; render(); return; }
    S.balance = Core.round2(S.balance - p.amount); S.feesPaid = Core.round2(S.feesPaid + p.fee);
    S.positions.push({ market: p.market, kind: p.kind, side: p.side, amount: p.amount, qty: p.qty, price: p.price }); pending = null; msg = '✓ ' + L.done; save(); }
  else if (e.target.classList.contains('arb')) { const v = Core.VENUES[+e.target.dataset.i]; const r = Core.arb(v.a, v.b, 100);
    if (S.balance < 100) { alert(L.e_funds); return; } S.balance = Core.round2(S.balance + r.net); S.feesPaid = Core.round2(S.feesPaid + r.fees); save(); alert(L.arbDone + ': ' + money(r.net)); }
  else if (id === 'reset') { localStorage.removeItem('pm'); Object.assign(S, { balance: 0, positions: [], feesPaid: 0 }); dep = { step: 1 }; pending = null; msg = ''; save(); }
  else return;
  render();
});
render();
