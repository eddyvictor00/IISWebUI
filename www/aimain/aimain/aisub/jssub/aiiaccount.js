///////////////////////////////////////////////////////////////////////////////////////

var app = {

// Application Constructor
    initialize: function () {

        $(document).ready(function () {

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
if ((iisWebObjStr == null) || (iisWebObjStr.length == 0)) {
    window.location.href = "aiiend.html";
}

var iisWebObj = "";
try {
    iisWebObj = JSON.parse(iisWebObjStr);
} catch (err) {
    window.location.href = "aiiend.html";
}

//var GOBLE_Filter = ["IUSB,ERX,ERY,FAS,FAZ,YINN,YANG,CHAU,TECL,TECS,HOU.TO,HOD.TO,SPXL,SPXS,DRN,DRV,WEBL,WEBS,DGP"];
//var GOBLE_Filter = ["IUSB,ERX,FAS,YINN,TECL,HOU.TO,SPXL,DRN,WEBL,DGP"];
// var GOBLE_Filter = ["SPY,DIA,FAS,QQQ,DGP"];

var GOBLE_Filter = ["SPY,DIA,QQQ,DGP,FAS,DRN,ERX,SPXL,TECL,WEBL,YINN"];

var iisurlStr = iisWebObj.iisurlStr;
iisurl = iisurlStr;

var custObjStr = iisWebObj.custObjStr;
if ((custObjStr == null) || (custObjStr.length == 0)) {
    window.location.href = "aiiend.html";
}
var custObj = JSON.parse(custObjStr);

var iisDataObjStr = iisWebObj.iisDataObjStr;
if ((iisDataObjStr == null) || (iisDataObjStr.length == 0)) {
    window.location.href = "aiiend.html";
}

var iisDataObj = JSON.parse(iisDataObjStr);

var accObjListStr = "";
var accObjList = "";
var accObj = null;
var accId = 0;
var accfundObj = null;
var accfundId = 0;

var accdevObj = null;
var accdevId = 0;

var filterList = "";
filterList = iisDataObj.filterList;
if (filterList == undefined) {
    filterList = "";
}
var iisODSObjSession = "iisODSObjSession";
var iisODSObjStr = window.localStorage.getItem(iisODSObjSession);
if ((iisODSObjStr == null) || (iisODSObjStr.length == 0)) {
    // initialize ODS data
    // initialize ODS data
    const iisODSObj = {// operation data src
        custT: 0,
        accId: 0,
        accfundId: 0,
        stockId: 0,
        stockFundId: 0,
        stockFmgrId: 0,
        sysDevOp: false,
        accdevId: 0,
        admcust: '',
        admLStr: '',
        admPagenum: 0,
        admCmd: '',
        admParm: '',
        debug01: false,
        debug02: false,
        debug03: false,
        custChange: true,
        userN: '',
        trName: 'TR_ACC',
        STnameLStr: '',
        STPageNum: -1,
        ctabPlan: 0,
        ctabSt: 0,
        ctabStnn: 0,
        ctabfun: 0,
        trM1: '',
        trM1TR: 0,
        trM1St: '',

        trM2: '',
        trM2TR: 0,
        trM2St: '',
        trM3: '',
        trM3TR: 0,
        trM3St: '',

        scribLStr: '',
        trFilter: '',
        commOLStr: '',
        nameRpt: '',
        yearRpt: 0

    }
//////Goble variable

    var defFilter = [];
    if ((custObj.id == 3) || (custObj.id == 1)) { // demo acc
        defFilter = GOBLE_Filter;
    }
    if (filterList.length === 0) {
        filterList = defFilter;
    }
    iisODSObj.trFilter = filterList;

    var filterinput = "";
    if (filterList.length > 0) {
        filterinput = filterList; //.join(","); // must be like this to work
    }
    document.getElementById("filtersymid").setAttribute('value', filterinput);
    iisODSObj.custT = custObj.type;
    var userN = custObj.firstname;
    if (userN.length == 0) {
        var userNL = custObj.email.split("@");
        userN = userNL[0];
    }
    if (userN.length == 0) {
        userN = "Private";
    }
    iisODSObj.userN = userN;
    var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
    window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
} else {
    var defFilter = [];
    if (custObj.id == 3) { // demo acc
        defFilter = GOBLE_Filter;
    }
    if (filterList.length === 0) {
        filterList = defFilter;
    }

    var filterinput = "";
    if (filterList.length > 0) {
        filterinput = filterList; //.join(",");
    }
    document.getElementById("filtersymid").setAttribute('value', filterinput);
}
// initialize ODS data




var iisODSObj = JSON.parse(iisODSObjStr);
//////Goble variable
var userN = iisODSObj.userN;
var custT = iisODSObj.custT;
var sysDevOp = iisODSObj.sysDevOp;
var debug01 = iisODSObj.debug01;
var debug02 = iisODSObj.debug02;
var debug03 = iisODSObj.debug03;
var custChange = iisODSObj.custChange;
var scribLStr = iisODSObj.scribLStr;
var trName = iisODSObj.trName;
var trM1 = iisODSObj.trM1;
var trM1TR = iisODSObj.trM1TR;
var trM1St = iisODSObj.trM1St;
var trM2 = iisODSObj.trM2;
var trM2TR = iisODSObj.trM2TR;
var trM2St = iisODSObj.trM2St;
var trM3 = iisODSObj.trM3;
var trM3TR = iisODSObj.trM3TR;
var trM3St = iisODSObj.trM3St;
var commOLStr = iisODSObj.commOLStr;
var stockIdOLStr = iisODSObj.stockIdOLStr;
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

document.getElementById("sm-fundmgr").style.display = "none";  //hide    
document.getElementById("sm-admin").style.display = "none";  //hide        

initMainAcc();

function initMainAcc() {
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/accsystem",
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
        success: function (resultAccObjList) {
            if ((resultAccObjList === null) || (resultAccObjList === "")) {
                window.location.href = "aiiend.html";
                return;
            }
//                console.log(resultAccObjList);

            accObjListStr = JSON.stringify(resultAccObjList, null, '\t');
            accObjList = JSON.parse(accObjListStr);

            accObj = null;
            for (i = 0; i < accObjList.length; i++) {
                var accObjTmp = accObjList[i];
                if (accObjTmp.type == 110) { //INT_TRADING_ACCOUNT
                    accObj = accObjTmp;
                    accId = accObj.id;

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
                        pp = "Professional Plan - Max 40 stocks";
                    } else if (custObj.substatus == 80) {
                        pp = "Enterprise Plan - Max 80 stocks";
                    } else if (custObj.substatus == 160) {
                        pp = "Corporate Plan - Max 160 stocks";                        
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
                    $("#myaccid").append(acchtml);
                }
                if (accObjTmp.type === INT_MUTUAL_FUND_ACCOUNT) { //INT_MUTUAL_FUND_ACCOUNT = 120;
                    accfundObj = accObjTmp;
                    accfundId = accfundObj.id;

                    var fundacchtml = "<br><br>";
                    var accDataSt = accfundObj.data;
                    var perfBalPercent = 0;
                    var perfBal = 0;
                    if (accDataSt != null) {
                        if (accDataSt != "") {
                            accDataSt = accDataSt.replaceAll('#', '"');
                            var accData = JSON.parse(accDataSt);
                            if ((accData.ref !== "") && (accData.ref !== undefined)) {
                                var accName = "acc-" + accfundObj.customerid + "-" + accData.ref;
                                if (accfundObj.id < 10) {
                                    accName = "sys-" + accfundObj.customerid + "-" + accData.ref;
                                }
                                fundacchtml += "Fund Name: " + accName;
                            }
                             if (accData != null) {                                
                                //name,cur%, 1mon%
                                perfBalPercent = accData.curM.toFixed(2);
                                perfBal = perfBalPercent * N_FUN_ST * TRADING_AMOUNT / 100;

                            }
                        }
                    }
                    var total = perfBal; //accObjTmp.investment + accObjTmp.balance;
                    var totSt = Number(total.toFixed(2)).toLocaleString('en-US', {style: 'currency', currency: 'USD'});

                    fundacchtml += '<br>Fund Performance: ' + totSt + '&nbsp;&nbsp&nbsp(' + perfBalPercent + '%)';
                    $("#myfundaccid").append(fundacchtml);

                }

                if (accObjTmp.type === INT_DEVOP_ACCOUNT) {
                    accdevObj = accObjTmp;
                    accdevId = accObjTmp.id;
                }
            }

            if (accObj == null) {
                window.location.href = "aiiend.html";
                return;
            }


            try {
                sysDevOp = false;
                debug01 = false;
                debug02 = false;
                debug03 = false;
                scribLStr = '';
                trM1 = '';
                trM1TR = 0;
                trM1St = '';
                trM2 = '';
                trM2TR = 0;
                trM2St = '';
                trM3 = '';
                trM3TR = 0;
                trM3St = '';
                sysDevOp = false;
                if ((custT == 99) ||
                        (custT == 82) ||
                        (custT == 84) ||
                        (custT == 86)) {
                    sysDevOp = true;
                }

                var custDataSt = custObj.data;
                if (custDataSt != null) {
                    if (custDataSt !== "") {
                        custDataSt = custDataSt.replaceAll('#', '"');
                        var custData = JSON.parse(custDataSt);                        
                        if (custData != null) {
                        }
                    }
                }
                var servListSt = custObj.serL;
                servListSt = servListSt.replaceAll('#', '"');
                if (servListSt == ""){
                    servListSt ="[]"
                }                
                var servList = JSON.parse(servListSt);                 

                if (servList.length > 0) {

                    for (i = 0; i < servList.length; i++) {
                        var servObj = servList[i];

                        if ((servObj.type == 9) && (servObj.subtype > 50)) { //TYPE_BILL_CUST_NOENCYPION = 9;
                            if (trM1.length == 0) {
                                trM1 = "TR_NN" + servObj.subtype;
                                trM1TR = servObj.subtype;
                                trM1St = "Cust NN" + servObj.subtype;

                            } else if (trM2.length == 0) {
                                trM2 = "TR_NN" + servObj.subtype;
                                trM2TR = servObj.subtype;
                                trM2St = "Cust NN" + servObj.subtype;

                            } else {
                                trM3 = "TR_NN" + servObj.subtype;
                                trM3TR = servObj.subtype;
                                trM3St = "Cust NN" + servObj.subtype;
                            }
                        }
                        if (servObj.type == 8) { //TYPE_CUSTOM_DEV
                            if (trM1.length == 0) {
                                trM1 = "TR_NN" + servObj.subtype;
                                trM1TR = servObj.subtype;
                                trM1St = "Dev NN" + servObj.subtype;
                                
                            } else if (trM2.length == 0) {
                                trM2 = "TR_NN" + servObj.subtype;
                                trM2TR = servObj.subtype;
                                trM2St = "Dev NN" + servObj.subtype;

                            } else {
                                trM3 = "TR_NN" + servObj.subtype;
                                trM3TR = servObj.subtype;
                                trM3St = "Dev NN" + servObj.subtype;
                            }
   
                        }
                        if (servObj.type == 20) { // internal flag
                            if (servObj.subtype == 101) {
                                debug01 = true;
                            }
                            if (servObj.subtype == 102) {
                                debug02 = true;
                            }
                            if (servObj.subtype == 103) {
                                debug03 = true;
                            }
                        }

                        if (servObj.type == 7) { //TYPE_BILL_PRICE_NOENCYPION
                            // bill feature                            
                            var date = new Date(servObj.st).toLocaleDateString("en-US");

                            var name = servObj.cd; //date + " " + servObj.cd;
                            if ((name.indexOf("BillPriceS") != -1) || (name.indexOf("BillMgr-") != -1)) {
                                if (scribLStr.length > 0) {
                                    scribLStr += ",";
                                }
                                scribLStr += name;
                            }
                        }
                    }    
                }   // servList loop
 
                // force DEVNN91
                if (custT == 99) {
                    trM1 = "TR_NN" + 91;
                    trM1TR = 91;
                    trM1St = "Dev NN" + 91;
                    trM2 = "TR_NN" + 92;
                    trM2TR = 92;
                    trM2St = "Dev NN" + 92;
                    trM3 = "TR_NN" + 93;
                    trM3TR = 93;
                    trM3St = "Dev NN" + 93;                    
                }

                iisODSObj.sysDevOp = sysDevOp;
                iisODSObj.accdevId = accdevId;
                iisODSObj.debug01 = debug01;
                iisODSObj.debug02 = debug02;
                iisODSObj.debug03 = debug03;
                iisODSObj.scribLStr = scribLStr;
                iisODSObj.trM1 = trM1;
                iisODSObj.trM1TR = trM1TR;
                iisODSObj.trM1St = trM1St;
                iisODSObj.trM2 = trM2;
                iisODSObj.trM2TR = trM2TR;
                iisODSObj.trM2St = trM2St;
                iisODSObj.trM3 = trM3;
                iisODSObj.trM3TR = trM3TR;
                iisODSObj.trM3St = trM3St;
            } catch (err) {

            }


            iisODSObj.accId = accId;
            iisODSObj.accfundId = accfundId;


            var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
            window.localStorage.setItem(iisODSObjSession, iisODSObjStr);

            iisDataObj.accObjListStr = accObjListStr;
            var iisDataObjStr = JSON.stringify(iisDataObj, null, '\t');
            var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
            window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));

            var iisWebObj = {'myMenuId': 0};
            window.localStorage.setItem(iisWebSM, JSON.stringify(iisWebObj));
            mySubMenuReset();

            myInitCurStock();

            myInitCommFunction();

            initMarketFun();

            initMarketStockFun();
        }
    });

}

