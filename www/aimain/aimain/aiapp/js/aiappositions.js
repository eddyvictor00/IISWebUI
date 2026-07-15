const MOCK_API_DELAY = 500;

let isLoggedIn = false; // Initial state: not logged in

/////////////////////////////basic local storage
/////////////////////////////basic local storage
//////Goble variable
var iisWebSession = "iisWebSession";
var iisWebObjStr = window.localStorage.getItem(iisWebSession);
if ((iisWebObjStr == null) || (iisWebObjStr.trim().length == 0)) {
    window.location.href = "aiiend.html";
    // window.location.href = "aiaplogin.html";
}
var iisWebObj = JSON.parse(iisWebObjStr);

//var GOBLE_Filter = ["IUSB,ERX,ERY,FAS,FAZ,YINN,YANG,CHAU,TECL,TECS,HOU.TO,HOD.TO,SPXL,SPXS,DRN,DRV,WEBL,WEBS,DGP"];
//var GOBLE_Filter = ["IUSB,ERX,FAS,YINN,TECL,HOU.TO,SPXL,DRN,WEBL,DGP"];
var GOBLE_Filter = ["SPY,DIA,FAS,QQQ,DGP"];
var Cur_Plan = "";
var iisurlStr = iisWebObj.iisurlStr;
iisurl = iisurlStr;

var custObjStr = iisWebObj.custObjStr;
if ((custObjStr == null) || (custObjStr.length == 0)) {
    window.location.href = "aiiend.html";
    // window.location.href = "aiaplogin.html";
}
var custObj = JSON.parse(custObjStr);

var iisDataObjStr = iisWebObj.iisDataObjStr;
if ((iisDataObjStr == null) || (iisDataObjStr.length == 0)) {
    window.location.href = "aiiend.html";
    // window.location.href = "aiaplogin.html";
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
if (filterList.length > 0) {
    if (!Array.isArray(filterList)) {
        // If it's a string, wrap it in an array. 
        // If it's already something else, this still ensures it becomes an array.
        filterList = [filterList];
    }
}
var iisODSObj = {// operation data src
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
var iisODSObjSession = "iisODSObjSession";
var iisODSObjStr = window.localStorage.getItem(iisODSObjSession);
if ((iisODSObjStr == null) || (iisODSObjStr.length == 0)) {

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
        filterinput = filterList.join(",");
    }
    // document.getElementById("filtersymid").setAttribute('value', filterinput);
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
        filterinput = filterList.join(",");
    }
    // document.getElementById("filtersymid").setAttribute('value', filterinput);
}
// initialize ODS data
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

///////////////
trName = "TR_NN33";     // force TR_NN33
if (trName.length == 0) {
    trName = "TR_NN33"
}
// force TR_NN33
iisODSObj.trName = trName; 
var iisODSObjUpdateStr = JSON.stringify(iisODSObj, null, '\t');
window.localStorage.setItem(iisODSObjSession, iisODSObjUpdateStr);
///////////////
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
                
isLoggedIn = true;

initMainAcc();

function initMainAcc() {
        // 2. Only show loading in the list area for a refresh
    $('#positions-list-full').html(showLoading());        
    postitionActivity = [];

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
            // window.location.href = "aiaplogin.html";
        },
        success: function (resultAccObjList) {
            if ((resultAccObjList === null) || (resultAccObjList === "")) {
                window.location.href = "aiiend.html";
                // window.location.href = "aiaplogin.html";
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
                    Cur_Plan = pp;

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
            // mySubMenuReset();

            myInitCurStock();

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
var stockPageList = "";
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
            // window.location.href = "aiaplogin.html";
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
                // $("#curstockid").html(msg);
            }
        }

        if (STnameLStr !== "") {
            itemList = [];
            STnameL = JSON.parse(STnameLStr);
            STnameNum = STnameL.length;
            if (STnameNum <= pageSize) {
//                document.getElementById("tag-filter").style.display = "none"; //hide  
                stockPageList = STnameL.join(", ");
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

        updateCurStock(stockPageList);
    }
}


