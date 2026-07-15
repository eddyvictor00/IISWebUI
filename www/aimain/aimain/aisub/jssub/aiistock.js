///////////////////////////////////////////////////////////////////////////////////////

var app = {

// Application Constructor
    initialize: function () {

        $(document).ready(function () {
            $("#refreshSpace3Btn").click();
        });
    }

};
app.initialize();
//alert("aiiaccount");
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
trName = "TR_ACC"
if (trName.length == 0) {
    trName = "TR_ACC"
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

//////Goble variable


var msgObjStr = "";

var custChange = true;

var custDataSt = custObj.data;
try {
    if (custDataSt != null) {
        if (custDataSt !== "") {
            custDataSt = custDataSt.replaceAll('#', '"');
            var custData = JSON.parse(custDataSt);
            if (custData != null) {
                if (custData.stype == 1) {
                    custChange = false;
                }
            }
        }
    }
} catch (err) {
}
var htmlModel = "";

// update menu start need some delay????
mySubMenuReset();

updateShortCommFunction();

var trObjSt = "";
var trObj = "";
var stockObj;
trName = "TR_ACC"; // force ACC
myInitFunction();


function myInitFunction() {
//    $("#grtxt1").show(0);

    if (stockObjList.length == 0) {
        $("#mytrid").html("Please refresh the Dashboard page again....");
        return;
    }

    if (stockId == 0) {
        stockObj = stockObjList[0];
        stockId = stockObj.id;
    } else {
        var tempStId = 0;
        for (i = 0; i < stockObjList.length; i++) {
            stockObj = stockObjList[i];
            if (stockId == stockObj.id) {
                tempStId = stockId;
                break;
            }
        }
        if (tempStId == 0) {
            stockObj = stockObjList[0];
            stockId = stockObj.id;
        }
    }

    var htmlSt = "";
    var selected = "selected";
    htmlSt += '<select id="selectStid" onchange="return selectStFunction();" class="form-select mb-3" aria-label="Select symbol">';
    var htmlName = "";
    for (i = 0; i < stockObjList.length; i++) {
        var stockObjTmp = stockObjList[i];
        if (stockId == stockObjTmp.id) {
            selected = "";
            htmlName += '<option value="' + stockObjTmp.id + '" selected>' + stockObjTmp.symbol + '</option>';
        } else {
            htmlName += '<option value="' + stockObjTmp.id + '" >' + stockObjTmp.symbol + '</option>';
        }
    }
    htmlSt += '<option value="-1" ' + selected + '>Select</option>' + htmlName;
    htmlSt += '</select>';

    var active11 = "";
    var active12 = "";
    var myMenuId = 0;
    var iisWebMObjStr = window.localStorage.getItem(iisWebSM);
    if (iisWebMObjStr.length > 0) {
        var iisWebObj = JSON.parse(iisWebMObjStr);
        myMenuId = iisWebObj.myMenuId;
    }
    if ((myMenuId >= 10) && (myMenuId < 20)) {
        if (myMenuId == 11) {
            active11 = "active";
        }
        if (myMenuId == 12) {
            active12 = "active";
        }
        htmlSt += '<br><br>Stock TR:<br><a href="aiistock.html" onclick="return subMenu(11);" class="dropdown-item ' + active11 + '">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> TR Acc</a>';
        htmlSt += '<a href="aiistocknn.html" onclick="return subMenu(12);" class="dropdown-item ' + active12 + ' ">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> AI_NN33 TR</a>';
    }

    $("#selectsymid").html(htmlSt);

    if (sysDevOp == true) {
        if (accdevId > 0) {
            accId = accdevId;
        }
    }

    iniTRgraph();

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/" + stockId + "/tr/" + trName,
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
                return;
            }


            trObjSt = JSON.stringify(resultTRList, null, '\t');
            trObj = JSON.parse(trObjSt);

            var percentSt = "";
            var close = 0;
            var preClose = 0;
            if (stockObj.afstockInfo != null) {
                close = stockObj.afstockInfo.fclose;
                preClose = stockObj.prevClose;
                var percent = 100 * (close - preClose) / preClose;
                if (percent > 0) {
                    percentSt = "<font style= color:green>" + percent.toFixed(2) + '%' + "</font>";
                } else {
                    percentSt = "<font style= color:red>" + percent.toFixed(2) + '%' + "</font>";
                }
            }

            var stockDataStr = "";
            var stockData = null;
            var stockD = stockObj.data;
            try {
                if (stockD !== "") {
                    stockDataStr = stockD.replaceAll('#', '"');
                    var objData = JSON.parse(stockDataStr);

                    if (objData != null) {
                        stockData = objData;
                    }
                }
            } catch (err) {
            }

            var stStr = '<Strong>Symbol (' + stockObj.symbol + '): ' + stockObj.stockname + '</Strong>';

            var stStSize = 0;
            var stockDataStr = "";
            var stockD = stockObj.data;
            try {
                if (stockD !== "") {
                    stockDataStr = stockD.replaceAll('#', '"');
                    var objData = JSON.parse(stockDataStr);

                    if (objData != null) {
                        if (objData.bulbea == 1) {
                            stStr += '<br>Trend reversal for Buy detected.';
                        } else if (objData.bulbea == 2) {
                            stStr += '<br>Trend reversal for Sell detected.';
                        }
                        stStr += '<br>Market Trend (+/-): ' + objData.mktre;

                        stStSize = objData.stSize;
                    }
                }
            } catch (err) {
            }
            var stStatus = "";
            if (stockObj.substatus == 12) { //ConstantKey.STOCK_DETLA = 12
                stStatus = "<font style= color:red>St: PriceDif>20%</font>";
            } else if (stockObj.substatus == 11) { //ConstantKey.STOCK_ERROR = 11
                var stStockMsg = "<font style= color:red>St: Error</font>";
                if (stStSize > 0) {
                    if (stStSize < 700) {
                        stStockMsg = "<font style= color:red>St: SizeError</font>";
                    }
                }
                stStatus = stStockMsg;

            } else if (stockObj.substatus == 10) { //ConstantKey.STOCK_SPLIT = 10
                stStatus = "<font style= color:red>St: Split</font>";
            } else if (stockObj.substatus == 2) { //INITIAL = 2;
                stStatus = "St: Init";
            } else if (stockObj.substatus == 0) { //INITIAL = 2;
                stStatus = "<font style= color:green>St: Ready</font>";
            }
            stStr += '<br>Stock Trend (+/-): ' + stockObj.shortterm;
            stStr += '<br>' + stockObj.updatedatedisplay + " " + stStatus;
            stStr += '<br>' + 'Prev Close:' + preClose + ' &nbsp;&nbsp;Delayed Close:' + close + ' &nbsp;&nbsp;Change:' + percentSt
            stStr += '<br>';
            $("#mytrid").html(stStr);

            iniTRmodel();

            iniStockAnalysis();

            iniTRbuysell();

            myInitPerf();

            initTranFunction();
            return;
//////
        }

    });
}

