const MOCK_API_DELAY = 500;
/////////////////////////////basic local storage
/////////////////////////////basic local storage
//////Goble variable
var iisWebSession = "iisWebSession";
var iisWebObjStr = window.localStorage.getItem(iisWebSession);
var iisWebObj = JSON.parse(iisWebObjStr);


var iisurlStr = iisWebObj.iisurlStr;
iisurl = iisurlStr;

var custObjStr = iisWebObj.custObjStr;
if (custObjStr == null) {
    window.location.href = ".aiiend.html";
}
var custObj = JSON.parse(custObjStr);

var iisDataObjStr = iisWebObj.iisDataObjStr;
if (iisDataObjStr == null) {
    window.location.href = ".aiiend.html";
}
var iisDataObj = JSON.parse(iisDataObjStr);

var stockObjListStr = iisDataObj.stockObjListStr;
var stockObjList = "";
if (iisDataObjStr != null) {
    if (stockObjListStr.length > 0) {
        stockObjList = JSON.parse(stockObjListStr);
    }
}

var stockFundObjListStr = iisDataObj.stockFundObjListStr;
var stockFundObjList = "";
if (iisDataObjStr != null) {
    if (stockFundObjListStr.length > 0) {
        stockFundObjList = JSON.parse(stockFundObjListStr);
    }
}

var accObjListStr = "";
var accObjList = "";
var accObj = null;
var accId = 0;
var accfundObj = null;
var accfundId = 0;

var accdevObj = null;
var accdevId = 0;

var iisODSObjSession = "iisODSObjSession";
var iisODSObjStr = window.localStorage.getItem(iisODSObjSession);
var iisODSObj = JSON.parse(iisODSObjStr);
//////Goble variable
var userN = iisODSObj.userN;
var custT = iisODSObj.custT;
var sysDevOp = iisODSObj.sysDevOp;
var debug01 = iisODSObj.debug01;
var custChange = iisODSObj.custChange;
var scribLStr = iisODSObj.scribLStr;

var trName = iisODSObj.trName;

if (trName.length == 0) {
    trName = "TR_NN33";
}

var stockId = iisODSObj.stockId;

var trM1 = iisODSObj.trM1;
var trM1TR = iisODSObj.trM1TR;
var trM1St = iisODSObj.trM1St;
var trM2 = iisODSObj.trM2;
var trM2TR = iisODSObj.trM2TR;
var trM2St = iisODSObj.trM2St;
var trM3 = iisODSObj.trM3;
var trM3TR = iisODSObj.trM3TR;
var trM3St = iisODSObj.trM3St;

accId = iisODSObj.accId;
accfundId = iisODSObj.accfundId;
accdevId = iisODSObj.accdevId;

var trObjSt = "";
var trObj = "";
var stockObj;
var stockDataStr = "";
var stockData = null;


var ProfileData = {
    ready: false,
    debugSt: "",
    analysisSt: "",
    trNa: "",
    trDec: "",
    BSsignal: 0,
    BSsignalStr : "",
    QuantityHeld: "",
    AveragePrice: "",
    TranDate: "",
    MarketValue: "",
    OpenPL: "",

    fromdate: "",
    cum_return: 0,	
    bh_return: 0,	
    numtrade: 0,
    numloss: 0,
    numwin: 0,
    totalloss: 0,
    totalwin: 0,		
    maxholdtime: 0,
    minholdtime: 0,
    sharpe: 0,
    max_drawdown: 0,
    rating: 0,

    curPrice: 0, 
    curStatus: "",
    preClose: 0, 
    percentSt: "",
    stockStatus: "",

    WHigh: 0.0,
    WLow: 0.0,
    MarketCap: 0.0,
    PERatio: 0.0,
    BuyPercent: 0.0,
    SellPercent: 0.0,
    HoldPercent: 0.0,

    sr: 0,
    itrend: 0,
    imacd : 0,
    irsi : 0,
    iband : 0,
    ivol : 0,
    ibull : 0,
    ibear : 0,

    fema: 0.0,
    fmacd : 0.0,
    fbandh : 0.0,
    fbandl : 0.0,    
    fdir : 0.0,
    fvol : 0.0,

    snn: 0,
    snncnt: 0,
    nntrend: 0,
    nntech: 0,
    nntechcnt: 0,    
    updatedatel:0
};

