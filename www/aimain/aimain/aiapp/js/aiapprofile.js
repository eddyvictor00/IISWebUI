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
// var GOBLE_Filter = ["SPY,DIA,FAS,QQQ,DGP"];

var GOBLE_Filter = ["SPY,DIA,QQQ,DGP,FAS,DRN,ERX,SPXL,TECL,WEBL,YINN"];
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
var commOLStr = iisODSObj.commOLStr;
var stockIdOLStr = iisODSObj.stockIdOLStr;


var tradingBotObjStr = "";
var tradingBotObj = "";
var msgObjStr = "";

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
                var servListSt = custObj.serL;
                servListSt = servListSt.replaceAll('#', '"');
                if (servListSt == ""){
                    servListSt ="[]"
                }       
                var tradingBotFlag = false;

                var servList = JSON.parse(servListSt);                 
                if (servList.length > 0) {
                    for (i = 0; i < servList.length; i++) {
                        var servObj = servList[i];

                        if (servObj.type == 7) { //TYPE_BILL_PRICE_NOENCYPION
                            // bill feature                            
                            var date = new Date(servObj.st).toLocaleDateString("en-US");

                            var name = servObj.cd; //date + " " + servObj.cd;
                            if ((name.indexOf("BillPriceF") != -1) ) {
                               var botSrvId = name.replace("BillPriceF", "");  
                               if (botSrvId == "50") {
                                    tradingBotFlag = true;
                                    
                               } else  if (botSrvId == "51") {
                                    tradingBotFlag = true;
                                    
                               } else  if (botSrvId == "52") {
                                    tradingBotFlag = true;                               }
                            }
                        }                        
                    }
                }
             
            }
        }
    }
} catch (err) {
}
          

isLoggedIn = true;
// renderProfilePage(); // Triggers loading state
showMessage('Login successful!', 'success');      

// UPDATED: Added billing data
var mockProfileData = {
    ready: false,
    updateReady: false,
    updateStatus: false,
    billingready: false,   
    tradingbotready: false, 
    firstName: '',
    lastName: '',
    email: '',
    memberSince: '',
    accountType: '',
    plan: '',
    payment: 0,
    credit: 0,
    disc: 0,
    portfolioValue: 0.0,
    totalReturn: 0.0,
    totalReturnPercent: 0.0,
    accountBalance: '',
    favoriteStocks: [], // ['AAPL', 'TSLA', 'MSFT', 'NVDA'],
    recentActivity: [
        // { type: 'BUY', symbol: 'AAPL', shares: 5, price: 182.50, date: '2023-10-25', time: '14:30' },
        // { type: 'SELL', symbol: 'TSLA', shares: 2, price: 175.20, date: '2023-10-24', time: '11:15' },
        // { type: 'BUY', symbol: 'MSFT', shares: 3, price: 405.80, date: '2023-10-23', time: '09:45' },
        // { type: 'DIVIDEND', symbol: 'JPM', amount: 12.50, date: '2023-10-20', time: '08:00' }
    ],
    // NEW: Mock billing data
    billing: {
        currentCharge: 0.00,
        currentPlan: 0.00,
        otherservice: 0.00,               
        credit: 0.00,        
        discount: 0.00,
        paymentDate: '',
        paymentAmount: 0.00, // Net charge paid
        currentBalance: 0.00, // Assuming full payment was made
        prevPaymentDate: '',
        prevPaymentAmount: 0.00,
        billID:0,
        custID:0,
        accID:0
    }
};

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

                    var pp = "Basic Plan - 2 stocks";
                    if (custObj.substatus == 0) {
                        pp = "Basic Plan - 2 stocks";
                    } else if (custObj.substatus == 10) {
                        pp = "Standard Plan - 8 stocks";
                    } else if (custObj.substatus == 20) {
                        pp = "Premium Plan - 20 stocks";
                    } else if (custObj.substatus == 40) {
                        pp = "Professional Plan - 40 stocks";
                    } else if (custObj.substatus == 80) {
                        pp = "Enterprise Plan - 80 stocks";
                    } else if (custObj.substatus == 160) {
                        pp = "Corporate Plan - 160 stocks";                        
                    } else if (custObj.substatus == 90) {
                        pp = "API Plan - 500 stocks";
                    } else if (custObj.substatus == 100) {
                        pp = "SRV Plan - 0 stocks";
                    }
                    Cur_Plan = pp;


                }
                if (accObjTmp.type === INT_MUTUAL_FUND_ACCOUNT) { //INT_MUTUAL_FUND_ACCOUNT = 120;
                    accfundObj = accObjTmp;
                    accfundId = accfundObj.id;

                    var fundacchtml = "<br><br>";
                    var accDataSt = accfundObj.data;
                    // var perfBalPercent = 0;
                    // var perfBal = 0;
                    // if (accDataSt != null) {
                    //     if (accDataSt != "") {
                    //         accDataSt = accDataSt.replaceAll('#', '"');
                    //         var accData = JSON.parse(accDataSt);
                    //         if ((accData.ref !== "") && (accData.ref !== undefined)) {
                    //             var accName = "acc-" + accfundObj.customerid + "-" + accData.ref;
                    //             if (accfundObj.id < 10) {
                    //                 accName = "sys-" + accfundObj.customerid + "-" + accData.ref;
                    //             }
                    //             fundacchtml += "Fund Name: " + accName;
                    //         }
                    //         var perfList = accData.perfL;
                    //         if (perfList != null) {                                
                    //             //name,cur%, 1mon%
                    //             perfBalPercent = perfList.curM_6;
                    //             perfBal = perfBalPercent * N_FUN_ST * TRADING_AMOUNT / 100;

                    //         }
                    //     }
                    // }
                    // var total = perfBal; //accObjTmp.investment + accObjTmp.balance;
                    // var totSt = Number(total.toFixed(2)).toLocaleString('en-US', {style: 'currency', currency: 'USD'});

                    // fundacchtml += '<br>Fund Performance: ' + totSt + '&nbsp;&nbsp&nbsp(' + perfBalPercent + '%)';
                    // $("#myfundaccid").append(fundacchtml);

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
                trM23St = '';

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

            myInitCommFunction();

            // initMarketFun();

            // initMarketStockFun();

        }
    });

}

// Start with an empty array
var recentComActivity = [];

// A function to create and add a new transaction to the array
function recordTransaction(id, type, symbol, msgType, msg, date, time) {
    const newActivity = {
        id: id,
        type: type,
        symbol: symbol,
        msgType: msgType,
        msg: msg,
        date: date,
        time: time
    };
    
    // Use the push() method to add the new object to the end of the array
    recentComActivity.push(newActivity);
}

function myInitCommFunction() {
    recentComActivity = [];
//    alert("init");
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + iisODSObj.accId + "/comm?length=6",
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

                var timestamp = commObj.updatedatel;
                const date = new Date(timestamp*1000);

                // Default local format
                // console.log(date.toLocaleString()); 

                // Custom format: "Sep 27, 2024, 10:30 AM"
                const formatted = date.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });         
                col1 = formatted;

                // col1 = commObj.updatedatedisplay;
                // type: 'BUY', symbol: 'AAPL', shares: 5, price: 182.50, date: '2023-10-25', time: '14:30' }

                col2 = commObj.name + ' Acc (' + custObj.id + ')';

                col3 = commObj.data;
                symbol = "";
                if (custObj.type <= 20) {
                    //id, type, symbol, msg, date, time
                    // if ((commObj.name == 'FUNDMSG') || (commObj.name == 'MESSAGE')) {
                    if ((commObj.name == 'MESSAGE')) {
                        const parts = commObj.data.split(' ');
                        symbol = parts[2]; // Index 2 is the 3rd part
                    }
                }
                 
                var buysell = 'BUY';
                if (col3.indexOf("Sig:buy") != -1) {
                    col3 = '<font style= color:green>' + col3 + '</font>';
                    buysell = 'BUY';
                    // Record a BUY
                    recordTransaction(i, 'BUY', symbol, commObj.name, commObj.data, col1, '');                    
                } else if (col3.indexOf("Sig:sell") != -1) {
                    col3 = '<font style= color:red>' + col3 + '</font>';
                    buysell = 'SELL';
                    // Record a SELL
                    recordTransaction(i, 'SELL', symbol, commObj.name, commObj.data, col1, '');                            
                } else {
                    recordTransaction(i, '', symbol, commObj.name, commObj.data, col1, '');   
                }

            }

            initmockProfileData();
            if (recentComActivity.length > 0) {
                mockProfileData.recentActivity = (recentComActivity);
                renderProfilePage(); // Triggers loading state
            }

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
                        stockPageList = trFilter[0];
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
        initmockProfileData();
        // updateCurStock(stockPageList);
    }
}



function initmockProfileData() {
    mockProfileData.firstName = custObj.firstname
    mockProfileData.lastName = custObj.lastname
    mockProfileData.email = custObj.email
    mockProfileData.memberSince = custObj.startdate
    mockProfileData.accountType = accObj.accountname
    if (stockPageList.length > 0) {
        mockProfileData.favoriteStocks = stockPageList.split(",");
    }
    
    var balanceSt = Number(custObj.balance).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    var paymentSt = ""
    if (custObj.payment != 0) {
        var curPaySt = Number(custObj.payment).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
        paymentSt = ' Payment due: <font style= color:red>' + curPaySt + '</font>';
    }    
    mockProfileData.accountBalance = balanceSt
    mockProfileData.payment = custObj.payment
    mockProfileData.credit = custObj.cr
    mockProfileData.plan = Cur_Plan

    mockProfileData.ready = true;
}

