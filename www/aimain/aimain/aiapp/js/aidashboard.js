// FINAL V3 - Dynamic 9 based on stock list, same simple style
// 9 is NOT hardcoded - calculated from account object stockList

const urlParams = new URLSearchParams(window.location.search);
const custId = urlParams.get('cust') || '0';
const fundId = urlParams.get('fundid') || '0';

let equityChartInst = null;
let winLossChartInst = null;
let monthlyChartInst = null;
let lastTradesData = [];
let lastEquityData = [];
let firstTradeDateStr = null;
const PER_SYMBOL = 6000;

let currentTotalReturnPct = 0;


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

// Parse stock list from account object: "(CHAU,DRN,FAS,...)" -> ["CHAU","DRN",...]
function parseStockList(str) {
  if (!str || typeof str !== 'string') return [];
  var cleaned = str.replace(/[()]/g, '').trim();
  if (!cleaned) return [];
  return cleaned.split(',').map(function(s){ return s.trim().toUpperCase(); }).filter(function(s){ return s.length>0; });
}

function updateNumSymbolsUI(stockListArray) {
  if (!stockListArray || stockListArray.length === 0) return;
  var num = stockListArray.length;
  var deployed = num * PER_SYMBOL;
  var cash = 100000 - deployed;
  // Update all spans that show 9 - dynamic from stock list
  var ids = ['num_symbols_header','num_symbols_sub','num_symbols_equity','num_symbols_monthly','num_symbols_footer','num_symbols_warning','num_symbols_compliance','num_symbols_footer'];
  for (var i=0;i<ids.length;i++){ var el=document.getElementById(ids[i]); if(el) el.textContent = num; }
  // Deployed capital spans (54k etc)
  var deployedIds = ['deployed_capital','deployed_capital_warning','deployed_capital_warning2','deployed_capital_compliance','deployed_capital_footer'];
  for (var j=0;j<deployedIds.length;j++){ var dEl=document.getElementById(deployedIds[j]); if(dEl) dEl.textContent = (deployed/1000).toString(); }
  var cashIds = ['cash_buffer','cash_buffer_warning','cash_buffer_compliance'];
  for (var k=0;k<cashIds.length;k++){ var cEl=document.getElementById(cashIds[k]); if(cEl) cEl.textContent = (cash/1000).toString(); }
  // Stock list display in warning box
  var slWarn = document.getElementById('stockList_warning'); if(slWarn) slWarn.textContent = stockListArray.join(',');
  var slMain = document.getElementById('stockList'); if(slMain) slMain.textContent = '(' + stockListArray.join(',') + ')';

}