var graphStname = "";
var graphStper = "";
var graphStnn3Per = "";

var graphTopStname = "";
var graphTopStnn3Per = "";

var STnameLStr = "";
var STnameL = "";
var STnameNum = 0;
var stockObjListStr = "";
var stockObjList = "";

var trFilter = "";

var itemList = [];
var paginatedList;
var stockPageNum = 0;

var ctx1 = null;
var myChart = null;
var ctx1top = null;
var myCharttop = null;
// Function to paginate a list
// Number of items per page

var STnumDisp = 8;   // number of line for stockt
const pageSize = 8;
function paginateList(list, pageSize) {
    const pageCount = Math.ceil(list.length / pageSize);
    const pages = [];

    for (let i = 0; i < pageCount; i++) {
        const start = i * pageSize;
        const end = start + pageSize;
        pages.push(list.slice(start, end));
    }
    return pages;
}

// Function to display a page
function displayPage(pageNumber) {
    if (pageNumber == 0) {
        pageNumber = 1;
    }
    const page = paginatedList[pageNumber - 1];
    var pageRet = "";
    if (page) {
        pageRet = page.join(", ");
//        console.log("Page " + pageNumber + ": " + pageRet);

    } else {
//        console.log("Page not found");
    }
    return pageRet;
}

function myInitCurStock() {
    var accId = iisODSObj.accId;
    trFilter = iisODSObj.trFilter;
    stockPagenum = iisODSObj.STPageNum;
    if (sysDevOp == true) {
        if (accdevId > 0) {
            accId = accdevId;
        }
    }

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/stname",
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
        success: handleResult
    }); // use promises



    function handleResult(resultSTnameList) {
//        console.log(resultSTnameList);

        if (resultSTnameList !== "") {
            if (resultSTnameList.length > 0) {
                STnameLStr = JSON.stringify(resultSTnameList, null, '\t');
            } else {
                var msg = 'Please add stock to your portfolio.';
                msg = '<div class="col-sm-12 col-xl-4"><br>' + msg + '</div>';
                $("#curstockid").html(msg);
            }
        }

        if (STnameLStr !== "") {
            STnameL = JSON.parse(STnameLStr);
            STnameNum = STnameL.length;
            if (STnameNum <= pageSize) {
//                document.getElementById("tag-filter").style.display = "none"; //hide  
                stockPageList = [STnameL.join(", ")];
            } else {
                for (i = 0; i < STnameL.length; i++) {
                    itemList.push(STnameL[i]);
                }
                // Paginate the list
                paginatedList = paginateList(itemList, pageSize);
                if (stockPagenum == -1) {
                    if (trFilter.length > 0) {
                        stockPagenum = 0;
                        stockPageList = trFilter;
                    } else {
                        stockPagenum = 1;
                        stockPageList = displayPage(stockPagenum);
                    }

                } else {
                    if (stockPagenum > paginatedList.length) {
                        stockPagenum = paginatedList.length;
                    }
                    stockPageList = displayPage(stockPagenum);
                }
            }
        }

        if ((STnameL.length > 18) || (custObj.id == 3)) {
            $("#stocktotalid").html(" Total number of Stocks = " + STnameL.length);
            document.getElementById("filter-tag").style.display = "";  //show              
        } else {
            document.getElementById("filter-tag").style.display = "none";  //hide    
        }
        updateCurStock(stockPageList);

    }
}



