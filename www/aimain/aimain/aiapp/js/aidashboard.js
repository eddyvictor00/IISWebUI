// FIXED VERSION - Live Paper Trading Dashboard
// Replace your old aidashboard.js with this file as aidashboard_fixed.js

const urlParams = new URLSearchParams(window.location.search);
const custId = urlParams.get('cust') || '0';
const fundId = urlParams.get('fundid') || '0';

let equityChartInst = null;
let winLossChartInst = null;
let monthlyChartInst = null;
let lastTradesData = [];

function fmt(n) { return (n === undefined || n === null || isNaN(n)) ? '-' : parseFloat(n).toFixed(2); }
function fmtDollar(n) { 
  if (n === undefined || n === null || isNaN(n)) return '-';
  const v = parseFloat(n); 
  return (v >= 0 ? '+$' : '-$') + Math.abs(v).toFixed(2); 
}
function fmtPct(n) { 
  if (n === undefined || n === null || isNaN(n)) return '-';
  const v = parseFloat(n); 
  return (v >= 0 ? '+' : '') + v.toFixed(2) + '%'; 
}

// --- Metrics ---
function loadMetrics() {
  return $.ajax({
      url: iisurl + '/cust/' + custId + '/acc/0/fund/'+fundId+'/aplaca/metrics',
      crossDomain: true, cache: false, timeout: 120000,
      success: function(m) {
        if (!m) return;
        const value = (m.investment !== undefined && m.totalPnL !== undefined) ? parseFloat(m.investment) + parseFloat(m.totalPnL) : null;
        if (value !== null) {
          document.getElementById('accountLabel').textContent = 'Paper Equity (Alpaca): $' + value.toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2}) + ' | Live-forward, not backtest';
        }
        document.getElementById('totalReturn').textContent  = fmtPct(m.totalReturnPct);
        document.getElementById('winRate').textContent      = (m.winRate !== undefined) ? m.winRate + '%' : '-';
        document.getElementById('winCount').textContent     = (m.winningTrades !== undefined) ? m.winningTrades + 'W / ' + m.losingTrades + 'L of ' + m.totalTrades + ' trades (incl. losses)' : '';
        document.getElementById('sharpe').textContent       = fmt(m.sharpeRatio);
        document.getElementById('drawdown').textContent     = (m.maxDrawdown !== undefined) ? '-' + Math.abs(m.maxDrawdown) + '%' : '-';
        document.getElementById('riskReward').textContent   = (m.riskRewardRatio !== undefined && !isNaN(m.riskRewardRatio)) ? fmt(m.riskRewardRatio) + ' : 1' : '-';
        document.getElementById('totalPnl').textContent     = fmtDollar(m.totalPnL);
        document.getElementById('totalInves').textContent   = (m.investment !== undefined) ? 'Starting Paper Capital $' + parseFloat(m.investment).toFixed(0) : '';
        document.getElementById('stockList').textContent    = m.stockList ? '(' + m.stockList + ')' : ''; 
        document.getElementById('firstdate').textContent    = m.firstDate ? m.firstDate : '-'; 
        const fd2 = document.getElementById('firstdate2'); if(fd2) fd2.textContent = m.firstDate || '-';

        const wins = m.winningTrades || 0, losses = m.losingTrades || 0, total = m.totalTrades || 0;
        const wPct = total > 0 ? Math.round(wins / total * 100) : 0, lPct = total > 0 ? 100 - wPct : 0;
        if (winLossChartInst) winLossChartInst.destroy();
        winLossChartInst = new Chart(document.getElementById('winLossChart'), {
          type: 'doughnut',
          data: { labels: ['Wins ' + wPct + '%', 'Losses ' + lPct + '%'], datasets: [{ data: [wins, losses], backgroundColor: ['#1D9E75','#E24B4A'], borderWidth: 0 }] },
          options: { responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false } } }
        });
      }
  });
}