function selectStFunction() {
    var selectId = $('#selectStid').val();
    if (selectId == -1) {
        return;
    }
    stockId = selectId;
    iisODSObj.stockId = selectId;

    var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
    window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
    window.location.href = "aiistock.html";
}

var curBSsignalHtml = "";
function iniTRmodel() {
    var dispNameHtml = "";
    var dispName = trObj.trname;

    $("#trheaderid").html('Stock Acc (' + stockObj.symbol + ')');
    dispNameHtml += '<h5 class="card-title">Stock Acc  (' + stockObj.symbol + ')</h5>';

    var status = trObj.status;
    if (status == 2) { //int PENDING = 2;
        dispName = 'PENDING'
        dispNameHtml += '<div  style="color:red" >TR Model: <strong>' + dispName + '</strong></div>';
    } else {
        dispName = "ACCOUNT"
        dispNameHtml += '<div  >TR Model: <strong>' + dispName + '</strong></div>';
    }
    dispNameHtml += '<p>This paper trading ACCOUNT records your trading transactions, supporting both buy and sell actions. \n\
Note that there are no actual transactions linked to a stockbroker; all results are based on simulated trading.</p>'


    var htmlName = '';
    htmlName += dispNameHtml;

    var deltaTotal = 0;

    var sharebalance = 0;
    curBSsignalHtml = "Buy";
    if (trObj.trsignal == S_BUY) {
        sharebalance = trObj.longamount;
        if (trObj.longshare > 0) {
            if (close > 0) {
                deltaTotal = (close - (trObj.longamount / trObj.longshare)) * trObj.longshare;
            }
        }
        curBSsignalHtml = '<big><div style="color:green">Signal: ' + curBSsignalHtml + '</div></big>';
        htmlName += curBSsignalHtml;
    } else if (trObj.trsignal == S_SELL) {
        curBSsignalHtml = "Sell";
        sharebalance = trObj.shortamount;
        if (trObj.shortshare > 0) {
            if (close > 0) {
                deltaTotal = ((trObj.shortamount / trObj.shortshare) - close) * trObj.shortshare;
            }
        }
        curBSsignalHtml = '<big><div style="color:red">Signal: ' + curBSsignalHtml + '</div></big>';
        htmlName += curBSsignalHtml;
    } else {
        curBSsignalHtml = "----";   //"Exit";
        curBSsignalHtml = '<big><div>Signal: ' + curBSsignalHtml + '</div></big>';
        htmlName += curBSsignalHtml;
    }


    var total = trObj.balance + sharebalance;
    if (trObj.longshare > 0) {
        total = total - sharebalance; // trObj.investment;
    }
    if (stockObj.substatus === 0) {
        total = total + deltaTotal;
    }
    
    var totalSt = Number(total.toFixed(0)).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    totalSt = totalSt.replace(".00", "");
    var totalPer = 100 * total / TRADING_AMOUNT;
    totalSt += " (" + totalPer.toFixed(1) + "%)";
    if (trObj.trname === "TR_ACC") {
        if (total >= 0) {
            htmlName += '<div style="background-color:Green;color:White" >Profit: ' + totalSt + '</div>';
        } else {
            htmlName += '<div style="background-color:Red;color:White" >Profit: ' + totalSt + '</div>';
        }

    } else {
        htmlName += '<div style="color:SteelBlue">Profit: ' + totalSt + '</div>';
    }


    var status = trObj.status;
    if (status == 2) { //int PENDING = 2;
        htmlName += 'Pending on delete when the signal is exited. <br>'
    }
    htmlName += '<br>';

    $("#mytrmodelid").html(htmlName);

//    default 
//    private int sl = 12;     // stop loss value, 0 disable NN1StopLoss = 12
//    private int pt = 12;     // profit taking value value, 0 disalbe   
    var stopL = 12;
    var profitT = 12;
    if (trObj.cfg != "") {
        if (trObj.cfg != "null") {
            try {
                var objDataStr = trObj.cfg.replaceAll('#', '"');
                var objData = JSON.parse(objDataStr);
                if (objData != null) {
                    var stop = objData.sl;
                    var profit = objData.pt;
                    if (stop > 0) {
                        stopL = stop;
                    }
                    if (profit > 0) {
                        profitT = profit;
                    }
                }
            } catch (err) {
            }
        }
    }
    $("#slptid").html("Stop-loss(" + stopL + "%)<br>Profit-taking(" + profitT + "%)");

}

