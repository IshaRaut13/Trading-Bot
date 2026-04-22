function toggleDryRun() {
  isDryRun = !isDryRun;
  const badge = document.getElementById('dryrunToggle');
  if (isDryRun) {
    badge.textContent = '⚠ DRY RUN MODE';
    badge.classList.remove('live');
    log('WARN', 'Switched to DRY RUN mode — no real orders will be placed');
    showToast('Dry run mode ON', 'warn');
  } else {
    badge.textContent = '🔴 LIVE MODE';
    badge.classList.add('live');
    log('WARN', 'Switched to LIVE MODE — orders will hit the real testnet API!');
    showToast('Live mode activated — use real credentials!', 'warn');
  }
}

function updateStatus() {
  const key = document.getElementById('apiKey').value.trim();
  const sec = document.getElementById('apiSecret').value.trim();
  const dot = document.getElementById('statusDot');
  const txt = document.getElementById('statusText');
  if (key && sec) {
    dot.className = 'status-dot';
    txt.textContent = 'READY';
  } else {
    dot.className = 'status-dot offline';
    txt.textContent = isDryRun ? 'DRY RUN' : 'NO CREDENTIALS';
  }
}

function setSide(s) {
  side = s;
  document.querySelectorAll('.side-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.side-btn.${s.toLowerCase()}`).classList.add('active');
  updateSubmitBtn();
}

function setType(t) {
  orderType = t;
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  const pf  = document.getElementById('priceField');
  const spf = document.getElementById('stopPriceField');
  const tf  = document.getElementById('tifField');

  pf.classList.toggle('hidden',  t !== 'LIMIT');
  spf.classList.toggle('hidden', t !== 'STOP_MARKET');
  tf.classList.toggle('hidden',  t !== 'LIMIT');
  updateSubmitBtn();
}

function updateSubmitBtn() {
  const btn = document.getElementById('submitBtn');
  const isBuy = side === 'BUY';
  btn.textContent = `Place ${side} ${orderType} Order`;
  btn.className = `submit-btn ${isBuy ? 'buy-btn' : 'sell-btn'}`;
}


(function init() {
  log('INFO', 'Binance Futures Testnet Trading Bot initialised');
  log('WARN', 'Running in <span style="color:var(--warn)">DRY RUN</span> mode — toggle header badge for live mode');
  log('INFO', 'Paste API credentials above to enable live trading on Binance Futures Testnet');
  log('DEBUG', 'Endpoint: https://testnet.binancefuture.com/fapi/v1/order');
  updateStatus();
})();
