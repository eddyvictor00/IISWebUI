///////////////////////////////////////////////////////////////////////////////////////

var app = {

// Application Constructor
    initialize: function () {

        $(document).ready(function () {
            // $("#refreshSpace3Btn").click();
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
    window.location.href = "aiiend.html";
}
var custObj = JSON.parse(custObjStr);

var iisDataObjStr = iisWebObj.iisDataObjStr;
if (iisDataObjStr == null) {
    window.location.href = "aiiend.html";
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
//if (trName.length == 0) {
trName = "TR_ACC";
//}

var stockId = iisODSObj.stockId;
var stockFundId = iisODSObj.stockFundId;

var trM1 = iisODSObj.trM1;
var trM1TR = iisODSObj.trM1TR;
var trM1St = iisODSObj.trM1St;
var trM2 = iisODSObj.trM2;
var trM2TR = iisODSObj.trM2TR;
var trM2St = iisODSObj.trM2St;

accId = iisODSObj.accId;
accfundId = iisODSObj.accfundId;
var scribList = "";
//////Goble variable
var SubMenuId = getSubMenuId();
var SubName = "";
var SubSubType = 0;
var SubBillType = 0;
var SubScanFeature = false;

var subLogDesc = "";
var htmlModel = "";

const hashMap = new Map();

if (scribLStr.length > 0) {

    scribList = scribLStr.split(",");
    if (scribList.length > 0) {
        bubbleSort(scribList);

        var found = false;
        for (i = 0; i < scribList.length; i++) {
            var id = 21 + i;
            if (id == SubMenuId) {
                SubName = scribList[i];

                var custDataSt = custObj.data;
                if (custDataSt != null) {
                    if (custDataSt !== "") {
                        custDataSt = custDataSt.replaceAll('#', '"');
                        var custData = JSON.parse(custDataSt);
                        if (custData != null) {
                            var servListSt = custObj.serL;
                            servListSt = servListSt.replaceAll('#', '"');
                            if (servListSt == ""){
                                servListSt ="[]"
                            }                            
                            var servList = JSON.parse(servListSt);                            
                            if (servList.length > 0) {
                                for (i = 0; i < servList.length; i++) {
                                    var servObj = servList[i];
                                    var name = servObj.cd;
                                    if (name === SubName) {
                                        SubSubType = servObj.subtype;
                                        SubBillType = servObj.type;
                                        if ((SubBillType == 7) && (SubSubType == 20)) {
                                            SubScanFeature = true;
                                            document.getElementById("featFund-tag").style.display = "none";  //hide    
                                            document.getElementById("featScan-tag").style.display = "";  //show                                            
                                        } else {
                                            document.getElementById("featFund-tag").style.display = "";  //show    
                                            document.getElementById("featScan-tag").style.display = "none";  //hide
                                        }
                                        break;
                                    }

                                }   // servList loop

                            }
                        }
                    }
                }
                break;
            }

        }
    }
}


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


// update menu start need some delay????
mySubMenuReset();

updateShortCommFunction();

var trObjSt = "";
var trObj = "";
var stockObj = null;

var stockDataStr = "";
var stockData = null;

var fundObjListStr = "";
var fundObjList = "";
var fundLinkId = 0;

if (SubName.length > 0) {

    if (SubScanFeature == true) {
        myInitScanFun()
    } else {
        myInitFeatureFun();
    }
} else {
    document.getElementById("featChkFund-tag").style.display = "none";  //hide    
    document.getElementById("featScan-tag").style.display = "none";  //hide    
    $("#fundinfoid").html('Fund Manager not found...');
}

function myInitScanFun() {
    var feat = SubName;
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/stockscan?feat=" + feat,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function () {
            window.location.href = "aiiend.html";
        },
        success: handleResult
    }); // use promises
    function handleResult(resultFeatList) {

        if ((resultFeatList === null) || (resultFeatList === "")) {
            window.location.href = "aiiend.html";
            return;
        }

        var resultFeatListStr = JSON.stringify(resultFeatList, null, '\t');
        var fundIdList = JSON.parse(resultFeatListStr);
        if (fundIdList.length == 0) {
            $("#scaninfoid").html('Fund Manager not found...');
            return;
        }
        if (fundIdList.length <= 3) {
            $("#scaninfoid").html('Fund Manager not found...');
            return;
        }
        fundLinkId = fundIdList[0];
        var fundDesc = fundIdList[1];
        var stockScanNum = fundIdList[2];
        var stockFunN = fundIdList[3];

        fundDesc = getHtmlDesc(fundDesc);


        $.ajax({
            url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/stockscan/" + fundLinkId + "/st",
            crossDomain: true,
            cache: false,
            timeout: INT_TIMOUT, //120 sec,
            beforeSend: function () {
                $("#loader").show();
            },
            error: function () {
                window.location.href = "aiiend.html";
            },
            success: handleResult
        }); // use promises
        function handleResult(resultStockList) {

            if ((resultStockList === null) || (resultStockList === "")) {
                window.location.href = "aiiend.html";
                return;
            }

            stockFundObjListStr = JSON.stringify(resultStockList, null, '\t');
            stockFundObjList = JSON.parse(stockFundObjListStr);
            var NUM_StockScan = stockScanNum;

            var htmlhead = "";
            var acchtml = 'FundMgr:<br>' + stockFunN;

            htmlhead += '<h6 class="mb-4">' + SubName + '</h6>';
            htmlhead += acchtml;
            htmlhead += '<br><br>';

            htmlhead += fundDesc;
            htmlhead += '<br><br>';
            htmlhead += '<span id="scanPerfid"></span>';
            $("#scaninfoid").html(htmlhead);

            htmlhead = '';
            htmlhead += '<h6 class="mb-4">FundMgr: ' + stockFunN;
            htmlhead += '<br>' + stockFundObjList.length + " Stocks";
            htmlhead += '</h6>';
            htmlhead += 'You can add the following potential bullish stock to your portfolio.';

            $("#myScanid").html(htmlhead);

            var htmlSt = '';
            htmlSt += '<h6 class="card-title">Current Potential Bullish Stocks</h6>';
            htmlSt += '<div class="accordion accordion-flush" id="accordionFlushExample">';

            var index = -1;
            var totalStockPer = 0;
            var stockCnt = stockFundObjList.length;
            for (i = 0; i < stockCnt; i++) {
                stockObj = stockFundObjList[stockCnt - i - 1];
//    
                var idN = i;

                var col1 = ""
                var col2 = "";
                var col3 = "";

                var signal = "Buy";
                if (stockObj.trsignal === S_BUY) {
                    signal = "Buy";
                    col1 += '<span style="color:green"><strong>' + stockObj.symbol + '</strong></span>';
                    col2 += '<span  style="color:green">' + signal + '</span>';
                } else if (stockObj.trsignal === S_SELL) {
                    signal = "Sell";
                    col1 += '<span  style="color:red"><strong>' + stockObj.symbol + '</strong></span>';
                    col2 += '<span  style="color:red">' + signal + '</span>';
                } else {
                    signal = "Exit";
                    col1 += '<span  ><strong>' + stockObj.symbol + '</strong></span>';
                    col2 += '<span  >' + '----' + '</div>'; //'<span  >' + signal + '</div>';
                }


                var percentSt = "";
                var perSt = "";
                var close = 0;
                var preClose = 0;
                if (stockObj.afstockInfo != null) {
                    close = stockObj.afstockInfo.fclose;
                    preClose = stockObj.prevClose;
                    var percent = 100 * (close - preClose) / preClose;
                    percentSt = percent.toFixed(1); // close price '%';


                    var perform = stockObj.perform;
                    totalStockPer = totalStockPer + perform;

                    perSt = perform.toFixed(0); // performance '%';                
                    if (perform != 0) {
                        if (perform < 10) {
                            if (perform > -10) {
                                perSt = perform.toFixed(2);
                                perSt = perSt.replace("0.00", "0");
                            }
                        }
                    }
                }
                col3 = '<span style="color:gray">ACC Profit: ' + perSt + '%</span>';


                var detail = '';
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

                var detail = '<Strong>Symbol (' + stockObj.symbol + '): ' + stockObj.stockname + '</Strong>';

                var stStatus = "";
                if (stockObj.substatus == 12) { //ConstantKey.STOCK_DETLA = 12
                    stStatus = "<font style= color:red>St: PriceDif>20%</font>";
                } else if (stockObj.substatus == 11) { //ConstantKey.STOCK_ERROR = 11
                    stStatus = "<font style= color:red>St: Error</font>";
                } else if (stockObj.substatus == 10) { //ConstantKey.STOCK_SPLIT = 10
                    stStatus = "<font style= color:red>St: Split</font>";
                } else if (stockObj.substatus == 2) { //INITIAL = 2;
                    stStatus = "St: Init";
                } else if (stockObj.substatus == 0) { //INITIAL = 2;
                    stStatus = "<font style= color:green>St: Ready</font>";
                }
                var stockDataStr = "";
                var stockD = stockObj.data;
                try {
                    if (stockD !== "") {
                        stockDataStr = stockD.replaceAll('#', '"');
                        var objData = JSON.parse(stockDataStr);

                        if (objData != null) {
                            if (objData.bulbea == 1) {
                                detail += '<br>Trend reversal for Buy detected.';
                            } else if (objData.bulbea == 2) {
                                detail += '<br>Trend reversal for Sell detected.';
                            }
                            detail += '<br>Market Trend (+/-): ' + objData.mktre;
                        }
                    }
                } catch (err) {
                }
                detail += '<br>Stock Trend (+/-): ' + stockObj.shortterm;
                detail += '<br>' + stockObj.updateDateD + " " + stStatus;
                detail += '<br>' + 'Prev Close:' + preClose + ' &nbsp;&nbsp;Delayed Close:' + close + ' &nbsp;&nbsp;Change:' + percentSt
                detail += '<br>';


                detail += '<br><button type="button" onclick="return scanclickFun(' + i + ',\'' + stockObj.symbol + '\');"  class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#basicModal' + idN + '">';
                detail += 'Add Stock to My Portfolio';
                detail += '</button>';
                detail += '<div class="modal fade" id="basicModal' + idN + '" tabindex="-1">';
                detail += '<div class="modal-dialog">';
                detail += '<div class="modal-content">';
                detail += '<div class="modal-header">';
                detail += '<h5 class="modal-title">Add Stock to my portfolio</h5>';
                detail += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
                detail += '</div>';
                detail += '<div class="modal-body">';
                detail += '<span id="' + i + 'scanBodyId"></span>';
                detail += '</div>';
                detail += '<div class="modal-footer">';
                detail += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
                detail += '<button type="button" id="' + i + 'scansubmit" onclick="return scansubmitFun(' + i + ',\'' + stockObj.symbol + '\');"  class="btn btn-primary">Save changes</button>';
                detail += '</div>';
                detail += '</div>';
                detail += '</div>';
                detail += '</div>';
                detail += '<br><br>';
                detail += '<span id="' + i + 'scanOverviewId"><a style="color:blue" onclick="return scanFundamentalclick(' + i + ',\'' + stockObj.symbol + '\');">Fundamental Analysis Report</a></span>';

                var tranSt = "";
                tranSt += '<table class="table table-borderless table-sm">';
//                tranSt += '<table onclick="return scanFundamentalclick(' + i + ',\'' + stockObj.symbol + '\');" class="table table-borderless table-sm">';
                tranSt += '<tr>';
                tranSt += '<th width="20%">' + col1 + '</th>';
                tranSt += '<td width="20%">' + col2 + '</td>';
                tranSt += '<td width="60%">' + col3 + '</td>';
                tranSt += '</tr>';
                tranSt += '<tr>';
                tranSt += '<td colspan="3">' + stockObj.stockname + '</td>';
                tranSt += '</tr>';
                tranSt += '</table>';

                detail = '<div><small>' + detail + '</small>' + '</div>';

                htmlSt += '<div class="accordion-item">';
                htmlSt += '<h2 class="accordion-header" id="flush-heading' + idN + '">';
                htmlSt += '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse' + idN + '" aria-expanded="false" aria-controls="flush-collapse' + idN + '">';
                htmlSt += tranSt;
                htmlSt += '</button>';
                htmlSt += '</h2>';
                htmlSt += '<div id="flush-collapse' + idN + '" class="accordion-collapse collapse" aria-labelledby="flush-heading' + idN + '" data-bs-parent="#accordionFlushExample">';
                htmlSt += '<div class="accordion-body">' + detail + '</div>';
                htmlSt += '</div>';
                htmlSt += '</div>'

                if (index == -1) {
                    index = 0;
                }
                index++;
                if (index >= NUM_StockScan) {
                    index = 0;
                }
            }

            htmlSt += '</div>';
            $("#scanfeatId").html(htmlSt);

            htmlSt = '';
            var perSt = (totalStockPer / stockCnt).toFixed(2);
            var perSt = perSt.replace("0.00", "0");

            if (totalStockPer < 0) {
                perSt = '<font style= color:red>' + perSt + '%</font>';
            } else {
                perSt = '<font style= color:green>' + perSt + '%</font>';
            }

            var totalAll = totalStockPer * TRADING_AMOUNT / 100; //
            var totAllSt = Number(totalAll.toFixed(0)).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
            totAllSt = totAllSt.replace(".00", "");

            htmlSt += 'Total All Fund Balance: ' + totAllSt + '&nbsp;&nbsp&nbsp(' + perSt + ')';
            $("#scanPerfid").html(htmlSt);

        }
        return;
    }
}

function getHtmlDesc(descSt) {
    // do not know why this covert through internet. local is okey
    descSt = descSt.replaceAll("\u003Cbr\u003E", "<br>");

    var desList = descSt.split("==");
    if (desList.length > 2) {
        var lList = desList[1].split(",");
        var linkSt = desList[1];
        if (lList.length > 1) {
            linkSt = lList[0] + '#' + lList[1];
        }
        descSt = desList[0] + '<a href="' + linkSt + '"><strong>' + desList[2] + '</strong></a>';
    }
    return descSt;
}

function scanclickFun(i, sym) {

    var htmlhead = "";

    $("#" + i + "scansubmit").attr("disabled", true);


    htmlhead += 'Add stock: ' + sym;

    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            htmlhead += "<br><br>This operation is not supported on demo accounts.";
            $("#" + i + "scanBodyId").html(htmlhead);
            return;
        }
    }

    htmlModel = htmlhead;

    $("#" + i + "scanBodyId").html(htmlhead);
    $("#" + i + "scansubmit").attr("disabled", false);
    return;

}