function myInitFunction(symbolN) {

    var htmlSt = "";
    var selected = "selected";
    htmlSt += '<select id="selectStid" onchange="return selectStFunction();" class="form-select mb-3" aria-label="Select symbol">';
    var htmlName = "";
    var tempStId = 0;
    for (i = 0; i < stockObjList.length; i++) {
        stockObj = stockObjList[i];
        if (symbolN == stockObj.symbol) {
            stockId = stockObj.id;        
            break;
        }
    }
    if (sysDevOp == true) {
        if (accdevId > 0) {
            accId = accdevId;
        }
    }
    // var trName = "TR_NN33";

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/" + symbolN + "/tr/" + trName,
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
        success: function (resultTRList) {
            if ((resultTRList === null) || (resultTRList === "")) {
//                window.location.href = "aiiend.html";
                // need to clear the Positions and statistic

                ProfileData.BSsignal = 0;
                ProfileData.BSsignalStr = "";
                ProfileData.QuantityHeld="";
                ProfileData.AveragePrice= "";
                ProfileData.TranDate= "";
                ProfileData.MarketValue= "";
                ProfileData.OpenPL= "";

                ProfileData.fromdate= "";
                ProfileData.cum_return= 0;	
                ProfileData.bh_return= 0;	
                ProfileData.numtrade= 0;
                ProfileData.numloss= 0;
                ProfileData.numwin= 0;
                ProfileData.totalloss= 0;
                ProfileData.totalwin= 0;		
                ProfileData.maxholdtime= 0;
                ProfileData.minholdtime= 0;

                ProfileData.rating= 0;

                ProfileData.curPrice= 0;
                ProfileData.curStatus = "";
                ProfileData.preClose= 0; 
                ProfileData.percentSt= "";
                ProfileData.stockStatus= "";

                ProfileData.WHigh= 0.0;
                ProfileData.WLow= 0.0;
                ProfileData.MarketCap= 0.0;
                ProfileData.PERatio= 0.0;
                ProfileData.BuyPercent= 0.0;
                ProfileData.SellPercent= 0.0;
                ProfileData.HoldPercent= 0.0;
                ProfileData.trNa =trObj.trname;
                ProfileData.trDec ="";

                ProfileData.ready = true;
                $('#stock-detail-content').html(renderStockDetailHtml());
                return;
            }

            var trObjData = "";
            trObjSt = JSON.stringify(resultTRList, null, '\t');
            trObj = JSON.parse(trObjSt);           
            try {

                ProfileData.trNa =trObj.trname;
                ProfileData.trDec ="";
                                
                var trObjD = trObj.data;
                if (trObjD !== "") {
                    var trObjDataStr = trObjD.replaceAll('#', '"');
                    trObjData = JSON.parse(trObjDataStr);
                    ProfileData.snn = (trObjData.Snn === 1) ? "Buy" : "Sell";
                    ProfileData.snncnt= trObjData.SnnCnt;
                    ProfileData.nntrend= (trObjData.STren === 1) ? "Up" : "Down";
                    ProfileData.nntech= (trObjData.STch === 1) ? "Up" : "Down";
                    ProfileData.nntechcnt= trObjData.STcnt;
                    
                }

                var trObjD = trObj.conf;
                if (trObjD !== "") {
                    var trObjDataStr = trObjD.replaceAll('#', '"');
                    trObjData = JSON.parse(trObjDataStr);
                    
                    ProfileData.trDec = trObjData.comm;    
                    if (ProfileData.trDec === undefined) {
                        // myVar has been declared but has no value
                        ProfileData.trDec = "";
                    }                           
                }
            } catch (err) {
            }                 
                  
            var percentSt = "";
            var dateSt ="";
            var close = 0;
            var preClose = 0;
            if (stockObj.afstockInfo != null) {
                close = stockObj.afstockInfo.fclose;
                preClose = stockObj.prevClose;
                var percent = 100 * (close - preClose) / preClose;
                if (percent > 0) {
                    percentSt = '<span class="text-green-500">(' + percent.toFixed(2) + '%)' + "</span>";
                } else {
                    percentSt = "<font style= color:red>(" + percent.toFixed(2) + '%)' + "</font>";
                }
                // 1. Convert seconds to milliseconds
                const timestampInMs = stockObj.afstockInfo.updatedatel * 1000;
                // 2. Create a new Date object
                const date = new Date(timestampInMs);
                // --- Option A: To display a fully localized, readable string ---
                dateSt = date.toLocaleString();
                            
            }


            // var stStr = '<Strong>Symbol (' + stockObj.symbol + '): ' + stockObj.stockname + '</Strong>';
            var stStr = "";
            var stStSize = 0;

            stockDataStr = "";
            stockD = stockObj.data;
            try {
                if (stockD !== "") {
                    stockDataStr = stockD.replaceAll('#', '"');
                    var objData = JSON.parse(stockDataStr);

                    if (objData != null) {
                        stockData = objData;

                        if (objData.bulbea == 1) {
                            stStr += 'Trend reversal for Buy detected.';
                        } else if (objData.bulbea == 2) {
                            stStr += 'Trend reversal for Sell detected.';
                        }
                        // stStr += '<br>Market Trend (+/-): ' + objData.mktre;

                        stStSize = objData.stSize;

                        ProfileData.rating = objData.rate;
                        if (objData.sr === 0) {
                            ProfileData.sr = "No Change"
                        } else {
                            ProfileData.sr = (objData.sr === 1) ? "Buy" : "Sell";
                        }
                        // ProfileData.tech = (objData.tech === 1) ? "Up" : "Down";
                        // ProfileData.vol= (objData.vol === 1) ? "Good" : "Low"; 
                        // ProfileData.rsiup= (objData.rsiup === 1) ? "True" : "False"; 
                        // ProfileData.rsidownup= (objData.rsidownup === 1) ? "True" : "False"; 
                        // ProfileData.rsi= objData.rsi.toFixed(2);    

                        ProfileData.itrend = (objData.itrend === 1) ? "Up" : "Down";
                        ProfileData.imacd = (objData.imacd === 1) ? "Up" : "Down";
                        ProfileData.irsi = (objData.irsi === 1) ? "True" : "False";
                        ProfileData.iband = (objData.iband === 1) ? "True" : "False";
                        ProfileData.ivol =  (objData.ivol === 1) ? "Good" : "Low";
                        ProfileData.ibull = objData.ibull;
                        ProfileData.ibear = objData.ibear;

                        ProfileData.fema = objData.fema 
                        ProfileData.fmacd = objData.fmacd;
                        ProfileData.frsi = objData.frsi;
                        ProfileData.fbandh = objData.fbandh;
                        ProfileData.fbandl = objData.fbandl;
                        ProfileData.fvol = objData.fvol;

                        ProfileData.fdir = objData.chDir;
                        ProfileData.dir = ""
                        if (objData.chDir > 5) {
                            ProfileData.dir = "Up"
                        } else if (objData.chDir < -5) {
                             ProfileData.dir = "Down"
                        }
              
                    }
                }
            } catch (err) {
            }
            var stStatus = "";
            if (stockObj.substatus == 11) { //ConstantKey.STOCK_ERROR = 11
                var stStockMsg = "<font style= color:red>Error</font>";
                if (stStSize > 0) {
                    if (stStSize < 700) {
                        stStockMsg = "<font style= color:red>SizeError</font>";
                    }
                }
                stStatus = stStockMsg;

            } else if (stockObj.substatus == 10) { //ConstantKey.STOCK_SPLIT = 10
                stStatus = "<font style= color:red>Split</font>";
            } else if (stockObj.substatus == 2) { //INITIAL = 2;
                stStatus = "Init";
            } else if (stockObj.substatus == 0) { //INITIAL = 2;
                stStatus = ""; //"<font style= color:green>Ready</font>";
            }
            if (stStatus != ""){
                stStatus = "Stock Error: "+stStatus
            }


            ProfileData.curPrice = close; 
            ProfileData.preClose = preClose; 
            ProfileData.percentSt = percentSt;
            ProfileData.stockStatus = stStr;
            ProfileData.curStatus = stStatus;            
            ProfileData.timeSt = dateSt;

            // // Example Output (based on your system's timezone and locale): 
            // // "12/6/2025, 4:31:15 PM" 
            // console.log("Localized String:", localizedString);            
            // stStr += '<br>' + localizedString + " " + stStatus; //stockObj.updatedatedisplay + " " + stStatus;
            // stStr += '<br>' + 'Prev Close:' + preClose + ' &nbsp;&nbsp;Delayed Close:' + close + ' &nbsp;&nbsp;Change:' + percentSt
            // stStr += '<br>';
            // $("#mytrid").html(stStr);

            // iniTRmodel();
                        
            initTranFunction();
            iniStockAnalysis();
            myInitPerf();

            // ProfileData.BSsignal = trObj.trsignal;
            // ProfileData.BSsignalStr = " ";
            // // <span class="text-base font-semibold"><span class="text-green-500 text-base font-bold"><big>BUY</big></span></span>
            // if (trObj.trsignal == 1){
            //     ProfileData.BSsignalStr = '<span class="text-green-500 text-base font-bold"><big> Buy</big></span>';
            // } else if (trObj.trsignal == 2){
            //     ProfileData.BSsignalStr = '<span class="text-red-500 text-base font-bold"><big> Sell</big></span>';
            // } 
            
            // initFundamental();
            return;
//////
        }

    });
}