function updateCurStock(stockList) {
    if (stockList.length == 0) {
        ProfileData.ready = true;

        renderPositionsPage(true);        
        return;
    }
    // this must using TR ACC to get the correct ACC performance 
    trName = "TR_NN33"; //"TR_ACC";

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
        error: function () {
//                alert('Network failure. Please try again later.');
//                window.location.href = "index.html";
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
                            percentSt = '<span class="text-green-500">' + percent.toFixed(2) + '%' + "</span>";
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
                        var qty = 0;
                        var avgPrice = 0; 
                      
                        confSt = stockObj.conf;
                        if (confSt.length > 0) {
                             trans = JSON.parse(confSt);
                             qty = trans.share;
                             avgPrice = trans.avgprice;
                        }
                        var curPrice = stockObj.afstockInfo.fclose;                         
                        var openPNL = (curPrice-avgPrice)*qty;
                        var pnlPercent = 0;                        
                        if (avgPrice > 0) {
                            pnlPercent = 100*(curPrice-avgPrice)/avgPrice; 
                        } else{
                            pnlPercent = 0;  
                        }
                        var stockSym = stockObj.symbol;
                        var stockName = stockObj.stockname;

                        var actionButton = `<button class="text-xs bg-sky-600 px-2 py-1 rounded-full font-bold" onclick="window.location.href='#'">Exit</button>`;
                
                        if (stockObj.trsignal == 1) {
                            actionButton = `<button class="text-xs bg-green-600 px-2 py-1 rounded-full font-bold" onclick="window.location.href='#'">Buy</button>`;
                        } else if (stockObj.trsignal == 2) {
                            actionButton = `<button class="text-xs bg-red-600 px-2 py-1 rounded-full font-bold" onclick="window.location.href='#'">Sell</button>`;
                        }                        

                        if (stockObj.trsignal == 1) {
                            stockName = actionButton + ' ' + stockSym + ' - '+ stockName;
                        } else if (stockObj.trsignal == 2) {
                            stockName = actionButton + ' ' + stockSym + ' - ' + stockName;
                            openPNL = -openPNL;
                            pnlPercent = -pnlPercent
                        } else{
                            stockName = actionButton + ' ' + stockSym + ' - ' + stockName;
                        }
                        
                        var marketValue = (avgPrice * qty) + openPNL;
                        recordPostition(stockObj.symbol, stockName,
                            qty, marketValue, openPNL, pnlPercent, avgPrice, curPrice, preClose, percentSt);

                    } else {
                        var qty = 0;
                        var avgPrice = 0;     
                        var curPrice = 0;       
                        var preClose = 0;                  
                        var openPNL = (curPrice-avgPrice)*qty;
                        var pnlPercent = 0; 
                        var percentSt = "";
                        var marketValue = (avgPrice * qty) + openPNL;                     
                        recordPostition(stockObj.symbol, stockObj.stockname,
                            qty, marketValue, openPNL, pnlPercent, avgPrice, curPrice, preClose, percentSt);                        
                    }


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

                    htmlName += '<li class="page-item"><a id="StPageNumId" class="page-link" href="#"> Page ' + stockPagenum + '_of_' + paginatedList.length + '</a></li>';

                    htmlName += '<li onclick="return stPageCnt(1);"  class="page-item"><a class="page-link" href="#">Next</a></li>';

                    htmlName += '</ul>';

                    htmlName += '</nav>';
                }
                //<!-- End Basic Pagination -->

                // $("#curstockid").html(htmlName);
                // $("#curstockProgid").html('');
            }

            iisODSObj.stockIdOLStr = stockIdOLStr;
            iisODSObj.STnameLStr = STnameLStr;
            var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
            window.localStorage.setItem(iisODSObjSession, iisODSObjStr);



            iisDataObj.stockObjListStr = stockObjListStr;
            var iisDataObjStr = JSON.stringify(iisDataObj, null, '\t');
            var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
            window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));

            // displayStockPer();
            mockPositions = postitionActivity;
            ProfileData.ready = true;

            renderPositionsPage(true);
            return;
        }
    });
}


