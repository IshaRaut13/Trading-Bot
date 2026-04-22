async function submitOrder() {
  if (!validate()) return;

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Placing Order…`;

  const symbol = document.getElementById('symbol').value.trim().toUpperCase();
  const qty    = document.getElementById('quantity').value.trim();
  const price  = document.getElementById('price').value.trim();
  const sp     = document.getElementById('stopPrice').value.trim();
  const tif    = document.getElementById('tif').value;

  log('INFO', `Order request | symbol=<span class="highlight">${symbol}</span> side=<span class="${side==='BUY'?'val-green':'val-red'}">${side}</span> type=<span class="val-blue">${orderType}</span> qty=<span class="highlight">${qty}</span>${orderType==='LIMIT'?' price='+price:''}${orderType==='STOP_MARKET'?' stopPrice='+sp:''}`);

  if (isDryRun) {
    await fakePlaceOrder(symbol, qty, price, sp);
  } else {
    await realPlaceOrder(symbol, qty, price, sp, tif);
  }

  btn.disabled = false;
  updateSubmitBtn();
}

async function fakePlaceOrder(symbol, qty, price, sp) {
  await sleep(600 + Math.random() * 500);

  const orderId = Math.floor(80000000 + Math.random() * 9999999);
  const fakePrice = price || (symbol.includes('BTC') ? (43000 + Math.random()*2000).toFixed(2) : (2800 + Math.random()*300).toFixed(2));
  const status = orderType === 'MARKET' ? 'FILLED' : 'NEW';
  const avgPrice = orderType === 'MARKET' ? fakePrice : '0';

  const resp = {
    orderId, symbol,
    side, type: orderType,
    origQty: qty,
    executedQty: orderType === 'MARKET' ? qty : '0',
    avgPrice,
    price: price || '0',
    stopPrice: sp || '0',
    status,
    timeInForce: 'GTC',
    updateTime: Date.now(),
    dryRun: true,
  };

  log('DEBUG', `[DRY RUN] Simulated API response: orderId=<span class="val-blue">${orderId}</span>`);
  handleOrderResponse(resp);
}


function handleOrderResponse(data) {
  orderCount++;
  document.getElementById('statOrders').textContent = orderCount;
  orders.unshift(data);

  const isOk = data.status === 'FILLED' || data.status === 'NEW';
  log('OK',
    `✓ Order <span class="val-blue">#${data.orderId}</span> ` +
    `status=<span class="${data.status==='FILLED'?'val-green':'val-blue'}">${data.status}</span> ` +
    `execQty=<span class="highlight">${data.executedQty}</span> ` +
    `avgPrice=<span class="highlight">${data.avgPrice !== '0' ? data.avgPrice : '—'}</span>` +
    (data.dryRun ? ' <span style="color:var(--warn)">[DRY RUN]</span>' : '')
  );

  showToast(`Order #${data.orderId} → ${data.status}${data.dryRun?' (simulated)':''}`, 'success');
  renderOrderTable();
}

function renderOrderTable() {
  const el = document.getElementById('ordersTable');
  if (!orders.length) {
    el.innerHTML = '<div class="no-orders">No orders yet. Place one to get started.</div>';
    return;
  }
  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Order ID</th><th>Symbol</th><th>Side</th><th>Type</th>
          <th>Qty</th><th>Exec Qty</th><th>Avg Price</th><th>Status</th><th>Mode</th>
        </tr>
      </thead>
      <tbody>
        ${orders.map(o => `
          <tr>
            <td style="color:var(--muted)">${o.orderId}</td>
            <td style="color:#fff;font-weight:700">${o.symbol}</td>
            <td><span class="badge ${o.side}">${o.side}</span></td>
            <td><span class="badge ${o.type}">${o.type}</span></td>
            <td>${o.origQty}</td>
            <td>${o.executedQty}</td>
            <td>${o.avgPrice !== '0' ? o.avgPrice : '—'}</td>
            <td><span class="badge ${o.status}">${o.status}</span></td>
            <td style="color:${o.dryRun?'var(--warn)':'var(--buy)'}; font-size:10px">${o.dryRun?'SIM':'LIVE'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function clearOrders() {
  orders = [];
  orderCount = 0;
  document.getElementById('statOrders').textContent = '0';
  renderOrderTable();
  log('DEBUG', 'Order history cleared.');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