function scansubmitFun(i, sym) {

    var sym = sym.toUpperCase();

    $("#" + i + "scanBodyId").html('<span class="blink">Updating....</span>');

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/addsymbol?symbol=" + sym,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {
        //MAX_ALLOW_STOCK_ERROR = 100 ; NEW = 1; EXISTED = 2
        var msgObjStr = "";
        if (result != 1) {
            var msgObjStr = "Fail to add stock " + sym;
            if (result == 2) {
                msgObjStr += " : Stock alreday existed";
            }
            if (result == 100) {
                msgObjStr += " : Max number of stock exceeded the user plan";
            }
            msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'

            $("#" + i + "scanBodyId").html(msgObjStr);
            return;
        }

        window.location.href = "aiisubscription.html";

    }

}


function myInitFeatureFun() {

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/fundlink",
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function () {
            window.location.href = "aiiend.html";
        },
        success: function (resultFundObjList) {

            if (resultFundObjList !== "") {
                if (resultFundObjList.length > 0) {
                    fundObjListStr = JSON.stringify(resultFundObjList, null, '\t');
                }
            }
            if (fundObjListStr != "") {
                fundObjList = JSON.parse(fundObjListStr);
            }

            for (i = 0; i < fundObjList.length; i++) {
                var fundObj = fundObjList[i];
                if (SubSubType != fundObj.id) {
                    $("#fundinfoid").html('Fund Manager not found...');
                    continue;
                }
                if (fundObj.type != INT_MUTUAL_FUND_ACCOUNT) { //INT_MUTUAL_FUND_ACCOUNT = 120;
                    $("#fundinfoid").html('Fund Manager not found...');
                    continue;
                }

                fundLinkId = fundObj.id;

                var accName = "fundMgr";
                var accDataSt = fundObj.data;
                var perfBalPercent = 0;
                var perfBal = 0;
                var perfAllBalPercent = 0;
                var perfAllBal = 0;
                try {
                    if (accDataSt != null) {
                        accDataSt = accDataSt.replaceAll('#', '"');
                        var accData = JSON.parse(accDataSt);
                        if (typeof accData.ref === "undefined") {
                            ;
                        } else if (accData.ref !== "") {
                            accName = accData.ref;
                        }

                        if (accData != null) {
                            //name,cur%, 1mon%
                            perfAllBalPercent = accData.curM_6;
                            perfAllBal = perfAllBalPercent; // * N_FUN_ST * TRADING_AMOUNT / 100;
                       }
                    }
                } catch (err) {
                }

                var acchtml = 'FundMgr:<br>' + accName;
                var totalAll = perfAllBal; //fundObj.investment + fundObj.balance;
                var totAllSt = Number(totalAll.toFixed(0)).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                totAllSt = totAllSt.replace(".00", "");
                var perN = (perfAllBalPercent * 1).toFixed(2);
                var perSt = perN + "";
                if (perfAllBalPercent < 0) {
                    perSt = '<font style= color:red>' + perSt + '%</font>';
                } else {
                    perSt = '<font style= color:green>' + perSt + '%</font>';
                }
                if (perfAllBalPercent == -99999) {
                    perSt = 'N/A';
                }

                var htmlSt = "";
                htmlSt += '<h6 class="mb-4">' + SubName + '</h6>';
                htmlSt += acchtml;
                htmlSt += '<br><br>';
                htmlSt += 'Current Fund Balance: ' + totAllSt + '&nbsp;&nbsp&nbsp(' + perSt + ')';
                htmlSt += '<br><br>';

                htmlSt += 'Monthly Balance:';
                var per = accData.curM_3;
                var perN = (per * 1).toFixed(2);
                var perSt = "" + perN;
                if (per < 0) {
                    perSt = '<font style= color:red>' + perSt + '%</font>';
                } else {
                    perSt = '<font style= color:green>' + perSt + '%</font>';
                }
                if (per == -99999) {
                    perSt = 'N/A';
                }
                htmlSt += '<br>3 Month: ';
                htmlSt += perSt;

                per = accData.curM_6;
                perN = (per * 1).toFixed(2);
                perSt = "" + perN;
                if (per < 0) {
                    perSt = '<font style= color:red>' + perSt + '%</font>';
                } else {
                    perSt = '<font style= color:green>' + perSt + '%</font>';
                }
                if (per == -99999) {
                    perSt = 'N/A';
                }
                htmlSt += '<br>6 Months: ';
                htmlSt += perSt;

                per = accData.curM_12;
                perN = (per * 1).toFixed(2);
                perSt = "" + perN;
                if (per < 0) {
                    perSt = '<font style= color:red>' + perSt + '%</font>';
                } else {
                    perSt = '<font style= color:green>' + perSt + '%</font>';
                }
                if (per == -99999) {
                    perSt = 'N/A';
                }
                htmlSt += '<br>12 Months: ';
                htmlSt += perSt;

                $("#fundinfoid").html(htmlSt);

                InitFundStock();

                blogInitFunction();
                return;
            }
        } // end of success

    });
}


