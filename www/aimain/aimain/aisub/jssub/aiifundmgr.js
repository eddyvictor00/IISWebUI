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
var accObj = null;
var accId = 0;
var accfundObj = null;
var accfundId = 0;
var iisODSObjSession = "iisODSObjSession";
var iisODSObjStr = window.localStorage.getItem(iisODSObjSession);
var iisODSObj = JSON.parse(iisODSObjStr);
//////Goble variable
var SubMenuId = getSubMenuId();
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
var stockFmgrId = iisODSObj.stockFmgrId;
var trM1 = iisODSObj.trM1;
var trM1TR = iisODSObj.trM1TR;
var trM1St = iisODSObj.trM1St;
var trM2 = iisODSObj.trM2;
var trM2TR = iisODSObj.trM2TR;
var trM2St = iisODSObj.trM2St;
accId = iisODSObj.accId;
accfundId = iisODSObj.accfundId;
var accObjListStr = iisDataObj.accObjListStr;
var accObjList = "";
if (iisDataObjStr != null) {
    if (accObjListStr.length > 0) {
        accObjList = JSON.parse(accObjListStr);
    }
}

for (i = 0; i < accObjList.length; i++) {
    var accObjTmp = accObjList[i];
    if (accObjTmp.id == accfundId) {
        accfundObj = accObjTmp;
        break;
    }
}

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


// update menu start need some delay????
mySubMenuReset();
updateShortCommFunction();
var commObjList = null;
var fundDesc = "";
var commDelListSt = "";
var subLogDesc = "";
var htmlModel = "";
var trObjSt = "";
var trObj = "";
var stockObj = null;
if (SubMenuId == 131) {
    document.getElementById("fundMgr-tag").style.display = "none"; //hide    
    document.getElementById("fundLog-tag").style.display = ""; //show     
    blogInitFunction(true);
} else if (SubMenuId == 132) {
    document.getElementById("fundMgr-tag").style.display = ""; //show   
    document.getElementById("fundLog-tag").style.display = "none"; //hid     
    myInitCurStock();
    blogInitFunction(false);
}


function blogInitFunction(idFlag) {
    if (idFlag == true) {
        $("#fundBlogcomm").html('<span class="blink">Retrieving info....</span>');
    } else {
        $("#fundMgrcomm").html('<span class="blink">Retrieving info....</span>');
    }
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accfundId + "/fundlink/" + accfundId + "/comm",
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

            commObjList = JSON.parse(commObjListStr);
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
                    if (idFlag == true) {
                        dateSt = commId + " id#<br>" + dateSt;
                    }
                    htmlhead += '<li class="comment">';
                    htmlhead += '<div class="single_comment">';
                    if (uName.length > 0) {
                        htmlhead += '<div class="comment-avatar">';
                        htmlhead += '<div class="avatar">';
                        htmlhead += uName;
                        htmlhead += '</div>';
                        htmlhead += '</div>';
                    }
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
            if (idFlag == true) {
                $("#fundBlogcomm").html(htmlhead);
            } else {
                $("#fundMgrcomm").html(htmlhead);
            }
            return;
        }
        if (idFlag == true) {
            $("#fundBlogcomm").html("No Message");
        } else {
            $("#fundMgrcomm").html("No Message");
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
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/fundlink/" + accfundId + "/comm/add?type=1",
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
        window.location.href = "aiifundmgr.html";
    }
});

function fundLogclickFun() {
    var htmlhead = "";
    $("#fundLogsubmit").attr("disabled", true);
    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            htmlhead += "<br><br>This operation is not supported on demo accounts.";
            $("#fundLogBodyId").html(htmlhead);
            return;
        }
    }

    var upd = "";
    fundDesc = $.trim($("#fundDescTextarea").val());
    if (fundDesc.length > 0) {
        upd += '<br>Update FundMgr description.';
    }

    if (upd.length > 0) {
        htmlhead += 'Update BLog:' + upd;
    } else {
        htmlhead += 'No Update';
        $("#fundLogBodyId").html(htmlhead);
        return;
    }

    htmlModel = htmlhead;
    $("#fundLogBodyId").html(htmlhead);
    $("#fundLogsubmit").attr("disabled", false);
    return;
}

$("#fundLogsubmit").click(function () {
    if (fundDesc.length == 0) {
        return;
    }
    var comment = fundDesc;
    $("#fundLogBodyId").html('<span class="blink">Updating....</span>');

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accfundId + "/fundlink/" + accfundId + "/comm/add?type=0",
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
            $("#fundLogBodyId").html(msgObjStr);
            return;
        }
        window.location.href = "aiifundmgr.html";
    }
});