// Function to show loading spinner
function showLoadingSpinner() {
    $("#loadingSpinner").show();
}

// Function to hide loading spinner
function hideLoadingSpinner() {
    $("#loadingSpinner").hide();
}

// Refresh on button click
$("#refreshSpace3Btn").click(function () {
    showLoadingSpinner();
    var resultURL = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/" + stockObj.symbol + "/tr/" + trName + "/tran/history/chart?month=3&t=" + new Date().getTime();
    $("#space3image").attr("src", resultURL);
});

$("#refreshSpace6Btn").click(function () {
    showLoadingSpinner();
    var resultURL = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/" + stockObj.symbol + "/tr/" + trName + "/tran/history/chart?month=6&t=" + new Date().getTime();
    $("#space3image").attr("src", resultURL);
});

$("#refreshSpace12Btn").click(function () {
    showLoadingSpinner();
    var resultURL = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/" + stockObj.symbol + "/tr/" + trName + "/tran/history/chart?month=12&t=" + new Date().getTime();
    $("#space3image").attr("src", resultURL);
});

// Hide spinner when image loads
$("#space3image").on("load", function() {
    hideLoadingSpinner();
});

// Also hide spinner if image fails to load
$("#space3image").on("error", function() {
    hideLoadingSpinner();
    console.error("Failed to load chart image");
});

// Function to reload image on error (as in original code)
function reload3Image(img) {
    console.log("Image failed to load, attempting reload");
    var src = img.src;
    img.src = "";
    setTimeout(function() {
        img.src = src;
    }, 500);
}

function iniTRgraph() {

}