function myInitPerf() {
    // trName = "TR_NN33"; // just for testing
    var symbol = stockObj.symbol;
    var urlSt = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/" + symbol + "/tr/" + trName + "/perf";

    $.ajax({
        url: urlSt,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function () {
//            alert('Network failure. Please try again later.');
//            window.location.href = "aiiend.html";
        },
        success: function (resultPerfList) {
//            console.log(resultPerfList);

            if (resultPerfList != null) {
                if (resultPerfList.length === 0) {
                    return;
                }

                var PerfObj = resultPerfList[0];
                var trsignal = PerfObj.performData.trsignal;
                var perfStart = PerfObj.performData.fromdate;
                var perfEnd = PerfObj.updatedatedisplay;

                var netprofitSt = Number(PerfObj.grossprofit).toLocaleString('en-US', {style: 'currency', currency: 'USD'});

                var percentProfit = 100 * (PerfObj.grossprofit) / TRADING_AMOUNT;
                var percentProfitSt = "";
  
                if (percentProfit > 100) {
                    percentProfitSt = Number(percentProfit.toFixed(0)).toLocaleString('en');
                } else {
                    percentProfitSt = Number(percentProfit.toFixed(2)).toLocaleString('en');
                }

                var tranSt = "";
                var title1 = "";
                var col1 = "";
                var title2 = "";
                var col2 = "";


                tranSt += '<table class="table table-striped table-sm">';
                tranSt += ' <thead>';
                tranSt += '<tr>';
                tranSt += '<th></th>';
                tranSt += '<td></td>';
                tranSt += '<th></th>';
                tranSt += '<td></td>';
                tranSt += '</tr>';
                tranSt += '</thead>';
                tranSt += '<tbody>';

                title1 = 'Date: ';
                col1 = perfEnd;
                title2 = 'From: ';
                col2 = perfStart;
                tranSt += '<tr>';
                tranSt += '<th width="20%">' + title1 + '</th>';
                tranSt += '<td width="30%">' + col1 + '</td>';
                tranSt += '<th width="20%">' + title2 + '</th>';
                tranSt += '<td width="30%">' + col2 + '</td>';
                tranSt += '</tr>';

                tranSt += '<tr>';
                tranSt += '<th></th>';
                tranSt += '<td></td>';
                tranSt += '<th></th>';
                tranSt += '<td></td>';
                tranSt += '</tr>';

                title1 = 'Profit: ';
                col1 = netprofitSt;
                title2 = 'Profit (%): ';
                col2 = percentProfitSt + '%';
                tranSt += '<tr>';
                tranSt += '<th>' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';


                title1 = 'Rating: ';
                col1 = PerfObj.rating.toFixed(2);
                title2 = 'Num Trade: ';
                col2 = PerfObj.numtrade;
                tranSt += '<tr>';
                tranSt += '<th>' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                title1 = 'Num Win: ';
                col1 = PerfObj.performData.numwin;
                title2 = 'Num Loss: ';
                col2 = PerfObj.performData.numloss;
                tranSt += '<tr>';
                tranSt += '<th>' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                title1 = 'Max Win: ';
                col1 = PerfObj.performData.maxwin.toFixed(2);
                title2 = 'Max Loss: ';
                col2 = PerfObj.performData.maxloss.toFixed(2);
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                title1 = 'Avg Win: ';
                col1 = PerfObj.performData.avgwin.toFixed(2);
                title2 = 'Avg Loss: ';
                col2 = PerfObj.performData.avgloss.toFixed(2);
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                title1 = 'Total Buy: ';
                col1 = PerfObj.performData.totalbuyonly.toFixed(2);
                title2 = 'Total Sell: ';
                col2 = PerfObj.performData.totalsellonly.toFixed(2);
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                title1 = 'Hold Time: ';
                col1 = PerfObj.performData.holdtime;
                title2 = 'Max Hold Time: ';
                col2 = PerfObj.performData.maxholdtime;
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                title1 = 'Sharp Ratio: ';
                col1 = PerfObj.performData.sharpe;
                title2 = 'Cumulative: ';
                col2 = PerfObj.performData.cum_return;
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                title1 = 'Drawdonw: ';
                col1 = PerfObj.performData.max_drawdown;
                title2 = 'Turnover: ';
                col2 = PerfObj.performData.turnover;
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                var buyhold = PerfObj.performData.buyhold;   // profit of buy and hold
                var buyholdSt = Number(buyhold).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                var percentbuyholdSt = "";
                var percentbuyhold = 100 * buyhold / TRADING_AMOUNT;
                if (buyhold > 100) {
                    percentbuyholdSt = Number(percentbuyhold.toFixed(0)).toLocaleString('en');
                } else {
                    percentbuyholdSt = Number(percentbuyhold.toFixed(2)).toLocaleString('en');
                }

                title1 = 'BH Profit: ';
                col1 = buyholdSt
                title2 = 'Buy Hold Per: ';
                col2 = percentbuyholdSt + '%';
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                var reInvest = PerfObj.performData.reInvestProfit;   // 
                var reInvestSt = Number(reInvest).toLocaleString('en-US', {style: 'currency', currency: 'USD'});

                var percent = 100 * reInvest / TRADING_AMOUNT;
                var percentSt = "";
                if (percent > 100) {
                    percentSt = Number(percent.toFixed(0)).toLocaleString('en');
                } else {
                    percentSt = Number(percent.toFixed(2)).toLocaleString('en');
                }

                ProfileData.fromdate = PerfObj.performData.fromdate;
                ProfileData.cum_return = percentProfit.toFixed(2);	
                ProfileData.bh_return = percentbuyhold.toFixed(2);	

                ProfileData.numtrade = PerfObj.numtrade;
                ProfileData.numloss = PerfObj.performData.numloss;
                ProfileData.numwin = PerfObj.performData.numwin;
                ProfileData.totalloss = PerfObj.performData.totalloss;
                ProfileData.totalwin = PerfObj.performData.totalwin;		
                ProfileData.sharpe = PerfObj.performData.sharpe;
                ProfileData.max_drawdown = PerfObj.performData.max_drawdown;		                
                ProfileData.maxholdtime = PerfObj.performData.maxholdtime;
                ProfileData.minholdtime = PerfObj.performData.holdtime;
                $('#stock-detail-content').html(renderStockDetailHtml());
            }
        }
    });
}

function iniStockAnalysis() {

    var urlSt = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/analysis/" + stockObj.symbol;

    $.ajax({
        url: urlSt,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function () {
//            alert('Network failure. Please try again later.');
//            window.location.href = "aiiend.html";
        },
        success: function (commObjList) {

            if (commObjList !== "") {
                var size = commObjList.length;
                if (size == 0) {
                    ProfileData.analysisST = "No Message";
                    $('#stock-detail-content').html(renderStockDetailHtml());    
                    return;
                }

                var htmlhead = "";

                for (i = 0; i < commObjList.length; i++) {
                    var dataSt = commObjList[i];
                    dataSt = dataSt.replaceAll("\n", "<br>");
                    var dataList = dataSt.split(" - ");
                    if (dataList.length >= 2) {
                        var msg = dataList[1];
                        if (debug01 == true) {
                            if (dataList.length >= 3) {
                                msg += " " + dataList[2];
                            }
                        }
                        htmlhead +=  msg;
                        ProfileData.analysisST = htmlhead;  
                        
                        $('#stock-detail-content').html(renderStockDetailHtml());                  
                        return;
                    }
                }


            }
            ProfileData.analysisST = "";
            $('#stock-detail-content').html(renderStockDetailHtml());   

        }
    });
}