function delLogclickFun() {
    var htmlhead = "";
    $("#delLoggsubmit").attr("disabled", true);
    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            htmlhead += "<br><br>This operation is not supported on demo accounts.";
            $("#delLogBodyId").html(htmlhead);
            return;
        }
    }

    var upd = "";
    commDelListSt = document.getElementById("commList").value;
    if (commDelListSt.length > 0) {
        commDelList = commDelListSt.split(",");
        if (commObjList != null) {
            var delId = 0;
            for (j = 0; j < commDelList.length; j++) {
                delId = commDelList[j];
                var found = false;
                for (i = 0; i < commObjList.length; i++) {
                    var commObj = commObjList[i];
                    var commId = commObj.id;
                    if (commId == delId) {
                        found = true;
                        break;
                    }
                }
                if (found == false) {
                    htmlhead += 'No Update: ' + delId + ' Id not found.';
                    $("#delLogBodyId").html(htmlhead);
                    return;
                }
            }
        }
        upd += '<br>Update to remove comment: ' + commDelListSt;
    }

    if (upd.length > 0) {
        htmlhead += 'Update BLog:' + upd;
    } else {
        htmlhead += 'No Update';
        $("#delLogBodyId").html(htmlhead);
        return;
    }

    htmlModel = htmlhead;
    $("#delLogBodyId").html(htmlhead);
    $("#delLogsubmit").attr("disabled", false);
    return;
}

$("#delLogsubmit").click(function () {
    if (commDelListSt.length == 0) {
        return;
    }
    $("#delLogBodyId").html('<span class="blink">Updating....</span>');

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accfundId + "/fundlink/" + accfundId + "/comm/remove?idlist=" + commDelListSt,
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

    function handleResult(result) {
        var msgObjStr = '';
        if (result === 1) {

        }
        if (result !== 1) {
            msgObjStr = "Update failed. Please try again.";
            msgObjStr = htmlModel + '<br><p  style="color:red">' + msgObjStr + '</p>';
            $("#delLogBodyId").html(msgObjStr);
            return;
        }
        window.location.href = "aiifundmgr.html";
    }

});
//////////////////////
function myInitCurStock() {
    if (accfundId == 0) {
        return;
    }

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accfundId + "/st?trname=" + trName,
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



    function handleResult(resultStockList) {
        if ((resultStockList === null) || (resultStockList === "")) {
            window.location.href = "aiiend.html";
            return;
        }
        stockFundObjListStr = JSON.stringify(resultStockList, null, '\t');
        stockFundObjList = JSON.parse(stockFundObjListStr);
        iisDataObj.stockFundObjListStr = stockFundObjListStr;
        var iisDataObjStr = JSON.stringify(iisDataObj, null, '\t');
        var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
        window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));
        var accName = "fundMgr";
        var accDataSt = accfundObj.data;

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
        var totalAll = perfAllBal;
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
        myInitFunction();
    }
}

function myInitFunction() {
//    $("#grtxt1").show(0);

    if (stockFundObjList.length == 0) {
        $("#mytrid").html("Error. Please refresh the Dashboard page again....");
        return;
    }

    if (stockFmgrId == 0) {
        stockObj = stockFundObjList[0];
        stockFmgrId = stockObj.id;
    } else {
        var tempStId = 0;
        for (i = 0; i < stockFundObjList.length; i++) {
            stockObj = stockFundObjList[i];
            if (stockFmgrId == stockObj.id) {
                tempStId = stockFmgrId;
                break;
            }
        }
        if (tempStId == 0) {
            stockObj = stockFundObjList[0];
            stockFmgrId = stockObj.id;
        }
    }


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
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accfundId + "/st/" + stockFmgrId + "/tr/" + trName,
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
            stStr += '<br>' + stockObj.updateDateD + " " + stStatus;
            stStr += '<br>' + 'Prev Close:' + preClose + ' &nbsp;&nbsp;Close:' + close + ' &nbsp;&nbsp;Chang:' + percentSt
            stStr += '<br>';
            $("#mytrid").html(stStr);
            iniTRgraph();
            iniTRmodel();

            iniStockAnalysis();
            myInitPerf();
            initTranFunction();
            return;
//////
        }

    });
}

//function selectStFundFunction() {
//    var selectId = $('#selectStid').val();
//    if (selectId == -1) {
//        return;
//    }
//    stockFmgrId = selectId;
//    iisODSObj.stockFmgrId = selectId;
//    var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
//    window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
//    window.location.href = "aiifundmgr.html";
//}