const backend = {
    getProfileData: () => {
        const deferred = $.Deferred();

        let pollIntervalID = null;
        let checks = 0; // Counter to prevent infinite loops (optional, but recommended)
        const MAX_CHECKS = 80; // Max 20 seconds (200 * 100ms) before giving up
        // Start the polling interval
        pollIntervalID = setInterval(() => {
            checks++;

            // 1. CHECK FOR READY FLAG
            if (mockProfileData.ready) {
                // Stop the loop
                clearInterval(pollIntervalID);                
                // Resolve the promise immediately
                deferred.resolve(mockProfileData);
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
        //     // Resolve with the current state of mockProfileData
        //     deferred.resolve(mockProfileData);
        // }, MOCK_API_DELAY);
        // return deferred.promise();
    },
    // Mock function to update profile data
    updateProfileData: (updates) => {
        const deferred = $.Deferred();
        mockProfileData.updateReady = false;
        mockProfileData.updateStatus = false;
        var newPassword = "";
         if (updates.passwordChanged){
            newPassword = updates.newPassword;
         }

        profileCclickFun(updates.firstName, updates.lastName, updates.updatedTrNNlinkid, newPassword);

        let pollIntervalID = null;
        let checks = 0; // Counter to prevent infinite loops (optional, but recommended)
        const MAX_CHECKS = 80; // Max 20 seconds (200 * 100ms) before giving up
        // Start the polling interval
        pollIntervalID = setInterval(() => {
            checks++;

            // 1. CHECK FOR READY FLAG
            if (mockProfileData.updateReady) {
                if (mockProfileData.updateStatus == false ){
                    clearInterval(pollIntervalID);               
                    // Reject the promise if the data never became ready
                    deferred.reject({ error: "Profile updated failed!" });
                    return;                    
                }
                // Update global mock data properties
                mockProfileData.firstName = updates.firstName;
                mockProfileData.lastName = updates.lastName;
                
                if (updates.passwordChanged) {
                    console.log("Password updated.");
                }
                deferred.resolve({ success: true, message: 'Profile updated successfully!' });                
                // Stop the loop
                clearInterval(pollIntervalID);                
                // Resolve the promise immediately
                deferred.resolve(mockProfileData);
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
        // setTimeout(() => {
        //     // Update global mock data properties
        //     mockProfileData.firstName = updates.firstName;
        //     mockProfileData.lastName = updates.lastName;
            
        //     if (updates.passwordChanged) {
        //         console.log("Password updated.");
        //     }
        //     deferred.resolve({ success: true, message: 'Profile updated successfully!' });
        // }, MOCK_API_DELAY);
        return deferred.promise();
    }
};


function profileCclickFun(txtfirstname, txtlastname, updatedTrNNlinkid, newpassword) {

    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            var msgObjStr = "This operation is not supported on demo accounts.";
            mockProfileData.updateReady = true;
            mockProfileData.updateStatus = false;            
            return;
        }
    }    
    var updateURL = iisurl + "/cust/" + custObj.username + "/acc/" + accId 
        + "/custupdate?firstName=" + txtfirstname + "&lastName=" + txtlastname+ "&opt=" + updatedTrNNlinkid;
    if (newpassword.length > 0) {
        updateURL = updateURL+"&pass=" + newpassword
    }
    $.ajax({
        url: updateURL ,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {

        var webMsg = result.webMsg;

        var resultID = webMsg.resultID;
        var msgObjStr = '';
        // 0 - general fail, 1 - successful, 2 - email fail 3 - password
        if (resultID === 0) {
            msgObjStr = "Update failed. Please try again.";
        } else if (resultID === 1) {

        } else if (resultID === 10) {
            msgObjStr = "Update failed. Promotoion code not allowed.";
        } else if (resultID === 12) {
            msgObjStr = "Update failed. Promotoion code not allowed.";
        }


        if (resultID !== 1) {
            msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
            $("#profileCBodyId").html(msgObjStr);
            mockProfileData.updateReady = true;
            mockProfileData.updateStatus = false;
            return;
        }

        custObj = result.custObj;
        if (custObj != null) {

//             update customer
            var custObjStr = JSON.stringify(custObj, null, '\t');
            var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
            window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));
        }
        mockProfileData.updateReady = true;
        mockProfileData.updateStatus = true;
    }
}
// --- Utility Functions ---

function showMessage(message, type = 'error') {
    const bgColor = type === 'error' ? 'bg-red-600' : 'bg-green-600';
    const $messageBox = $(`
        <div id="custom-message" class="fixed top-2 right-2 ${bgColor} text-white p-3 rounded-lg shadow-xl z-50 transition-transform duration-300 transform translate-x-full">
            ${message}
        </div>
    `);
    
    // Remove any existing messages
    $('#custom-message').remove();
    $('body').append($messageBox);
    
    // Animate in
    setTimeout(() => {
        $messageBox.removeClass('translate-x-full');
    }, 10);

    // Animate out and remove
    setTimeout(() => {
        $messageBox.addClass('translate-x-full');
        $messageBox.on('transitionend', () => $messageBox.remove());
    }, 3000);
}

function showLoading() {
    // Spinner size reduced from h-8 w-8 to h-5 w-5 for a smaller visual footprint
    return (`
        <div class="flex flex-col items-center justify-center h-full min-h-[100px] p-2">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-400 mb-2"></div>
            <p class="text-gray-400 text-sm">Waiting for the data from the backend...</p>
        </div>
    `);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(dateString) {
    if (dateString.length == 0) {
        return "";
    }
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);

}

function formatDateTime(dateString) {
    if (!dateString || dateString.length == 0) {
        return "";
    }
    
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true // Set to false for 24-hour format
    };

    return new Date(dateString).toLocaleString('en-US', options);
}
// --- Auth Functions ---

function handleLogin() {
    const email = $('#login-email').val();
    const password = $('#login-password').val();

    if (!email || !password) {
        showMessage('Please enter both email and password.');
        return;
    }
    txemail = email;
    txtpassword = password;
    $.ajax({
        url: iisurl + "/cust/login?email=" + txemail + "&pass=" + txtpassword,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        error: function () {
            alert('Network failure. Please try again later.');
            // window.location.href = "aiiindex.html";
        },
        success: handleResult
    }); // use promises

    function handleResult(result) {
        var msgObjStr = '';
        if ((result === null) || (result === "")) {
            window.location.href = "aiiindex.html";
            isLoggedIn = false;
            renderProfilePage(); // Triggers loading state
            showMessage('Login failed!', 'error');            
            return;e
        }

        if (result.webMsg.resultID === 100) {
            msgObjStr = 'System is in maintenance. Please try again later. '
        }
        var version = result.webMsg.ver * 1;
        if (parseFloat(version) > (iis_ver)) {
            msgObjStr = 'Please upgrade to newer version v' + result.webMsg.ver;
        }

        if (msgObjStr.length > 0) {
            msgObjStr = '<p  style="color:red;">' + msgObjStr + '</p>';
            $('#tag-logging').fadeIn().html(msgObjStr);
            return;
        }
        var custObj = result.custObj;

        var custObjStr = JSON.stringify(custObj, null, '\t');

        window.localStorage.setItem(iisODSObjSession, "");

        const iisDataObj = {
            accObjListStr: '',
            stockObjListStr: '',
            stockFundObjListStr: '',
            filterList:''
        }
        var iisDataObjStr = JSON.stringify(iisDataObj, null, '\t');

        var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
        window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));

        var webMsg = result.webMsg;
        if (webMsg.resultID == 0) {
            if (custObj != null) {
                var iisMsgSession = "iisMsgSession";
                window.localStorage.setItem(iisMsgSession, "");

                
                isLoggedIn = true;
                renderProfilePage(); // Triggers loading state
                showMessage('Login successful!', 'success');      
                return;          

            }
        }
        msgObjStr = "";
        msgObjStr = "Incorrect user email/password. Please try again.";
        if (webMsg.resultID == 2) {
            msgObjStr = "Account in processing. Please try again later. ";
        }
        if (webMsg.resultID == 1) {
            msgObjStr = "Account is disabled. ";
        }

        isLoggedIn = false;
        renderProfilePage(); // Triggers loading state
        showMessage(msgObjStr, 'error');            
        return;
        // if (msgObjStr.length > 0) {
        //     msgObjStr = '<p  style="color:red;">' + msgObjStr + '</p>';
        //     $('#tag-logging').fadeIn().html(msgObjStr);
        //     return;
        // }
    }
    // // Mock successful login
    // isLoggedIn = true;
    // renderProfilePage(); // Triggers loading state
    // showMessage('Login successful!', 'success');
}

function handleRegister() {
    const email = $('#login-email').val();
    const password = $('#login-password').val();

    if (!email || !password) {
        showMessage('Please fill in credentials to register.', 'error');
        return;
    }

    // Mock registration process
    isLoggedIn = true;
    renderProfilePage();
    showMessage('Mock Registration successful! Logging you in.', 'success');
}

function handleLogout() {
    var iisWebSession = "iisWebSession";
    window.localStorage.setItem(iisWebSession, " ");

    var iisMsgSession = "iisMsgSession";
    window.localStorage.setItem(iisMsgSession, "");

    var iisWebInitSession = "iisWebInitSession";
    window.localStorage.setItem(iisWebInitSession, "");    

    showMessage('Logged out successfully.', 'success');    
    isLoggedIn = false;
    window.location.href = "aiiend.html";
    // window.location.href = "aiaplogin.html";
    return;    
    // renderProfilePage();
    // showMessage('Logged out successfully.', 'success');
}

function handleConsentChange() {
    const isChecked = $('#disclaimer-check').is(':checked');
    const $loginButton = $('#login-button');
    const $registerButton = $('#register-button');

    if (isChecked) {
        $loginButton.removeClass('btn-disabled');
        $registerButton.removeClass('btn-disabled');
    } else {
        $loginButton.addClass('btn-disabled');
        $registerButton.addClass('btn-disabled');
    }
}

function attachLoginEvents() {
    // Attach real-time consent change listener
    $('#disclaimer-check').off('change').on('change', handleConsentChange);
    
    // Initial state check 
    handleConsentChange();

    // Attach Login/Register handlers
    $('#login-button').off('click').on('click', handleLogin);

    $('#register-button').off('click').on('click', handleRegister);
}

// --- Edit Profile Logic ---

function handleEditProfile() {
    $('#fixed-header').hide(); // Hide the header completely    
    // Renders the edit form
    $('#main-content').html(renderEditProfileForm());
    attachEditProfileEvents();
}

function handleCancelEdit() {
    // Re-render the main profile page
    renderProfilePage();
}

function attachEditProfileEvents() {
    $('#edit-profile-form').off('submit').on('submit', function(e) {
        e.preventDefault();
        handleSaveProfile();
    });
    $('#cancel-edit-button').off('click').on('click', handleCancelEdit);
    $('#cancel-edit-button-header').off('click').on('click', handleCancelEdit); // Also attach to header back button
}

function handleSaveProfile() {
    const firstName = $('#edit-first-name').val().trim();
    const lastName = $('#edit-last-name').val().trim();
    const newPassword = $('#edit-new-password').val();
    const confirmPassword = $('#edit-confirm-password').val();
    const updatedTrNNlinkid = parseInt($('#edit-trNNlinkid').val());

    if (!firstName || !lastName) {
        showMessage('First Name and Last Name cannot be empty.', 'error');
        return;
    }

    if (newPassword && newPassword.length < 6) {
        showMessage('New Password must be at least 6 characters.', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage('New Password and Confirm Password do not match.', 'error');
        return;
    }

    // Prepare updates payload
    const updates = { firstName, lastName, newPassword, updatedTrNNlinkid, passwordChanged: false };
    if (newPassword) {
        updates.passwordChanged = true; 
    }

    // Visually show loading while waiting for mock API response
    $('#edit-profile-form-container').html(showLoading()); 

    backend.updateProfileData(updates).done((response) => {
        showMessage(response.message || 'Profile updated!', 'success');
        renderProfilePage(); // Re-render the updated profile
    }).fail(() => {
        showMessage('Failed to update profile.', 'error');
        renderProfilePage(); // Return to profile page on error
    });
}



function myInitBillFunction() {
    // billing
//    console.log("myInitBillFunction");
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/billing?length=2",
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function () {
            window.location.href = "aiiend.html";
            // window.location.href = "aiaplogin.html";
        },
        success: function (resultBillingList) {
            var billObjListStr = JSON.stringify(resultBillingList, null, '\t');

            var billObjList = JSON.parse(billObjListStr);


            $("#mybillid").html("No billing info"); //clear the field

            var htmlName = '';
            htmlName += '<div class="accordion" id="accordionExample">';

            for (i = 0; i < billObjList.length; i++) {
                var billObj = billObjList[i];
                var billId = billObj.id;
                var idN = "col" + i;

                var billN = "";

                billN += 'Billing id: (' + billId + ') Account payment due date: ' + billObj.updatedatedisplay;

                var statusSt = 'NA';
                if (billObj.status === 2) {
                    statusSt = '<font style= color:red>Amount due</font>';
                }
                if (billObj.status === 5) {
                    statusSt = 'Amount paid';
                }

                var curPaySt = Number(billObj.payment).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                billN += '<br>Status:' + statusSt + ' invoice: ' + curPaySt;
                

                var billD = "";
                var dataSt = billObj.data;
                var DiscSt = 0;
                try {
                    if (dataSt != null) {
                        if (dataSt !== "") {
                            dataSt = dataSt.replaceAll('#', '"');
                            var detailObj = JSON.parse(dataSt);
                            if (detailObj != null) {
//                                billD += 'Plan: ' + detailObj.feat;
                                var currencySt = Number(detailObj.curPaym).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                                billD += 'Current Plan: ' + detailObj.feat + " " + currencySt;

                                currencySt = Number(detailObj.prevOwn).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                                billD += '<br>Previous outstanding: ' + currencySt;
                                currencySt = Number(detailObj.service).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                                var currencyCSt = Number(detailObj.credit).toLocaleString('en-US', {style: 'currency', currency: 'USD'});

                                var currencyDSt = "";
                                if (detailObj.disc > 0) {
                                    DiscSt = Number(detailObj.disc).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                                    currencyDSt = ' &nbsp;&nbsp;&nbsp;discount:' + DiscSt;
                                }
                                billD += '<br>Other service: ' + currencySt + ' &nbsp;&nbsp;&nbsp;credit: ' + currencyCSt + currencyDSt;
                                if (i==0){
                                    mockProfileData.billing.billID = billObj.id;
                                    mockProfileData.billing.custID = billObj.customerid;
                                    mockProfileData.billing.accID = billObj.accountid;
                                    mockProfileData.billing.currentCharge = billObj.payment;
                                    mockProfileData.billing.currentPlan = detailObj.curPaym;
                                    mockProfileData.billing.otherservice = detailObj.service;
                                    mockProfileData.billing.credit = detailObj.credit;       
                                    mockProfileData.billing.discount = detailObj.disc;
                                    mockProfileData.billing.currentBalance = custObj.balance;                                 
                                    mockProfileData.billing.paymentDate = billObj.updatedatedisplay;
                                    mockProfileData.billing.paymentAmount = custObj.payment; // Net charge paid
                                    mockProfileData.billing.prevPaymentDate = "";
                                    mockProfileData.billing.prevPaymentAmount = 0;                                     
                                } else if (i==1){
                                    mockProfileData.billing.prevPaymentDate = billObj.updatedatedisplay;
                                    mockProfileData.billing.prevPaymentAmount = billObj.payment; 

                                }
                            }
                        }
                    }
                } catch (err) {
                }
                billD = '<div><small>' + billD + '</small>' + '</div>';
                billN = '<div><h6>' + billN + '</h6>' + billD + '</div>';


                var detail = '';
                try {
                    var dataSt = billObj.data;
                    if (dataSt != null) {
                        if (dataSt !== "") {
                            dataSt = dataSt.replaceAll('#', '"');
                            var detailObj = JSON.parse(dataSt);
                            if (detailObj != null) {
                                detail += 'Detail Billing:';
                                var detailL = detailObj.tranL;

                                for (j = 0; j < detailL.length; j++) {
                                    var detailSt = detailL[j];

                                    var detailList = detailSt.split('|');
                                    var dateList = detailList[0].split(" ");
                                    var datailDisp = dateList[0];
                                    for (k = 1; k < detailList.length; k++) {
                                        datailDisp += ' : ' + detailList[k];
                                    }
//                                    var datailDisp = detailSt.replaceAll('|', ' : ');


                                    detail += '<br>' + datailDisp;
                                }
                            }
                        }
                    }
                } catch (err) {
                }

                // detail = '<div><small>' + detail + '</small>' + '</div>';
                // var expandedF = "false";
                // var showF = "";
                // var collapsedF = "collapsed";

                // if (i == 0) {
                //     expandedF = "true";
                //     var showF = "show";
                //     collapsedF = "";
                // }
                // htmlName += '<div class="accordion-item">';
                // htmlName += '<h2 class="accordion-header" id="heading' + idN + '">';
                // htmlName += '<button class="accordion-button ' + collapsedF + '" type="button" data-bs-toggle="collapse" ';
                // htmlName += ' data-bs-target="#collapse' + idN + '" aria-expanded="' + expandedF + '"';
                // htmlName += ' aria-controls="collapse' + idN + '">';
                // htmlName += billN;
                // htmlName += '</button>';
                // htmlName += '</h2>';
                // htmlName += '<div id="collapse' + idN + '" class="accordion-collapse collapse ' + showF + '"';
                // htmlName += ' aria-labelledby="heading' + idN + '" data-bs-parent="#accordionExample">';
                // htmlName += '<div class="accordion-body">';
                // htmlName += detail;
                // htmlName += '</div>';
                // htmlName += '</div>';
                // htmlName += '</div>';

                
            }
            
            // htmlName += '</div>';
            // $("#mybillid").html(htmlName);
            mockProfileData.billingready = true;
        }
    });

}