function initTranFunction() {
    // trName = "TR_NN33"; // just for testing
    var symbol = stockObj.symbol;

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/" + symbol + "/tr/" + trName + "/tran",
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
        success: function (resultTranList) {

            var tranObjListStr = JSON.stringify(resultTranList, null, '\t');
            var tranObjList = JSON.parse(tranObjListStr);

            if (tranObjList.length === 0) {
                ProfileData.ready = true;
                renderStockDetails(symbol, name);
                activateTab('stock-detail'); // Activate the first tab by default (updated name)

                return;
            }
            var j = tranObjList.length - 1;
            var prevTranObj = null;
            var total = 0;

            var list = [];
            var buyOnly = 0;
            if (trName === "TR_ACC") {
                buyOnly = 1;
            }
            var close = 0;
            close = stockObj.afstockInfo.fclose;

            var htmlSt = "";
            htmlSt += '<table class="table table-sm">';
            htmlSt += '<thead>';
            htmlSt += '<tr>';
            htmlSt += '<th width="5%" scope="col">#</th>';
            htmlSt += '<th width="20%" scope="col">Date</th>';
            htmlSt += '<th width="20%" scope="col">Signal</th>';
            htmlSt += '<th scope="col">Price</th>';
            htmlSt += '<th scope="col">cur Profit</th>';
            htmlSt += '</tr>';
            htmlSt += '</thead>';
            htmlSt += '<tbody>';

            var initF = false;
            var rowCnt = 1;
            for (i = 0; i < tranObjList.length; i++) {
                var tranObj = tranObjList[j - i];

                if (i === 0) {
                    prevTranObj = tranObj;
                }
                var col1 = ""
                var col2 = "";
                var col3 = "";
                var col4 = "";
                var tranSt = "";
                var tranhtml = '';

                var itemColor = 'style="background: #f2f2f2"';
                col1 = '<div ><strong>' + tranObj.updatedatedisplay + '</strong></div>';
                var signal = "Buy";
                if (tranObj.trsignal === S_BUY) {
                    signal = "Buy";
                } else if (tranObj.trsignal === S_SELL) {
                    signal = "Sell";
                    if (buyOnly === 1) {
                        // assume buy only and no short selling
                        prevTranObj = tranObj;
                        if (tranObjList.length === 1) {
                            tranhtml = 'No transaction ...';
                        }
                        continue;
                    }
                } else {
                    signal = "Exit";
                }

                if (signal === "Exit") {
                    if (prevTranObj != null) {
                        var diff = (tranObj.avgprice - prevTranObj.avgprice) * tranObj.share;
                        if (prevTranObj.trsignal === S_BUY) {
                            ;
                        }
                        if (prevTranObj.trsignal === S_SELL) {
                            diff = -diff;
                            if (buyOnly === 1) {
                                // assume buy only and no short selling
                                diff = 0;
                                prevTranObj = tranObj;
                                continue;
                            }
                        }
                        total += diff;

                        var totalSt = Number(total.toFixed(0)).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                        var diffSt = Number(diff.toFixed(0)).toLocaleString('en-US', {style: 'currency', currency: 'USD'});

                        var perTran1 = 1.0 * diff / (tranObj.share * prevTranObj.avgprice);
                        perTran1 = perTran1 * 100;
                        diffSt = diffSt.replace(".00", "");
                        var tran = ' Tran on loss:' + diffSt + ' (' + perTran1.toFixed(1) + '%)';
                        if (diff > 0) {
                            tran = ' Tran on gain:' + diffSt + ' (' + perTran1.toFixed(1) + '%)';
                        }

                        tranhtml += 'Share=' + tranObj.share + tran; // + ' Total: ' + totalSt;
                    }
                } else {
                    if (i == tranObjList.length - 1) {
                        //calculate the result on the last one
                        var diff = (close - tranObj.avgprice) * tranObj.share;
                        if (tranObj.trsignal === S_BUY) {
                            ;
                        }
                        if (tranObj.trsignal === S_SELL) {
                            diff = -diff;
                            if (buyOnly === 1) {
                                // assume buy only and no short selling
                                diff = 0;
                                prevTranObj = tranObj;
                                continue;
                            }
                        }
                        total += diff;
                        var totalSt = Number(total.toFixed(0)).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                        var diffSt = Number(diff.toFixed(0)).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                        var perTran = 1.0 * diff / (tranObj.share * prevTranObj.avgprice);
                        perTran = perTran * 100;
                        diffSt = diffSt.replace(".00", "");
                        var perTranSt = "";
                        // if (perTran > 0) {
                        //     perTranSt = "<font style= color:green>" + diffSt + ' (' + perTran.toFixed(1) + '%)' + "</font>";
                        // } else {
                        //     perTranSt = "<font style= color:red>" + diffSt + ' (' + perTran.toFixed(1) + '%)' + "</font>";
                        // }              
                        // if (stockObj.substatus === 0) {
                        //     tranhtml += 'Share=' + tranObj.share + ' Tran amt change: ' + perTranSt; // + ' Total: ' + totalSt;
                        // }
                        ProfileData.BSsignal = tranObj.trsignal;
                        ProfileData.BSsignalStr = "";
                        if (tranObj.trsignal == 1){
                            ProfileData.BSsignalStr = '<span class="text-green-500 text-base font-bold"><big> Buy</big></span>';
                        } else if (tranObj.trsignal == 2){
                            ProfileData.BSsignalStr = '<span class="text-red-500 text-base font-bold"><big> Sell</big></span>';
                        } 
                        if (perTran > 0) {
                            perTranSt = '<span class="text-green-500">' + diffSt + ' (' + perTran.toFixed(1) + '%)' + '</span>';
                        } else {
                            perTranSt = "<font style= color:red>" + diffSt + ' (' + perTran.toFixed(1) + '%)' + "</font>";
                        }                                  
                        ProfileData.AveragePrice = tranObj.avgprice;                        
                        ProfileData.QuantityHeld = tranObj.share;
                        ProfileData.TranDate = tranObj.updatedatedisplay;
                        ProfileData.OpenPL = perTranSt;
                        ProfileData.MarketValue =  (tranObj.share * prevTranObj.avgprice) + diff
                        ProfileData.MarketValue = ProfileData.MarketValue.toFixed(0) 
                        ProfileData.ready = true;

                        stockDataStr = "";
                        stockData = stockObj.data;
                        if (stockData !== null) {
                            var stockSt = stockData.replaceAll('#', '"');;
                            var objStData = JSON.parse(stockSt);
                            stockDataStr += "<br>Stock Msg: (ADX:" + objStData.chDir + " volat:" + objStData.valid                            
                                    + " p:" + objStData.pCl + " top:" + objStData.top
                                    + " bp:" + objStData.bulbea + " trend:" + objStData.tre 
                                    + " dayt:" + objStData.dayt 
                                    + " NN31:"+objStData.perf31
                                    + " NN32:"+objStData.perf32
                                    + " NN33:"+objStData.perf33
                                    + " NN91:"+objStData.perf91
                                    + " NN92:"+objStData.perf92
                                    + " NN93:"+objStData.perf93                                    
                                    + " )"
                            if ((objStData.stSize > 0) && (objStData.stSize < 700)) {
                                stockDataStr += "<br>Warning: Historical data size " + objStData.stSize + " is not sufficient for NN training...";
                            }
                        }

                        var trDataSt = trObj.data;
                            if (trDataSt != null) {
                                if (trDataSt !== "") {
                                    trDataSt = trDataSt.replaceAll('#', '"');
                                    var trData = JSON.parse(trDataSt);                        
                                    if (trData != null) {
                                        if (debug01 == true) {
                                            ProfileData.debugSt = trData.nnst;
                                            ProfileData.debugSt += stockDataStr;
                                        }
                                    }
                                }
                            }                        
                        $('#stock-detail-content').html(renderStockDetailHtml());
                    }
                }
                if (tranObj.trsignal === S_BUY) {
                    col2 = '<span class="text-green-500">' + signal + '</span>';
                } else if (tranObj.trsignal === S_SELL) {
                    col2 = '<div style="color:red">' + signal + '</div>';
                } else {
                    col2 = '<div  >' + '----' + '</div>';   //'<div  >' + signal + '</div>';
                    itemColor = "";
                }

                var avgSt = tranObj.avgprice.toFixed(2);
                col3 = avgSt;
                var totalSt = Number(total.toFixed(0)).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                col4 = totalSt.replace(".00", "");
                tranSt += '<tr ' + itemColor + '>';
                tranSt += '<th scope="row">' + rowCnt + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '<td>' + col3 + '</td>';
                tranSt += '<td>' + col4 + '</td>';
                tranSt += '</tr>';
                if (initF == true) {
                    tranSt += '<tr ' + itemColor + '>';
                    tranSt += '<th scope="row"> </th>';
                    tranSt += '<td colspan="5">' + tranhtml + '</td>';
                    tranSt += '</tr>';
                }
                initF = true;
                rowCnt++;

                prevTranObj = tranObj;

                list.push(tranSt);
 
            }

            // for (i = 0; i < list.length; i++) {
            //     htmlSt += list[list.length - i - 1];
            // }
            // htmlSt += '</tbody>';
            // htmlSt += '</table>';

            // $("#trtranid").html(htmlSt);
            
            // ProfileData.BSsignal = trObj.trsignal;
            // ProfileData.BSsignalStr = "";
            // if (trObj.trsignal == 1){
            //     ProfileData.BSsignalStr = '<span class="text-green-500 text-base font-bold"><big> Buy</big></span>';
            // } else if (trObj.trsignal == 2){
            //     ProfileData.BSsignalStr = '<span class="text-red-500 text-base font-bold"><big> Sell</big></span>';
            // } 
        }
    });

}