const MOCK_CURRENT_PRICE = 186.98; // Global mock price for all stocks for simplicity in this example
var ProfileData = {
    ready: false
}
// Using let so we can modify the array when adding new positions
var mockPositions = [
    // { symbol: 'AAPL', name: 'Apple Inc.', qty: 45, marketValue: 8414.10, openPNL: 213.92, pnlPercent: 2.61, avgPrice: 182.23 },
    // { symbol: 'TSLA', name: 'Tesla Inc', qty: 19, marketValue: 3309.23, openPNL: 251.77, pnlPercent: 8.23, avgPrice: 160.92 },
];
// Start with an empty array
var postitionActivity = [];

// A function to create and add a new transaction to the array
function recordPostition(symbol, name, qty, marketValue, openPNL, pnlPercent, avgPrice, curPrice,
    preClose, percentSt  ) {
    const newPosition = { 
        symbol: symbol, 
        name: name, 
        qty: qty, 
        marketValue: marketValue, 
        openPNL: openPNL, 
        pnlPercent: pnlPercent, 
        avgPrice: avgPrice, 
        curPrice: curPrice,
        preClose: preClose,
        percentSt: percentSt       
    };

    postitionActivity.push(newPosition);
}


const backend = {
    getPositions: () => {
        const deferred = $.Deferred();
        let pollIntervalID = null;
        let checks = 0; // Counter to prevent infinite loops (optional, but recommended)
        const MAX_CHECKS = 80; // Max 20 seconds (200 * 100ms) before giving up
        // Start the polling interval
        pollIntervalID = setInterval(() => {
            checks++;

            // 1. CHECK FOR READY FLAG
            if (ProfileData.ready) {
                // Recalculate PNL and market value for all stocks based on mock price 
                mockPositions = mockPositions.map(p => {
                    const marketValue = p.marketValue;
                    const investedValue = p.qty * p.avgPrice;
                    const openPNL = p.openPNL; //marketValue - investedValue;
                    const pnlPercent = p.pnlPercent; // (investedValue > 0) ? (openPNL / investedValue) * 100 : 0;
                    return { ...p, marketValue, openPNL, pnlPercent };
                });

                const totalValue = mockPositions.reduce((sum, p) => sum + p.marketValue, 0);
                const totalGain = mockPositions.reduce((sum, p) => sum + p.openPNL, 0);
                const totalInvested = mockPositions.reduce((sum, p) => sum + (p.qty * p.avgPrice), 0);
                const gainPercent = (totalInvested > 0) ? ((totalGain / totalInvested) * 100) : 0;

                // Sort positions by symbol for consistent display
                mockPositions.sort((a, b) => a.symbol.localeCompare(b.symbol));

                deferred.resolve({ positions: mockPositions, totalValue, totalGain, gainPercent: gainPercent });                
                // Stop the loop
                clearInterval(pollIntervalID);                

                return; 
            }

            // 2. CHECK FOR MAX TIMEOUT (Fallback)
            if (checks >= MAX_CHECKS) {
                 // Stop the loop
                clearInterval(pollIntervalID);               
                // Reject the promise if the data never became ready
                deferred.reject({ error: "Timeout: Data never became ready." });
                return;
            }
        }, MOCK_API_DELAY);
        return deferred.promise();        
        
        // setTimeout(() => {
        //     // Recalculate PNL and market value for all stocks based on mock price 
        //     mockPositions = mockPositions.map(p => {
        //         const marketValue = p.marketValue;
        //         const investedValue = p.qty * p.avgPrice;
        //         const openPNL = p.openPNL; //marketValue - investedValue;
        //         const pnlPercent = p.pnlPercent; // (investedValue > 0) ? (openPNL / investedValue) * 100 : 0;
        //         return { ...p, marketValue, openPNL, pnlPercent };
        //     });

        //     const totalValue = mockPositions.reduce((sum, p) => sum + p.marketValue, 0);
        //     const totalGain = mockPositions.reduce((sum, p) => sum + p.openPNL, 0);
        //     const totalInvested = mockPositions.reduce((sum, p) => sum + (p.qty * p.avgPrice), 0);
        //     const gainPercent = (totalInvested > 0) ? ((totalGain / totalInvested) * 100) : 0;

        //     // Sort positions by symbol for consistent display
        //     mockPositions.sort((a, b) => a.symbol.localeCompare(b.symbol));

        //     deferred.resolve({ positions: mockPositions, totalValue, totalGain, gainPercent: gainPercent });

        // }, MOCK_API_DELAY);
        // return deferred.promise();
    }
};