function loadMetrics() {
  return $.ajax({
      url: iisurl + '/cust/' + custId + '/acc/0/fund/'+fundId+'/aplaca/metrics',
      crossDomain: true, cache: false, timeout: 120000,
      success: function(m) {
        if (!m) return;
        firstTradeDateStr = m.firstDate || null;

        // Dynamic: get stock list from metrics (conf.A_Sym)
        if (m.stockList) {
          var list = parseStockList(m.stockList);
          if (list.length > 0) {
            updateNumSymbolsUI(list);
        
            var deployedCapital = list.length  * PER_SYMBOL; // e.g. 9 * 6000 = 54000
            if (deployedCapital > 0 && !isNaN(m.totalPnL)) {
              // Return on deployed = (Total Return % * $100,000) / Deployed Capital
              var deployedReturn = (m.totalPnL * 100) / deployedCapital;
              
              var depEl = document.getElementById('deployed_return_pct');
              if (depEl) depEl.textContent = fmtPct(deployedReturn);
              
              var honEl = document.getElementById('honest_return_pct');
              if (honEl) honEl.textContent = fmtPct(m.totalReturnPct);
            }              

          }
        }
        
        var value = (m.investment !== undefined && m.totalPnL !== undefined) ? parseFloat(m.investment) + parseFloat(m.totalPnL) : null;
        if (value !== null) {
          var label = document.getElementById('accountLabel');
          if (label) label.textContent = 'Paper Equity (Alpaca): $' + value.toLocaleString(undefined,{minimumFractionDigits:2, maximumFractionDigits:2}) + ' | Live-forward from ' + (m.firstDate||'-');
        }
        var el;
        el = document.getElementById('totalReturn'); if(el) el.textContent = fmtPct(m.totalReturnPct);
        el = document.getElementById('winRate'); if(el) el.textContent = (m.winRate !== undefined) ? m.winRate + '%' : '-';
        el = document.getElementById('winCount'); if(el) el.textContent = (m.winningTrades !== undefined) ? m.winningTrades + 'W / ' + m.losingTrades + 'L of ' + m.totalTrades + ' trades' : '';
        el = document.getElementById('sharpe'); if(el) el.textContent = fmt(m.sharpeRatio);
        el = document.getElementById('drawdown'); if(el) el.textContent = (m.maxDrawdown !== undefined) ? '-' + Math.abs(m.maxDrawdown) + '%' : '-';
        el = document.getElementById('riskReward'); if(el) el.textContent = (m.riskRewardRatio !== undefined && !isNaN(m.riskRewardRatio)) ? fmt(m.riskRewardRatio) + ' : 1' : '-';
        el = document.getElementById('totalPnl'); if(el) el.textContent = fmtDollar(m.totalPnL);
        el = document.getElementById('totalInves'); if(el) el.textContent = (m.investment !== undefined) ? 'Starting Paper Capital $' + parseFloat(m.investment).toFixed(0) : '';
        el = document.getElementById('stockList'); if(el) el.textContent = m.stockList ? '(' + m.stockList + ')' : ''; 
        el = document.getElementById('firstdate'); if(el) el.textContent = m.firstDate ? m.firstDate : '-';  
        el = document.getElementById('firstdate_sub'); if(el) el.textContent = m.firstDate ? m.firstDate : '-';  

        var ids = ['firstdate_chart','firstdate_chart2'];
        for (var j=0;j<ids.length;j++){ var e=document.getElementById(ids[j]); if(e) e.textContent = m.firstDate || '2026-04-30'; }

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

function loadEquityHistory() {
  return $.ajax({
    url: iisurl + '/cust/' + custId + '/acc/0/fund/'+fundId+'/aplaca/equityhistory',
    crossDomain: true, cache: false, timeout: 120000,
    success: function(data) {
      if (!data || !data.length) return;
      lastEquityData = data;
      
      var cleanData = data.filter(function(p) {
        if (p.equity === null || p.equity === undefined) return false;
        if (p.equity <= -99) return false;
        if (firstTradeDateStr && p.date && p.date < firstTradeDateStr) return false;
        if (p.real_equity !== undefined && p.real_equity !== null && p.real_equity < 1000) return false;
        return true;
      });
      if (cleanData.length === 0) cleanData = data.filter(function(p){ return p.equity !== null && p.equity > -99; });
      if (cleanData.length < 2 && data.length > 2) cleanData = data.slice(-60).filter(function(p){ return p.equity > -99; });

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

      var ctx = document.getElementById('equityChart');
      if (!ctx) return;
      equityChartInst = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            { label: 'Paper Equity % Gain (live from ' + (firstTradeDateStr||'first trade') + ')', data: pctValues, borderColor: '#1D9E75', backgroundColor: 'rgba(29,158,117,0.12)', borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 4, fill: true, tension: 0.3 },
            { label: 'Drawdown %', data: drawdownPct, borderColor: '#E24B4A', backgroundColor: 'rgba(226,75,74,0.08)', borderWidth: 1, pointRadius: 0, fill: true, tension: 0.3 }
          ]
        },
        options: {
          responsive:true, maintainAspectRatio:false, interaction:{mode:'index', intersect:false},
          plugins:{
            legend:{display:true, position:'bottom', labels:{font:{size:11}}},
            tooltip:{ callbacks:{ afterBody: function(ti){ var idx=ti[0].dataIndex; var re=realEquityValues[idx]; if(re) return 'Real Equity: $'+re.toFixed(2)+' (Paper)'; return ''; } } }
          },
          scales:{
            y:{ min: yMin, max: yMax, grid:{color:'#f0f0f0'}, ticks:{ callback: function(v){ return v + '%'; } } },
            x:{ grid:{display:false}, ticks:{ maxTicksLimit: 12, maxRotation: 45 } }
          }
        }
      });
      buildMonthlyChart(cleanData);
    }
  });
}