function iniTRbuysell() {
    var linkTRname = "";
    var linkId = trObj.linktradingruleid;
    var linkTRname = trObj.linktrname;
    var htmlSt = "";
    if (trObj == null) {
        return;
    }
    if (linkId == 0) {
        htmlSt += ' <Strong>Manual buy and sell Transaction</Strong>';
        htmlSt += '<br><br>' + curBSsignalHtml;
        htmlSt += 'Manual trading is enabled...' + '<br>';
    } else {
        if (linkId == trM1TR) {
            linkTRname = trM1;
            htmlSt += ' <Strong>Auto Custom Trading Signal ' + linkTRname + '</Strong>';
        } else if (linkId == trM2TR) {
            linkTRname = trM2;
            htmlSt += ' <Strong>Auto Custom Trading Signal ' + linkTRname + '</Strong>';
        } else if (linkId == trM3TR) {
            linkTRname = trM3;
            htmlSt += ' <Strong>Auto Custom Trading Signal ' + linkTRname + '</Strong>';            
        } else {
            htmlSt += ' <Strong>Auto Trading Signal from AI model ' + linkTRname + '</Strong>';
        }

        htmlSt += '<br><br>' + curBSsignalHtml;
        htmlSt += 'Manual trading is disabled...' + '<br>';
    }

    $("#myTrmodeId").html(htmlSt);
    if (linkId == 0) {
        if (trObj.trsignal === S_BUY) {
            $("#buybtn").attr("disabled", true);
            $("#buybtn").attr("data-bs-toggle", "");

            $("#sellbtn").attr("disabled", false);
            $("#sellbtn").attr("data-bs-toggle", "modal");
        } else if (trObj.trsignal === S_SELL) {
            $("#buybtn").attr("disabled", false);
            $("#buybtn").attr("data-bs-toggle", "modal");

            $("#sellbtn").attr("disabled", true);
            $("#sellbtn").attr("data-bs-toggle", "");
        } else {
            $("#buybtn").attr("disabled", false);
            $("#buybtn").attr("data-bs-toggle", "modal");
            $("#sellbtn").attr("disabled", false);
            $("#sellbtn").attr("data-bs-toggle", "modal");
        }
    } else {
        $("#buybtn").attr("disabled", true);
        $("#buybtn").attr("data-bs-toggle", "");
        $("#sellbtn").attr("disabled", true);
        $("#sellbtn").attr("data-bs-toggle", "");
    }
    var htmlSt = "";

    var rchecked0 = "";
    var rchecked3 = "";
    var rcheckedTRM1 = "";
    var rcheckedTRM2 = "";
    var rcheckedTRM3 = "";    
    if (linkId == 0) {
        rchecked0 = "checked";
    } else {
        if (linkId == trM1TR) {
            rcheckedTRM1 = "checked";
        } else if (linkId == trM2TR) {
            rcheckedTRM2 = "checked";
        } else if (linkId == trM3TR) {
            rcheckedTRM3 = "checked";            
        } else {
            rchecked3 = "checked";
        }
    }

    htmlSt += '<div class="form-check">';
    htmlSt += '<input class="form-check-input" type="radio" id="mytrsel" name="mytrsel" value="TR_ACC" ' + rchecked0 + '>';
    htmlSt += '<label class="form-check-label" for="gridRadios1">';
    htmlSt += 'Using Manual Trading';
    htmlSt += '</label>';
    htmlSt += '</div>';

    htmlSt += '<div class="form-check">';
    htmlSt += '<input class="form-check-input" type="radio" id="mytrsel" name="mytrsel" value="TR_NN33" ' + rchecked3 + '>';
    htmlSt += '<label class="form-check-label" for="gridRadios1">';
    htmlSt += 'Auto AI Trading TR_NN33';
    htmlSt += '</label>';
    htmlSt += '</div>';
    if (trM1.length > 0) {
        htmlSt += '<div class="form-check">';
        htmlSt += '<input class="form-check-input" type="radio"  id="mytrsel" name="mytrsel" value="' + trM1 + '" ' + rcheckedTRM1 + '>';
        htmlSt += '<label class="form-check-label" for="gridRadios1">';
        htmlSt += 'Auto AI Trading ' + trM1St;
        htmlSt += '</label>';
        htmlSt += '</div>';
    }
    if (trM2.length > 0) {
        htmlSt += '<div class="form-check">';
        htmlSt += '<input class="form-check-input" type="radio" id="mytrsel" name="mytrsel" value="' + trM2 + '"  ' + rcheckedTRM2 + '>';
        htmlSt += '<label class="form-check-label" for="gridRadios1">';
        htmlSt += 'Auto AI Trading ' + trM2St;
        htmlSt += '</label>';
        htmlSt += '</div>';
    }
    if (trM3.length > 0) {
        htmlSt += '<div class="form-check">';
        htmlSt += '<input class="form-check-input" type="radio" id="mytrsel" name="mytrsel" value="' + trM3 + '"  ' + rcheckedTRM3 + '>';
        htmlSt += '<label class="form-check-label" for="gridRadios1">';
        htmlSt += 'Auto AI Trading ' + trM3St;
        htmlSt += '</label>';
        htmlSt += '</div>';
    }    
    $("#trmodeRadioid").html(htmlSt);
}