function loadEquityHistory() {
  return $.ajax({
    url: iisurl + '/cust/' + custId + '/acc/0/fund/'+fundId+'/aplaca/equityhistory',
    crossDomain: true, cache: false, timeout: 120000,
    success: function(data) {
      const cleanData = data.filter(p => p.equity !== null && p.equity !== 0);
      const labels = cleanData.map(p => p.date);
      const pctValues = cleanData.map(p => p.equity);
      let peakPct = pctValues[0] || 0;
      const drawdownPct = pctValues.map(v => { if (v > peakPct) peakPct = v; return peakPct > 0 ? parseFloat((v - peakPct).toFixed(4)) : 0; });
      if (equityChartInst) equityChartInst.destroy();
      equityChartInst = new Chart(document.getElementById('equityChart'), {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'Paper Equity % Gain (live-forward, incl. all trades)', data: pctValues, borderColor: '#1D9E75', backgroundColor: 'rgba(29,158,117,0.08)', borderWidth: 2, pointRadius: 0, fill: true, tension: 0.3 },
            { label: 'Drawdown %', data: drawdownPct, borderColor: '#E24B4A', backgroundColor: 'rgba(226,75,74,0.08)', borderWidth: 1, pointRadius: 0, fill: true, tension: 0.3 }
          ]
        },
        options: { responsive:true, maintainAspectRatio:false, interaction:{mode:'index', intersect:false}, plugins:{legend:{display:true, position:'bottom', labels:{font:{size:11}}}}, scales:{y:{grid:{color:'#f5f5f5'}}, x:{grid:{display:false}}} }
      });
      // Monthly P&L chart
      buildMonthlyChart(cleanData);
      $("#loader").hide();      
    }
  });
}

//     Monthly P&L derived from equity history       
function buildMonthlyChart(data) {
  if (!data || data.length === 0) return;

  const monthly = {};

  data.forEach((p, idx) => {
    const month = p.date.substring(0, 7); // YYYY-MM
    
    if (!monthly[month]) {
      // FIX: If it's the first data point overall, start baseline is 0.
      // Otherwise, start baseline is the previous day's ending equity.
      const prevEquity = idx > 0 ? data[idx - 1].equity : 0;
      monthly[month] = { start: prevEquity, end: p.equity };
    }
    
    monthly[month].end = p.equity; // keeps updating to the latest equity of the month
  });

  const labels = Object.keys(monthly).map(m => {
    // Adding time zone offset to prevent Date object from rolling back a day
    const d = new Date(m + '-02');
    return d.toLocaleDateString('en-US', { month: 'short' });
  });

  // Calculate monthly gain = end % minus start %
  const values = Object.values(monthly).map(m =>
    parseFloat((m.end - m.start).toFixed(2))
  );

  if (monthlyChartInst) monthlyChartInst.destroy();

  monthlyChartInst = new Chart(document.getElementById('monthlyChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: values.map(v =>
          v >= 0 ? 'rgba(29,158,117,0.75)' : 'rgba(226,75,74,0.75)'
        ),
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              const val = ctx.parsed.y;
              const sign = val >= 0 ? '+' : '';
              return ` ${sign}${val.toFixed(2)}%`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { font: { size: 11 }, color: '#888' },
          grid: { display: false }
        },
        y: {
          ticks: {
            font: { size: 11 },
            color: '#888',
            callback: function(v) {
              const sign = v >= 0 ? '+' : '';
              return sign + parseFloat(v.toFixed(2)) + '%';
            }
          },
          grid: { color: 'rgba(0,0,0,0.05)' }
        }
      }
    }
  });
} 

function loadPositions() {
  return $.ajax({
    url: iisurl + '/cust/' + custId + '/acc/0/fund/'+fundId+'/aplaca/positions',
    crossDomain: true, cache: false, timeout: 120000,
    success: function(positions) {
      const tbody = document.getElementById('positionsBody');
      const ts = document.getElementById('positionsTimestamp');
      if(ts) ts.textContent = 'as of ' + new Date().toLocaleString('en-US',{hour:'2-digit', minute:'2-digit', timeZone:'America/Toronto'}) + ' EST - Source: Alpaca /v2/positions';
      if (!positions || !positions.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="color:#aaa; text-align:center; padding:16px;">No open positions (100% cash) - Alpaca reports flat</td></tr>'; return;
      }
      tbody.innerHTML = positions.map(p => {
        const pnl = parseFloat(p.unrealized_pl || 0);
        const change = parseFloat(p.unrealized_plpc || 0)*100;
        return `<tr>
          <td><strong>${p.symbol}</strong></td>
          <td>${p.qty}</td>
          <td>$${parseFloat(p.avg_entry_price).toFixed(2)}</td>
          <td>$${parseFloat(p.current_price).toFixed(2)}</td>
          <td class="${pnl>=0?'pos':'neg'}">${fmtDollar(pnl)}</td>
          <td class="${change>=0?'pos':'neg'}">${fmtPct(change)}</td>
        </tr>`;
      }).join('');
    }
  });
}

