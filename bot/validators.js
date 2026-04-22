function validate() {
  const symbol = document.getElementById('symbol').value.trim().toUpperCase();
  const qty    = parseFloat(document.getElementById('quantity').value);

  if (!symbol || symbol.length < 4) {
    showToast('Invalid symbol (e.g. BTCUSDT)', 'error');
    return null;
  }
  if (!qty || qty <= 0) {
    showToast('Quantity must be > 0', 'error');
    return null;
  }
  if (orderType === 'LIMIT') {
    const price = parseFloat(document.getElementById('price').value);
    if (!price || price <= 0) { showToast('Limit price is required and must be > 0', 'error'); return null; }
  }
  if (orderType === 'STOP_MARKET') {
    const sp = parseFloat(document.getElementById('stopPrice').value);
    if (!sp || sp <= 0) { showToast('Stop price is required and must be > 0', 'error'); return null; }
  }
  if (!isDryRun) {
    const key = document.getElementById('apiKey').value.trim();
    const sec = document.getElementById('apiSecret').value.trim();
    if (!key || !sec) { showToast('API credentials required for live mode', 'error'); return null; }
  }
  return true;
}