function myInitPerf() {
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

                var percent = 100 * (PerfObj.grossprofit) / TRADING_AMOUNT;
                var percentSt = "";
                if (percent > 100) {
                    percentSt = Number(percent.toFixed(0)).toLocaleString('en');
                } else {
                    percentSt = Number(percent.toFixed(2)).toLocaleString('en');
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
                col2 = percentSt + '%';
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

                percent = 100 * buyhold / TRADING_AMOUNT;
                if (percent > 100) {
                    percentSt = Number(percent.toFixed(0)).toLocaleString('en');
                } else {
                    percentSt = Number(percent.toFixed(2)).toLocaleString('en');
                }

                title1 = 'BH Profit: ';
                col1 = buyholdSt
                title2 = 'Buy Hold Per: ';
                col2 = percentSt + '%';
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                var reInvest = PerfObj.performData.reInvestProfit;   // 
                var reInvestSt = Number(reInvest).toLocaleString('en-US', {style: 'currency', currency: 'USD'});

                percent = 100 * reInvest / TRADING_AMOUNT;
                if (percent > 100) {
                    percentSt = Number(percent.toFixed(0)).toLocaleString('en');
                } else {
                    percentSt = Number(percent.toFixed(2)).toLocaleString('en');
                }

                title1 = 'Re Invest: ';
                col1 = reInvestSt
                title2 = 'Re Invest Per: ';
                col2 = percentSt + '%';
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                tranSt += '</tbody>';
                tranSt += '</table>';
                tranSt += '</div> ';

                $("#trperformid").html(tranSt);

            }
        }
    });
}


function initTranFunction() {

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
                        if ((tranObj.share * prevTranObj.avgprice) == 0){
                            perTran1 = 0;
                        }
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
                        if (perTran > 0) {
                            perTranSt = "<font style= color:green>" + diffSt + ' (' + perTran.toFixed(1) + '%)' + "</font>";
                        } else {
                            perTranSt = "<font style= color:red>" + diffSt + ' (' + perTran.toFixed(1) + '%)' + "</font>";
                        }
                        if (stockObj.substatus === 0) {
                            tranhtml += 'Share=' + tranObj.share + ' Tran amt change: ' + perTranSt; // + ' Total: ' + totalSt;
                        }
                    }
                }
                if (tranObj.trsignal === S_BUY) {
                    col2 = '<div  style="color:green">' + signal + '</div>';
                } else if (tranObj.trsignal === S_SELL) {
                    col2 = '<div style="color:red">' + signal + '</div>';
                } else {
                    col2 = '<div  >' + signal + '</div>';
                    itemColor = "";
                }
                var avgSt = tranObj.avgprice.toFixed(2);
                col3 = avgSt;
                var totalSt = Number(total.toFixed(0)).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                col4 = totalSt.replace(".00", "");
                tranSt += '<tr ' + itemColor + '>'
                tranSt += '<th scope="row">' + rowCnt + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '<td>' + col3 + '</td>';
                tranSt += '<td>' + col4 + '</td>';
                tranSt += '</tr>';
                if (initF == true) {
                    tranSt += '<tr ' + itemColor + '>'
                    tranSt += '<th scope="row"> </th>';
                    tranSt += '<td colspan="5">' + tranhtml + '</td>';
                    tranSt += '</tr>';
                }
                initF = true;
                rowCnt++;
                prevTranObj = tranObj;

                list.push(tranSt);
            }

            for (i = 0; i < list.length; i++) {
                listSt = list[list.length - i - 1];
                htmlSt += listSt;
                if (i> 15){
                    if (listSt.indexOf("----") == -1)
                        break;
                }
            }
            htmlSt += '</tbody>';
            htmlSt += '</table>';

            $("#trtranid").html(htmlSt);
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
                    $("#myAnalystid").html("No Message");
                    return;
                }

                var htmlhead = "";

                htmlhead += '<table class="table table-borderless" table-sm>';
                htmlhead += '<thead>';
                htmlhead += '<tr>';
                htmlhead += '<th scope="col">#</th>';
                htmlhead += '<th scope="col">Date</th>';
                htmlhead += '<th scope="col">Message</th>';
                htmlhead += '</tr>';
                htmlhead += '</thead>';
                htmlhead += '<tbody>';

                for (i = 0; i < commObjList.length; i++) {
                    var dataSt = commObjList[i];
                    dataSt = dataSt.replaceAll("\n", "<br>");
                    var dataList = dataSt.split(" - ");
                    if (dataList.length >= 2) {
                        htmlhead += '<tr>';
                        htmlhead += '<th scope="row">' + (i + 1) + '</th>';
                        htmlhead += '<td>' + dataList[0] + '</td>';
                        htmlhead += '<td> </td>';
                        htmlhead += '</tr>';
                        htmlhead += '<tr>';
                        htmlhead += '<th scope="row"> </th>';
                        var msg = dataList[1];
                        if (debug01 == true) {
                            if (dataList.length >= 3) {
                                msg += " " + dataList[2];
                            }
                        }
                        htmlhead += '<td  colspan="2">' + msg + '</td>';
                        htmlhead += '</tr>';
                    }
                }

                htmlhead += '</tbody>';
                htmlhead += '</table> ';

                $("#myAnalystid").html(htmlhead);
            }

        }
    });
}