function showLoading() {
    // This function is for showing the loading spinner for the list section inside the main content (smaller version)
    return (`
        <div class="flex flex-col items-center justify-center h-full min-h-[100px] p-2">
            <!-- Smaller version of the custom spinner using Tailwind classes -->
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-gray-600 border-t-2 border-t-sky-400 mb-2"></div>
            <p class="text-gray-400 text-xs">Loading data...</p>
        </div>
    `);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// --- Overlay Screen Logic ---

function closeTradeScreen(screenId) {
    $(`#${screenId}`).removeClass('active');
}

// --- Add Stock Logic ---
function openAddStockScreen() {
    $("#validateaddStockBodyId").html('');
    $('#validate-add-symbol-input').val('');
    $('#add-qty-input').val(1);
    $('#add-avg-price-input').val('');
    $('#add-name-input').val('');
    $('#validate-add-stock-screen').addClass('active');
    $('#validate-add-stock-screen').scrollTop(0);  
    // $('#add-stock-screen').addClass('active');
    // $('#add-stock-screen').scrollTop(0); 
}

function validateAddStock() {
    const symbol = $('#validate-add-symbol-input').val().toUpperCase().trim();
    if (!symbol ) {
        console.error('Validation failed: Invalid inputs.');
        return;
    }
    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            var msgObjStr = "This operation is not supported on demo accounts.";
            $("#validateaddStockBodyId").html('<p style="color:red">' + msgObjStr + '</p>');
            return;
        }
    }

    if (accObj.type === INT_MUTUAL_FUND_ACCOUNT) {
        // should not happen
        return;
    }

    $("#validateaddStockBodyId").html('<span class="blink">Updating....</span>');
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/realtime/" + symbol,
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
            htmlhead += "<br>Add stock " + symbol + " close at $" + close;
            closeTradeScreen('validate-add-stock-screen');

            $("#addStockBodyId").html('');
            $('#add-symbol-input').val(symbol);
            $('#add-qty-input').val(1);
            $('#add-price-input').val(""+close);
            $('#add-name-input').val(name);

            $('#add-stock-screen').addClass('active');
            $('#add-stock-screen').scrollTop(0);             
            return;
        }
        var msgObjStr = "Stock symbol " + symbol + " does not found in yahoo.com.";
        $("#validateaddStockBodyId").html('<p style="color:red">' + msgObjStr + '</p>');
    }


    // closeTradeScreen('validate-add-stock-screen');
    // renderPositionsPage(true); // Call render with refresh true to reload the list
}

function confirmAddStock() {
    const symbol = $('#add-symbol-input').val().toUpperCase().trim();
    const avgPrice = parseFloat($('#add-price-input').val());
    const name = $('#add-name-input').val().trim() || `${symbol} (New Stock)`;

    if (!symbol || isNaN(avgPrice) || avgPrice <= 0) {
        console.error('Validation failed: Invalid inputs.');
        return;
    }
    var sym = symbol.toUpperCase();
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
            $("#addStockBodyId").html('<p style="color:red">' + msgObjStr + '</p>')

            return;
        }
        // 1. Close the overlay screen
        closeTradeScreen('add-stock-screen');

        // 2. Simulate the click on the refresh button to reload the data
        $('#refresh-button').click();

        // renderPositionsPage(true); // Call render with refresh true to reload the list

    }

}

// --- Remove Stock Logic ---
function updateRemovalDetails() {
    const selectedSymbol = $('#remove-symbol-select').val();
    const position = mockPositions.find(p => p.symbol === selectedSymbol);
    
    if (position) {
        $('#max-qty-text').text(`Max available: ${position.qty} shares`);
        $('#remove-qty-input').attr('max', position.qty).val(position.qty);
        $('#remove-qty-input').removeClass('trade-input-disabled').prop('disabled', false);
        $('#confirm-remove-stock-btn').prop('disabled', false).removeClass('bg-gray-600 hover:bg-gray-700').addClass('bg-red-600 hover:bg-red-700');
    } else {
        $('#max-qty-text').text('No shares available.');
        $('#remove-qty-input').val(0).prop('disabled', true).addClass('trade-input-disabled');
        $('#confirm-remove-stock-btn').prop('disabled', true).removeClass('bg-red-600 hover:bg-red-700').addClass('bg-gray-600 hover:bg-gray-700');
    }
}