function updateCurStock(stockList) {
    if (stockList.length == 0) {
        return;
    }
    // this must using TR ACC to get the correct ACC performance 
    trName = "TR_ACC";

    if (sysDevOp == true) {
        if (accdevId > 0) {
            accId = accdevId;
        }
    }
    $.ajax({
        // default st size 20
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st?trname=" + trName + "&filter=" + stockList,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT * 2, //120 sec,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error("Status Text: " + textStatus);
            console.error("HTTP Status Code: " + xhr.status); // Should say 401
            
            if (xhr.status === 401) {
                alert('Session expired. Please log in again.');
            } else {
                alert('Network failure. Please try again later.');          
            }

            window.location.href = "aiiend.html";                     
        },        
        success: function (resultStockList) {
            if ((resultStockList === null) || (resultStockList === "")) {
                $('#error_message').fadeIn().html('Network error. Please try again later. ');
                window.location.href = "aiiend.html";
                return;
            }

            stockObjListStr = JSON.stringify(resultStockList, null, '\t');

            stockObjList = JSON.parse(stockObjListStr);


            var htmlName = '';
            if (stockObjList == "") {
                htmlName = 'Current stock list is empty.';
                $("#curstockid").html(htmlName);

            } else {
                htmlName += '<table class="table text-start align-middle table-bordered table-hover mb-0">';
                htmlName += '<thead>';
                htmlName += '<tr class="text-dark">';
                htmlName += '<th scope="col">Symbol</th>';
                htmlName += '<th scope="col">Signal</th>';
                htmlName += '<th scope="col">Delayed Close</th>';
                htmlName += '<th scope="col">Change %</th>';
                htmlName += '<th scope="col">Trend %</th>';
                htmlName += '<th scope="col">Tr Profit %</th>';
                htmlName += '<th scope="col">N3 Profit % </th>';
                htmlName += '</tr>';
                htmlName += '</thead>';
                htmlName += '<tbody>';

                var totalStockPer = 0;
                stockIdOLStr = "";

                graphStname = "";
                graphStper = "";
                graphStnn3Per = "";

                for (i = 0; i < stockObjList.length; i++) {
//                if (i >= STnumDisp) {
//                    break;
//                }
                    var stockObj = stockObjList[i];

                    if (i > 0) {
                        stockIdOLStr += ",";
                    }
                    stockIdOLStr += stockObj.id + "," + stockObj.symbol;

                    var stockDataStr = "";
                    var stockD = stockObj.data;
                    var bulbea = "";
                    var mktre = "";
                    var shortterm = stockObj.shortterm + '%';
                    try {
                        if (stockD !== "") {
                            stockDataStr = stockD.replaceAll('#', '"');
                            var objData = JSON.parse(stockDataStr);

                            if (objData != null) {
                                if (objData.bulbea == 1) {
                                    bulbea = ' (trb)';
                                } else if (objData.bulbea == 2) {
                                    bulbea = ' (trs)';
                                }
                                mktre = objData.mktre;
                                shortterm += bulbea;
                            }
                        }
                    } catch (err) {
                    }

                    var percentSt = "";
                    var priceSt = "";
                    var perSt = "";
                    var close = 0;
                    var preClose = 0;
                    var performN3 = "";
                    var perN3St = "";
                    if (stockObj.afstockInfo != null) {
                        close = stockObj.afstockInfo.fclose;
                        preClose = stockObj.prevClose;
                        var percent = 100 * (close - preClose) / preClose;

                        if (percent > 0) {
                            percentSt = "<font style= color:green>" + percent.toFixed(2) + '%' + "</font>";
                        } else {
                            percentSt = "<font style= color:red>" + percent.toFixed(2) + '%' + "</font>";
                        }

                        priceSt = "$" + close.toFixed(2);
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
                        perSt += '%';

                        performN3 = stockObj.performN3;

                        perN3St = performN3.toFixed(0); // performance '%';                
                        if (performN3 != 0) {
                            if (performN3 < 10) {
                                if (performN3 > -10) {
                                    perN3St = performN3.toFixed(2);
                                    perN3St = perN3St.replace("0.00", "0");
                                }
                            }
                        }
                        perN3St += '%';
                    }

                    var symbol = "";
                    var signal = "";
                    if (stockObj.trsignal === S_BUY) {
                        symbol = '<span style="color:green"><strong>' + stockObj.symbol + '</strong></span>';
                        signal = '<span  style="color:green">Buy</span>';
                    } else if (stockObj.trsignal === S_SELL) {
                        symbol = '<span  style="color:red"><strong>' + stockObj.symbol + '</strong></span>';
                        signal = '<span  style="color:red">Sell</span>';
                    } else {
                        symbol = '<span  ><strong>' + stockObj.symbol + '</strong></span>';
                        signal = '<span  >----</span>'; //'<span  >Exit</span>';
                    }



                    htmlName += '<tr>';
                    htmlName += '<td onclick="return stN3TRClick(' + stockObj.id + ');">' + symbol + '</td>';
                    htmlName += '<td>' + signal + '</td>';
                    htmlName += '<td>' + priceSt + '</td>';
                    htmlName += '<td>' + percentSt + '</td>';
                    htmlName += '<td>' + shortterm + '</td>';
                    htmlName += '<td ><a href="#" onclick="return stACCTRClick(' + stockObj.id + ');">' + perSt + '</a></td>';
                    htmlName += '<td ><a href="#" onclick="return stN3TRClick(' + stockObj.id + ');">' + perN3St + '</a></td>';

                    htmlName += '</tr>';

                    //////Graph setup
                    if (i > 0) {
                        graphStname += ",";
                        graphStper += ",";
                        graphStnn3Per += ",";
                    }
                    graphStname += stockObj.symbol;
                    graphStper += perSt;
                    graphStnn3Per += perN3St;

                } // end of stock list
                htmlName += '</tbody>';
                htmlName += '</table>';

                //<!-- Basic Pagination -->
                if (STnameNum > pageSize) {
                    htmlName += '<nav aria-label="Page navigation example">';
                    htmlName += '<ul class="pagination">';
                    htmlName += '<li onclick="return stPageCnt(-1);" class="page-item"><a class="page-link" href="#">Previous</a></li>';

                    htmlName += '<li class="page-item"><a id="StPageNumId" class="page-link" href="#">' + stockPagenum + '_of_' + paginatedList.length + '</a></li>';

                    htmlName += '<li onclick="return stPageCnt(1);"  class="page-item"><a class="page-link" href="#">Next</a></li>';

                    htmlName += '</ul>';

                    htmlName += '</nav>';
                }
                //<!-- End Basic Pagination -->

                $("#curstockid").html(htmlName);
                $("#curstockProgid").html('');
            }

            iisODSObj.stockIdOLStr = stockIdOLStr;
            iisODSObj.STnameLStr = STnameLStr;
            var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
            window.localStorage.setItem(iisODSObjSession, iisODSObjStr);



            iisDataObj.stockObjListStr = stockObjListStr;
            var iisDataObjStr = JSON.stringify(iisDataObj, null, '\t');
            var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
            window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));

            displayStockPer();
            return;
        }
    });
}