function blogInitFunction() {
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/fundlink/" + fundLinkId + "/comm",
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function () {
//            alert('Network failure. Please try again later.');
            window.location.href = "aiiend.html";
        },
        success: handleResult
    }); // use promises

    function handleResult(resultSTcommList) {
        var commObjListStr = "";
        if (resultSTcommList !== "") {
            if (resultSTcommList.length > 0) {
                commObjListStr = JSON.stringify(resultSTcommList, null, '\t');
            }
        }
        if (commObjListStr !== "") {

            var commObjList = JSON.parse(commObjListStr);
            var size = commObjList.length;
            var htmlhead = "";
            htmlhead += '<div class="comment-list">';
            if (size > 0) {
                size = size - 1;
            }
            htmlhead += '<h5>' + size + ' Comments</h5>';
            htmlhead += '<ol>';
            htmlhead += '<li class="comment">';

            for (i = 0; i < commObjList.length; i++) {
                var commObj = commObjList[i];
                var commId = commObj.id;
                var dataSt = commObj.msg;
                dataSt = dataSt.replaceAll("<br>", "");
                dataSt = dataSt.replaceAll("\n", "<br>");
                if (commObj.type === 0) {
                    var daList = dataSt.split(" -");
                    var fieldList = daList[0].split(" ");
                    var nameSt = "";
                    var dateSt = "";
                    var msgSt = daList;

                    if (fieldList.length >= 2) {
                        dateSt = fieldList[0];
                        nameSt = fieldList[1];
                        if (fieldList.length >= 3) {
                            nameSt += " " + fieldList[2];
                        }
                        msgSt = daList[1];
                    }

                    htmlhead += '<div class="single_comment">';
                    htmlhead += '<div class="comment-content">';
                    htmlhead += '<div class="comment-name"><a href="#">' + dateSt + " " + nameSt + '</a></div>';
                    htmlhead += '<div class="comment-text">';
                    htmlhead += msgSt;
                    htmlhead += '</div>';
                    htmlhead += '</div>';
                    htmlhead += '</div>';

                }
            }
            htmlhead += '<ol class="comment-sub">';
            for (i = 0; i < commObjList.length; i++) {
                var commObj = commObjList[i];
                var commId = commObj.id;
                var dataSt = commObj.msg;
                dataSt = dataSt.replaceAll("<br>", "");
                dataSt = dataSt.replaceAll("\n", "<br>");
                if (commObj.type != 0) {
                    var uName = "";
                    var nameList = dataSt.split("||");
                    if (nameList.length >= 3) {
                        uName = nameList[1];
                        dataSt = nameList[0] + nameList[2];
                    }
                    var daList = dataSt.split(" -");
                    var fieldList = daList[0].split(" ");
                    var nameSt = "";
                    var dateSt = "";
                    var msgSt = daList;

                    if (fieldList.length >= 2) {
                        dateSt = fieldList[0];
                        nameSt = fieldList[1];
                        if (fieldList.length >= 3) {
                            nameSt += " " + fieldList[2];
                        }
                        msgSt = daList[1];
                    }
                    htmlhead += '<li class="comment">';
                    if (uName.length > 0) {
                        htmlhead += '<div class="comment-avatar">';
                        htmlhead += '<div class="avatar">';
                        htmlhead += uName;
                        htmlhead += '</div>';
                        htmlhead += '</div>';
                    }
                    htmlhead += '<div class="single_comment">';
                    htmlhead += '<div class="comment-content">';
                    htmlhead += '<div class="comment-name"><a href="#">' + dateSt + " " + nameSt + '</a><span>-</span><a href="#" class="comment-reply">Reply</a></div>';
                    htmlhead += '<div class="comment-text">';
                    htmlhead += msgSt;
                    htmlhead += '</div>';
                    htmlhead += '</div>';
                    htmlhead += '</div>';
                    htmlhead += '</li>';
                }
            }

            htmlhead += '</ol>';
            htmlhead += '</li>';
            htmlhead += '</ol>';
            htmlhead += '</div>';
            $("#fundMgrcomm").html(htmlhead);

        }

    }
}