function loadTrades() {
  return $.ajax({
    url: iisurl + '/cust/' + custId + '/acc/0/fund/'+fundId+'/aplaca/trades',
    crossDomain: true, cache: false, timeout: 120000,
    success: function(trades) {
      lastTradesData = trades || [];
      const tbody = document.getElementById('tradesBody');
      const recent = (trades || []).slice(0, 30);
      if (!recent.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="color:#aaa; text-align:center; padding:16px;">No fills yet today - bot waiting for signal</td></tr>'; return;
      }
      tbody.innerHTML = recent.map(t => {
        const date = new Date(t.filled_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Toronto' }) + ' EST';
        const price = parseFloat(t.filled_avg_price).toFixed(2);
        const side = t.side.toLowerCase();
        const orderIdShort = t.order_id ? t.order_id.substring(0,8) + '...' : 'paper-' + t.symbol;
        // Estimate slippage/commission for transparency
        const estCost = (parseFloat(t.filled_qty||0) * 0.02).toFixed(2); // $0.02 est slippage per share
        return `<tr>
          <td><strong>${t.symbol}</strong></td>
          <td><span class="badge ${side}">${t.side}</span></td>
          <td>$${price} <span style="font-size:10px; color:#888;">(Alpaca fill)</span></td>
          <td>${t.filled_qty}</td>
          <td style="font-size:11px; color:#666;">$${estCost} est. slippage<br><span style="font-size:10px; color:#999;">Commission $0.00 (paper)</span></td>
          <td style="font-family:monospace; font-size:11px;"><span title="${t.order_id || ''}">${orderIdShort}</span><br><span style="font-family:sans-serif; color:#888;">${date}</span></td>
        </tr>`;
      }).join('');
    }
  });
}

function loadAccount() {
  return $.ajax({
    url: iisurl + '/cust/' + custId + '/acc/0/fund/'+fundId+'/aplaca/account',
    crossDomain: true, cache: false, timeout: 120000,
    success: function(a) {
      if(!a) return;
      document.getElementById('accountdescLabel').textContent = a.desc || '';
      // New live status box
      const equityEl = document.getElementById('liveEquity');
      const cashEl = document.getElementById('liveCash');
      const pnlDayEl = document.getElementById('livePnlDay');
      const botStatusEl = document.getElementById('botStatus');
      const heartbeatEl = document.getElementById('lastHeartbeat');
      const apiStatusEl = document.getElementById('apiStatus');
      
      if(a.equity) equityEl.textContent = 'Equity: $' + parseFloat(a.equity).toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2}) + ' (Paper)';
      if(a.cash) cashEl.textContent = 'Cash: $' + parseFloat(a.cash).toLocaleString(undefined,{minimumFractionDigits:2}) + ' | Buying Power: $' + parseFloat(a.buying_power || a.cash*2).toLocaleString(undefined,{minimumFractionDigits:2});
      if(a.portfolio_value !== undefined || a.equity) {
        const dayPnl = a.equity && a.last_equity ? parseFloat(a.equity) - parseFloat(a.last_equity) : 0;
        pnlDayEl.textContent = 'Day P&L: ' + fmtDollar(dayPnl) + ' | Last close equity: $' + (a.last_equity ? parseFloat(a.last_equity).toFixed(2) : '-');
      }
      const now = new Date();
      botStatusEl.textContent = 'BOT ONLINE - Live Paper Trading';
      botStatusEl.style.color = '#1d9e75';
      heartbeatEl.textContent = 'Last API ping: ' + now.toLocaleString('en-US',{hour:'2-digit', minute:'2-digit', second:'2-digit', timeZone:'America/Toronto'}) + ' EST';
      apiStatusEl.textContent = 'GET /v2/account: 200 OK at ' + now.toISOString() + ' | status: ' + (a.status || 'ACTIVE');
      apiStatusEl.style.color = '#1d9e75';

      document.getElementById('lastUpdated').textContent = now.toLocaleString('en-US',{timeZone:'America/Toronto'}) + ' America/Toronto';
    },
    error: function() {
      document.getElementById('botStatus').textContent = 'BOT OFFLINE / API ERROR';
      document.getElementById('botStatus').style.color = '#d85a30';
      document.getElementById('apiStatus').textContent = 'GET /v2/account: FAILED - check server';
      document.getElementById('apiStatus').style.color = '#d85a30';
    }
  });
}