function autoTclickFun() {
    var htmlhead = "";
    $("#autoTsubmit").attr("disabled", true);

    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            htmlhead += "<br><br>This operation is not supported on demo accounts.";
            $("#autoTBodyId").html(htmlhead);
            return;
        }
    }

    var upd = "";

    var tr = document.querySelector('input[name="mytrsel"]:checked').value
    if (tr.length > 0) {
        if (tr === "TR_ACC") {
            tr = "Manual Trading";
        }
        upd = tr;
    }

    if (upd.length > 0) {
        htmlhead += 'Update trading mode: ' + upd;

    } else {
        htmlhead += 'No Update';
        $("#autoTBodyId").html(htmlhead);
        return;
    }

    htmlModel = htmlhead;
    $("#autoTBodyId").html(htmlhead);

    $("#autoTsubmit").attr("disabled", false);
    return;

}
$("#autoTsubmit").click(function () {

    var tr = document.querySelector('input[name="mytrsel"]:checked').value
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/" + stockObj.id + "/tr/TR_ACC/update"
                + "?linktr=" + tr,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        success: handleResult
    }); // use promises

    function handleResult(result) {

        var msgObjStr = "";
        if (result != 1) {
            msgObjStr = "Update failed. Please try again.";
        }
        if (result !== 1) {
            msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
            $("#autoTBodyId").html(msgObjStr);
            return;
        }

        window.location.href = "aiistock.html";
        return;

    }

});

function buybtnclickFun() {
    var htmlhead = "";
    $("#buybtnsubmit").attr("disabled", true);

    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            htmlhead += "<br><br>This operation is not supported on demo accounts.";
            $("#buybtnBodyId").html(htmlhead);
            return;
        }
    }

    var upd = "";
    upd += 'Buy ' + stockObj.symbol;
    upd += '<br><br>Assumption:';
    upd += '<br>Each transaction is approximately $' + TRADING_AMOUNT;
    upd += '<br>Transactions are executed at market prices';
    upd += '<br>Slippage and commission fees are not considered';


    if (upd.length > 0) {
        htmlhead += upd;

    } else {
        htmlhead += 'No Update';
        $("#buybtnBodyId").html(htmlhead);
        return;
    }

    htmlModel = htmlhead;
    $("#buybtnBodyId").html(htmlhead);

    $("#buybtnsubmit").attr("disabled", false);
    return;

}
$("#buybtnsubmit").click(function () {
    var trName = "TR_ACC";
    var symbol = stockObj.symbol;
    var sig = S_BUY;
    $("#buybtnBodyId").html('<span class="blink">Updating....</span>');
    var urlSt = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/" + symbol + "/tr/" + trName + "/tran/" + sig + "/order";
    $.ajax({
        url: urlSt,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function () {
            window.location.href = "aiiend.html";
        },
        success: function (result) {
            var msgObjStr = ""
            if (result !== 1) {
                msgObjStr = "Update failed. Please try again.";
                if (result == -1) {
                    msgObjStr = "Update failed. Market Closed.";
                }
            }

            if (result !== 1) {
                msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
                $("#buybtnBodyId").html(msgObjStr);
                return;
            }

            window.location.href = "aiistock.html";
            return;
        }
    });


});


