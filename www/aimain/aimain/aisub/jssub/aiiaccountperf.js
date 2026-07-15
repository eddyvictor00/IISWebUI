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
    }
    if (accObjTmp.id == accId) {
        accObj = accObjTmp;
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
var stockObj;

myInitFunction();



function myInitFunction() {

    accfundId = accId;
    stockFmgrId = "-1";

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
                window.location.href = "aiiend.html";
                return;
            }

            var accN = 'Account: ' + accObj.accountname;
            var acchtml = '<h4>' + accN + '</h4><br>';

            var pp = "Basic Plan - Max 2 stocks";
            if (custObj.substatus == 0) {
                pp = "Basic Plan - Max 2 stocks";
            } else if (custObj.substatus == 10) {
                pp = "Standard Plan - Max 8 stocks";
            } else if (custObj.substatus == 20) {
                pp = "Premium Plan - Max 20 stocks";
            } else if (custObj.substatus == 40) {
                pp = "Deluxe Plan - Max 40 stocks";
            } else if (custObj.substatus == 80) {
                pp = "Deluxe2 Plan - Max 80 stocks";
            } else if (custObj.substatus == 90) {
                pp = "API Plan - Max 500 stocks";
            } else if (custObj.substatus == 100) {
                pp = "SRV Plan - Max 0 stocks";
            }

            acchtml += 'Plan: ' + pp;
            var balanceSt = Number(custObj.balance).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
            acchtml += '<br>Acc Open Date: ' + accObjTmp.startdate;
            acchtml += '<br>Acc Bal: ' + balanceSt;
            if (custObj.payment != 0) {
                var curPaySt = Number(custObj.payment).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                acchtml += ' Payment due: <font style= color:red>' + curPaySt + '</font>';
            }
            if (custObj.dis != 0) {
                var discSt = Number(custObj.dis).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                acchtml += ' Discount: ' + discSt;
            }
            if (custObj.cr != 0) {
                var creditcSt = Number(custObj.cr).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                acchtml += ' Credit: ' + creditcSt;
            }
            $("#fundinfoid").html(acchtml);


            trObjSt = JSON.stringify(resultTRList, null, '\t');
            trObj = JSON.parse(trObjSt);

            var htmlSt = "<br>Currently, No performance result.";
            var commentSt = trObj.comment;
            if (commentSt != null) {
                htmlSt = "Performance result:<br>";
                commentSt = commentSt.replaceAll('^', '"');
                var perfData = JSON.parse(commentSt);

                if (perfData != null) {
                    //name,cur_fund,curM_All,curM_1,curM_3,curM_6,curM_12,curM_24

                    if (perfData.length >= 8) {
                        htmlSt = "";
                        htmlSt += '<table class="table table-sm">';
                        htmlSt += '<thead>';
                        htmlSt += '<tr>';
                        htmlSt += '<th scope="col">Period</th>';
                        htmlSt += '<th scope="col">Performance</th>';
                        htmlSt += '</tr>';
                        htmlSt += '</thead>';
                        htmlSt += '<tbody>';

                        htmlSt += '<tr>';
                        var per = perfData[4];
                        var perSt = "" + per;
                        if (per < 0) {
                            perSt = '<font style= color:red>' + per + '%</font>';
                        } else {
                            perSt = '<font style= color:green>' + per + '%</font>';
                        }
                        if (per == -99999) {
                            perSt = 'N/A';
                        }
                        htmlSt += '<td>' + '3 Months ' + '</td>';
                        htmlSt += '<td>' + perSt + '</td>';
                        htmlSt += '</tr>';
                        htmlSt += '<tr>';
                        per = perfData[5];
                        perSt = "" + per;
                        if (per < 0) {
                            perSt = '<font style= color:red>' + per + '%</font>';
                        } else {
                            perSt = '<font style= color:green>' + per + '%</font>';
                        }
                        if (per == -99999) {
                            perSt = 'N/A';
                        }
                        htmlSt += '<td>' + '6 Months ' + '</td>';
                        htmlSt += '<td>' + perSt + '</td>';
                        htmlSt += '</tr>';
                        htmlSt += '<tr>';
                        per = perfData[6];
                        perSt = "" + per;
                        if (per < 0) {
                            perSt = '<font style= color:red>' + per + '%</font>';
                        } else {
                            perSt = '<font style= color:green>' + per + '%</font>';
                        }
                        if (per == -99999) {
                            perSt = 'N/A';
                        }
                        htmlSt += '<td>' + '12 Months ' + '</td>';
                        htmlSt += '<td>' + perSt + '</td>';
                        htmlSt += '</tr>';

                    }

                    htmlSt += '</tbody>';
                    htmlSt += '</table>';
                } else {
                    htmlSt = commentSt;
                }
            }
            $("#mytrid").html(htmlSt);

            iniTRgraph();
            initTranFunction();
            return;
//////
        }

    });
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
    $("#clearBodyId").html('<span class="blink">Updating....</span>');
    $("#clearsubmit").attr("disabled", true);
    accfundId = -accId;

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
        window.location.href = "aiiaccountpref.html";
        return;
    }
});




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
    var symbol = "-1";
    accfundId = accId;
}