function openRemoveStockScreen() {
    const symbols = mockPositions.map(p => p.symbol);
    const options = symbols.map(s => `<option value="${s}">${s}</option>`).join('');
    
    $('#remove-symbol-select').html(options);

    $("#removeStockBodyId").html('');
    
    if (symbols.length > 0) {
        updateRemovalDetails();
    } 


    $('#remove-stock-screen').addClass('active');
    $('#remove-stock-screen').scrollTop(0);
}


function confirmRemoveStock() {
    const symbol = $('#remove-symbol-select').val();
    
    if (!symbol) {
        console.error('Please select a stock to remove.');
        return;
    }
    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            var msgObjStr = "This operation is not supported on demo accounts.";
            $("#removeStockBodyId").html('<p style="color:red">' + msgObjStr + '</p>');
            return;
        }
    }
    $("#removeStockBodyId").html('<span class="blink">Updating....</span>');

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/removesymbol?symbol=" + symbol,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        success: handleResult
    }); // use promises

    function handleResult(result) {

        if (result != 1) {

            var msgObjStr = "Fail to remove stock " + symbol;
            if (result == 2) {
                msgObjStr += " : Stock not existed";
            }
            if (result == 100) {
                msgObjStr += " : Max number of stock exceeded the user plan";
            }
            msgObjStr = '<p style="color:red">' + msgObjStr + '</p>'
            $("#removeStockBodyId").html(msgObjStr);
            return;
        }
        // 1. Close the overlay screen
        closeTradeScreen('remove-stock-screen');

        // 2. Simulate the click on the refresh button to reload the data
        $('#refresh-button').click();
        // renderPositionsPage(true); // Call render with refresh true to reload the list
        window.location.href = "aiappositions.html";
    }

}


// --- Stock Detail Screen Logic (Redirect) ---

/**
 * Redirects the user to the dedicated stock detail page, passing the symbol as a query parameter.
 */
function openStockDetailScreen(symbol) {
    // iisODSObj.trName = "TR_NN33";
    // var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
    // window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
    window.location.href = `aiappositions_stock.html?symbol=${symbol}`;
}

// --- Refresh Logic for Positions Page ---
function refreshPositions(buttonElement) {
    const $icon = $(buttonElement).find('.refresh-icon');
    
    // 1. Start the spin animation and disable button
    $icon.addClass('animate-spin');
    $(buttonElement).prop('disabled', true).addClass('opacity-50 cursor-not-allowed');
    
    // 2. Only show loading in the list area for a refresh
    $('#positions-list-full').html(showLoading());

    initMainAcc();
    // // 3. Re-fetch data
    // renderPositionsPage(true).always(() => {
    //     // 4. Stop the spin animation and re-enable the button
    //     $icon.removeClass('animate-spin');
    //     $(buttonElement).prop('disabled', false).removeClass('opacity-50 cursor-not-allowed');
    // });
    $icon.removeClass('animate-spin');
    $(buttonElement).prop('disabled', false).removeClass('opacity-50 cursor-not-allowed');
}


// Pagination Navigation Functions
function goToPrevPage() {
    stPageCnt(-1);
    // if (currentPageIdx > 0) {
    //     currentPageIdx--;
    //     renderListOnly();
    //     window.scrollTo(0, 0);
    // }
}

function goToNextPage() {
    stPageCnt(1);
    // const totalPages = Math.ceil(allPositionsData.length / POSITIONS_PER_PAGE);
    // if (currentPageIdx < totalPages - 1) {
    //     currentPageIdx++;
    //     renderListOnly();
    //     window.scrollTo(0, 0);
    // }
}


