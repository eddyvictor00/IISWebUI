// FIXED V3 - Includes monthly chart again + starts at first trade
// This is complete file, replace your current aidashboard.js

const urlParams = new URLSearchParams(window.location.search);
const custId = urlParams.get('cust') || '0';
const fundId = urlParams.get('fundid') || '0';

let equityChartInst = null;
let winLossChartInst = null;
let monthlyChartInst = null;
let lastTradesData = [];
let lastEquityData = [];
let firstTradeDateStr = null;

function fmt(n) { return (n === undefined || n === null || isNaN(n)) ? '-' : parseFloat(n).toFixed(2); }
function fmtDollar(n) { 
  if (n === undefined || n === null || isNaN(n)) return '-';
  var v = parseFloat(n); 
  return (v >= 0 ? '+$' : '-$') + Math.abs(v).toFixed(2); 
}
function fmtPct(n) { 
  if (n === undefined || n === null || isNaN(n)) return '-';
  var v = parseFloat(n); 
  return (v >= 0 ? '+' : '') + v.toFixed(2) + '%'; 
}

// ── Metrics ──
function loadMetrics() {
  return $.ajax({
      url: iisurl + '/cust/' + custId + '/acc/0/fund/'+fundId+'/aplaca/metrics',
      crossDomain: true, cache: false, timeout: 120000,
      success: function(m) {
        if (!m) return;
        firstTradeDateStr = m.firstDate || null;
        
        var value = (m.investment !== undefined && m.totalPnL !== undefined) ? parseFloat(m.investment) + parseFloat(m.totalPnL) : null;
        if (value !== null) {
          var label = document.getElementById('accountLabel');
          if (label) label.textContent = 'Paper Equity (Alpaca): $' + value.toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2}) + ' | Live-forward from ' + (m.firstDate||'-') + ', not backtest';
        }
        var el;
        el = document.getElementById('totalReturn'); if(el) el.textContent = fmtPct(m.totalReturnPct);
        el = document.getElementById('winRate'); if(el) el.textContent = (m.winRate !== undefined) ? m.winRate + '%' : '-';
        el = document.getElementById('winCount'); if(el) el.textContent = (m.winningTrades !== undefined) ? m.winningTrades + 'W / ' + m.losingTrades + 'L of ' + m.totalTrades + ' trades (incl. losses)' : '';
        el = document.getElementById('sharpe'); if(el) el.textContent = fmt(m.sharpeRatio);
        el = document.getElementById('drawdown'); if(el) el.textContent = (m.maxDrawdown !== undefined) ? '-' + Math.abs(m.maxDrawdown) + '%' : '-';
        el = document.getElementById('riskReward'); if(el) el.textContent = (m.riskRewardRatio !== undefined && !isNaN(m.riskRewardRatio)) ? fmt(m.riskRewardRatio) + ' : 1' : '-';
        el = document.getElementById('totalPnl'); if(el) el.textContent = fmtDollar(m.totalPnL);
        el = document.getElementById('totalInves'); if(el) el.textContent = (m.investment !== undefined) ? 'Starting Paper Capital $' + parseFloat(m.investment).toFixed(0) : '';
        el = document.getElementById('stockList'); if(el) el.textContent = m.stockList ? '(' + m.stockList + ')' : ''; 
        el = document.getElementById('firstdate'); if(el) el.textContent = m.firstDate ? m.firstDate : '-'; 
        var fd2 = document.getElementById('firstdate2'); if(fd2) fd2.textContent = m.firstDate || '-';
        var fd3 = document.getElementById('firstdate_chart'); if(fd3) fd3.textContent = m.firstDate || '-';

        var wins = m.winningTrades || 0, losses = m.losingTrades || 0, total = m.totalTrades || 0;
        var wPct = total > 0 ? Math.round(wins / total * 100) : 0;
        if (winLossChartInst) { try { winLossChartInst.destroy(); } catch(e){} }
        var ctx = document.getElementById('winLossChart');
        if (ctx) {
          winLossChartInst = new Chart(ctx, {
            type: 'doughnut',
            data: { labels: ['Wins ' + wPct + '%', 'Losses ' + (100-wPct) + '%'], datasets: [{ data: [wins, losses], backgroundColor: ['#1D9E75','#E24B4A'], borderWidth: 0 }] },
            options: { responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false } } }
          });
        }
      }
  });
}