function displayStockPer() {
// Worldwide Sales Chart
    if (graphStname.length == 0) {
        return;
    }

    var graphObj = {
        type: "bar",
        data: {
            labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
            datasets: [{
                    label: "USA",
                    data: [15, 30, 55, 65, 60, 80, 95],
                    backgroundColor: "rgba(0, 156, 255, .7)"
                },
                {
                    label: "UK",
                    data: [8, 35, 40, 60, 70, 55, 75],
                    backgroundColor: "rgba(0, 156, 255, .5)"
                },
                {
                    label: "AU",
                    data: [12, 25, 45, 55, 65, 70, 60],
                    backgroundColor: "rgba(0, 156, 255, .3)"
                }
            ]
        },
        options: {
            responsive: true
        }
    };


    var nameList = graphStname.split(",");

    graphStper = graphStper.replaceAll("%", "");
    var perList = graphStper.split(",");

    graphStnn3Per = graphStnn3Per.replaceAll("%", "");
    var nn3perList = graphStnn3Per.split(",");

    graphObj.data.labels = nameList;


    var arr = [];
    arr.push({
        label: "Perf TR(%)",
        data: perList,
        bbackgroundColor: "rgba(0, 156, 255, .5)"
    });
    arr.push({
        label: "Perf NN3(%)",
        data: nn3perList,
        backgroundColor: "rgba(0, 156, 255, .7)"
    });

    graphObj.data.datasets = arr;

    if (myChart == null) {
        ctx1 = $("#canvasId").get(0).getContext("2d");
        myChart = new Chart(ctx1, graphObj);
    } else {
        myChart.data = graphObj.data;
        myChart.update();
    }

}