function stPageCnt(cnt) {
    var changeF = false;
    // Get total pages from your list length
    var totalPages = paginatedList.length; 

    if (cnt == -1) {
        // PREVIOUS logic
        if (stockPagenum > 1) {
            stockPagenum--;            
            changeF = true;
        }
    } else if (cnt == 1) { // FIX: Changed '=' to '=='
        // NEXT logic
        if (stockPagenum < totalPages) {
            stockPagenum++;
            changeF = true;
        }
    }
    currentPageIdx = stockPagenum;
    // UPDATE BUTTON STATES (Enable/Disable)
    // This part "enables" or "disables" the buttons based on the new page number
    $('#prev-page-btn').prop('disabled', stockPagenum <= 1);
    $('#next-page-btn').prop('disabled', stockPagenum >= totalPages);

    if (changeF == true) {
        // Update the display data
        stockPageList = displayPage(stockPagenum);
        
        // Save state to Local Storage
        iisODSObj.STPageNum = stockPagenum;
        var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
        window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
        window.location.href = 'aiappositions.html';
        // // Trigger the refresh animation and data reload
        // const btn = document.getElementById('refresh-button');
        // if (btn) {
        //     refreshPositions(btn); 
        // }
    }
}
/**
 * Generates the entire HTML structure for the positions page, populated with data.
 */