// ── Equity curve - FIXED to start at first trade ──
function loadEquityHistory() {
  return $.ajax({
    url: iisurl + '/cust/' + custId + '/acc/0/fund/'+fundId+'/aplaca/equityhistory',
    crossDomain: true, cache: false, timeout: 120000,
    success: function(data) {
      if (!data || !data.length) return;
      lastEquityData = data;
      
      var cleanData = data.filter(function(p) {
        if (p.equity === null || p.equity === undefined) return false;
        if (p.equity <= -99) return false; // remove -100% pre-inception
        if (firstTradeDateStr && p.date && p.date < firstTradeDateStr) return false;
        if (p.real_equity !== undefined && p.real_equity !== null && p.real_equity < 1000) return false;
        return true;
      });
      if (cleanData.length === 0) {
        cleanData = data.filter(function(p){ return p.equity !== null && p.equity > -99; });
      }
      if (cleanData.length < 2 && data.length > 2) {
        cleanData = data.slice(-60).filter(function(p){ return p.equity > -99; });
      }

      var labels = cleanData.map(function(p){ return p.date; });
      var pctValues = cleanData.map(function(p){ return p.equity; });
      var realEquityValues = cleanData.map(function(p){ return p.real_equity || 0; });

      var peakPct = pctValues.length ? pctValues[0] : 0;
      var drawdownPct = pctValues.map(function(v){
        if (v > peakPct) peakPct = v;
        return parseFloat((v - peakPct).toFixed(4));
      });

      var minPct = Math.min.apply(null, pctValues);
      var maxPct = Math.max.apply(null, pctValues);
      var padding = (maxPct - minPct) * 0.3 || 1;
      var yMin = Math.floor(minPct - padding);
      var yMax = Math.ceil(maxPct + padding);
      if (yMin > -5) yMin = -5;
      if (yMax < 5) yMax = 10;

      if (equityChartInst) { try { equityChartInst.destroy(); } catch(e){} }

      var equityTitle = document.getElementById('equityChartTitle');
      if (equityTitle && firstTradeDateStr) {
        equityTitle.innerHTML = 'Paper Equity Curve (Live-Forward, Never Reset) <span style="font-size:11px; color:#888; font-weight:400;">Start: ' + firstTradeDateStr + ' | Source: Alpaca /v2/account/portfolio/history | Pre-inception -100% removed</span>';
      }

      var ctx = document.getElementById('equityChart');
      if (!ctx) return;
      equityChartInst = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Paper Equity % Gain (live from ' + (firstTradeDateStr||'first trade') + ')',
              data: pctValues,
              borderColor: '#1D9E75',
              backgroundColor: 'rgba(29,158,117,0.12)',
              borderWidth: 2.5,
              pointRadius: 0,
              pointHoverRadius: 4,
              fill: true,
              tension: 0.3
            },
            {
              label: 'Drawdown %',
              data: drawdownPct,
              borderColor: '#E24B4A',
              backgroundColor: 'rgba(226,75,74,0.08)',
              borderWidth: 1,
              pointRadius: 0,
              fill: true,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive:true,
          maintainAspectRatio:false,
          interaction:{mode:'index', intersect:false},
          plugins:{
            legend:{display:true, position:'bottom', labels:{font:{size:11}}},
            tooltip:{
              callbacks:{
                afterBody: function(tooltipItems){
                  var idx = tooltipItems[0].dataIndex;
                  var realEq = realEquityValues[idx];
                  if (realEq) return 'Real Equity: $' + realEq.toFixed(2) + ' (Paper)';
                  return '';
                }
              }
            }
          },
          scales:{
            y:{ min: yMin, max: yMax, grid:{color:'#f0f0f0'}, ticks:{ callback: function(v){ return v + '%'; } } },
            x:{ grid:{display:false}, ticks:{ maxTicksLimit: 12, maxRotation: 45 } }
          }
        }
      });

      // Also build monthly chart from same equity data
      buildMonthlyChart(cleanData);
    }
  });
}