function stACCTRClick(stockSymId) {

    trName = "TR_ACC";
    iisODSObj.trName = trName;

    stockId = stockSymId;
    iisODSObj.stockId = stockId;
    var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
    window.localStorage.setItem(iisODSObjSession, iisODSObjStr);

    clickSubMenuId(11);
    window.location.href = "aiistock.html";
}

function stN3TRClick(stockSymId) {
    trName = "TR_NN33";
    iisODSObj.trName = trName;

    stockId = stockSymId;
    iisODSObj.stockId = stockId;
    var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
    window.localStorage.setItem(iisODSObjSession, iisODSObjStr);

    clickSubMenuId(12);
    window.location.href = "aiistocknn.html";
}

function stPageCnt(cnt) {
    var changeF = false;
    if (cnt == -1) {
        if (stockPagenum > 1) {
            stockPagenum--;
            changeF = true;
        }
    } else if (cnt = 1) {
        if (stockPagenum < paginatedList.length) {
            stockPagenum++;
            changeF = true;
        }
    }
    if (changeF == true) {
        stockPageList = displayPage(stockPagenum);
        iisODSObj.STPageNum = stockPagenum;
        var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
        window.localStorage.setItem(iisODSObjSession, iisODSObjStr);

        $("#StPageNumId").html('<span class="blink">Processing</span>');
        updateCurStock(stockPageList)
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function myInitCommFunction() {
//    alert("init");
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + iisODSObj.accId + "/comm?length=8",
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
        success: function (resultCommObjList) {

            commOLStr = "";
            commObjList = [];
            if (resultCommObjList !== "") {
                if (resultCommObjList.length > 0) {
                    commOLStr = JSON.stringify(resultCommObjList, null, '\t');
                    commObjList = JSON.parse(commOLStr);
                }
            }
            iisODSObj.commOLStr = commOLStr;
            var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
            window.localStorage.setItem(iisODSObjSession, iisODSObjStr);


            if (commOLStr.length > 0) {
                commObjList = JSON.parse(commOLStr);
                if (commObjList.length == 0) {
                    commObjList = [];
                }
            }

            var htmlCom = "";
            var col1 = "";
            var col2 = "";
            var col3 = "";

            for (i = 0; i < commObjList.length; i++) {
                var commObj = commObjList[i];
                var commId = commObj.id;

                col1 = commObj.updatedatedisplay;
                const parts = commObj.updatedatedisplay.split('-');
                const localDate = new Date(parts[0], parts[1] - 1, parts[2]);                
                col1 = formatDate(localDate);

//                    col2 = commObj.id + ' ' + commObj.name + ' (' + custObj.id + ')';
                col2 = commObj.name + ' Acc (' + custObj.id + ')';

                col3 = commObj.data;

                htmlCom += '<div class="d-flex align-items-center border-bottom py-3">';

                htmlCom += '<div class="w-100 ms-3">';
                htmlCom += '<div class="d-flex w-100 justify-content-between">';


                var buysell = false;
                if (col3.indexOf("Sig:buy") != -1) {
                    col3 = '<font style= color:green>' + col3 + '</font>';
                    buysell = true;
                }
                if (col3.indexOf("Sig:sell") != -1) {
                    col3 = '<font style= color:red>' + col3 + '</font>';
                    buysell = true;
                }
                htmlCom += '<h6 class="mb-0">' + col2 + '</h6>';
                htmlCom += '<small>' + col1 + '</small>';
                htmlCom += '</div>';
                htmlCom += '<span>' + col3 + '</span>';
                htmlCom += '</div>';
                htmlCom += '</div>';

            }
            $("#mycomm").html(htmlCom);

            updateShortCommFunction();

        }
    });

}