function handleClassicView() {
    window.location.href = "aiiaccount.html";
}

// --- Account Statements Logic (NEW) ---

function handleAccountStatements() {
    myInitBillFunction();
    $('#fixed-header').hide(); // Hide the header completely    
    $('#main-content').html(showLoading()); 
    
        let pollIntervalID = null;
        let checks = 0; // Counter to prevent infinite loops (optional, but recommended)
        const MAX_CHECKS = 80; // Max 20 seconds (200 * 100ms) before giving up
        // Start the polling interval
        pollIntervalID = setInterval(() => {
            checks++;

            // 1. CHECK FOR READY FLAG
            if (mockProfileData.billingready) {
                // Stop the loop
                clearInterval(pollIntervalID);                
                // Resolve the promise immediately

                // Re-use getProfileData to fetch the mock billing object
                backend.getProfileData().done(data => {
                    // 1. Render and insert the updated template string into your view container
                    const statementHtml = renderAccountStatementsHtml(data);
                    $('#main-content').html(statementHtml); // (or whatever your main view container ID is)

                    // 2. Safely initialize the SDK if the condition was met and container exists
                    // if ($('#paypal-button-container').length > 0) {                        
                    //     initPayPalSmartButtons(); //data.billing.currentBalance);
                    // }

                    // 3. Keep your existing navigation handlers
                    $('#back-to-profile').off('click').on('click', function() {
                        renderProfilePage(); // returns back to profile view
                    });

                }).fail(() => {
                    showMessage('Failed to load billing data.', 'error');
                    renderProfilePage(); // Go back to profile on failure
                });                
                return; 
            }

            // 2. CHECK FOR MAX TIMEOUT (Fallback)
            if (checks >= MAX_CHECKS) {
                 // Stop the loop
                clearInterval(pollIntervalID);               
                showMessage('Failed to load billing data.', 'error');
                renderProfilePage(); // Go back to profile on failure
                return;
            }
        }, MOCK_API_DELAY);

}


// Renders the billing statement view