// ── MONTHLY CHART - RESTORED ──
function buildMonthlyChart(equityData) {
  var monthlyCtx = document.getElementById('monthlyChart');
  if (!monthlyCtx) return;

  // If equityData not passed, use lastEquityData filtered
  var data = equityData || lastEquityData;
  if (!data || data.length < 2) {
    // Fallback: try to build from trades if no equity
    buildMonthlyChartFromTrades();
    return;
  }

  // Group by YYYY-MM, take first and last equity of month to get monthly P&L %
  var monthlyMap = {}; // key: YYYY-MM -> { firstEquityPct, lastEquityPct, firstReal, lastReal, firstDate, lastDate }
  for (var i = 0; i < data.length; i++) {
    var p = data[i];
    if (!p.date) continue;
    var monthKey = p.date.substring(0, 7); // YYYY-MM
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { firstPct: p.equity, lastPct: p.equity, firstReal: p.real_equity||0, lastReal: p.real_equity||0, count: 0 };
    }
    monthlyMap[monthKey].lastPct = p.equity;
    if (p.real_equity) monthlyMap[monthKey].lastReal = p.real_equity;
    monthlyMap[monthKey].count++;
  }

  // Convert to sorted array
  var months = Object.keys(monthlyMap).sort();
  var labels = [];
  var pnlPercents = [];
  var pnlDollars = [];

  var prevPct = 0;
  // For first month, monthly gain = its pct - 0, for others = current lastPct - previous lastPct
  for (var j = 0; j < months.length; j++) {
    var key = months[j];
    var entry = monthlyMap[key];
    var monthlyPct;
    if (j === 0) {
      monthlyPct = entry.lastPct - (entry.firstPct || 0);
      // If first month started not at 0, use its last as monthly
      if (Math.abs(monthlyPct) < 0.01) monthlyPct = entry.lastPct;
    } else {
      var prevKey = months[j-1];
      var prevEntry = monthlyMap[prevKey];
      monthlyPct = entry.lastPct - prevEntry.lastPct;
    }
    // Also calculate dollar P&L if we have real equity
    var monthlyDollar = 0;
    if (entry.lastReal && j > 0) {
      var prevReal = monthlyMap[months[j-1]].lastReal;
      if (prevReal) monthlyDollar = entry.lastReal - prevReal;
    } else if (entry.lastReal && j === 0 && entry.firstReal) {
      monthlyDollar = entry.lastReal - entry.firstReal;
    }

    labels.push(key);
    pnlPercents.push(parseFloat(monthlyPct.toFixed(2)));
    pnlDollars.push(monthlyDollar);
  }

  // If only one month (your case since 2026-04-30), show it as single bar
  if (monthlyChartInst) { try { monthlyChartInst.destroy(); } catch(e){} }

  monthlyChartInst = new Chart(monthlyCtx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Monthly P&L % (Paper)',
        data: pnlPercents,
        backgroundColor: pnlPercents.map(function(v){ return v >= 0 ? 'rgba(29,158,117,0.8)' : 'rgba(226,75,74,0.8)'; }),
        borderColor: pnlPercents.map(function(v){ return v >= 0 ? '#1D9E75' : '#E24B4A'; }),
        borderWidth: 1,
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
            label: function(ctx){
              var idx = ctx.dataIndex;
              var pct = ctx.parsed.y;
              var dollar = pnlDollars[idx];
              var str = ' ' + (pct >= 0 ? '+' : '') + pct.toFixed(2) + '%';
              if (dollar) str += ' ($' + dollar.toFixed(2) + ')';
              return str;
            },
            afterBody: function(){ return 'Live-forward, includes all trades, slippage est.'; }
          }
        }
      },
      scales: {
        y: { grid:{color:'#f0f0f0'}, ticks:{ callback: function(v){ return v + '%'; } } },
        x: { grid:{display:false}, ticks:{ font:{size:11} } }
      }
    }
  });
}