$("#detailclick").click(function () {
    detailtranclick();
});

function detailtranclick() {
    var symbol = "-1";
    accfundId = accId;
    var tr = "detail";
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accfundId + "/st/" + symbol + "/tr/" + tr + "/tran",
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
            var totalAvg = 0;
            for (i = 0; i < tranObjList.length; i++) {
                var tranObj = tranObjList[i];
                  var avg = tranObj.avgprice;
                  totalAvg += avg;
                  tranObj.share = totalAvg;
                  
            }

            var htmlSt = "";
            htmlSt += '<table class="table table-sm">';
            htmlSt += '<thead>';
            htmlSt += '<tr>';
            htmlSt += '<th scope="col">#</th>';
            htmlSt += '<th scope="col">Date</th>';
            htmlSt += '<th scope="col">Sym</th>';
            htmlSt += '<th scope="col">%</th>';
            htmlSt += '<th scope="col">Total Profit</th>';
            htmlSt += '</tr>';
            htmlSt += '</thead>';
            htmlSt += '<tbody>';
            var primary = "";
            var secondary = 'style="background: #f2f2f2"';
            var rowCnt = 1;
            var j = tranObjList.length - 1;
            for (i = 0; i < tranObjList.length; i++) {
                var tranObj = tranObjList[j - i];

                var col1 = ""
                var col2 = "";
                var col3 = "";
                var col4 = "";
                var tranSt = "";

                var itemColor = primary;
                if ((i % 2) == 0) {
                    itemColor = secondary;
                }
                col1 = '<div ><strong>' + tranObj.entrydatedisplay + '</strong></div>';
                col2 = tranObj.symbol;
                var avgSt = tranObj.avgprice.toFixed(2);                
                col3 = avgSt + "%";
                var totalAvg =  tranObj.share.toFixed(2);          
                var total = totalAvg * TRADING_AMOUNT / 100;
                var totalSt = Number(total.toFixed(0)).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                col4 = totalSt.replace(".00", "");
                tranSt += '<tr ' + itemColor + '>'
                tranSt += '<th scope="row">' + rowCnt + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '<td>' + col3 + '</td>';
                tranSt += '<td>' + col4 + '</td>';
                tranSt += '</tr>';

                htmlSt += tranSt;
                rowCnt++;
            }


            htmlSt += '</tbody>';
            htmlSt += '</table>';
            $("#trtranid").html(htmlSt);
        }
    });
}

function initTranFunction() {
    var symbol = "-1";
    accfundId = accId;
//    trName = "";
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

            var htmlSt = "";
            htmlSt += '<table class="table table-sm">';
            htmlSt += '<thead>';
            htmlSt += '<tr>';
            htmlSt += '<th scope="col">#</th>';
            htmlSt += '<th scope="col">Date</th>';
            htmlSt += '<th scope="col"> </th>';
            htmlSt += '<th scope="col">%</th>';
            htmlSt += '<th scope="col">Total Profit</th>';
            htmlSt += '</tr>';
            htmlSt += '</thead>';
            htmlSt += '<tbody>';
            var primary = "";
            var secondary = 'style="background: #f2f2f2"';
            var rowCnt = 1;
            for (i = 0; i < tranObjList.length; i++) {
                var tranObj = tranObjList[j - i];

                var col1 = ""
                var col2 = "";
                var col3 = "";
                var col4 = "";
                var tranSt = "";

                var itemColor = primary;
                if ((i % 2) == 0) {
                    itemColor = secondary;
                }
                col1 = '<div ><strong>' + tranObj.entrydatedisplay + '</strong></div>';
                col2 = tranObj.symbol;
                var avgSt = tranObj.avgprice.toFixed(2);
                col3 = avgSt + "%";
                var total = avgSt * TRADING_AMOUNT / 100;
                var totalSt = Number(total.toFixed(0)).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                col4 = totalSt.replace(".00", "");
                tranSt += '<tr ' + itemColor + '>'
                tranSt += '<th scope="row">' + rowCnt + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '<td>' + col3 + '</td>';
                tranSt += '<td>' + col4 + '</td>';
                tranSt += '</tr>';

                htmlSt += tranSt;
                rowCnt++;
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