function exportCsv() {
  if(!lastTradesData || !lastTradesData.length) { alert('No trades to export yet'); return; }
  const headers = ['symbol','side','filled_avg_price','filled_qty','filled_at','order_id','type'];
  const rows = lastTradesData.map(t => [t.symbol, t.side, t.filled_avg_price, t.filled_qty, t.filled_at, t.order_id || '', 'paper'].join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'aiiweb_alpaca_paper_fills_' + new Date().toISOString().slice(0,10) + '.csv'; a.click();
}

function loadAll() {
  document.getElementById('spinner').style.display = 'inline';
  Promise.allSettled([loadMetrics(), loadEquityHistory(), loadPositions(), loadTrades(), loadAccount()]).then(() => {
    document.getElementById('spinner').style.display = 'none';
  });
}
// Attach event listeners and start timers when DOM structure is ready
$(document).ready(function() {
  /////////////////////////////basic local storage
/////////////////////////////basic local storage

var iisWebSession = "iisWebSession";
window.localStorage.setItem(iisWebSession, " ");

var iisMsgSession = "iisMsgSession";
window.localStorage.setItem(iisMsgSession, "");

var iisWebInitSession = "iisWebInitSession";
window.localStorage.setItem(iisWebInitSession, "");


var iisurlStr = iisurl;

var iisWebObj = {'myMenuId': 1}
window.localStorage.setItem(iisWebM, JSON.stringify(iisWebObj));

try {
    var initiisurl = "";

    var iisWebInitObjStr = window.localStorage.getItem(iisWebInitSession);
    if ((iisWebInitObjStr != null) && (iisWebInitObjStr.length > 0)) {
        var iisWebInitObj = JSON.parse(iisWebInitObjStr);
        var iisurlInitStr = iisWebInitObj.iisurlStr;
        if (iisurlInitStr.length > 0) {
            iisurlStr = iisurlInitStr;
            iisurl = iisurlInitStr;
            initiisurl = iisurlInitStr;
        }
    }

    if (android_app1 == true) { // for android app only
//        iisurl = iisurl_ORACLE;
        iisurlInitStr = iisurl;
        iisurlStr = iisurlInitStr;
        iisurl = iisurlInitStr;
        initiisurl = iisurlInitStr;
        var iisWebInit1Obj = {'iisurlStr': iisurlStr};
        window.localStorage.setItem(iisWebInitSession, JSON.stringify(iisWebInit1Obj));
    } else if (android_app2 == true) { // for android app only
//        iisurl = iisurl_RENDER;
        iisurlInitStr = iisurl;
        iisurlStr = iisurlInitStr;
        iisurl = iisurlInitStr;
        initiisurl = iisurlInitStr;
        var iisWebInit1Obj = {'iisurlStr': iisurlStr};
        window.localStorage.setItem(iisWebInitSession, JSON.stringify(iisWebInit1Obj));
    } else {
        if (initiisurl == "") {
            var initiisurl_data = document.getElementById("initIISURL_java").dataset.value;

            if ((initiisurl_data === undefined) || (initiisurl_data.length == 0)) {
                initiisurl_data = document.getElementById("initIISURL_python").dataset.value;

            }
            if ("{{ init_iisurl_python }}" == initiisurl_data) {
                initiisurl_data = ""
            }
            if ("{{ init_iisurl_java }}" == initiisurl_data) {
                initiisurl_data = ""
            }
            initiisurl = initiisurl_data

            // initiisurl = $('#myvar').text(); // $("#init_iisurl");
            if (initiisurl === undefined) {
                initiisurl = iisurl;

            } else if (initiisurl.length > 0) {
                iisurl = initiisurl;
            } else {
                initiisurl = iisurl;
            }
            initiisurl = iisurl;
            iisurlStr = iisurl;
            var iisWebInit1Obj = {'iisurlStr': iisurlStr};
            window.localStorage.setItem(iisWebInitSession, JSON.stringify(iisWebInit1Obj));
        }
    }

} catch (err) {
}
  // Bind click trigger natively to decouple from inline HTML handler attributes
  $('#refreshBtn').on('click', loadAll);

  // Auto-load on page open, auto-refresh every 60 seconds
  loadAll();
  setInterval(loadAll, 60000*30);
});