function renderAccountStatementsHtml(data) {
    const { currentCharge, currentPlan, otherservice, credit, discount, paymentDate, paymentAmount, currentBalance } = data.billing;
    const netCharge = currentCharge - paymentAmount;

    // Condition requested: Amount Paid Invoice (currentCharge) > Current Balance (currentBalance)
    // and ensuring there actually is a positive balance due to charge via PayPal.
    const showPayPalButton = (paymentAmount > currentBalance) ;
// Dynamic Parameter Parsing mapped from your Java structure logic
    const uniqueStamp = String(new Date().getTime()).slice(-6);
    
    // Fallback logic to grab the active billing ID and customer ID values dynamically from the data payload context
    const rawBillId = mockProfileData.billing.billID;
    const rawCustId = custObj.username;
    const rawAccId = mockProfileData.billing.accID;
    const billId = "BILL-" + rawBillId;
    const custId = rawCustId; // JavaScript equivalent placeholder for compressed session string/integer
    
    // Build target hosted payments address string cleanly
    const paypalSandboxUrl = iisurl + "/aimain/aiappayment.html"
                           + "?invoice_id=" + (billId)
                           + "&custom_id=" + (custId)
                           + "&timestamp=" + uniqueStamp;
// BACKEND API PDF URL ENDPOINT LINK
    const downloadPdfUrl = iisurl + "/cust/" + rawCustId + "/acc/" + rawAccId + "/billing/pdf?length=1";

    return `
        <div class="p-4 sm:p-6 lg:p-8">
            <div class="flex items-center mb-6 border-b border-gray-700 pb-3">
                <button id="back-to-profile" class="text-sky-400 mr-4 text-3xl font-light leading-none hover:text-sky-300 transition-colors">&larr;</button>
                <h2 class="text-xl font-bold text-white">Account Statements</h2>
            </div>
            
            <div class="bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
                <h3 class="text-xl font-semibold text-gray-300 mb-4">
                    <span class="mr-2">💳</span> Billing Overview (${paymentDate && paymentDate !== '' ? `${formatDate(paymentDate)}` : ''})
                </h3>
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-700 pb-4 gap-4">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-300">Statement Summary</h3>
                        <p class="text-xs text-gray-500">Invoice ID: ${rawBillId ? billId : 'N/A'}</p>
                    </div>
                    
                    <a href="${downloadPdfUrl}" target="_blank" class="flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-xl shadow transition duration-200 text-sm gap-2">
                        <span>📥</span> Download PDF Invoice
                    </a>
                </div>
                <div class="space-y-3 text-sm">
                    <div class="flex justify-between py-2 border-b border-gray-700">
                        <p class="text-xl font-bold text-sky-300">Invoice Amount</p>
                        <p class="text-xl font-bold text-gray-300" >
                            ${formatCurrency(currentCharge)}
                        </p>  
                    </div>

                    <div class="flex justify-between py-2 border-b border-gray-700">
                        <p class="text-gray-400">Current Plan Rate<br>(${data.plan})</p>
                        <p class="font-semibold text-white">${formatCurrency(currentPlan)}</p>
                    </div>

                    <div class="flex justify-between py-2 border-b border-gray-700">
                        <p class="text-gray-400">Other Services</p>
                        <p class="font-semibold text-white">${formatCurrency(otherservice)}</p>
                    </div>                    
                    <div class="flex justify-between py-2 border-b border-gray-700">
                        <p class="text-gray-400">System Credit</p>
                        <p class="font-semibold text-green-500">(${formatCurrency(credit)})</p>
                    </div>                    
                    <div class="flex justify-between py-2 border-b border-gray-700">
                        <p class="text-gray-400">Applied Discount</p>
                        <p class="font-semibold text-green-500">(${formatCurrency(discount)})</p>
                    </div>

                    <div class="flex justify-between py-2 border-b border-gray-600 font-bold">
                        <p class="text-gray-300">Total Amount Paid</p>
                        <p class="text-white">${formatCurrency(netCharge)}</p>
                    </div>
                    
                    <div class="flex justify-between pt-2 pb-1">
                        <p class="text-gray-400">Last Payment Made (${formatDate(data.billing.prevPaymentDate)})</p>
                        <p class="font-semibold text-green-500">(${formatCurrency(data.billing.prevPaymentAmount)})</p>
                    </div>
                </div>

                <hr class="border-gray-700">

                <div class="flex justify-between pt-2">
                    <p class="text-xl font-bold text-sky-300">Current Balance</p>
                    <p class="text-xl font-bold ${currentBalance >= 0 ? 'text-green-300' : 'text-red-300'}">
                        ${formatCurrency(currentBalance)}
                    </p>
                </div>

                ${showPayPalButton ? `
                    <div class="pt-4 border-t border-gray-700 mt-4">
                        <p class="text-xs text-gray-400 mb-3 uppercase tracking-wider text-center">Secure Payment via PayPal</p>
                        <a href="${paypalSandboxUrl}" 
                            class="w-full max-w-xs mx-auto block text-center bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 px-4 rounded-xl shadow transition duration-200 uppercase tracking-wide text-sm">                        Pay via PayPal Link
                        </a>
                    </div>
                ` : ''}

            </div>

            <p class="text-xs text-gray-500 mt-6 text-center">
                This statement reflects your current month's charges and payment activity as of today.
            </p>
        </div>
    `;
}
// --- Page Rendering Functions ---

function renderLoginPage() {
    // Start with both buttons disabled by adding the btn-disabled class
    const loginButtonClasses = "w-full py-3 text-lg font-semibold bg-sky-600 hover:bg-sky-700 rounded-xl transition duration-200 shadow-lg shadow-sky-900/50 btn-disabled";
    const registerButtonClasses = "w-full py-3 text-lg font-semibold bg-gray-800 hover:bg-gray-700 rounded-xl transition duration-200 border border-gray-700 btn-disabled";

    return `
        <div class="flex flex-col items-center min-h-full text-center p-6">
            <div class="mb-8 mt-16">
                <div class="text-3xl font-bold text-white tracking-widest flex items-center justify-center">
                    <span class="w-2 h-2 rounded-full bg-sky-400 mr-1 block animate-pulse"></span>
                    <span class="w-2 h-2 rounded-full bg-sky-400 mr-2 block animate-pulse animation-delay-300"></span>
                    Stocks
                </div>
                <h1 class="text-5xl font-extrabold text-sky-400 my-2">AIIWeb</h1>
                <p class="text-gray-400 text-sm">On the go investing.</p>
                <div class="w-12 h-1 bg-sky-400 mx-auto mt-3 rounded-full"></div>
            </div>

            <div class="w-full max-w-sm space-y-4 mb-20">
                <input type="email" id="login-email" placeholder="Email Address" 
                    class="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500 text-white transition duration-200">
                <input type="password" id="login-password" placeholder="Password" 
                    class="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500 text-white transition duration-200">
                
                <div class="text-left pt-2">
                    <label class="inline-flex items-start cursor-pointer">
                        <!-- Checkbox is now h-5 w-5 for better touch target size -->
                        <input type="checkbox" id="disclaimer-check" class="form-checkbox h-5 w-5 mt-0.5 text-sky-500 bg-gray-800 border-gray-600 rounded-sm">
                        <p class="text-xs text-gray-400 ml-3 leading-snug">
                            I acknowledge that this application provides <strong style="color: lightcoral;">simulation and informational content</strong> only. It is <strong style="color: lightcoral;">not financial advice</strong>, and I understand that <strong style="color: lightcoral;">investing involves risk</strong>, including the possible loss of principal. I will consult a qualified financial professional before making any actual investment decisions.
                        </p>
                    </label>
                </div>

                <button id="login-button" class="${loginButtonClasses}">
                    Log In
                </button>
                <button id="register-button" class="${registerButtonClasses}">
                    New Register
                </button>

                <p class="text-sm text-gray-500 pt-3">
                    Forgot Password? (Mock)
                </p>
            </div>
        </div>
    `;
}

// Form for editing profile details
function renderEditProfileForm() {

    const { firstName, lastName, email } = mockProfileData;
    var linkId = 0;

    var trNNlinkid = "";

    if (debug01 == true){
        trNNlinkid = `
        <hr class="border-gray-700">
        <p class="text-sm text-gray-500">Select the AI model for automated trading signals for all stocks.</p>

        <div class="space-y-4">
            <div class="flex flex-col space-y-1">
                <label for="edit-trNNlinkid" class="text-sm font-medium text-gray-400">
                TR_ACC Link ID Setting</label>
                <div class="relative">
                    <select id="edit-trNNlinkid" 
                        class="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg 
                            focus:ring-blue-500 focus:border-blue-500 block p-2.5 
                            appearance-none cursor-pointer hover:bg-gray-750 transition-colors">
                        <option value="0" ${linkId == 0 ? 'selected' : ''}>No Change</option>
                        <option value="33" ${linkId == 33 ? 'selected' : ''}>Auto AI Trading TR_NN33 (Default)</option>
                        <option value="91" ${linkId == 91 ? 'selected' : ''}>Auto AI Trading TR_NN91</option>
                        <option value="92" ${linkId == 92 ? 'selected' : ''}>Auto AI Trading TR_NN92</option>
                        <option value="93" ${linkId == 93 ? 'selected' : ''}>Auto AI Trading TR_NN93</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
                <p class="text-xs text-gray-500"></p>
            </div>        
        </div>
        
        `;

     }

    return `
        <div id="edit-profile-form-container" class="p-4 sm:p-6 lg:p-8">
            <div class="flex items-center mb-6 border-b border-gray-700 pb-3">
                <!-- Back button using the left arrow symbol -->
                <button id="cancel-edit-button-header" class="text-sky-400 mr-4 text-3xl font-light leading-none hover:text-sky-300 transition-colors">&larr;</button>
                <h2 class="text-xl font-bold text-white">Edit Profile</h2>
            </div>
            <form id="edit-profile-form" class="space-y-6">
                
                <!-- First Name -->
                <div>
                    <label for="edit-first-name" class="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                    <input type="text" id="edit-first-name" value="${firstName}" required
                        class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-sky-500 focus:border-sky-500 text-white transition duration-200">
                </div>

                <!-- Last Name -->
                <div>
                    <label for="edit-last-name" class="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                    <input type="text" id="edit-last-name" value="${lastName}" required
                        class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-sky-500 focus:border-sky-500 text-white transition duration-200">
                </div>
                
                <!-- Email (Read-only for context) -->
                <div class="opacity-70">
                    <label for="edit-email" class="block text-sm font-medium text-gray-400 mb-1">Email (Cannot be changed)</label>
                    <input type="email" id="edit-email" value="${email}" disabled
                        class="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-500">
                </div>

                <hr class="border-gray-700">

                <p class="text-sm text-gray-500">Only fill in the fields below if you want to change your password (min 6 characters).</p>

                <!-- New Password -->
                <div>
                    <label for="edit-new-password" class="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                    <input type="password" id="edit-new-password" placeholder="Leave blank to keep current password"
                        class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-sky-500 focus:border-sky-500 text-white transition duration-200">
                </div>

                <!-- Confirm Password -->
                <div>
                    <label for="edit-confirm-password" class="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                    <input type="password" id="edit-confirm-password" placeholder="Retype new password"
                        class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-sky-500 focus:border-sky-500 text-white transition duration-200">
                </div>

                ${trNNlinkid}
                
                <div class="flex space-x-4 pt-4">
                    <button type="button" id="cancel-edit-button" class="w-full py-3 text-lg font-semibold bg-gray-700 hover:bg-gray-600 rounded-xl transition duration-200">
                        Cancel
                    </button>
                    <button type="submit" class="w-full py-3 text-lg font-semibold bg-sky-600 hover:bg-sky-700 rounded-xl transition duration-200 shadow-lg shadow-green-900/50">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    `;
}