// --- Added Loading Spinner Functions ---
function showLoadingSpinner() {
    // Hide the placeholder icon/text and show the spinner
    $('#chart-placeholder-content').addClass('hidden');
    $('#chart-loading-spinner').removeClass('hidden');
}

function hideLoadingSpinner() {
    // Hide the spinner and show the placeholder icon/text (simulating chart data loaded)
    $('#chart-loading-spinner').addClass('hidden');
    $('#chart-placeholder-content').removeClass('hidden');
}
// --- End Loading Spinner Functions ---

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatPercentage(amount) {
    return amount.toFixed(2) + '%';
}

// Global variable to keep track of the currently selected month duration
var selectedChartMonth = 3; 

function renderStockDetails(symbol, name) {
    showLoadingSpinner();
    $('#stock-symbol').text(symbol);
    trNameChart = trName;

    var resultURL = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/" + symbol + "/tr/" + trNameChart + "/tran/history/chart?month=" + selectedChartMonth + "&t=" + new Date().getTime();
    
    var $imageElement = $("#space3image");
    
    // ATTACH HANDLERS BEFORE SETTING SRC
    $imageElement.off("load error"); 
    
    // Attach the success handler (load)
    $imageElement.on("load", function() {
        hideLoadingSpinner();
    });

    // Attach the failure handler (error)
    $imageElement.on("error", function() {
        console.error("Failed to load chart image.");
        hideLoadingSpinner();
    });

    // SET THE SRC TO START LOADING
    $imageElement.attr("src", resultURL);
}

// Function to handle switching the duration from the UI buttons
function changeChartDuration(month) {
    selectedChartMonth = month;
    
    // Update active button styles
    $('.chart-duration-btn').removeClass('bg-sky-500 text-white').addClass('bg-gray-700 text-gray-300');
    $(`#btn-chart-${month}m`).removeClass('bg-gray-700 text-gray-300').addClass('bg-sky-500 text-white');
    
    const symbol = getUrlParameter('symbol');
    renderStockDetails(symbol, "");
}

// Function to reload image on error (as in original code)
function reload3Image(img) {
    console.log("Image failed to load, attempting reload");
    var src = img.src;
    img.src = "";
    setTimeout(function() {
        img.src = src;
    }, 500);
}
function reload3Image(pThis) {
    // To prevent this from being executed over and over
    pThis.onerror = null;

    // Refresh the src attribute, which should make the
    // browsers reload the iamge.
    pThis.src = pThis.src;
}

function activateTab(tabName) {
    // Deactivate all tab buttons and content
    $('.tab-button').removeClass('active');
    $('.tab-content').removeClass('active').addClass('hidden'); // Ensure hidden is applied

    // Activate the selected tab button and content
    $(`.tab-button[data-tab="${tabName}"]`).addClass('active');
    $(`#${tabName}-content`).addClass('active').removeClass('hidden');

    if (tabName == 'stock-detail') {        
        $('#stock-detail-content').html(renderStockDetailHtml());
    } else if (tabName == 'orders') { // This matches your 'Analysis' button data-tab
        initFundamental();
    }
}