$("#clearallbtn").click(function () {

    var comIdList = "";

    if (commObjList.length == 0) {
        if ((custChange == true)) { // Demo
            return;
        } else {
            comIdList = "-2";
        }
    }
    for (i = 0; i < commObjList.length; i++) {
        var commObj = commObjList[i];
        var commId = commObj.id;
        if (i > 0) {
            comIdList += ",";
        }
        comIdList += commId;
        break;
    }
    if (custT == 99) {
        return;    // ignore this customer
    }
    $('#clearmsgId').html('<span class="blink">Processing</span>')

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + iisODSObj.accId + "/comm/remove?idlist=" + comIdList,
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
        success: function (result) {
            if (result != 1) {

            }
            $('#clearmsgId').html('Notification Messages')

            myInitCommFunction(); // does not refresh???
//            window.location.href = "aiiaccount.html";
        }
    });
});


$("#addstclick").click(function () {
    var htmlhead = "";
    $("#addsubmit").attr("disabled", true);

    var addsymbol = document.getElementById("searchsymid").value;
    if (addsymbol === "") {
        htmlhead += "Please add the stock symbol in the input field.";
        $("#addStockBodyId").html(htmlhead);
        return;

    }
    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            htmlhead = "This operation is not supported on demo accounts.";
            $("#addStockBodyId").html(htmlhead);
            return;
        }
    }

    if (accObj.type === INT_MUTUAL_FUND_ACCOUNT) {
        // should not happen
        return;
    }
    var sym = addsymbol.toUpperCase();
    var found = false;
    for (i = 0; i < STnameL.length; i++) {
        if (sym === STnameL[i]) {
            found = true;
            break;
        }
    }

    if (found == true) {
        htmlhead += sym + " stock already exist.";
        $("#addStockBodyId").html(htmlhead);
        return;
    }
    htmlhead += '<span class="blink">Retrieving stock ' + sym + ' info....</span>';
    $("#addStockBodyId").html(htmlhead);

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/realtime/" + sym,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        success: handleResult
    }); // use promises

    function handleResult(stockObj) {
        var htmlhead = "";
        if (stockObj !== null && stockObj !== "") {
            var name = stockObj.stockname;
            var close = stockObj.afstockInfo.fclose;

            htmlhead += "Name:" + name;
            htmlhead += "<br>Add stock " + sym + " close at $" + close;

            htmlModel = htmlhead;
            $("#addStockBodyId").html(htmlhead);

            $("#addsubmit").attr("disabled", false);
            return;
        }
        htmlhead += sym + " stock does not found in yahoo.com.";
        htmlModel = htmlhead;

        $("#addStockBodyId").html(htmlhead);
    }


});