function generateProfileHtml(data) {

    $('#fixed-header').show(); // Show the header again

    const fullName = `${data.firstName} ${data.lastName}`; // Use new fields
    const initials = data.firstName.charAt(0) + data.lastName.charAt(0); // Use new fields
    
    const favoritesHtml = data.favoriteStocks.map(stock => `
        <div class="bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-600 transition">
            <span class="text-sm font-semibold">${stock}</span>
        </div>
    `).join('');

    const activityHtml = data.recentActivity.map(activity => {
        let activityText = '';
        let activityClass = 'text-gray-400';
        if (activity.type === 'BUY') {
            activityText = `${activity.msg}`;
            activityClass = 'text-green-500';
        } else if (activity.type === 'SELL') {
            activityText = `${activity.msg}`;
            activityClass = 'text-red-500';
        } else {
            activityText = `${activity.msg}`;
            activityClass = 'text-sky-400';
        }        
        // const parts = activity.date.split('-');
        // const localDate = new Date(parts[0], parts[1] - 1, parts[2]);
        var clickMode = "";
        if (activity.symbol.length > 0){
            clickMode ="&gt;";
        }
        return `        
            <div class="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                <div class="activity-item cursor-pointer" data-id="${activity.id}">
                    <p class="text-sm ${activityClass}">${activityText}</p>
                    <p class="text-xs text-gray-500">${activity.date} </p>
                </div>
                <span class="text-gray-400 text-lg">${clickMode}</span>
            </div>

        `;
    }).join('');

    var debugHtmlSt = "";
    if ((debug01 == true) || (accfundId > 0) || (custObj.type > 60) || (custObj.substatus >= 20)) {
        debugHtmlSt = `    
                <div class="pt-4 border-t border-gray-700">
                    <button id="desktop-button" class="w-full py-3 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition text-center">
                        Desktop View
                    </button>                
                </div>
                `;             
    }
    var tradingBotSt = ""; 
    if (tradingBotFlag == true) {
        tradingBotSt = `    
                    <button id="btn-trading-bot" class="w-full py-3 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition text-center">
                        Trading Bot
                    </button>       
                `;          
    }
    return `
        <div class="p-3">
            <div class="flex flex-col items-center mb-6">
                <div class="w-20 h-20 bg-sky-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                    ${initials}
                </div>
                <h1 class="text-xl font-bold">${fullName}</h1>
                <p class="text-gray-400 text-sm">${data.email}</p>
                <div class="mt-2 px-3 py-1 bg-sky-600 text-white text-xs rounded-full">
                    ${data.accountType} Member
                </div>
            </div>

            <div class="bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
                <h2 class="text-base font-semibold text-gray-300 mb-3">Account Summary</h2>
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p class="text-gray-400">Member Since</p>
                        <p class="font-semibold">${formatDate(data.memberSince)}</p>
                    </div>
                    <div>
                        <p class="text-gray-400">Account Balance</p>
                        <p class="font-semibold">${data.accountBalance}</p>
                    </div>
                    <div>
                        <p class="text-gray-400">Payment</p>
                        <p class="font-semibold">${formatCurrency(data.payment)}</p>                   
                    </div>
                    <div>
                        <p class="text-gray-400">Credit</p>
                        <p class="font-semibold ${data.credit >= 0 ? 'text-green-500' : 'text-red-500'}">
                            ${data.totalReturn >= 0 ? '+' : ''}${formatCurrency(data.credit)}
                        </p>
                    </div>
                </div>
            </div>

            <div class="bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
                <h2 class="text-base font-semibold text-gray-300 mb-3">My Portfolio Stocks - ${data.plan}</h2>
                Total: ${STnameNum}
                <div id="favorite-stocks" class="flex flex-wrap gap-2">
                    ${favoritesHtml}
                </div>
            </div>

            <div class="bg-gray-800 p-4 rounded-lg shadow-sm">
                <div class="flex justify-between items-center mb-3">
                    <h2 class="text-base font-semibold text-gray-300">Recent Activity</h2>
                    <span class="text-sky-400 text-sm cursor-pointer"></span>
                </div>
                <div id="recent-activity" class="space-y-3">
                    ${activityHtml}
                </div>
            </div>

            <div class="mt-4">
                <div class="space-y-2 mb-4">
                    <!-- Edit Profile Button -->
                    <button id="edit-profile-button" class="w-full py-3 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition text-center">
                        Edit Profile
                    </button>
                    <!-- Account Statements Button (Handler attached below) -->
                    <button id="account-statements-button" class="w-full py-3 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition text-center">
                        Account Statements
                    </button>
                    ${tradingBotSt}
            
                </div>
                ${debugHtmlSt}
                <!-- Separated Destructive Action -->
                <div class="pt-4 border-t border-gray-700">
                    <button id="logout-button" class="w-full py-3 text-sm bg-red-600 hover:bg-red-700 rounded-lg transition text-center">
                        Logout
                    </button>
                </div>
            </div>
            <!-- Educational & Informational Disclaimer -->
            <div class="p-3 mt-4 text-center border-t border-gray-800">
                <p class="text-xs text-gray-500 leading-relaxed italic">
                    For educational and informational purposes only. Past performance is not indicative of future results. This is not financial advice. Paper trading figures do not reflect real-market friction.
                </p>
            </div>                
        </div>
    `;
}


function handleTradingBotView() {
    if (tradingBotFlag == true) {
        myTradingBott();
    }     
    $('#fixed-header').hide(); // Hide the header completely    
    $('#main-content').html(showLoading()); 
    
        let pollIntervalID = null;
        let checks = 0; // Counter to prevent infinite loops (optional, but recommended)
        const MAX_CHECKS = 80; // Max 20 seconds (200 * 100ms) before giving up
        // Start the polling interval
        pollIntervalID = setInterval(() => {
            checks++;

            // 1. CHECK FOR READY FLAG
            if (mockProfileData.tradingbotready) {
                // Stop the loop
                clearInterval(pollIntervalID);                
          
                return; 
            }

            // 2. CHECK FOR MAX TIMEOUT (Fallback)
            if (checks >= MAX_CHECKS) {
                 // Stop the loop
                clearInterval(pollIntervalID);               
                showMessage('Failed to load billing data.', 'error');
                renderProfilePage(); // Go back to profile on failure
                return;
            }
        }, MOCK_API_DELAY);

}


