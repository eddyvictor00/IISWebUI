
// Add this at the very top of aidashboard.js
const urlParams = new URLSearchParams(window.location.search);
const custId = urlParams.get('cust') || '0'; // Defaults to 0 if ?cust= is missing

let equityChartInst = null;
let winLossChartInst = null;
let monthlyChartInst = null;

function fmt(n) { return parseFloat(n).toFixed(2); }
function fmtDollar(n) { const v = parseFloat(n); return (v >= 0 ? '+$' : '-$') + Math.abs(v).toFixed(2); }
function fmtPct(n) { const v = parseFloat(n); return (v >= 0 ? '+' : '') + v.toFixed(2) + '%'; }

//     Metrics                                                
function loadMetrics() {
  $.ajax({
      url: iisurl + '/cust/' + custId + '/acc/0/aplaca/metrics',
      crossDomain: true,
      cache: false,
      timeout: INT_TIMOUT, //120 sec,
      beforeSend: function () {
          $("#loader").show();
      },
      error: function () {
          alert('Network failure. Please try again later.');
          window.location.href = "aiiend.html";
      },
      success: function(m) {
      document.getElementById('totalReturn').textContent  = fmtPct(m.totalReturnPct);
      document.getElementById('winRate').textContent      = m.winRate + '%';
      document.getElementById('winCount').textContent     = m.winningTrades + ' of ' + m.totalTrades + ' trades';
      document.getElementById('sharpe').textContent       = fmt(m.sharpeRatio);
      document.getElementById('drawdown').textContent     = m.maxDrawdown + '%';
      document.getElementById('riskReward').textContent   = fmt(m.riskRewardRatio) + ' : 1';
      document.getElementById('totalPnl').textContent     = fmtDollar(m.totalPnL);
      document.getElementById('totalInves').textContent   = 'Investment $' + (m.investment).toFixed(0);
      document.getElementById('stockList').textContent    = '(' + m.stockList + ')'; 
      document.getElementById('firstdate').textContent    = '(' + m.firstDate + ')'; 

      // Win/loss donut
      const wins   = m.winningTrades;
      const losses = m.losingTrades;
      const wPct   = Math.round(wins / m.totalTrades * 100);
      const lPct   = 100 - wPct;
      if (winLossChartInst) winLossChartInst.destroy();
      winLossChartInst = new Chart(document.getElementById('winLossChart'), {
        type: 'doughnut',
        data: {
          labels: ['Wins ' + wPct + '%', 'Losses ' + lPct + '%'],
          datasets: [{ data: [wins, losses], backgroundColor: ['#1D9E75','#E24B4A'], borderWidth: 0 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '72%',
          plugins: { legend: { display: false } }
        }
      });
    },
    error: function() {
      console.error('Failed to load metrics');
    }
  });
}

//     Equity curve      
function loadEquityHistory() {
  $.ajax({
    url: iisurl + '/cust/' + custId + '/acc/0/aplaca/equityhistory',
    crossDomain: true,
    cache: false,
    timeout: INT_TIMOUT,
    beforeSend: function () {
        $("#loader").show();
    },
    error: function () {
        alert('Network failure. Please try again later.');
        window.location.href = "aiiend.html";
    },
    success: function(data) {

      // Filter out zero/null equity points (weekends, holidays)
      const cleanData = data.filter(p => p.equity !== null && p.equity !== 0);

      const labels    = cleanData.map(p => p.date);
      const pctValues = cleanData.map(p => p.equity); // backend sends % gain directly

      // Drawdown in %
      let peakPct = pctValues[0] || 0;
      const drawdownPct = pctValues.map(v => {
        if (v > peakPct) peakPct = v;
        return peakPct > 0 ? parseFloat((v - peakPct).toFixed(4)) : 0;
      });

      if (equityChartInst) equityChartInst.destroy();

      equityChartInst = new Chart(document.getElementById('equityChart'), {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Gain %',
              data: pctValues,
              borderColor: '#378ADD',
              backgroundColor: 'rgba(55,138,221,0.08)',
              borderWidth: 2,
              pointRadius: 0,
              fill: true,
              tension: 0.4
            },
            {
              label: 'Drawdown %',
              data: drawdownPct,
              borderColor: '#E24B4A',
              backgroundColor: 'rgba(226,75,74,0.10)',
              borderWidth: 1,
              pointRadius: 0,
              fill: true,
              tension: 0.4,
              borderDash: [4, 3]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: { size: 11 },
                boxWidth: 12,
                padding: 16,
                color: '#555'
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(ctx) {
                  const val = ctx.parsed.y;
                  const sign = val >= 0 ? '+' : '';
                  const decimals = Math.abs(val) < 1 ? 4 : 2;
                  return ` ${ctx.dataset.label}: ${sign}${val.toFixed(decimals)}%`;
                },
                title: function(ctx) {
                  return ctx[0].label;
                }
              }
            }
          },
          scales: {
            x: {
              ticks: {
                maxTicksLimit: 6,
                font: { size: 11 },
                color: '#888'
              },
              grid: { color: 'rgba(0,0,0,0.04)' }
            },
            y: {
              beginAtZero: true,
              ticks: {
                font: { size: 11 },
                color: '#888',
                callback: function(v) {
                  const sign = v >= 0 ? '+' : '';
                  const decimals = Math.abs(v) < 1 ? 4 : 2;
                  return sign + parseFloat(v.toFixed(decimals)) + '%';
                }
              },
              grid: { color: 'rgba(0,0,0,0.04)' }
            }
          }
        }
      });

      // Monthly P&L chart
      buildMonthlyChart(cleanData);
      $("#loader").hide();
    }
  });
}                         
// function loadEquityHistory() {
//   $.ajax({
//     url: iisurl + '/cust/' + custId + '/acc/0/aplaca/equityhistory',
//     crossDomain: true,
//     cache: false,
//     timeout: INT_TIMOUT, //120 sec,
//     beforeSend: function () {
//         $("#loader").show();
//     },
//     error: function () {
//         alert('Network failure. Please try again later.');
//         window.location.href = "aiiend.html";
//     },    
//     success: function(data) {
//       const labels = data.map(p => p.date);
//       const values = data.map(p => p.equity);