function getFullPositionsHtml(data) {
    const totalInvested = data.positions.reduce((sum, p) => sum + (p.qty * p.avgPrice), 0);
    const investedAmount = formatCurrency(totalInvested);
    const currentAmount = formatCurrency(data.totalValue);
    
    const gainClass = data.totalGain >= 0 ? 'text-green-500' : 'text-red-500';
    const pnlTotalHtml = `
        <span class="${gainClass}">
            ${data.totalGain >= 0 ? '+' : ''}${formatCurrency(data.totalGain)}
        </span>
        <span class="text-xs text-gray-400 ml-1">
            (${data.gainPercent >= 0 ? '+' : ''}${data.gainPercent.toFixed(2)}%)
        </span>
    `;
    var positionsHtml = "";
    if (data.positions.length == 0) {
        positionsHtml = ` 
                <div class="bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-700 cursor-pointer hover:bg-gray-700 transition" >
                    <div class="flex justify-between items-center mb-0.5">
                        <span class="text-base font-semibold"> Please add stock to your portfolio.</span>
                    </div>
                </div>    
            `;
    }  else {
        positionsHtml = data.positions.map(p => {
            const itemGainClass = p.openPNL >= 0 ? 'text-green-500' : 'text-red-500';
            const investedValue = p.qty * p.avgPrice;
            return `
                <div class="bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-700 cursor-pointer hover:bg-gray-700 transition" onclick="openStockDetailScreen('${p.symbol}')">
                    <div class="flex justify-between items-center mb-0.5">
                        <span class="text-base font-semibold">${p.name}</span>
                        <span class="${itemGainClass} text-base font-bold">${p.openPNL >= 0 ? '+' : ''}${p.openPNL.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs">
                        <div class="text-gray-400">
                            Qty: ${p.qty} | Avg: ${p.avgPrice.toFixed(2)}
                        </div>
                        <div class="${itemGainClass} text-right">
                            (${p.pnlPercent >= 0 ? '+' : ''}${p.pnlPercent.toFixed(2)}%)
                        </div>
                    </div>
                    <div class="flex justify-between items-center text-xs mt-1 text-gray-500">
                        <span>Cl: ${p.curPrice.toFixed(2)} ${p.percentSt}</span>
                        <span>Mkt Value: ${p.marketValue.toFixed(0)}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    // Return the entire final layout
    return (`
        <div class="p-3 bg-gray-900 sticky top-0 z-10 rounded-b-lg shadow-lg">
            <div class="flex justify-between items-start"> 
                <h1 class="text-xl font-bold mb-4">My Positions</h1>
                <button id="refresh-button" onclick="refreshPositions(this)" class="text-2xl text-sky-400 hover:text-sky-300 transition" aria-label="Refresh Data">
                    <span class="refresh-icon">&#x21BB;</span>
                </button>
            </div>
            <div id="positions-header" class="grid grid-cols-2 gap-1.5 mb-2">
                <div class="bg-gray-800 p-1.5 rounded-md">
                    <p class="text-[10px] uppercase tracking-wider text-gray-400">Invested</p>
                    <p id="invested-amount" class="text-sm font-bold mt-0.5">${investedAmount}</p>
                </div>
                <div class="bg-gray-800 p-1.5 rounded-md">
                    <p class="text-[10px] uppercase tracking-wider text-gray-400">Current Paper Trading</p>
                    <p id="current-amount" class="text-sm font-bold mt-0.5">${currentAmount}</p>
                </div>
                <div class="col-span-2 bg-gray-800 p-1.5 rounded-md flex justify-between items-center">
                    <p class="text-[10px] uppercase tracking-wider text-gray-400">Profit & Loss (${trName})</p>
                    <p id="pnl-total" class="text-sm font-bold">${pnlTotalHtml}</p>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-2 mb-1 px-1">
                <button id="add-stock-btn" onclick="openAddStockScreen()" class="flex items-center justify-center space-x-1.5 py-1.5 px-2 bg-transparent border border-sky-500 text-sky-400 font-bold rounded-lg shadow-sm hover:bg-sky-500/10 active:scale-95 transition-all text-xs">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    <span>Add Stock</span>
                </button>

                <button id="remove-stock-btn" onclick="openRemoveStockScreen()" class="flex items-center justify-center space-x-1.5 py-1.5 px-2 bg-transparent border border-rose-500 text-rose-400 font-bold rounded-lg shadow-sm hover:bg-rose-500/10 active:scale-95 transition-all text-xs">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                    </svg>
                    <span>Remove Stock</span>
                </button> 
            </div>            
     

        </div>

        <div class="p-3">
            <div id="positions-list-full" class="space-y-2">
                ${positionsHtml}
                <div id="pagination-controls" class="flex justify-between items-center mt-6 px-2 hidden">
                    <button onclick="goToPrevPage()" id="prev-page-btn" class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50 transition">
                        Previous
                    </button>
                    
                    <span id="page-info" class="text-gray-400 text-sm font-medium">Page ${stockPagenum}</span>
                    
                    <button onclick="goToNextPage()" id="next-page-btn" class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50 transition">
                        Next
                    </button>
                </div>                
            </div>
        </div>

        <div class="p-3">
            <div id="positions-list-full" class="space-y-2"></div>

            <div id="pagination-controls" class="flex justify-between items-center mt-6 px-2 hidden">
                <button onclick="goToPrevPage()" id="prev-page-btn" class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50 transition">
                    Previous
                </button>

                <span id="page-info" class="text-gray-400 text-sm font-medium">Page ${stockPagenum}</span>
                
                <button onclick="goToNextPage()" id="next-page-btn" class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50 transition">
                    Next
                </button>
            </div>
        </div>        
    `);
}

// Global variables for pagination state
var currentPageIdx = 0;
var allPositionsData = [];
const POSITIONS_PER_PAGE = 8;

/**
 * Renders only the items for the current page into the list container.
 */
function renderListOnly() {
    currentPageIdx = 0;
    const startIndex = currentPageIdx * POSITIONS_PER_PAGE;
    const endIndex = startIndex + POSITIONS_PER_PAGE;
    const pageData = allPositionsData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allPositionsData.length / POSITIONS_PER_PAGE);


    var positionsHtml = "";
    if (pageData.length == 0) {
        positionsHtml = ` 
                <div class="bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-700 cursor-pointer hover:bg-gray-700 transition" >
                    <div class="flex justify-between items-center mb-0.5">
                        <span class="text-base font-semibold"> Please add stock to your portfolio.</span>
                    </div>
                </div>    
            `;
    }  else {
        positionsHtml = pageData.map(p => {
            const itemGainClass = p.openPNL >= 0 ? 'text-green-500' : 'text-red-500';
            const investedValue = p.qty * p.avgPrice;
            return `
                <div class="bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-700 cursor-pointer hover:bg-gray-700 transition mb-3" onclick="openStockDetailScreen('${p.symbol}')">
                    <div class="flex justify-between items-center mb-0.5">
                        <span class="text-base font-semibold">${p.name}</span>
                        <span class="${itemGainClass} text-base font-bold">${p.openPNL >= 0 ? '+' : ''}${p.openPNL.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs">
                        <div class="text-gray-400">Qty: ${p.qty} | Avg: ${p.avgPrice.toFixed(2)}</div>
                        <div class="${itemGainClass} text-right">(${p.pnlPercent >= 0 ? '+' : ''}${p.pnlPercent.toFixed(2)}%)</div>
                    </div>
                    <div class="flex justify-between items-center text-xs mt-1 text-gray-500">
                        <span>Cl: ${p.curPrice.toFixed(2)} ${p.percentSt}</span>
                        <span>Mkt Value: ${p.marketValue.toFixed(0)}</span>
                    </div>
                </div>`;
        }).join('');
    }
    // Inject items into the list container
    $('#positions-list-full').html(positionsHtml);

    // Update Pagination Controls
    // $('#page-info').text(`Page ${currentPageIdx + 1} of ${totalPages}`);
    // $('#prev-page-btn').prop('disabled', currentPageIdx === 0);
    // $('#next-page-btn').prop('disabled', currentPageIdx >= totalPages - 1);
    
    // Show/Hide controls based on data length
    // if (allPositionsData.length > POSITIONS_PER_PAGE) {
    //     $('#pagination-controls').removeClass('hidden');
    // } else {
    //     $('#pagination-controls').addClass('hidden');
    // }
 
    if ((STnameL.length > STnumDisp) || (custObj.id == 3)) {
        $('#pagination-controls').removeClass('hidden');           
    } else {
        $('#pagination-controls').addClass('hidden');
    } 
}
/**
 * The core rendering function integrated with pagination.
 */
function renderPositionsPage(isRefresh = false) {

    return backend.getPositions().done(data => {

        // Update global data for pagination
        allPositionsData = data.positions;
        // if (!isRefresh) currentPageIdx = 0; // Reset to page 1 on fresh load

        const finalHtml = getFullPositionsHtml(data);
        // isRefresh = true;
        if (!isRefresh) {
            // Initial Load: Replace spinner with layout
            $('#main-content')
                .html(finalHtml)
                .removeClass('flex items-center justify-center h-full')
                .addClass('full-content-loaded');                
        } else {
            // Refresh: Update Header Totals
            const totalInvested = data.positions.reduce((sum, p) => sum + (p.qty * p.avgPrice), 0);
            const totalGain = data.positions.reduce((sum, p) => sum + p.openPNL, 0);
            const gainPercent = (totalInvested > 0) ? (totalGain / totalInvested) * 100 : 0;
            const gainClass = totalGain >= 0 ? 'text-green-500' : 'text-red-500';
            
            $('#invested-amount').text(formatCurrency(totalInvested));
            $('#current-amount').text(formatCurrency(data.totalValue));
            $('#pnl-total').html(`
                <span class="${gainClass}">${totalGain >= 0 ? '+' : ''}${formatCurrency(totalGain)}</span>
                <span class="text-xs text-gray-400 ml-1">(${gainPercent >= 0 ? '+' : ''}${gainPercent.toFixed(2)}%)</span>
            `);
        }

        // Always call the list renderer to handle the current page
        renderListOnly();

    }
    ).fail(() => {
        if (isRefresh) {
            $('#positions-list-full').html('<p class="text-red-500 text-xs text-center p-3">Failed to refresh portfolio data.</p>');
        } else {
            $('#main-content')
                .html('<p class="text-red-500 text-center p-5">Failed to load portfolio data.</p>')
                .removeClass('flex items-center justify-center h-full')
                .addClass('full-content-loaded');
        }
    });
}


$(document).ready(function() {
    // Initial render of positions page, which shows the full-screen spinner until data resolves
    renderPositionsPage();

    // Set up event listeners for navigation bar
    $('.nav-item').on('click', function() {
        const page = $(this).data('page');
        if (page !== 'apappositions') {
            window.location.href = page + '.html';
        }
    });
    
    // --- Add Stock Listeners ---
    $('#validate-add-stock-btn').on('click', validateAddStock);    
    $('#validate-add-back-button').on('click', () => closeTradeScreen('validate-add-stock-screen'));    
    $('#confirm-add-stock-btn').on('click', confirmAddStock);
    $('#add-back-button').on('click', () => closeTradeScreen('add-stock-screen'));

    // --- Remove Stock Listeners ---
    $('#remove-symbol-select').on('change', updateRemovalDetails);
    $('#confirm-remove-stock-btn').on('click', confirmRemoveStock);
    $('#remove-back-button').on('click', () => closeTradeScreen('remove-stock-screen'));
  
});