function renderTradingBotForm() {
    return `
        <div class="p-4 sm:p-6 space-y-6">
            <div class="flex items-center space-x-4 mb-6">
                <button id="back-to-profile" class="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                </button>
                <h2 class="text-xl font-bold text-white">Trading Bot Configuration</h2>
            </div>
            <div>           
            <span id="bot_spinner_id"></span>
            </div>
            <form id="tradingBotForm" class="space-y-6">
                <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700" id="nav_bot_ALPACA" style="display: none;">
                    <h3 class="text-lg font-semibold text-sky-400 mb-4">Alpaca Bot Settings</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">ALPACA Key</label>
                            <input type="text" id="bot_ALPACA_ID" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">ALPACA Secret</label>
                            <input type="password" id="bot_ALPACA_SECRET" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500">
                        </div>
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-400 mb-1">Stock Symbol List</label>
                        <input type="text" id="bot_ALPACA_STOCK" placeholder="AAPL,TSLA..." class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white">
                    </div>
                    <div class="mt-4 space-y-2">
                        <label class="flex items-center space-x-3">
                            <input type="checkbox" id="bot_ALPACA_paper" class="form-checkbox h-5 w-5 text-sky-500 rounded border-gray-700 bg-gray-900">
                            <span class="text-gray-300">Enable Paper Trading</span>
                        </label>                    
                        <label class="flex items-center space-x-3">
                            <input type="checkbox" id="bot_ALPACA_ssell" class="form-checkbox h-5 w-5 text-sky-500 rounded border-gray-700 bg-gray-900">
                            <span class="text-gray-300">Enable Short Sell Trading</span>
                        </label>                        
                        <label class="flex items-center space-x-3">
                            <input type="checkbox" id="bot_ALPACA_status" class="form-checkbox h-5 w-5 text-sky-500 rounded border-gray-700 bg-gray-900">
                            <span class="text-gray-300">Enable Automated Trading</span>
                        </label>                                    
                        
                    </div>
                    <p class="mt-3 text-xs text-gray-500">Status: <span id="myALPACA_info_id"></span></span> <br> <span id="myALPACA_msg_id"></span></p>
                </div>
                <br>
                <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700" id="nav_bot_OANDA" style="display: none;">
                    <h3 class="text-lg font-semibold text-sky-400 mb-4">Oanda Bot Settings</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">OANDA Account ID</label>
                            <input type="text" id="bot_OANDA_ID" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">OANDA Access Token</label>
                            <input type="password" id="bot_OANDA_TOKEN" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500">
                        </div>
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-400 mb-1">Stock Symbol List</label>
                        <input type="text" id="bot_OANDA_STOCK" placeholder="AAPL,TSLA..." class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white">
                    </div>
                    <div class="mt-4 space-y-2">
                        <label class="flex items-center space-x-3">
                            <input type="checkbox" id="bot_OANDA_paper" class="form-checkbox h-5 w-5 text-sky-500 rounded border-gray-700 bg-gray-900">
                            <span class="text-gray-300">Enable Paper Trading</span>
                        </label>                    
                        <label class="flex items-center space-x-3">
                            <input type="checkbox" id="bot_OANDA_ssell" class="form-checkbox h-5 w-5 text-sky-500 rounded border-gray-700 bg-gray-900">
                            <span class="text-gray-300">Enable Short Sell Trading</span>
                        </label>                        
                        <label class="flex items-center space-x-3">
                            <input type="checkbox" id="bot_OANDA_status" class="form-checkbox h-5 w-5 text-sky-500 rounded border-gray-700 bg-gray-900">
                            <span class="text-gray-300">Enable Automated Trading</span>
                        </label>
                    </div>
                    <p class="mt-3 text-xs text-gray-500">Status: <span id="myOANDA_info_id"></span></span> <br> <span id="myOANDA_msg_id"></span></p>
                </div>
                <br>
                <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700" id="nav_bot_LIME" style="display: none;">
                    <h3 class="text-lg font-semibold text-sky-400 mb-4">Lime Bot Settings</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">LIME ClientId</label>
                            <input type="text" id="bot_LIME_ClientId" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">LIME clientSecret</label>
                            <input type="password" id="bot_LIME_clientSecret" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">LIME Username</label>
                            <input type="text" id="bot_LIME_USER" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">LIME Password</label>
                            <input type="password" id="bot_LIME_PASS" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500">
                        </div>
                    </div>                    
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-400 mb-1">Stock Symbol List</label>
                        <input type="text" id="bot_LIME_STOCK" placeholder="AAPL,TSLA..." class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white">
                    </div>
                    <div class="mt-4 space-y-2">
                        <label class="flex items-center space-x-3">
                            <input type="checkbox" id="bot_LIME_paper" class="form-checkbox h-5 w-5 text-sky-500 rounded border-gray-700 bg-gray-900">
                            <span class="text-gray-300">Enable Paper Trading</span>
                        </label>                    
                        <label class="flex items-center space-x-3">
                            <input type="checkbox" id="bot_LIME_ssell" class="form-checkbox h-5 w-5 text-sky-500 rounded border-gray-700 bg-gray-900">
                            <span class="text-gray-300">Enable Short Sell Trading</span>
                        </label>                        
                        <label class="flex items-center space-x-3">
                            <input type="checkbox" id="bot_LIME_status" class="form-checkbox h-5 w-5 text-sky-500 rounded border-gray-700 bg-gray-900">
                            <span class="text-gray-300">Enable Automated Trading</span>
                        </label>
                    </div>
                    <p class="mt-3 text-xs text-gray-500">Status: <span id="myLIME_info_id"></span></span> <br> <span id="myLIME_msg_id"></span></p>
                </div>
                <br>
                <div class="bg-gray-800 rounded-2xl p-6 border border-gray-700" id="nav_bot_TELEGRAM" >
                    <h3 class="text-lg font-semibold text-sky-400 mb-4">Telegram Chat Settings</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Telegram Chat ID</label>
                            <input type="text" id="bot_TELEGRAM_ID" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Telegram Chat Token</label>
                            <input type="password" id="bot_TELEGRAM_TOKEN" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500">
                        </div>
                    </div>
                    <div class="mt-4 space-y-2">                      
                        <label class="flex items-center space-x-3">
                            <input type="checkbox" id="bot_TELEGRAM_status" class="form-checkbox h-5 w-5 text-sky-500 rounded border-gray-700 bg-gray-900">
                            <span class="text-gray-300">Enable Telegram Chat Message</span>
                        </label>
                    </div>
                    <p class="mt-3 text-xs text-gray-500">Status: <span id="myTE_info_id"></span></span> </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Transaction Amount per trade</label>
                        <input type="text" id="bot_TRAN" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500">
                    </div>
                </div>       

                <div class="flex gap-4 pt-4" id="nav_bot_button" style="display: none;">
                    <button type="submit" class="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-sky-500/20">
                        Update Trading Bot
                    </button>
                    <button type="button" id="cancel-bot" class="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all">
                        Cancel
                    </button>
                </div>

            </form>
            <div id="botResponse" class="mt-4"></div>
        </div>
    `;
}

 function myTradingBott() {

    $("#nav_bot_button").hide(); 
    $("#bot_spinner_id").html('<span class="blink">Retrieving info....</span>');    
    $("#myLIME_info_id").html('<span class="blink">Retrieving info....</span>');
    $("#myOANDA_info_id").html('<span class="blink">Retrieving info....</span>');
    $("#myALPACA_info_id").html('<span class="blink">Retrieving info....</span>');    
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/tradingbot",
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function () {
            window.location.href = "iisend.html";
        },
        success: function (resultObjList) {
            
            $('#main-content').html(renderTradingBotForm());
            $("#bot_spinner_id").html('');   
            $("#nav_bot_button").show(); 
            mockProfileData.tradingbotready = true;
            // 3. Attach Events
            $('#back-to-profile, #cancel-bot').on('click', function() {
                renderProfilePage(); // Return to main profile
            });

            $('#tradingBotForm').on('submit', function(e) {
                e.preventDefault();
                submitTradingBot();
            });   

            tradingBotObjStr = "";
            tradingBotObj = "";
            if (resultObjList !== "") {               
                tradingBotObjStr = JSON.stringify(resultObjList, null, '\t');
                tradingBotObj = JSON.parse(tradingBotObjStr);
                if (tradingBotObj.subtype == 0) {
                    tradingBotObj.subtype = 6000;
                } 
                $("#bot_TRAN").val(tradingBotObj.subtype);                  
                // $("#bot_ALPACA_ID").val(tradingBotObj.A_ID);
                if (tradingBotObj.A_Sym) {
                    $("#bot_ALPACA_STOCK").val(tradingBotObj.A_Sym);                
                }                
                $("#bot_ALPACA_paper").prop("checked", tradingBotObj.A_PAP === 0);                   
                $("#bot_ALPACA_ssell").prop("checked", tradingBotObj.A_SS === 0);                                   
                $("#bot_ALPACA_status").prop("checked", tradingBotObj.St_A === 0);
                $("#myALPACA_info_id").html("Failed"); 
            
                if (tradingBotObj.A_Msg.length > 0){
                    $("#myALPACA_info_id").html("Success"); 
                    // 1. Remove the leading '[' and trailing ']'
                    // 2. Split by ', ' (Java's default separator)
                    const summaryArray = tradingBotObj.A_Msg.slice(1, -1).split(', ');
                    var summary = "";
                    var tableStarted = false;

                    summaryArray.forEach(line => {
                        // Check if the line looks like a position (contains multiple commas but no colon)
                        if (line.includes(',') && !line.includes(':')) {
                            if (!tableStarted) {
                                summary += '<table style="width:100%; border-collapse: collapse; margin-top:10px; font-family: monospace;">';
                                summary += '<tr style="border-bottom: 1px solid #ccc; text-align: left;"><th>Symbol</th><th>Qty</th><th>Price</th><th>Value</th><th>P/L</th></tr>';
                                tableStarted = true;
                            }
                            
                            const cols = line.split(',');
                            summary += `<tr>
                                <td><b>${cols[0]}</b></td>
                                <td>${cols[1]}</td>
                                <td>$${cols[2]}</td>
                                <td>$${cols[3]}</td>
                                <td style="color: ${parseFloat(cols[4]) >= 0 ? 'green' : 'red'}">${cols[4]}%</td>
                            </tr>`;
                        } else {
                            // Close table if we were in one and hit a non-position line
                            if (tableStarted) {
                                summary += '</table>';
                                tableStarted = false;
                            }
                            
                            // Format regular account info lines
                            if (line.includes(':')) {
                                summary += `<div>${line}</div>`;
                            } else {
                                summary += `<div style="margin-top:10px; font-weight: bold; border-bottom: 1px solid #eee;">${line}</div>`;
                            }
                        }
                    });

                    if (tableStarted) summary += '</table>';
                    $("#myALPACA_msg_id").html(summary); 
                }

                if (tradingBotObj.A_ID) {
                    $("#bot_ALPACA_ID").attr("placeholder", "******");
                }
                if (tradingBotObj.A_CS) {
                    $("#bot_ALPACA_SECRET").attr("placeholder", "******");
                }

//////////////////////////////
                $("#bot_OANDA_ID").val(tradingBotObj.OA_ID);
                if (tradingBotObj.OA_Sym) {
                    $("#bot_OANDA_STOCK").val(tradingBotObj.OA_Sym);                
                }
                $("#bot_OANDA_paper").prop("checked", tradingBotObj.OA_PAP === 0);                   
                $("#bot_OANDA_ssell").prop("checked", tradingBotObj.OA_SS === 0);                               
                $("#bot_OANDA_status").prop("checked", tradingBotObj.St_OA === 0);
                // $("#myOANDA_info_id").html(tradingBotObj.OA_Msg); 
                $("#myOANDA_info_id").html("Failed"); 
                if (tradingBotObj.OA_Msg.length > 0) {
                    $("#myOANDA_info_id").html("Success");
                    
                    const summaryArray = tradingBotObj.OA_Msg.slice(1, -1).split(', ');
                    var summary = "";
                    var tableStarted = false;

                    summaryArray.forEach(line => {
                        // Check if the line looks like a position (contains multiple commas but no colon)
                        if (line.includes(',') && !line.includes(':')) {
                            if (!tableStarted) {
                                summary += '<table style="width:100%; border-collapse: collapse; margin-top:10px; font-family: monospace;">';
                                summary += '<tr style="border-bottom: 1px solid #ccc; text-align: left;"><th>Symbol</th><th>Qty</th><th>Price</th><th>Value</th><th>P/L</th></tr>';
                                tableStarted = true;
                            }
                            
                            const cols = line.split(',');
                            summary += `<tr>
                                <td><b>${cols[0]}</b></td>
                                <td>${cols[1]}</td>
                                <td>$${cols[2]}</td>
                                <td>$${cols[3]}</td>
                                <td style="color: ${parseFloat(cols[4]) >= 0 ? 'green' : 'red'}">${cols[4]}%</td>
                            </tr>`;
                        } else {
                            // Close table if we were in one and hit a non-position line
                            if (tableStarted) {
                                summary += '</table>';
                                tableStarted = false;
                            }
                            
                            // Format regular account info lines
                            if (line.includes(':')) {
                                summary += `<div>${line}</div>`;
                            } else {
                                summary += `<div style="margin-top:10px; font-weight: bold; border-bottom: 1px solid #eee;">${line}</div>`;
                            }
                        }
                    });

                    if (tableStarted) summary += '</table>';

                    $("#myOANDA_msg_id").html(summary);
                }                   
                // if (tradingBotObj.OA_Msg.length > 0){
                //     $("#myOANDA_info_id").html("Success"); 
                //     // 1. Remove the leading '[' and trailing ']'
                //     // 2. Split by ', ' (Java's default separator)
                //     const summaryArray = tradingBotObj.OA_Msg.slice(1, -1).split(', ');
                //     var summary = "";
                //     // Example: Displaying in HTML
                //     summaryArray.forEach(line => {
                //         summary += line+'<br>'
                //         // console.log("Line Item:", line);
                //     });
                //     $("#myOANDA_msg_id").html(summary); 
                // }

                if (tradingBotObj.OA_AT) {
                    $("#bot_OANDA_TOKEN").attr("placeholder", "******");
                }

///////////////////////////////////////
                $("#bot_LIME_ClientId").val(tradingBotObj.L_ID);
                if (tradingBotObj.L_CS) {
                    $("#bot_LIME_clientSecret").attr("placeholder", "******");
                }
                if (tradingBotObj.L_USR) {
                    $("#bot_LIME_USER").attr("placeholder", "******");                
                }
                if (tradingBotObj.L_PAS) {
                    $("#bot_LIME_PASS").attr("placeholder", "******");                
                }
                if (tradingBotObj.L_Sym) {
                    $("#bot_LIME_STOCK").val(tradingBotObj.L_Sym);                    
                }
                $("#bot_LIME_paper").prop("checked", tradingBotObj.L_PAP === 0);                  
                $("#bot_LIME_ssell").prop("checked", tradingBotObj.L_SS === 0);                
                $("#bot_LIME_status").prop("checked", tradingBotObj.St_L === 0);
                // $("#myLIME_info_id").html(tradingBotObj.L_Msg); 
                $("#myLIME_info_id").html("Failed");
                if (tradingBotObj.L_Msg.length > 0){
                    $("#myLIME_info_id").html("Success"); 
                    // 1. Remove the leading '[' and trailing ']'
                    // 2. Split by ', ' (Java's default separator)
                    const summaryArray = tradingBotObj.L_Msg.slice(1, -1).split(', ');
                    var summary = "";
                    var tableStarted = false;

                    summaryArray.forEach(line => {
                        // Check if the line looks like a position (contains multiple commas but no colon)
                        if (line.includes(',') && !line.includes(':')) {
                            if (!tableStarted) {
                                summary += '<table style="width:100%; border-collapse: collapse; margin-top:10px; font-family: monospace;">';
                                summary += '<tr style="border-bottom: 1px solid #ccc; text-align: left;"><th>Symbol</th><th>Qty</th><th>Price</th><th>Value</th><th>P/L</th></tr>';
                                tableStarted = true;
                            }
                            
                            const cols = line.split(',');
                            summary += `<tr>
                                <td><b>${cols[0]}</b></td>
                                <td>${cols[1]}</td>
                                <td>$${cols[2]}</td>
                                <td>$${cols[3]}</td>
                                <td style="color: ${parseFloat(cols[4]) >= 0 ? 'green' : 'red'}">${cols[4]}%</td>
                            </tr>`;
                        } else {
                            // Close table if we were in one and hit a non-position line
                            if (tableStarted) {
                                summary += '</table>';
                                tableStarted = false;
                            }
                            
                            // Format regular account info lines
                            if (line.includes(':')) {
                                summary += `<div>${line}</div>`;
                            } else {
                                summary += `<div style="margin-top:10px; font-weight: bold; border-bottom: 1px solid #eee;">${line}</div>`;
                            }
                        }
                    });

                    if (tableStarted) summary += '</table>';
                    $("#myLIME_msg_id").html(summary); 
                }

                $("#bot_TELEGRAM_ID").val(tradingBotObj.TE_ID);
                if (tradingBotObj.TE_T) {
                    $("#bot_TELEGRAM_TOKEN").attr("placeholder", "******");                
                }                
                $("#bot_TELEGRAM_status").prop("checked", tradingBotObj.St_TE === 0);
                $("#myTE_info_id").html(tradingBotObj.TE_Msg); 

            } else {
                $("#myofferfeatid").html("No more feature available.");
            }

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
                            var servListSt = custObj.serL;
                            servListSt = servListSt.replaceAll('#', '"');
                            if (servListSt == ""){
                                servListSt ="[]"
                            }       
                            var tradingBotFlag = false;

                            var servList = JSON.parse(servListSt);                 
                            if (servList.length > 0) {
                                for (i = 0; i < servList.length; i++) {
                                    var servObj = servList[i];

                                    if (servObj.type == 7) { //TYPE_BILL_PRICE_NOENCYPION
                                        // bill feature                            
                                        var date = new Date(servObj.st).toLocaleDateString("en-US");

                                        var name = servObj.cd; //date + " " + servObj.cd;
                                        if ((name.indexOf("BillPriceF") != -1) ) {
                                        var botSrvId = name.replace("BillPriceF", "");  
                                        if (botSrvId == "50") {
                                                $("#nav-tradebot-tab").show();
                                                $("#nav_bot_OANDA").show();
                                                tradingBotFlag = true;
                                                
                                        } else  if (botSrvId == "51") {
                                                $("#nav-tradebot-tab").show();
                                                $("#nav_bot_LIME").show();
                                                tradingBotFlag = true;
                                                
                                        } else  if (botSrvId == "52") {
                                                $("#nav-tradebot-tab").show();
                                                $("#nav_bot_ALPACA").show();
                                                tradingBotFlag = true;                               }
                                        }
                                    }                        
                                }
                            }
                        
                        }
                    }
                }
            } catch (err) {
            }            

        }        
    });
}

