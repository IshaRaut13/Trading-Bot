function log(level, msg) {
  const body = document.getElementById('termBody');
  const now = new Date().toLocaleTimeString('en-US', { hour12: false });
  const line = document.createElement('div');
  line.className = 'log-line';
  line.innerHTML = `
    <span class="log-time">${now}</span>
    <span class="log-tag ${level}">${level}</span>
    <span class="log-msg">${msg}</span>
  `;
  body.appendChild(line);
  body.scrollTop = body.scrollHeight;
}

function clearLog() {
  document.getElementById('termBody').innerHTML = '';
  log('DEBUG', 'Log cleared.');
}

let toastTimer;
function showToast(msg, type='success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