function subLogclickFun() {
    var htmlhead = "";
    $("#subLogsubmit").attr("disabled", true);
    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            htmlhead += "<br><br>This operation is not supported on demo accounts.";
            $("#subLogBodyId").html(htmlhead);
            return;
        }
    }

    var upd = "";
    var subLName = document.getElementById("subLName").value;
    subLogDesc = $.trim($("#subLTextarea").val());
    if (subLName.length > 0) {
        subLogDesc = "||" + subLName + "||" + subLogDesc
    }

    if (subLogDesc.length > 0) {
        upd += '<br>Add FundMgr comment.';
    }

    if (upd.length > 0) {
        htmlhead += 'Update BLog:' + upd;
    } else {
        htmlhead += 'No Update';
        $("#subLogBodyId").html(htmlhead);
        return;
    }

    htmlModel = htmlhead;
    $("#subLogBodyId").html(htmlhead);
    $("#subLogsubmit").attr("disabled", false);
    return;
}

$("#subLogsubmit").click(function () {
    if (subLogDesc.length == 0) {
        return;
    }
    var comment = subLogDesc;
    $("#subLogBodyId").html('<span class="blink">Updating....</span>');

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/fundlink/" + fundLinkId + "/comm/add?type=1",
        type: "POST",
        data: {input: comment},
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        success: handleResult
    }); // use promises

    function handleResult(result) {
        var msgObjStr = '';
        if (result === 1) {

        }
        if (result !== 1) {
            msgObjStr = "Update failed. Please try again.";
            msgObjStr = htmlModel + '<br><p  style="color:red">' + msgObjStr + '</p>';
            $("#subLogBodyId").html(msgObjStr);
            return;
        }
        window.location.href = "aiisubscription.html";
    }
});