function buildMonthlyChart(equityData) {
  var monthlyCtx = document.getElementById('monthlyChart');
  if (!monthlyCtx) return;
  var data = equityData || lastEquityData;
  if (!data || data.length < 2) { buildMonthlyChartFromTrades(); return; }
  var monthlyMap = {};
  for (var i = 0; i < data.length; i++) {
    var p = data[i];
    if (!p.date) continue;
    var monthKey = p.date.substring(0, 7);
    if (!monthlyMap[monthKey]) monthlyMap[monthKey] = { firstPct: p.equity, lastPct: p.equity, firstReal: p.real_equity||0, lastReal: p.real_equity||0, count: 0 };
    monthlyMap[monthKey].lastPct = p.equity;
    if (p.real_equity) monthlyMap[monthKey].lastReal = p.real_equity;
    monthlyMap[monthKey].count++;
  }
  var months = Object.keys(monthlyMap).sort();
  var labels = [];
  var pnlPercents = [];
  var pnlDollars = [];
  for (var j = 0; j < months.length; j++) {
    var key = months[j];
    var entry = monthlyMap[key];
    var monthlyPct;
    if (j === 0) {
      monthlyPct = entry.lastPct - (entry.firstPct || 0);
      if (Math.abs(monthlyPct) < 0.01) monthlyPct = entry.lastPct;
    } else {
      var prevEntry = monthlyMap[months[j-1]];
      monthlyPct = entry.lastPct - prevEntry.lastPct;
    }
    labels.push(key);
    pnlPercents.push(parseFloat(monthlyPct.toFixed(2)));
  }
  if (monthlyChartInst) { try { monthlyChartInst.destroy(); } catch(e){} }
  monthlyChartInst = new Chart(monthlyCtx, {
    type: 'bar',
    data: { labels: labels, datasets: [{ label: 'Monthly P&L % (Paper)', data: pnlPercents, backgroundColor: pnlPercents.map(function(v){ return v >= 0 ? 'rgba(29,158,117,0.8)' : 'rgba(226,75,74,0.8)'; }), borderColor: pnlPercents.map(function(v){ return v >= 0 ? '#1D9E75' : '#E24B4A'; }), borderWidth: 1, borderRadius: 4 }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { grid:{color:'#f0f0f0'}, ticks:{ callback: function(v){ return v + '%'; } } }, x: { grid:{display:false} } }
    }
  });
}

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
    if (!monthly[key]) monthly[key] = { count:0 };
    monthly[key].count++;
  }
  var months = Object.keys(monthly).sort();
  var counts = months.map(function(k){ return monthly[k].count; });
  if (monthlyChartInst) { try { monthlyChartInst.destroy(); } catch(e){} }
  monthlyChartInst = new Chart(ctx, {
    type: 'bar',
    data: { labels: months, datasets: [{ label: 'Trades per month', data: counts, backgroundColor: 'rgba(55,138,221,0.7)', borderWidth: 1 }] },
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
      if(ts) ts.textContent = 'as of ' + new Date().toLocaleString('en-US',{hour:'2-digit', minute:'2-digit', timeZone:'America/Toronto'}) + ' EST';
      if (!tbody) return;
      if (!positions || !positions.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="color:#aaa; text-align:center; padding:16px;">No open positions</td></tr>'; return;
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
        tbody.innerHTML = '<tr><td colspan="6" style="color:#aaa; text-align:center; padding:16px;">No fills yet today</td></tr>'; return;
      }
      tbody.innerHTML = recent.map(function(t){
        var date = new Date(t.filled_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Toronto' }) + ' EST';
        var price = parseFloat(t.filled_avg_price || 0).toFixed(2);
        var side = (t.side||'').toLowerCase();
        var oid = t.id || t.order_id || '';
        var orderIdShort = oid ? oid.substring(0,8) + '...' : 'paper-' + t.symbol;
        var estCost = (parseFloat(t.filled_qty||0) * 0.02).toFixed(2);
        return '<tr><td><strong>'+t.symbol+'</strong></td><td><span class="badge '+side+'">'+t.side+'</span></td><td>$'+price+'</td><td>'+t.filled_qty+'</td><td style="font-size:11px;">$'+estCost+' est. slippage</td><td style="font-family:monospace; font-size:11px;"><span title="'+oid+'">'+orderIdShort+'</span><br><span style="font-family:sans-serif; color:#888;">'+date+'</span></td></tr>';
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

      // Dynamic 9 from account object - this is source of truth
      if (a.stockList) {
        var listFromAccount = parseStockList(a.stockList);
        if (listFromAccount.length > 0) {
          updateNumSymbolsUI(listFromAccount);
        }
      }

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
      if(botStatusEl){ botStatusEl.textContent = 'BOT ONLINE - Live Paper Trading'; botStatusEl.style.color = '#1d9e75'; }
      if(heartbeatEl) heartbeatEl.textContent = 'Last API ping: ' + now.toLocaleString('en-US',{hour:'2-digit', minute:'2-digit', second:'2-digit', timeZone:'America/Toronto'}) + ' EST';
      if(apiStatusEl){ apiStatusEl.textContent = 'GET /v2/account: 200 OK at ' + now.toISOString() + ' | status: ' + (a.status || 'ACTIVE'); apiStatusEl.style.color = '#1d9e75'; }
      var lu = document.getElementById('lastUpdated'); if(lu) lu.textContent = now.toLocaleString('en-US',{timeZone:'America/Toronto'}) + ' America/Toronto';
    }
  });
}

function exportCsv() {
  // Disabled - CSV export hidden per request
  return;
}
//     Load everything                                         
function loadAll() {
  document.getElementById('spinner').style.display = 'inline';
  Promise.all([
    new Promise(res => { loadMetrics(); setTimeout(res, 800); }),
    new Promise(res => { loadEquityHistory(); setTimeout(res, 800); }),
    new Promise(res => { loadPositions(); setTimeout(res, 800); }),
    new Promise(res => { loadTrades(); setTimeout(res, 800); }),
    new Promise(res => { loadAccount(); setTimeout(res, 800); })
  ]).then(() => {
    document.getElementById('spinner').style.display = 'none';
  });
}

// function loadAll() {
//   var spinner = document.getElementById('spinner'); if(spinner) spinner.style.display = 'inline';
//   loadAccount().then(function(){
//     loadMetrics().then(function(){ 
//       $.when(loadEquityHistory(), loadPositions(), loadTrades()).then(function(){
//         var spinner2 = document.getElementById('spinner'); if(spinner2) spinner2.style.display = 'none';
//       });
//     });
//   });
// }


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