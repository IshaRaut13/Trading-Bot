async function hmacSHA256(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2,'0')).join('');
}


async function realPlaceOrder(symbol, qty, price, sp, tif) {
  const apiKey    = document.getElementById('apiKey').value.trim();
  const apiSecret = document.getElementById('apiSecret').value.trim();
  const baseUrl   = document.getElementById('baseUrl').value.trim();

  const params = new URLSearchParams({
    symbol,
    side,
    type: orderType,
    quantity: qty,
    positionSide: 'BOTH',
    timestamp: Date.now(),
  });
  if (orderType === 'LIMIT') {
    params.set('timeInForce', tif);
    params.set('price', price);
  }
  if (orderType === 'STOP_MARKET') {
    params.set('stopPrice', sp);
  }

  const signature = await hmacSHA256(apiSecret, params.toString());
  params.set('signature', signature);

  log('DEBUG', `POST ${baseUrl}/fapi/v1/order`);

  try {
    const res = await fetch(`${baseUrl}/fapi/v1/order`, {
      method: 'POST',
      headers: {
        'X-MBX-APIKEY': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    const data = await res.json();
    log('DEBUG', `Response HTTP ${res.status}: ${JSON.stringify(data).slice(0,200)}`);

    if (!res.ok || (data.code && data.code < 0)) {
      log('ERR', `Binance error <span class="val-red">${data.code}</span>: ${data.msg}`);
      showToast(`API Error: ${data.msg}`, 'error');
    } else {
      handleOrderResponse(data);
    }
  } catch(e) {
    log('ERR', `Network failure: ${e.message}`);
    showToast('Network error — check CORS / URL', 'error');
  }
}