function InitFundStock() {
    if (fundLinkId == 0) {
        return;
    }
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/fundlink/" + fundLinkId + "/st",
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function () {
            window.location.href = "aiiend.html";
        },
        success: handleResult
    }); // use promises
    function handleResult(resultStockList) {

        if ((resultStockList === null) || (resultStockList === "")) {
//            $('#error_message').fadeIn().html('Network error. Please try again later. ');
            window.location.href = "aiiend.html";
            return;
        }

        stockFundObjListStr = JSON.stringify(resultStockList, null, '\t');

        stockFundObjList = JSON.parse(stockFundObjListStr);

        iisDataObj.stockFundObjListStr = stockFundObjListStr;
        var iisDataObjStr = JSON.stringify(iisDataObj, null, '\t');
        var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
        window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));

        initFundTR();
        return;
    }
}

function initFundTR() {
//    $("#grtxt1").show(0);

    if (stockFundObjList.length == 0) {
        $("#mytrid").html("Error. Please refresh the Dashboard page again....");
        return;
    }


    if (stockFundId == 0) {
        stockObj = stockFundObjList[0];
        stockFundId = stockObj.id;
    } else {
        var tempStFundId = 0;
        for (i = 0; i < stockFundObjList.length; i++) {
            stockObj = stockFundObjList[i];
            if (stockFundId == stockObj.id) {
                tempStFundId = stockFundId;
                break;
            }
        }
        if (tempStFundId == 0) {
            stockObj = stockFundObjList[0];
            stockFundId = stockObj.id;
        }
    }


//    var htmlSt = "";
//    var selected = "selected";
//    htmlSt += '<select id="selectStid" onchange="return selectStFunction();" class="form-select mb-3" aria-label="Select symbol">';
//    var htmlName = "";
//    for (i = 0; i < stockFundObjList.length; i++) {
//        var stockObjTmp = stockFundObjList[i];
//        if (stockFundId == stockObjTmp.id) {
//            selected = "";
//            htmlName += '<option value="' + stockObjTmp.id + '" selected>' + stockObjTmp.symbol + '</option>';
//        } else {
//            htmlName += '<option value="' + stockObjTmp.id + '" >' + stockObjTmp.symbol + '</option>';
//        }
//    }
//    htmlSt += '<option  value="-1" ' + selected + '>Select</option>' + htmlName;
//    htmlSt += '</select>';
//
//    $("#selectsymid").html(htmlSt);

    var htmlName = "";
    htmlName += '<table class="table text-start align-middle table-bordered table-hover mb-0">';
    htmlName += '<thead>';
    htmlName += '<tr class="text-dark">';
    htmlName += '<th scope="col">Symbol</th>';
    htmlName += '<th scope="col">Signal</th>';
    htmlName += '<th scope="col">Profit % </th>';
    htmlName += '</tr>';
    htmlName += '</thead>';
    htmlName += '<tbody>';
    for (i = 0; i < stockFundObjList.length; i++) {
        var stockObjTmp = stockFundObjList[i];
        for (i = 0; i < stockFundObjList.length; i++) {
            var stockObjTmp = stockFundObjList[i];
            var perform = stockObjTmp.perform;
            var perSt = perform.toFixed(0); // performance '%';                
            if (perform != 0) {
                if (perform < 10) {
                    if (perform > -10) {
                        perSt = perform.toFixed(2);
                        perSt = perSt.replace("0.00", "0");
                    }
                }
            }
            perSt += '%';

            var symbol = "";
            var signal = "";
            if (stockObjTmp.trsignal === S_BUY) {
                symbol = '<span style="color:green"><strong>' + stockObjTmp.symbol + '</strong></span>';
                signal = '<span  style="color:green">Buy</span>';
            } else if (stockObjTmp.trsignal === S_SELL) {
                symbol = '<span  style="color:red"><strong>' + stockObjTmp.symbol + '</strong></span>';
                signal = '<span  style="color:red">Sell</span>';
            } else {
                symbol = '<span  ><strong>' + stockObjTmp.symbol + '</strong></span>';
                signal = '<span  >----</span>'; //'<span  >Exit</span>';
            }
            htmlName += '<tr onclick="return stACCTRClick(' + stockObjTmp.id + ');">';
            htmlName += '<td >' + symbol + '</td>';
            htmlName += '<td>' + signal + '</td>';
            htmlName += '<td >' + perSt + '</td>';
            htmlName += '</tr>';
        }
    }

    $("#selectsymid").html(htmlName);

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/fundlink/" + fundLinkId + "/st/" + stockFundId + "/tr",
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
        success: function (resultTRList) {
            if ((resultTRList === null) || (resultTRList === "")) {
                window.location.href = "aiiend.html";
                return;
            }


            trObjSt = JSON.stringify(resultTRList, null, '\t');
            trObj = JSON.parse(trObjSt);
            trName = trObj.trname;

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


            var stStr = '<Strong>Symbol (' + stockObj.symbol + '): ' + stockObj.stockname + '</Strong>';

            var stStatus = "";
            if (stockObj.substatus == 12) { //ConstantKey.STOCK_DETLA = 12
                stStatus = "<font style= color:red>St: PriceDif>20%</font>";
            } else if (stockObj.substatus == 11) { //ConstantKey.STOCK_ERROR = 11
                stStatus = "<font style= color:red>St: Error</font>";
            } else if (stockObj.substatus == 10) { //ConstantKey.STOCK_SPLIT = 10
                stStatus = "<font style= color:red>St: Split</font>";
            } else if (stockObj.substatus == 2) { //INITIAL = 2;
                stStatus = "St: Init";
            } else if (stockObj.substatus == 0) { //INITIAL = 2;
                stStatus = "<font style= color:green>St: Ready</font>";
            }

            stockDataStr = "";
            stockD = stockObj.data;
            try {
                if (stockD !== "") {
                    stockDataStr = stockD.replaceAll('#', '"');
                    var objData = JSON.parse(stockDataStr);

                    if (objData != null) {
                        stockData = objData;

                        if (objData.bulbea == 1) {
                            stStr += '<br>Trend reversal for Buy detected.';
                        } else if (objData.bulbea == 2) {
                            stStr += '<br>Trend reversal for Sell detected.';
                        }
                        stStr += '<br>Market Trend (+/-): ' + objData.mktre;
                    }
                }
            } catch (err) {
            }

            stStr += '<br>Stock Trend (+/-): ' + stockObj.shortterm;
            stStr += '<br>' + stockObj.updatedatedisplay + " " + stStatus;
            stStr += '<br>' + 'Prev Close:' + preClose + ' &nbsp;&nbsp;Close:' + close + ' &nbsp;&nbsp;Change:' + percentSt
            stStr += '<br>';
            $("#mytrid").html(stStr);

            iniTRmodel();
            iniTRgraph();

//            iniTRbuysell();

            myInitPerf();

            initTranFunction();

            initFundamental();
            return;
//////
        }

    });
}