//       // Calculate drawdown series
//       let peak = values[0];
//       const drawdownSeries = values.map(v => {
//         if (v > peak) peak = v;
//         return peak > 0 ? v - peak : 0;
//       });

//       if (equityChartInst) equityChartInst.destroy();
//       equityChartInst = new Chart(document.getElementById('equityChart'), {
//         type: 'line',
//         data: {
//           labels,
//           datasets: [
//             {
//               label: 'Equity',
//               data: values,
//               borderColor: '#378ADD',
//               backgroundColor: 'rgba(55,138,221,0.08)',
//               borderWidth: 2, pointRadius: 0, fill: true, tension: 0.4
//             },
//             {
//               label: 'Drawdown',
//               data: drawdownSeries,
//               borderColor: '#E24B4A',
//               backgroundColor: 'rgba(226,75,74,0.10)',
//               borderWidth: 1, pointRadius: 0, fill: true,
//               tension: 0.4, borderDash: [4,3]
//             }
//           ]
//         },
//         options: {
//           responsive: true, maintainAspectRatio: false,
//           plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
//           scales: {
//             x: { ticks: { maxTicksLimit: 6, font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.05)' } },
//             y: { ticks: { font: { size: 11 }, callback: v => '$' + v.toLocaleString() }, grid: { color: 'rgba(0,0,0,0.05)' } }
//           }
//         }
//       });

//       // Monthly P&L from equity history
//       buildMonthlyChart(data);
//     },
//     error: function() { console.error('Failed to load equity history'); }
//   });
// }

//     Monthly P&L derived from equity history       
function buildMonthlyChart(data) {
  const monthly = {};

  data.forEach((p) => {
    const month = p.date.substring(0, 7); // YYYY-MM
    if (!monthly[month]) monthly[month] = { start: p.equity, end: p.equity };
    monthly[month].end = p.equity; // keep updating end until last day of month
  });

  const labels = Object.keys(monthly).map(m => {
    const d = new Date(m + '-01');
    return d.toLocaleDateString('en-US', { month: 'short' });
  });

  // Monthly gain = end % minus start % of that month
  const values = Object.values(monthly).map(m =>
    parseFloat((m.end - m.start).toFixed(4))
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
              const decimals = Math.abs(val) < 1 ? 4 : 2;
              return ` ${sign}${val.toFixed(decimals)}%`;
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
              const decimals = Math.abs(v) < 1 ? 4 : 2;
              return sign + parseFloat(v.toFixed(decimals)) + '%';
            }
          },
          grid: { color: 'rgba(0,0,0,0.05)' }
        }
      }
    }
  });
}         
// function buildMonthlyChart(data) {
//   const monthly = {};
//   data.forEach((p, i) => {
//     const month = p.date.substring(0, 7); // YYYY-MM
//     if (!monthly[month]) monthly[month] = { start: p.equity, end: p.equity };
//     monthly[month].end = p.equity;
//   });

//   const labels = Object.keys(monthly).map(m => {
//     const d = new Date(m + '-01');
//     return d.toLocaleDateString('en-US', { month: 'short' });
//   });
//   const values = Object.values(monthly).map(m => parseFloat((m.end - m.start).toFixed(2)));