$("#addsubmit").click(function () {
    var addsymbol = document.getElementById("searchsymid").value;
    if (addsymbol === "") {
        return;
    }
    var sym = addsymbol.toUpperCase();
    $("#addStockBodyId").html('<span class="blink">Updating....</span>');
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

        if (result != 1) {
            var msgObjStr = "Fail to add stock " + sym;
            if (result == 2) {
                msgObjStr += " : Stock alreday existed";
            }
            if (result == 100) {
                msgObjStr += " : Max number of stock exceeded the user plan";
            }
            msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'

            $("#addStockBodyId").html(msgObjStr);
            return;
        }

        refreshMyPage();
    }
});


$("#removestclick").click(function () {
    var htmlhead = "";
    $("#removesubmit").attr("disabled", true);

    var addsymbol = document.getElementById("searchsymid").value;
    if (addsymbol === "") {
        htmlhead += "Please add the stock symbol in the input field.";
        $("#removeStockBodyId").html(htmlhead);
        return;

    }
    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            htmlhead = "This operation is not supported on demo accounts.";
            $("#removeStockBodyId").html(htmlhead);
            return;
        }
    }

    if (accObj.type === INT_MUTUAL_FUND_ACCOUNT) {
        // should not happen
        return;
    }
    var sym = addsymbol.toUpperCase();

    var found = false;
    for (i = 0; i < STnameL.length; i++) {
        if (sym === STnameL[i]) {
            found = true;
            break;
        }
    }

    if (found == false) {
        htmlhead += sym + " stock is not found in your stock list.";
        $("#removeStockBodyId").html(htmlhead);
        return;
    }
    htmlhead += "Removing stock " + sym;
    htmlModel = htmlhead;

    $("#removeStockBodyId").html(htmlhead);

    $("#removesubmit").attr("disabled", false);
});


$("#removesubmit").click(function () {
    var rsymbol = document.getElementById("searchsymid").value;
    if (rsymbol === "") {
        return;
    }
    var sym = rsymbol.toUpperCase();
    $("#removeStockBodyId").html('<span class="blink">Updating....</span>');

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/removesymbol?symbol=" + sym,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        success: handleResult
    }); // use promises

    function handleResult(result) {

        if (result != 1) {

            var msgObjStr = "Fail to remove stock " + sym;
            if (result == 2) {
                msgObjStr += " : Stock not existed";
            }
            if (result == 100) {
                msgObjStr += " : Max number of stock exceeded the user plan";
            }
            msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
            $("#removeStockBodyId").html(msgObjStr);
            return;
        }
        refreshMyPage();
    }

});