//function selectStFunction() {
//    var selectId = $('#selectStid').val();
//    if (selectId == -1) {
//        return;
//    }
//    stockFundId = selectId;
//    iisODSObj.stockFundId = selectId;
//
//    var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
//    window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
//    window.location.href = "aiisubscription.html";
//}

function stACCTRClick(stockSymId) {
    stockFundId = stockSymId;
    iisODSObj.stockFundId = stockSymId;

    var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
    window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
    window.location.href = "aiisubscription.html";
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
    dispNameHtml += '<p>The ACCOUNT is your trading transaction that can support buy or sell.</p>'


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
    var resultURL = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/fundlink/" + fundLinkId + "/st/" + stockObj.symbol + "/tr/" + trName + "/tran/history/chart?month=3&t=" + new Date().getTime();
    $("#space3image").attr("src", resultURL);
});

$("#refreshSpace6Btn").click(function () {
    showLoadingSpinner();
    var resultURL = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/fundlink/" + fundLinkId + "/st/" + stockObj.symbol + "/tr/" + trName + "/tran/history/chart?month=6&t=" + new Date().getTime();
    $("#space3image").attr("src", resultURL);
});

$("#refreshSpace12Btn").click(function () {
    showLoadingSpinner();
    var resultURL = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/fundlink/" + fundLinkId + "/st/" + stockObj.symbol + "/tr/" + trName + "/tran/history/chart?month=12&t=" + new Date().getTime();
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
    if (stockFundId == 0) {
        stockObj = stockFundObjList[0];
        stockFundId = stockObj.id;
    } else {
        var tempStFundId = 0;
        for (i = 0; i < stockFundObjList.length; i++) {
            stockObj = stockFundObjList[i];
            if (stockFundId == stockObj.id) {
                tempStFundId = stockFundId;
                break;
            }
        }
        if (tempStFundId == 0) {
            stockObj = stockFundObjList[0];
            stockFundId = stockObj.id;
        }
    }
    $("#refreshSpace3Btn").click();    
}


function myInitPerf() {
    var urlSt = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/fundlink/" + fundLinkId + "/st/" + stockObj.symbol + "/tr/" + trName + "/perf";

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
            iniTRgraphStep1();
            
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
                title2 = 'Bu Hold Per: ';
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
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/fundlink/" + fundLinkId + "/st/" + symbol + "/tr/" + trName + "/tran",
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
                }
                var avgSt = tranObj.avgprice.toFixed(2);
                col3 = avgSt;
                var totalSt = Number(total.toFixed(0)).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                col4 = totalSt.replace(".00", "");
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + rowCnt + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '<td>' + col3 + '</td>';
                tranSt += '<td>' + col4 + '</td>';
                tranSt += '</tr>';
                if (initF == true) {
                    tranSt += '<tr>';
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
                htmlSt += list[list.length - i - 1];
            }
            htmlSt += '</tbody>';
            htmlSt += '</table>';

            $("#trtranid").html(htmlSt);
        }
    });

}