//   if (monthlyChartInst) monthlyChartInst.destroy();
//   monthlyChartInst = new Chart(document.getElementById('monthlyChart'), {
//     type: 'bar',
//     data: {
//       labels,
//       datasets: [{
//         data: values,
//         backgroundColor: values.map(v => v >= 0 ? 'rgba(29,158,117,0.75)' : 'rgba(226,75,74,0.75)'),
//         borderRadius: 4
//       }]
//     },
//     options: {
//       responsive: true, maintainAspectRatio: false,
//       plugins: { legend: { display: false } },
//       scales: {
//         x: { ticks: { font: { size: 11 } }, grid: { display: false } },
//         y: { ticks: { font: { size: 11 }, callback: v => '$' + v }, grid: { color: 'rgba(0,0,0,0.05)' } }
//       }
//     }
//   });
// }

//     Positions                                         
function loadPositions() {
  $.ajax({
    url: iisurl + '/cust/' + custId + '/acc/0/aplaca/positions',
    crossDomain: true,
    cache: false,
    timeout: INT_TIMOUT, //120 sec,
    beforeSend: function () {
        $("#loader").show();
    },
    error: function () {
        alert('Network failure. Please try again later.');
        window.location.href = "aiiend.html";
    },        
    success: function(positions) {
      const tbody = document.getElementById('positionsBody');
      if (!positions.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="color:#aaa; text-align:center; padding:16px;">No open positions</td></tr>';
        return;
      }
      const maxPnl = Math.max(...positions.map(p => Math.abs(parseFloat(p.unrealized_pl))));
      tbody.innerHTML = positions.map(p => {
        const pnl    = parseFloat(p.unrealized_pl);
        const pnlPct = parseFloat(p.unrealized_plpc) * 100;
        const barW   = maxPnl > 0 ? Math.round(Math.abs(pnl) / maxPnl * 100) : 0;
        const cls    = pnl >= 0 ? 'pos' : 'neg';
        const barClr = pnl >= 0 ? '#1D9E75' : '#E24B4A';
        return `<tr>
          <td><strong>${p.symbol}</strong></td>
          <td>${p.qty}</td>
          <td>$${parseFloat(p.avg_entry_price).toFixed(2)}</td>
          <td>$${parseFloat(p.current_price).toFixed(2)}</td>
          <td class="${cls}">${fmtDollar(pnl)} (${fmtPct(pnlPct)})</td>
          <td><div class="bar-wrap"><div class="bar-fill" style="width:${barW}%; background:${barClr}"></div></div></td>
        </tr>`;
      }).join('');
    },
    error: function() { console.error('Failed to load positions'); }
  });
}
function loadTrades() {
  $.ajax({
    url: iisurl + '/cust/' + custId + '/acc/0/aplaca/trades',
    crossDomain: true,
    cache: false,
    timeout: INT_TIMOUT, //120 sec,
    beforeSend: function () {
        $("#loader").show();
    },
    error: function () {
        alert('Network failure. Please try again later.');
        window.location.href = "aiiend.html";
    },           
    success: function(trades) {
      const tbody = document.getElementById('tradesBody');
      const recent = trades.slice(0, 20); //10);
      if (!recent.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="color:#aaa; text-align:center; padding:16px;">No trades yet</td></tr>';
        return;
      }
      tbody.innerHTML = recent.map(t => {
        // UPDATED: Formats both Date and Time cleanly (e.g., "Oct 14, 2:30 PM")
        const date = new Date(t.filled_at).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });        
        const price = parseFloat(t.filled_avg_price).toFixed(2);
        const side  = t.side.toLowerCase();
        return `<tr>
          <td><strong>${t.symbol}</strong></td>
          <td><span class="badge ${side}">${t.side}</span></td>
          <td>$${price}</td>
          <td>${t.filled_qty}</td>
          <td>${date}</td>
        </tr>`;
      }).join('');
    },
    error: function() { console.error('Failed to load trades'); }
  });
}


//     Account label                                         
function loadAccount() {
  $.ajax({
    url: iisurl + '/cust/' + custId + '/acc/0/aplaca/account',
    crossDomain: true,
    cache: false,
    timeout: INT_TIMOUT, //120 sec,
    beforeSend: function () {
        $("#loader").show();
    },
    error: function () {
        alert('Network failure. Please try again later.');
        window.location.href = "aiiend.html";
    },       
    success: function(a) {
      const label = parseFloat(a.equity) > 0
        ? 'Live via Alpaca - Portfolio value: $' + parseFloat(a.equity).toLocaleString()
        : 'Paper trading account';
      document.getElementById('accountLabel').textContent = label;
      document.getElementById('accountdescLabel').textContent = a.desc;
    }
  });
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