function initFundamental() {
    $('#fundamentalid').html('<span class="blink">Retrieving info....</span>');
    $.ajax({
//        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/commsplit",
        url: iisurl + "/cust/" + custObj.username + "/acc/0/billing/getfundamental?symbol=" + stockObj.symbol,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    function handleResult(result) {
        if (result != null) {
            if (result.length == 1) {
                var resultSt = result[0];
                // resultSt = resultSt.replaceAll("<h2>", "<h4>");
                // resultSt = resultSt.replaceAll("</h2>", "</h4>");
                // resultSt = resultSt.replaceAll("<h1>", "<h3>");
                // resultSt = resultSt.replaceAll("</h1>", "</h3>");
                // resultSt = `
                // <div class="p-4 bg-gray-800 rounded-lg">
                //     <h1 class="text-xl font-bold text-sky-400 mb-2">SPDR S&P 500 ETF Trust (SPY)</h1>
                //     <div class="meta flex flex-wrap gap-2 text-xs text-gray-400">
                //         <div class="card bg-gray-700 p-2 rounded"><strong>Report Date:</strong> Nov 10, 2025</div>
                //         <div class="card bg-gray-700 p-2 rounded"><strong>Ticker:</strong> SPY</div>
                //     </div>
                // </div>`;
                $('#fundamentalid').fadeIn().html(resultSt);      

            //     let tailwindResult = resultSt
            //     // Style the Main Header
            //     .replace(/<H1>/gi, '<h1 class="text-xl font-bold text-sky-400 mb-4 border-b border-gray-700 pb-2">')
            //     .replace(/<\/H1>/gi, '</h1>')
                
            //     // Style Sub-headers
            //     .replace(/<H2>/gi, '<h2 class="text-lg font-semibold text-gray-300 mt-6 mb-2">')
            //     .replace(/<\/H2>/gi, '</h2>')
                
            //     // Style Meta Container and Cards
            //     .replace(/<DIV class="meta">/gi, '<div class="flex flex-wrap gap-3 mb-6">')
            //     .replace(/<DIV class="card">/gi, '<div class="bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 shadow-sm">')
                
            //     // Style Strong tags (labels)
            //     .replace(/<STRONG>/gi, '<strong class="text-sky-400 text-xs uppercase block mb-1">')
            //     .replace(/<\/STRONG>/gi, '</strong>')
                
            //     // Style Paragraphs
            //     .replace(/<P>/gi, '<p class="text-sm text-gray-400 leading-relaxed mb-4">')
            //     .replace(/<\/P>/gi, '</p>')
                
            //     // Style Conclusion Section
            //     .replace(/<DIV class="conclusion">/gi, '<div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg mt-4 ">');

            // // Display the converted content
            // $('#fundamentalid').stop(true, true).fadeIn().html(tailwindResult);

            }
        }

    }
}

// Function to display a temporary message (toast/alert replacement)
function showMessage(message, type = 'success') {
    const messageBox = $('#order-message-box');
    messageBox.removeClass('hidden bg-red-800 text-red-200 bg-green-800 text-green-200').addClass('block');
    
    if (type === 'success') {
        messageBox.addClass('bg-green-800 text-green-200');
    } else if (type === 'error') {
        messageBox.addClass('bg-red-800 text-red-200');
    }

    messageBox.text(message);
    
    setTimeout(() => {
        messageBox.removeClass('block').addClass('hidden');
    }, 4000);
}

// Function to handle order placement (Pure client-side simulation)
function placeOrder(orderType) {
    const symbol = $('#stock-symbol').text().trim();
    const quantity = parseInt($('#order-quantity').val(), 10);
    const price = $('#order-price').val().trim(); // Price can be 'Market' or a number

    if (!quantity || quantity <= 0 || !symbol) {
        showMessage('Please enter a valid quantity (min 1).', 'error');
        return;
    }

    // Generate a simulated order ID
    const orderId = Math.random().toString(36).substring(2, 9).toUpperCase();

    // Log the simulated order to the console
    console.log("Simulated Order Placed:", {
        symbol: symbol,
        type: orderType,
        quantity: quantity,
        price: price,
        status: 'Simulated - No Persistence',
        timestamp: new Date().toISOString()
    });

    // Show success message to the user
    showMessage(`${symbol} ${orderType} order for ${quantity} shares placed successfully! (Simulated ID: ${orderId})`, 'success');
}



// Renders the billing statement view
function renderStockDetailHtml() {
    const symbol = getUrlParameter('symbol'); 
    if (ProfileData.ready == false) {
        return "";
    }

    var debugSt = "";
    if (ProfileData.debugSt.length > 0) {       
        debugSt = `    
            <div class="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
            <h2 class="text-base font-semibold text-gray-300 mb-2">Debug</h2>
            <div class="text-sm text-gray-400">${ProfileData.debugSt}</div>
            </div>
            `;           
    }

    var nndebugSt = "";
    var trNNdebug = "";
    if (ProfileData.debugSt.length > 0) {
        trNNdebug = `    
                    <div class="market-category-btn ${trName === 'TR_ACC' ? 'bg-blue-600' : 'bg-gray-700'} p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="TR_ACC" data-categoryid="0">TR_ACC</div>        
                    <div class="market-category-btn ${trName === 'TR_NN31' ? 'bg-blue-600' : 'bg-gray-700'} p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="TR_NN31" data-categoryid="31">TR_NN31</div>
                    <div class="market-category-btn ${trName === 'TR_NN32' ? 'bg-blue-600' : 'bg-gray-700'} p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="TR_NN32" data-categoryid="32">TR_NN32</div>                    
                    <div class="market-category-btn ${trName === 'TR_NN34' ? 'bg-blue-600' : 'bg-gray-700'} p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="TR_NN34" data-categoryid="24">TR_NN34</div>
                    <div class="market-category-btn ${trName === 'TR_NN91' ? 'bg-blue-600' : 'bg-gray-700'} p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="TR_NN91" data-categoryid="24">TR_NN91</div>
                    <div class="market-category-btn ${trName === 'TR_NN92' ? 'bg-blue-600' : 'bg-gray-700'} p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="TR_NN92" data-categoryid="24">TR_NN92</div>
                    <div class="market-category-btn ${trName === 'TR_NN93' ? 'bg-blue-600' : 'bg-gray-700'} p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="TR_NN93" data-categoryid="24">TR_NN93</div>
                `;            
    }
    var trNN33St  = "";
        trNN33St = `<div class="market-category-btn ${trName === 'TR_NN33' ? 'bg-blue-600' : 'bg-gray-700'} p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="TR_NN33" data-categoryid="33">TR_NN33</div>`;

    var trNN91St  = "";
    if ( (trM1.length > 0) || (ProfileData.debugSt.length > 0) ) {
        if (trM1 == 'TR_NN81') {
            trNN91St = `<div class="market-category-btn ${trName === 'TR_NN81' ? 'bg-blue-600' : 'bg-gray-700'} p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="TR_NN81" data-categoryid="81">TR_NN81</div>`;
        }
        if (trM1 == 'TR_NN82') {
            trNN91St = `<div class="market-category-btn ${trName === 'TR_NN82' ? 'bg-blue-600' : 'bg-gray-700'} p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="TR_NN82" data-categoryid="82">TR_NN82</div>`;
        }        
        if (trM1 == 'TR_NN83') {
            trNN91St = `<div class="market-category-btn ${trName === 'TR_NN83' ? 'bg-blue-600' : 'bg-gray-700'} p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="TR_NN83" data-categoryid="83">TR_NN83</div>`;
        }           
    }
    var trNN92St  = "";
    if ( (trM2.length > 0) || (ProfileData.debugSt.length > 0) ) {
        if (trM2 == 'TR_NN81') {
            trNN92St = `<div class="market-category-btn ${trName === 'TR_NN81' ? 'bg-blue-600' : 'bg-gray-700'} p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="TR_NN81" data-categoryid="81">TR_NN81</div>`;
        }
        if (trM2 == 'TR_NN82') {
            trNN92St = `<div class="market-category-btn ${trName === 'TR_NN82' ? 'bg-blue-600' : 'bg-gray-700'} p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="TR_NN82" data-categoryid="82">TR_NN82</div>`;
        }        
        if (trM2 == 'TR_NN83') {
            trNN92St = `<div class="market-category-btn ${trName === 'TR_NN83' ? 'bg-blue-600' : 'bg-gray-700'} p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="TR_NN83" data-categoryid="83">TR_NN83</div>`;
        }               
    }  
    var trNN93St  = "";
    if ( (trM3.length > 0) || (ProfileData.debugSt.length > 0) ) {
        if (trM3 == 'TR_NN81') {
            trNN93St = `<div class="market-category-btn ${trName === 'TR_NN81' ? 'bg-blue-600' : 'bg-gray-700'} p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="TR_NN81" data-categoryid="81">TR_NN81</div>`;
        }
        if (trM3 == 'TR_NN82') {
            trNN93St = `<div class="market-category-btn ${trName === 'TR_NN82' ? 'bg-blue-600' : 'bg-gray-700'} p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="TR_NN82" data-categoryid="82">TR_NN82</div>`;
        }        
        if (trM3 == 'TR_NN83') {
            trNN93St = `<div class="market-category-btn ${trName === 'TR_NN83' ? 'bg-blue-600' : 'bg-gray-700'} p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="TR_NN83" data-categoryid="83">TR_NN83</div>`;
        }                 
    }            
    if ( (ProfileData.debugSt.length > 0) || (trM1.length > 0) || (trM2.length > 0) || (trM3.length > 0) ) {
        nndebugSt = `    
                <div class="bg-gray-800 p-3 rounded-lg shadow-sm">
                <h2 class="text-base font-semibold text-gray-300 mb-2">Trading Models</h2>
                <div id="category-buttons-container" class="grid grid-cols-3 gap-2 text-sm text-center">

                    ${trNNdebug}
                    ${trNN33St}                    
                    ${trNN91St}
                    ${trNN92St}
                    ${trNN93St}                    
                </div>
            </div>            
                `;                 
    }                
 
    var technical = `
        <div class="space-y-2 text-sm">
            <div class="flex justify-between">
                <span class="text-gray-400">Technical Signal:</span>
                <span class="font-semibold">${ProfileData.sr}</span>
            </div>        
            <div class="flex justify-between">
                <span class="text-gray-400">Moving Average (EMA ${ProfileData.fema}):</span>
                <span class="font-semibold">${ProfileData.itrend}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Momentum Trend (MACD ${ProfileData.fmacd}):</span>
                <span class="font-semibold">${ProfileData.imacd}</span>
            </div>            
            <div class="flex justify-between">
                <span class="text-gray-400">Change Direction (ADX ${ProfileData.fdir}):</span>
                <span class="font-semibold">${ProfileData.dir}</span>
            </div>              
            <div class="flex justify-between">
                <span class="text-gray-400">Mean Reversion (RSI ${ProfileData.frsi}):</span>
                <span class="font-semibold">${ProfileData.irsi}</span>
            </div>            
            <div class="flex justify-between">
                <span class="text-gray-400">Bollinger Bands (${ProfileData.fbandh} ${ProfileData.fbandl}):</span>
                <span class="font-semibold">${ProfileData.iband}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Volume Validation (${ProfileData.fvol}x):</span>
                <span class="font-semibold">${ProfileData.ivol}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Bullish Score:</span>
                <span class="font-semibold">${ProfileData.ibull}</span>
            </div>    
            <div class="flex justify-between">
                <span class="text-gray-400">Bearish Score:</span>
                <span class="font-semibold">${ProfileData.ibear}</span>
            </div>                                         
        </div>
                `;     
                

    // 2, 1, 0, -1, -2 
    var ratingSt = `            
            <p class="text-sm text-gray-400 mb-4"><span class="font-bold text-blue-500">Prediction Fair</span></p>
            <div class="flex items-center space-x-2 text-sm">
                <div class="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div class="absolute left-0 top-0 h-full bg-green-500" style="width: 20%;"></div>
                    <div class="absolute top-0 h-full bg-blue-500" style="left: 20%; width: 60%;"></div>
                    <div class="absolute top-0 h-full bg-red-500" style="left: 80%; width: 20%;"></div>
                </div>
            </div>
            <div class="flex justify-between text-xs text-gray-400 mt-2">
                <span>Good (20%)</span>
                <span>Fair (60%)</span>
                <span>Poor (20%)</span>
            </div>`;  

    if (ProfileData.rating  > 0) {
        ratingSt = `
            <p class="text-sm text-gray-400 mb-4"><span class="font-bold text-green-500">Prediction Good</span></p>
            <div class="flex items-center space-x-2 text-sm">
                <div class="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div class="absolute left-0 top-0 h-full bg-green-500" style="width: 70%;"></div>
                    <div class="absolute top-0 h-full bg-blue-500" style="left: 70%; width: 20%;"></div>
                    <div class="absolute top-0 h-full bg-red-500" style="left: 90%; width: 10%;"></div>
                </div>
            </div>
            <div class="flex justify-between text-xs text-gray-400 mt-2">
                <span>Good (70%)</span>
                <span>Fair (20%)</span>
                <span>Poor (10%)</span>
            </div>`;              
    } else if (ProfileData.rating  < 0) {
        ratingSt = `        
            <p class="text-sm text-gray-400 mb-4"><span class="font-bold text-red-500">Prediction Poor</span></p>
            <div class="flex items-center space-x-2 text-sm">
                <div class="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div class="absolute left-0 top-0 h-full bg-green-500" style="width: 10%;"></div>
                    <div class="absolute top-0 h-full bg-blue-500" style="left: 10%; width: 20%;"></div>
                    <div class="absolute top-0 h-full bg-red-500" style="left: 30%; width: 70%;"></div>
                </div>
            </div>
            <div class="flex justify-between text-xs text-gray-400 mt-2">
                <span>Good (10%)</span>
                <span>Fair (20%)</span>
                <span>Poor (70%)</span>
            </div>`;  
    }
    if (ProfileData.curPrice < 5) {
        ProfileData.rating = -1;

        ratingSt = `        
            <p class="text-sm text-gray-400 mb-4"><span class="font-bold text-red-500"> Prediction Poor
            </span> : Note that prices below $4 won't predict a good outcome for the neural network.</p>
            <div class="flex items-center space-x-2 text-sm">
                <div class="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div class="absolute left-0 top-0 h-full bg-green-500" style="width: 10%;"></div>
                    <div class="absolute top-0 h-full bg-blue-500" style="left: 10%; width: 20%;"></div>
                    <div class="absolute top-0 h-full bg-red-500" style="left: 30%; width: 70%;"></div>
                </div>
            </div>
            <div class="flex justify-between text-xs text-gray-400 mt-2">
                <span>Good (10%)</span>
                <span>Fair (20%)</span>
                <span>Poor (70%)</span>
            </div>`;  
        }

    var neuralNet = "";
    var analysisST = "";
    if (ProfileData.analysisST.length > 0){
    analysisST = ` 
        <div class="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700"> 
            <h2 class="text-lg font-bold mb-3">Comment</h2> 
            <span class="text-gray-400">${ProfileData.analysisST}</span> 
        </div> `;
    }

    if (trObj.type < 50) {
        neuralNet = `
            <h2 class="text-lg font-bold mb-3">Neural Network Analysis</h2>
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-400">Neural Net Signal(${ProfileData.snncnt}):</span>
                    <span class="font-semibold">${ProfileData.snn}</span>
                </div>        
                <div class="flex justify-between">
                    <span class="text-gray-400">Neural Net Trend:</span>
                    <span class="font-semibold">${ProfileData.nntrend}</span>
                </div>
                
                <div class="flex justify-between">
                    <span class="text-gray-400">Tech Indicator(${ProfileData.nntechcnt}):</span>
                    <span class="font-semibold">${ProfileData.nntech}</span>
                </div>            
            </div>
            <br>
            ${ratingSt}   
            <br>
            ${analysisST}                 
            `;           
    }

    if (ProfileData.curPrice == 0) {
        return `
        <div class="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
            
            <h2 class="text-lg font-bold mb-3">Opening Price</h2>
            <div class="space-y-2 text-sm">          
                <div class="flex justify-between">
                    <span class="text-gray-400">Delayed Close:</span>
                    <span class="font-semibold">$${ProfileData.curPrice.toFixed(2)} ${ProfileData.percentSt}</span> 
                </div>   
                <div class="flex justify-between">
                    <span class="text-gray-400">${ProfileData.timeSt} </span>
                </div>                   
                <div class="flex justify-between">
                    <span class="text-gray-400">${ProfileData.stockStatus} </span>
                </div>                            
                <div class="flex justify-between">
                    <span class="text-gray-400">${ProfileData.curStatus} </span>
                </div>       
            </div>
        </div> 
        ${debugSt}  
        ${nndebugSt}  
                  
        `;          
    }

    nnMsg = "";
    if ((ProfileData.AveragePrice == 0) && (trName == 'TR_NN33')) {
        nnMsg = `
            <div class="flex justify-between">
                <span style="color:#0284c7;">Please wait. Training new data will take a few hours to complete ...</span>
                <span class="font-semibold"></span>
            </div>                  
            `;     
    }
                    var stockDataStr = "";
                    var stockD = stockObj.data;
                    var stockVolatility = "";
                    var shortterm = "";
                    try {
                        if (stockD !== "") {
                            stockDataStr = stockD.replaceAll('#', '"');
                            var objData = JSON.parse(stockDataStr);

                            if (objData != null) {
                                stockVolatility = objData.valid + '%';
                                shortterm = stockObj.shortterm + '%';
                            }
                        }
                    } catch (err) {
                    }

    return `
        <div class="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
            
            <h2 class="text-lg font-bold mb-3">Opening Price</h2>
            <div class="space-y-2 text-sm">          
                <div class="flex justify-between">
                    <span class="text-gray-400">Delayed Close:</span>
                    <span class="font-semibold">$${ProfileData.curPrice.toFixed(2)} ${ProfileData.percentSt}</span> 
                </div>   
                <div class="flex justify-between">
                    <span class="text-gray-400">${ProfileData.timeSt} </span>
                </div>                   
                <div class="flex justify-between">
                    <span class="text-gray-400">${ProfileData.stockStatus} </span>
                </div>                            
                <div class="flex justify-between">
                    <span class="text-gray-400">${ProfileData.curStatus} </span>
                </div>   
            </div>
        </div>    
        <div class="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">            
            <h2 class="text-lg font-bold mb-3">My Position - ${ProfileData.BSsignalStr} </h2>
            ${nnMsg}
            <div class="space-y-2 text-sm">                     
                <div class="flex justify-between">
                    <span class="text-gray-400">Trading Model:</span>
                    <span class="font-semibold">${trName}</span>
                </div>                
                <div class="flex justify-between">
                    <span class="text-gray-400">Transaction: </span>
                    <span class="font-semibold">${ProfileData.TranDate}</span>
                </div>                   
                <div class="flex justify-between">
                    <span class="text-gray-400">Quantity Held:</span>
                    <span class="font-semibold">${ProfileData.QuantityHeld}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Average Price:</span>
                    <span class="font-semibold">$${ProfileData.AveragePrice}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Market Value:</span>
                    <span class="font-semibold">$${ProfileData.MarketValue}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Profit & Loss:</span>
                    <span class="font-semibold text-red-500">${ProfileData.OpenPL}</span>
                </div>
            </div>
        </div>
        <div class="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
            <h2 class="text-lg font-bold mb-3">Key Statistics</h2>
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-400">From date:</span>
                    <span class="font-semibold">${ProfileData.fromdate}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Cumulative Return:</span>
                    <span class="font-semibold">${ProfileData.cum_return}%</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Buy&Hold Return:</span>
                    <span class="font-semibold">${ProfileData.bh_return}%</span>
                </div>                
                
                <div class="flex justify-between">
                    <span class="text-gray-400">Num Trade:</span>
                    <span class="font-semibold">${ProfileData.numtrade}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Num Win:</span>
                    <span class="font-semibold">${ProfileData.numwin}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Num Loss:</span>
                    <span class="font-semibold">${ProfileData.numloss}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Sharpe Ratio:</span>
                    <span class="font-semibold">${ProfileData.sharpe}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Max Drawdown:</span>
                    <span class="font-semibold">${ProfileData.max_drawdown}%</span>
                </div>                
                <div class="flex justify-between">
                    <span class="text-gray-400">Max Hold Time:</span>
                    <span class="font-semibold">${ProfileData.maxholdtime}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Avg Hold Time:</span>
                    <span class="font-semibold">${ProfileData.minholdtime}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Stock Trend:</span>
                    <span class="font-semibold">${shortterm}</span>
                </div>                              
                <div class="flex justify-between">
                    <span class="text-gray-400">Stock Volatility:</span>
                    <span class="font-semibold">${stockVolatility}</span>
                </div>                          
            </div>
        </div>

        <div class="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
            <h2 class="text-lg font-bold mb-3">Technical Analysis</h2>
            ${technical}
            
            <br>
            ${neuralNet}

        </div>   
        <div class="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
            <h2 class="text-base font-semibold text-gray-300 mb-2">${ProfileData.trNa}</h2>
                <span class="text-gray-400">
                    ${ProfileData.trDec}         
                </span>            
        </div>              
        ${debugSt}  
        ${nndebugSt}      
        <!-- Educational & Informational Disclaimer -->
        <div class="p-3 mt-4 text-center border-t border-gray-800">
            <p class="text-xs text-gray-500 leading-relaxed italic">
                For educational and informational purposes only. Past performance is not indicative of future results. This is not financial advice. Paper trading figures do not reflect real-market friction.
            </p>
        </div>            

    `;
}

// Function to simulate refreshing data
function refreshData(symbol) {
    window.location.href = `aiappositions_stock.html?symbol=${symbol}`;
    // const refreshButton = $('#refresh-button');
    // const icon = refreshButton.find('.refresh-icon');
    // const refreshDelay = 1500; // 1.5 seconds

    // // Start rotation animation and show spinner in chart area
    // icon.addClass('rotating');
    // showLoadingSpinner();
    
    // // Simulate API call delay
    // setTimeout(() => {
    //     // Stop rotation animation and hide spinner
    //     icon.removeClass('rotating');
    //     hideLoadingSpinner();
        
    //     // Show confirmation message
    //     showMessage('Stock data refreshed!', 'success');
        
    //     // In a real app, you would fetch new data here and update the DOM elements (My Position, Key Stats, etc.)
    //     console.log("Data refresh simulation complete.");

    // }, refreshDelay); 
}

$(document).on('click', '.market-category-btn', function() {
    // 1. Get the category name from the data-category attribute
    const selectedCategory = $(this).data('category');
    
    // 2. Update the global trName variable
    trName = selectedCategory;
    
    // 3. Optional: Visual feedback - highlight the selected button
    $('.market-category-btn').removeClass('bg-blue-600').addClass('bg-gray-700');
    $(this).removeClass('bg-gray-700').addClass('bg-blue-600');

    // 4. Re-run initialization to fetch data for the new model
    const symbol = getUrlParameter('symbol');
    myInitFunction(symbol);
    
    // 5. Update the chart for the new model
    renderStockDetails(symbol, "");
    
    console.log("Trading Model updated to: " + trName);
});

$(document).ready(function() {
    
    const symbol = getUrlParameter('symbol'); // Default to AAPL
    const name = getUrlParameter('name'); // Default name    
    myInitFunction(symbol) 
    // Show spinner immediately before any other async operations or rendering logic runs
    showLoadingSpinner(); 


    renderStockDetails(symbol, name);
    activateTab('stock-detail'); // Activate the first tab by default (updated name)

    // Tab click handlers
    $('.tab-button').on('click', function() {
        const tabName = $(this).data('tab');
        activateTab(tabName);
    });
    
    // Back button functionality
    $('#back-button').on('click', function() {
        window.history.back(); // Go back to the previous page
    });

    // Refresh button functionality
    $('#refresh-button').on('click', function() {
        refreshData(symbol);
    });

    // Event listeners for Buy/Sell buttons
    $(document).on('click', '#buy-button', function() {
        placeOrder('BUY');
    });

    $(document).on('click', '#sell-button', function() {
        placeOrder('SELL');
    });

 // Set up event listeners for navigation bar
    $('.nav-item').on('click', function() {
        const page = $(this).data('page');
        if (page !== 'aiappositions_stock') {
            window.location.href = page + '.html';
        }
    });
});