function initFundamental() {
    var symbol = stockObj.symbol;
    if (hashMap.has(symbol) == true) {
        var resultSt = hashMap.get(symbol);
        resultSt = resultSt.replaceAll("<h2>", "<h4>");
        resultSt = resultSt.replaceAll("</h2>", "</h4>");
        resultSt = resultSt.replaceAll("<h1>", "<h3>");
        resultSt = resultSt.replaceAll("</h1>", "</h3>");
        $('#fundamentalid').fadeIn().html(resultSt);
        return;
    }
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
                hashMap.set(symbol, resultSt);
                resultSt = resultSt.replaceAll("<h2>", "<h4>");
                resultSt = resultSt.replaceAll("</h2>", "</h4>");
                resultSt = resultSt.replaceAll("<h1>", "<h3>");
                resultSt = resultSt.replaceAll("</h1>", "</h3>");
                $('#fundamentalid').fadeIn().html(resultSt);

            }
        }

    }
}



function scanFundamentalclick(index, symbol) {

    var i = index;

    $('#' + i + 'scanOverviewId').fadeIn().html("Processing...");
    if (hashMap.has(symbol) == true) {
        var resultSt = hashMap.get(symbol);
        resultSt = resultSt.replaceAll("<h2>", "<h4>");
        resultSt = resultSt.replaceAll("</h2>", "</h4>");
        resultSt = resultSt.replaceAll("<h1>", "<h3>");
        resultSt = resultSt.replaceAll("</h1>", "</h3>");
        $('#' + i + 'scanOverviewId').fadeIn().html(resultSt);
        return;
    }

    $('#' + i + 'scanOverviewId').html('<span class="blink">Updating....</span>');
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/0/billing/getfundamental?symbol=" + symbol,
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
        success: function (result) {
            if (result != null) {
                if (result.length == 1) {
                    var resultSt = result[0];
                    hashMap.set(symbol, resultSt);
                    resultSt = resultSt.replaceAll("<h2>", "<h4>");
                    resultSt = resultSt.replaceAll("</h2>", "</h4>");
                    resultSt = resultSt.replaceAll("<h1>", "<h3>");
                    resultSt = resultSt.replaceAll("</h1>", "</h3>");
                    $('#' + i + 'scanOverviewId').fadeIn().html(resultSt);

                }
            }
        }

    });

}



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