function stACCTRClick(stockSymId) {
    stockFmgrId = stockSymId;
    iisODSObj.stockFmgrId = stockSymId;

    var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
    window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
    window.location.href = "aiifundmgr.html";
}


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
    $("#clearBodyId").html('<span class="blink">Updating. Pleae wait and do not close the dialog box....</span>');
    $("#clearsubmit").attr("disabled", true);
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accfundId + "/clearfundbalance",
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
            msgObjStr = '<br><p style="color:red">' + msgObjStr + '</p>'
            $("#clearBodyId").html(msgObjStr);
            $("#clearsubmit").attr("disabled", false);
            return;
        }
        window.location.href = "aiifundmgr.html";
        return;
    }
});


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
    var close = stockObj.afstockInfo.fclose;

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
    $("#trmodelid").html(htmlName);
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
    $("#refreshSpace3Btn").click();
}

function myInitPerf() {
    var symbol = stockObj.symbol;
    var urlSt = iisurl + "/cust/" + custObj.username + "/acc/" + accfundId + "/st/" + symbol + "/tr/" + trName + "/perf";
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
                tranSt += '<table class="table table-striped">';
                tranSt += ' <thead>';
                tranSt += '<tr>';
                tranSt += '<th></th>';
                tranSt += '<td></td>';
                tranSt += '<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>';
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
                tranSt += '<th>' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';
                tranSt += '<tr>';
                tranSt += '<th></th>';
                tranSt += '<td></td>';
                tranSt += '<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                tranSt += '<th></th>';
                tranSt += '<td></td>';
                tranSt += '</tr>';
                title1 = 'Profit: ';
                col1 = netprofitSt;
                title2 = 'Profit(%): ';
                col2 = percentSt + '%';
                tranSt += '<tr>';
                tranSt += '<th>' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';
                title1 = 'Rating: ';
                col1 = PerfObj.rating.toFixed(2);
                title2 = 'NumTrade: ';
                col2 = PerfObj.numtrade;
                tranSt += '<tr>';
                tranSt += '<th>' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';
                title1 = 'NumWin: ';
                col1 = PerfObj.performData.numwin;
                title2 = 'NumLoss: ';
                col2 = PerfObj.performData.numloss;
                tranSt += '<tr>';
                tranSt += '<th>' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';
                title1 = 'MaxWin: ';
                col1 = PerfObj.performData.maxwin.toFixed(2);
                title2 = 'MaxLoss: ';
                col2 = PerfObj.performData.maxloss.toFixed(2);
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';
                title1 = 'AvgWin: ';
                col1 = PerfObj.performData.avgwin.toFixed(2);
                title2 = 'AvgLoss: ';
                col2 = PerfObj.performData.avgloss.toFixed(2);
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';
                title1 = 'TotalBuy: ';
                col1 = PerfObj.performData.totalbuyonly.toFixed(2);
                title2 = 'TotalSell: ';
                col2 = PerfObj.performData.totalsellonly.toFixed(2);
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';
                title1 = 'HoldTime: ';
                col1 = PerfObj.performData.holdtime;
                title2 = 'MaxHoldTime: ';
                col2 = PerfObj.performData.maxholdtime;
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';
                var buyhold = PerfObj.performData.buyhold; // profit of buy and hold
                var buyholdSt = Number(buyhold).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                percent = 100 * buyhold / TRADING_AMOUNT;
                if (percent > 100) {
                    percentSt = Number(percent.toFixed(0)).toLocaleString('en');
                } else {
                    percentSt = Number(percent.toFixed(2)).toLocaleString('en');
                }

                title1 = 'BHProfit: ';
                col1 = buyholdSt
                title2 = 'BuyHoldPer: ';
                col2 = percentSt + '%';
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';
                var reInvest = PerfObj.performData.reInvestProfit; // 
                var reInvestSt = Number(reInvest).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                percent = 100 * reInvest / TRADING_AMOUNT;
                if (percent > 100) {
                    percentSt = Number(percent.toFixed(0)).toLocaleString('en');
                } else {
                    percentSt = Number(percent.toFixed(2)).toLocaleString('en');
                }

                title1 = 'ReInvest: ';
                col1 = reInvestSt
                title2 = 'ReInvestPer: ';
                col2 = percentSt + '%';
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>';
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
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accfundId + "/st/" + symbol + "/tr/" + trName + "/tran",
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
            htmlSt += '<th scope="col">#</th>';
            htmlSt += '<th scope="col">Date</th>';
            htmlSt += '<th scope="col">Signal</th>';
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
                    col2 = '<div  >' + signal + '</div>';   //'<div  >' + '----' + '</div>';   
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
                htmlSt += list[list.length - i - 1];
            }
            htmlSt += '</tbody>';
            htmlSt += '</table>';
            $("#trtranid").html(htmlSt);
        }
    });
}

function iniStockAnalysis() {

    var urlSt = iisurl + "/cust/" + custObj.username + "/acc/" + accfundId + "/st/analysis/" + stockObj.symbol;
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
                        htmlhead += '<td  colspan="2">' + dataList[1] + '</td>';
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