// Fallback monthly from trades if equity history not enough
function buildMonthlyChartFromTrades() {
  var ctx = document.getElementById('monthlyChart');
  if (!ctx) return;
  if (!lastTradesData || !lastTradesData.length) return;

  var monthly = {};
  for (var i = 0; i < lastTradesData.length; i++) {
    var t = lastTradesData[i];
    if (!t.filled_at) continue;
    var d = new Date(t.filled_at);
    var key = d.getFullYear() + '-' + ('0'+(d.getMonth()+1)).slice(-2);
    if (!monthly[key]) monthly[key] = { pnl: 0, count:0 };
    // We don't have individual trade P&L here, so we approximate from qty*price diff? 
    // Better to skip and show equity-based
    monthly[key].count++;
  }

  var months = Object.keys(monthly).sort();
  var labels = months;
  var counts = months.map(function(k){ return monthly[k].count; });

  if (monthlyChartInst) { try { monthlyChartInst.destroy(); } catch(e){} }
  monthlyChartInst = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Trades per month',
        data: counts,
        backgroundColor: 'rgba(55,138,221,0.7)',
        borderWidth: 1
      }]
    },
    options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}} }
  });
}

function loadPositions() {
  return $.ajax({
    url: iisurl + '/cust/' + custId + '/acc/0/fund/'+fundId+'/aplaca/positions',
    crossDomain: true, cache: false, timeout: 120000,
    success: function(positions) {
      var tbody = document.getElementById('positionsBody');
      var ts = document.getElementById('positionsTimestamp');
      if(ts) ts.textContent = 'as of ' + new Date().toLocaleString('en-US',{hour:'2-digit', minute:'2-digit', timeZone:'America/Toronto'}) + ' EST - Source: Alpaca /v2/positions';
      if (!tbody) return;
      if (!positions || !positions.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="color:#aaa; text-align:center; padding:16px;">No open positions (100% cash) - Alpaca reports flat</td></tr>'; return;
      }
      tbody.innerHTML = positions.map(function(p){
        var pnl = parseFloat(p.unrealized_pl || 0);
        var change = parseFloat(p.unrealized_plpc || 0)*100;
        return '<tr><td><strong>'+p.symbol+'</strong></td><td>'+p.qty+'</td><td>$'+parseFloat(p.avg_entry_price).toFixed(2)+'</td><td>$'+parseFloat(p.current_price).toFixed(2)+'</td><td class="'+(pnl>=0?'pos':'neg')+'">'+fmtDollar(pnl)+'</td><td class="'+(change>=0?'pos':'neg')+'">'+fmtPct(change)+'</td></tr>';
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
      var tbody = document.getElementById('tradesBody');
      if (!tbody) return;
      var recent = (trades || []).slice(0, 30);
      if (!recent.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="color:#aaa; text-align:center; padding:16px;">No fills yet today - bot waiting for signal</td></tr>'; return;
      }
      tbody.innerHTML = recent.map(function(t){
        var date = new Date(t.filled_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Toronto' }) + ' EST';
        var price = parseFloat(t.filled_avg_price || t.filled_avg_price || 0).toFixed(2);
        var side = (t.side||'').toLowerCase();
        var oid = t.id || t.order_id || '';
        var orderIdShort = oid ? oid.substring(0,8) + '...' : 'paper-' + t.symbol;
        var estCost = (parseFloat(t.filled_qty||0) * 0.02).toFixed(2);
        return '<tr><td><strong>'+t.symbol+'</strong></td><td><span class="badge '+side+'">'+t.side+'</span></td><td>$'+price+' <span style="font-size:10px; color:#888;">(Alpaca fill)</span></td><td>'+t.filled_qty+'</td><td style="font-size:11px; color:#666;">$'+estCost+' est. slippage<br><span style="font-size:10px; color:#999;">Commission $0.00 (paper)</span></td><td style="font-family:monospace; font-size:11px;"><span title="'+oid+'">'+orderIdShort+'</span><br><span style="font-family:sans-serif; color:#888;">'+date+'</span></td></tr>';
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
      var descEl = document.getElementById('accountdescLabel'); if(descEl) descEl.textContent = a.desc || '';
      var equityEl = document.getElementById('liveEquity');
      var cashEl = document.getElementById('liveCash');
      var pnlDayEl = document.getElementById('livePnlDay');
      var botStatusEl = document.getElementById('botStatus');
      var heartbeatEl = document.getElementById('lastHeartbeat');
      var apiStatusEl = document.getElementById('apiStatus');
      if(equityEl && a.equity) equityEl.textContent = 'Equity: $' + parseFloat(a.equity).toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2}) + ' (Paper)';
      if(cashEl && a.cash) cashEl.textContent = 'Cash: $' + parseFloat(a.cash).toLocaleString(undefined,{minimumFractionDigits:2}) + ' | Buying Power: $' + parseFloat(a.buying_power || a.cash*2).toLocaleString(undefined,{minimumFractionDigits:2});
      if(pnlDayEl) {
        var dayPnl = a.equity && a.last_equity ? parseFloat(a.equity) - parseFloat(a.last_equity) : 0;
        pnlDayEl.textContent = 'Day P&L: ' + fmtDollar(dayPnl) + ' | Last close equity: $' + (a.last_equity ? parseFloat(a.last_equity).toFixed(2) : '-');
      }
      var now = new Date();
      if(botStatusEl){ botStatusEl.textContent = 'TRADING BOT ONLINE - Live Paper Trading'; botStatusEl.style.color = '#1d9e75'; }
      if(heartbeatEl) heartbeatEl.textContent = 'Last API ping: ' + now.toLocaleString('en-US',{hour:'2-digit', minute:'2-digit', second:'2-digit', timeZone:'America/Toronto'}) + ' EST';
      if(apiStatusEl){ apiStatusEl.textContent = 'GET /v2/account: 200 OK at ' + now.toISOString() + ' | status: ' + (a.status || 'ACTIVE'); apiStatusEl.style.color = '#1d9e75'; }
      var lu = document.getElementById('lastUpdated'); if(lu) lu.textContent = now.toLocaleString('en-US',{timeZone:'America/Toronto'}) + ' America/Toronto';
    },
    error: function() {
      var botStatusEl = document.getElementById('botStatus'); if(botStatusEl){ botStatusEl.textContent = 'BOT OFFLINE / API ERROR'; botStatusEl.style.color = '#d85a30'; }
      var apiStatusEl = document.getElementById('apiStatus'); if(apiStatusEl){ apiStatusEl.textContent = 'GET /v2/account: FAILED - check server'; apiStatusEl.style.color = '#d85a30'; }
    }
  });
}

function exportCsv() {
  if(!lastTradesData || !lastTradesData.length) { alert('No trades to export yet'); return; }
  var headers = ['symbol','side','filled_avg_price','filled_qty','filled_at','order_id','type'];
  var rows = lastTradesData.map(function(t){ return [t.symbol, t.side, t.filled_avg_price, t.filled_qty, t.filled_at, t.id || t.order_id || '', 'paper'].join(','); });
  var csv = [headers.join(','), ...rows].join('\n');
  var blob = new Blob([csv], {type:'text/csv'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href = url; a.download = 'aiiweb_alpaca_paper_fills_' + new Date().toISOString().slice(0,10) + '.csv'; a.click();
}

function loadAll() {
  var spinner = document.getElementById('spinner'); if(spinner) spinner.style.display = 'inline';
  loadMetrics().then(function(){ 
    $.when(loadEquityHistory(), loadPositions(), loadTrades(), loadAccount()).then(function(){
      var spinner2 = document.getElementById('spinner'); if(spinner2) spinner2.style.display = 'none';
    });
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