function sellbtnclickFun() {
    var htmlhead = "";
    $("#sellbtnsubmit").attr("disabled", true);

    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            htmlhead += "<br><br>This operation is not supported on demo accounts.";
            $("#sellbtnBodyId").html(htmlhead);
            return;
        }
    }

    var upd = "";
    upd += 'Sell ' + stockObj.symbol;
    upd += '<br><br>Assumption:';
    upd += '<br>Each transaction is approximately $' + TRADING_AMOUNT;
    upd += '<br>Transactions are executed at market prices';
    upd += '<br>Slippage and commission fees are not considered';


    if (upd.length > 0) {
        htmlhead += upd;

    } else {
        htmlhead += 'No Update';
        $("#sellbtnBodyId").html(htmlhead);
        return;
    }

    htmlModel = htmlhead;
    $("#sellbtnBodyId").html(htmlhead);

    $("#sellbtnsubmit").attr("disabled", false);
    return;

}

$("#sellbtnsubmit").click(function () {
    var trName = "TR_ACC";
    var symbol = stockObj.symbol;
    var sig = S_SELL;
    $("#sellbtnBodyId").html('<span class="blink">Updating....</span>');
    var urlSt = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/" + symbol + "/tr/" + trName + "/tran/" + sig + "/order";
    $.ajax({
        url: urlSt,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function () {
            window.location.href = "aiiend.html";
        },
        success: function (result) {
            var msgObjStr = ""
            if (result !== 1) {
                msgObjStr = "Update failed. Please try again.";
                if (result == -1) {
                    msgObjStr = "Update failed. Market Closed.";
                }
            }

            if (result !== 1) {
                msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
                $("#sellbtnBodyId").html(msgObjStr);
                return;
            }

            window.location.href = "aiistock.html";
            return;
        }
    });


});



function clearclickFun() {
    var htmlhead = "";
    $("#clearsubmit").attr("disabled", true);

    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            htmlhead += "<br><br>This operation is not supported on demo accounts.";
            $("#clearBodyId").html(htmlhead);
            return;
        }
    }

    var upd = "";
    upd += '<br>Stock Trading Model: ' + trName;

    if (upd.length > 0) {
        htmlhead += upd;

    } else {
        htmlhead += 'No Update';
        $("#clearBodyId").html(htmlhead);
        return;
    }

    htmlModel = htmlhead;
    $("#clearBodyId").html(htmlhead);

    $("#clearsubmit").attr("disabled", false);
    return;

}

$("#clearsubmit").click(function () {
    var trName = "TR_ACC";
    $("#clearBodyId").html('<span class="blink">Updating....</span>');
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/" + stockObj.id + "/tr/" + trName + "/tran/clear",
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        success: handleResult
    }); // use promises

    function handleResult(result) {
        var msgObjStr = ""
        if (result !== 1) {
            msgObjStr = "Update failed. Please try again.";
        }
        if (result !== 1) {
            msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
            $("#clearBodyId").html(msgObjStr);
            return;
        }

        window.location.href = "aiistock.html";
        return;

    }

});


function reload3Image(pThis) {
    // To prevent this from being executed over and over
    pThis.onerror = null;

    // Refresh the src attribute, which should make the
    // browsers reload the iamge.
    pThis.src = pThis.src;
}

function reload6Image(pThis) {
    // To prevent this from being executed over and over
    pThis.onerror = null;

    // Refresh the src attribute, which should make the
    // browsers reload the iamge.
    pThis.src = pThis.src;
}

function reload12Image(pThis) {
    // To prevent this from being executed over and over
    pThis.onerror = null;

    // Refresh the src attribute, which should make the
    // browsers reload the iamge.
    pThis.src = pThis.src;
}