function initMarketFun() {
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/fundbestlist",
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        success: handleResult
    }); // use promises

    function handleResult(resultFundBestObjList) {
        var fundBestObjList = null;
        if (resultFundBestObjList !== "") {
            if (resultFundBestObjList.length > 0) {
                var fundBestObjListStr = JSON.stringify(resultFundBestObjList, null, '\t');
                fundBestObjList = JSON.parse(fundBestObjListStr);
            }

        }
        if ((fundBestObjList != null) && (fundBestObjList.length > 0)) {
            for (i = 0; i < fundBestObjList.length; i++) {
                var accObj = fundBestObjList[i];

                 var billCd = "BillMgr-fund" + accObj.id;
                var accName = billCd; //accObj.accountname;
                var accDataSt = accObj.data;
                var perfBalPercent = 0;
                var perfBal = 0;
                var stockList = [];
                try {
                    if (accDataSt != null) {
                        accDataSt = accDataSt.replaceAll('#', '"');
                        var accData = JSON.parse(accDataSt);
                        if (typeof accData.ref === "undefined") {
                            ;
                        } else if (accData.ref !== "") {
                            // accName = accObj.id + "-" + accData.ref.replaceAll("_", " ");
                            accName = accData.ref;
                        }
                        if (accData != null) {
                            //name,curRT%,All%,1mon%,3mon%,3mon%,
                            perfBalPercent = accData.curM.toFixed(2);
                        }
                        stockList = accData.accL;
                        for (j = 0; j < stockList.length; j++) {
                            stockN = stockList[j];
                    
                        }                        
                    }
                } catch (err) {
                }

                var htmlSt = "";
                htmlSt += '<p class="mb-2">' + accName + ' </p>';
                htmlSt += '<h6 class="mb-0">Total =' + perfBalPercent + '%</h6>';

                if (i == 0) {
                    $("#market1").html(htmlSt);
                } else if (i == 1) {
                    $("#market2").html(htmlSt);
                } else if (i == 2) {
                    $("#market3").html(htmlSt);
                } else if (i == 3) {
                    $("#market4").html(htmlSt);
                    break;
                }
            }

        }
    }

}

function initMarketStockFun() {
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/stockbestlist",
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        success: handleResult
    }); // use promises

    function handleResult(resultStockBestObjList) {
        var StockBestObjList = null;
        if (resultStockBestObjList !== "") {
            if (resultStockBestObjList.length > 0) {
                var StockBestObjListStr = JSON.stringify(resultStockBestObjList, null, '\t');
                StockBestObjList = JSON.parse(StockBestObjListStr);
            }

        }
        graphStname = "";
        graphTopStnn3Per = "";
        if (StockBestObjList.length > 0) {
            for (i = 0; i < StockBestObjList.length; i++) {
//       
                var stockObj = StockBestObjList[i];
                var sym = stockObj.symbol;
                var performN3 = stockObj.performN3;
                var perN3St = performN3.toFixed(0); // performance '%';   
                if (i > 0) {
                    graphTopStname += ",";
                    graphTopStnn3Per += ",";
                }
                graphTopStname += sym;
                graphTopStnn3Per += perN3St;
            }

            displayTopStockPer();
        }
    }

}


function displayTopStockPer() {
// Worldwide Sales Chart
    if (graphTopStname.length == 0) {
        return;
    }

    var graphObjTop = {
        type: "bar",
        data: {
            labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
            datasets: [{
                    label: "USA",
                    data: [15, 30, 55, 65, 60, 80, 95],
                    backgroundColor: "rgba(0, 156, 255, .7)"
                },
                {
                    label: "UK",
                    data: [8, 35, 40, 60, 70, 55, 75],
                    backgroundColor: "rgba(0, 156, 255, .5)"
                },
                {
                    label: "AU",
                    data: [12, 25, 45, 55, 65, 70, 60],
                    backgroundColor: "rgba(0, 156, 255, .3)"
                }
            ]
        },
        options: {
            responsive: true
        }
    };


    var nameList = graphTopStname.split(",");

    var Topnn3perList = graphTopStnn3Per.split(",");

    graphObjTop.data.labels = nameList;


    var arr = [];
    arr.push({
        label: "Perf NN3(%)",
        data: Topnn3perList,
        backgroundColor: "rgba(0, 156, 255, .7)"
    });

    graphObjTop.data.datasets = arr;

    if (myCharttop == null) {
        ctx1top = $("#canvasTopId").get(0).getContext("2d");
        myChartop = new Chart(ctx1top, graphObjTop);
    } else {
        myCharttop.data = graphObjTop.data;
        myCharttop.update();
    }

}



$("#filterstclick").click(function () {
    var htmlhead = "";
    $("#filtersubmit").attr("disabled", true);

    var filtersymbol = document.getElementById("filtersymid").value;
    if (filtersymbol === "") {
        htmlhead += "Please add the stock symbol in the input field.";
        $("#filterStockBodyId").html(htmlhead);
        return;

    }

    var sym = filtersymbol.toUpperCase();
    var htmlhead = "Filter Name:" + sym;
    htmlModel = htmlhead;
    $("#filterStockBodyId").html(htmlhead);

    $("#filtersubmit").attr("disabled", false);

});

$("#filtersubmit").click(function () {
    var filtersymbol = document.getElementById("filtersymid").value;
    if (filtersymbol === "") {
        return;
    }
    var sym = filtersymbol.toUpperCase();
    sym = sym.trim();
    sym = sym.replaceAll(" ", "");
    // var symList = sym.split(",");

    // var symArray = [];
    // for (i = 0; i < symList.length; i++) {
    //     if (symList[i].length > 0) {
    //         symArray.push(symList[i]);
    //     }
    // }

    // filterList = "";
    // if (symArray.length > 0) {
    //     filterList = symArray;
    // }

    iisDataObj.filterList = sym;

    iisDataObj.accObjListStr = '';
    iisDataObj.stockObjListStr = '';
    iisDataObj.stockFundObjListStr = '';

    var iisDataObjStr = JSON.stringify(iisDataObj, null, '\t')
    var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
    window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));

    window.localStorage.setItem(iisODSObjSession, "");
    refreshMyPage();
});