function submitTradingBot() {
    if (iisurl == iisurl_LOCAL) {
        ;
    } else {        
        if ((custChange == false)) { // Demo
            var msgObjStr = "This operation is not supported on demo accounts.";
            $("#botResponse").html('<p style="color:red">' + msgObjStr + '</p>');
            return;
        }
    }      
    // Collect data from the new fields
    var botSettings = {
        alpacaId: $("#bot_ALPACA_ID").val(),        
        alpacaSecret: $("#bot_ALPACA_SECRET").val(),
        alpacaStock: $("#bot_ALPACA_STOCK").val(),        
        alpacapaper: $("#bot_ALPACA_paper").is(":checked") ? 1 : 0,            
        alpacasell: $("#bot_ALPACA_ssell").is(":checked") ? 1 : 0,         
        alpacastatus: $("#bot_ALPACA_status").is(":checked") ? 1 : 0,   

        oandaToken: $("#bot_OANDA_TOKEN").val(),
        oandaId: $("#bot_OANDA_ID").val(),
        oandaStock: $("#bot_OANDA_STOCK").val(),        
        oandapaper: $("#bot_OANDA_paper").is(":checked") ? 1 : 0,           
        oandasell: $("#bot_OANDA_ssell").is(":checked") ? 1 : 0,         
        oandastatus: $("#bot_OANDA_status").is(":checked") ? 1 : 0,        

        limeUser: $("#bot_LIME_USER").val(),
        limePass: $("#bot_LIME_PASS").val(),
        limeClientId: $("#bot_LIME_ClientId").val(),
        limeclientSecret: $("#bot_LIME_clientSecret").val(),        
        limeStock: $("#bot_LIME_STOCK").val(),
        limepaper: $("#bot_LIME_paper").is(":checked") ? 1 : 0,           
        limesell: $("#bot_LIME_ssell").is(":checked") ? 1 : 0,         
        limestatus: $("#bot_LIME_status").is(":checked") ? 1 : 0,       

        telegramToken: $("#bot_TELEGRAM_TOKEN").val(),
        telegramId: $("#bot_TELEGRAM_ID").val(),        
        telegramstatus: $("#bot_TELEGRAM_status").is(":checked") ? 1 : 0,

        tranAmount: $("#bot_TRAN").val()
    };

    // AJAX Call to back end
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/tradingbot/update", 
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(botSettings),
        crossDomain: true,
        cache: false,
        beforeSend: function () {
            $("#loader").show(); // Use existing loader from your project
            $("#botResponse").html("Processing...");
        },
        error: function () {
            $("#loader").hide();
            alert('Failed to update bot settings. Please check your connection.');
        },
        success: function (result) {
            $("#loader").hide();
            if (result == 1) {
                $("#botResponse").html('<p style="color:green">Bot updated and started successfully!</p>');
                
                // Update local storage if necessary
                // iisODSObj.botStatus = botSettings.status;
                // window.localStorage.setItem(iisODSObjSession, JSON.stringify(iisODSObj));
            } else {
                var msgObjStr = 'Update failed. Please try again.';
                $("#botResponse").html('<p style="color:red">' + msgObjStr + '</p>');
            }
            window.location.href = "aiapprofile.html";
        }
    });
}

// The main rendering function, handles the conditional view
function renderProfilePage() {
    if (isLoggedIn) {
        // Show profile content
        $('#main-content').html(showLoading()); 
        backend.getProfileData().done(data => {

            $('#main-content').html(generateProfileHtml(data));
            // Attach event handlers for the profile view
            $('#logout-button').off('click').on('click', handleLogout); 
            $('#edit-profile-button').off('click').on('click', handleEditProfile); 
            // NEW: Attach handler for Account Statements
            $('#account-statements-button').off('click').on('click', handleAccountStatements);
            // Add this inside your main profile rendering logic
            $('#btn-trading-bot').on('click', handleTradingBotView);            
            $('#desktop-button').off('click').on('click', handleClassicView);
        }).fail(() => {
            $('#main-content').html('<p class="text-red-500 text-center p-8">Failed to load profile data.</p>');
        });
    } else {
        // Show login page
        $('#main-content').html(renderLoginPage());
        attachLoginEvents();
    }
}
function handleLogout() {
    // Show the confirmation overlay instead of immediate logout
    $('#logout-overlay').removeClass('hidden');
}

// Add these new helper functions to manage the overlay actions
function performActualLogout() {
    isLoggedIn = false;
    window.localStorage.removeItem(iisWebSession);
    window.localStorage.removeItem(iisODSObjSession);
    window.location.href = "aiiend.html"; // Redirect to logout/end page
}

function closeLogoutOverlay() {
    $('#logout-overlay').addClass('hidden');
}
// Function to refresh the page when the icon is clicked
function refreshData() {
    // This is updated to perform a hard page refresh
    window.location.reload();
}
$(document).ready(function() {
    $('.nav-item').on('click', function() {
        const page = $(this).data('page');
        // Check if the user is trying to navigate away while logged in (optional check, but good practice)
        if (isLoggedIn && page !== 'aiapprofile') { 
            // In a real app, this would use a router, but for a mock, we simulate navigation.
            // For this environment, we prevent navigation away from the single file.
            // If this were a multi-page app, we'd go to window.location.href = page + '.html';
            console.log(`Navigating to ${page}.html (Mocked)`);
        } else if (!isLoggedIn && page !== 'aiapprofile') {
            console.log(`Cannot navigate until logged in.`);
            showMessage('Please log in first.');
        }
        
        // Since this is the dprofile.html file, we just re-render the profile view 
         // Navigation handler (simulates page change)
        $('.nav-item').on('click', function() {
               const page = $(this).data('page');
               if (page !== 'aiapprofile') {
                   window.location.href = page + '.html';
               }
           });               
    });
// Existing logout button trigger (ensure your logout button calls handleLogout)
$('#logout-btn').on('click', handleLogout);

// New Confirmation Listeners
$('#confirm-logout-btn').on('click', performActualLogout);
$('#cancel-logout-btn').on('click', closeLogoutOverlay);

// Optional: Close overlay if user clicks outside the box
$('#logout-overlay').on('click', function(e) {
    if (e.target === this) closeLogoutOverlay();
});
// Add event listener for refresh button
$('#refresh-button').on('click', function() {
    refreshData();
});    


// --- Global Image Handler Callbacks for inline HTML events ---
window.handleImageLoad = function(imgEl) {
    // Hide the loader spinner once the network returns the chart image asset
    $(imgEl).siblings('#chart-img-spinner').addClass('hidden');
    // Animate smoothly to clear view matching aiaphome
    $(imgEl).removeClass('opacity-0').addClass('opacity-100');
};

window.reload3Image = function(imgEl) {
    console.log("Chart failed to load, retrying with cache-buster...");
    // Prevent infinite error loops by checking if a retry flag exists
    if (!imgEl.dataset.retried) {
        imgEl.dataset.retried = "true";
        
        // Strip existing parameters and append a fresh cache-busting timestamp
        let baseUrl = imgEl.src.split('?')[0];
        let originalParams = imgEl.src.indexOf('month=3') !== -1 ? "month=3&" : "";
        imgEl.src = baseUrl + "?" + originalParams + "t=" + new Date().getTime();
    } else {
        // If it fails even with cache-buster, remove spinner and fallback to a styling error state
        $(imgEl).siblings('#chart-img-spinner').addClass('hidden');
    }
};

// USE EVENT DELEGATION: Listen on #activity-list for any .activity-item click
$(document).on('click', '.activity-item', function() {
    // 1. Get the ID from the data attribute
    const activityId = $(this).data('id');

    // 2. Find the exact record in your data array
    const record = mockProfileData.recentActivity.find(a => a.id == activityId);
    if (record.symbol.length == 0){
        return;
    }

    $('#loading-spinner').removeClass('hidden');
    var curPrice = 0; 
    var preClose = 0; 
    var percentSt = "";
    var stockStatus = "";
    var timeSt = "";    
    var BSsignal = 0;
    var BSsignalStr = "";
    var QuantityHeld = "";
    var AveragePrice = "";
    var TranDate = "";
    var MarketValue = "";
    var OpenPL = "";


    symbol = record.symbol;
    trName = "TR_NN33";
    $.ajax({
        // default st size 20
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st?trname=" + trName + "&filter=" + symbol,
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
                return;
            }
            stockObjListStr = JSON.stringify(resultStockList, null, '\t');

            stockObjList = JSON.parse(stockObjListStr);    



            for (i = 0; i < stockObjList.length; i++) {
                var stockObj = stockObjList[i];

                if (stockObj.afstockInfo != null) {
                    curPrice = stockObj.afstockInfo.fclose;
                    preClose = stockObj.prevClose;
                    var percent = 100 * (curPrice - preClose) / preClose;

                    if (percent > 0) {
                        percentSt = '<span class="text-green-500">' + percent.toFixed(2) + '%' + "</span>";
                    } else {
                        percentSt = "<font style= color:red>" + percent.toFixed(2) + '%' + "</font>";
                    }
                }
                break;                    
            }

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

                    $('#loading-spinner').addClass('hidden');

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

                                BSsignal = tranObj.trsignal;
                                BSsignalStr = "";
                                if (tranObj.trsignal == 1){
                                    BSsignalStr = '<span class="text-green-500 text-base "><big> Buy</big></span>';
                                } else if (tranObj.trsignal == 2){
                                    BSsignalStr = '<span class="text-red-500 text-base "><big> Sell</big></span>';
                                } 
                                if (perTran > 0) {
                                    perTranSt = '<span class="text-green-500"> ' + perTran.toFixed(2) + '%' + '</span>';
                                } else {
                                    perTranSt = '<span class="text-red-500"> ' + perTran.toFixed(2) + '%' + '</span>';
                                }                                  
                                AveragePrice = tranObj.avgprice;                        
                                QuantityHeld = tranObj.share;
                                TranDate = tranObj.updatedatedisplay;
                                OpenPL = perTranSt;
                                MarketValue =  (tranObj.share * prevTranObj.avgprice) + diff
                                MarketValue = MarketValue.toFixed(0) 

                                // NEW: Extract the stock name from the stockObj safely
                                var stockName = stockObj.stockname || "";
                                // Extracting data from the clicked row
                                const statusClass = $(this).find('span.rounded-full').attr('class') || "";

                                var trNameChart = "TR_NN33";
                                var imageUrl = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/" + symbol + "/tr/" + trNameChart + "/tran/history/chart?month=3&t=" + new Date().getTime();


                                // Build the HTML to match your requested image style
                                const detailHtml = `
                                    <div class="text-white space-y-4">                         
                                        <div class="space-y-2">
                                            <p class="text-gray-400 text-sm font-bold uppercase tracking-wider px-6">Opening Price</p>
                                            <div class="mx-6 bg-gray-900 p-3 rounded-xl border border-gray-600 flex justify-between items-center">                                       
                                                <span class="text-gray-400">Delayed Close:</span>
                                                <span class="font-semibold">$${curPrice.toFixed(2)} ${percentSt}</span>
                                            </div>   
                                        </div>                                        
                                        <div class="space-y-2">
                                            <p class="text-gray-400 text-sm font-bold uppercase tracking-wider px-6">Transaction Details</p>
                                            
                                            <div class="mx-6 bg-gray-700/50 rounded-xl overflow-hidden border border-gray-600">
                                                <div class="flex justify-between p-3 border-b border-gray-600 items-start">
                                                    <div class="flex flex-col">
                                                        <span class="text-gray-300">Stock</span>
                                                        <p class="text-gray-400 text-xs mt-0.5">${stockName}</p>
                                                    </div>
                                                    <div class="text-right">
                                                        <span class="text-white-400 font-semibold">${symbol}</span>
                                                    </div>
                                                </div>
                                                <div class="flex justify-between p-1">
                                                    <span class="text-gray-400">Type: </span>
                                                    <span>${BSsignalStr}</span>
                                                </div>                                                       
                                                <div class="flex justify-between p-1">
                                                    <span class="text-gray-400">Transaction: </span>
                                                    <span>${TranDate}</span>
                                                </div>                   
                                                <div class="flex justify-between p-1">
                                                    <span class="text-gray-400">Quantity Held:</span>
                                                    <span>${QuantityHeld}</span>
                                                </div>
                                                <div class="flex justify-between p-1">
                                                    <span class="text-gray-400">Average Price:</span>
                                                    <span>$${AveragePrice}</span>
                                                </div>
                                                <div class="flex justify-between p-1">
                                                    <span class="text-gray-400">Market Value:</span>
                                                    <span>$${MarketValue}</span>
                                                </div>
                                                <div class="flex justify-between p-1">
                                                    <span class="text-gray-400">Profit & Loss:</span>
                                                    <span class="font-bold">${OpenPL}</span>
                                                </div>       
                                            </div>
                                        </div>

                                        <div class="text-white space-y-2">                         
                                            <p class="text-gray-400 text-sm font-bold uppercase tracking-wider px-6">Price Chart (3 Months)</p>
                                            <div class="relative bg-gray-900 overflow-hidden min-h-[200px] flex items-center justify-center -mx-6">
                                                <div id="chart-img-spinner" class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 z-10 absolute"></div>
                                                
                                                <img id="space3image" 
                                                    src="${imageUrl}" 
                                                    class="w-full h-auto block opacity-0 transition-opacity duration-300"
                                                    onload="handleImageLoad(this)"
                                                    onerror="reload3Image(this);" 
                                                    alt="Price Chart">
                                            </div>
                                        </div>
                                    </div>
                                `;

                                // Inject and Show
                                $('#activity-detail-content').html(detailHtml);
                                $('#activity-overlay').removeClass('hidden').addClass('flex');

                            }
                        }

                        rowCnt++;

                        prevTranObj = tranObj;

                        list.push(tranSt);
        
                    }

                }
            });


        }
    });

});


// Close logic
$('#close-activity-btn, #close-activity-footer').on('click', function() {
    $('#activity-overlay').addClass('hidden').removeClass('flex');
});
renderProfilePage();
});