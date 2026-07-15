const MOCK_API_DELAY = 500;

var mockDashboardData = {
    ready: false,
    plan: "",
    totalAssets: 4056.52,
    dayGain: -12.62,
    dayGainPercent: -0.31,
    favoriteStocks: [],     
    selCategory: "market1", // Set a default category
    selFId: 0,
    market1:"",
    market2:"",
    market3:"",
    market4:"",  
    market1FId:0,
    market2FId:0,
    market3FId:0,
    market4FId:0,     
    market1Txt:"",
    market2Txt:"",
    market3Txt:"",
    market4Txt:"",                 
    indices: [
        // { symbol: 'DOW', value: 32959.70, change: -76.23, percent: -0.23 },
        // { symbol: 'NASDAQ', value: 12674.897, change: -146.327, percent: -1.14 },
        // { symbol: 'S&P 500', value: 4160.79, change: -25.96, percent: -0.62 }
    ],

    news: [
        // { source: 'MW', title: 'Why T. Rowe Price\'s CIO thinks 10-y...', date: 'October 25, 2023 8:23 EDT', publisher: 'MarketWatch' },
        // { source: 'MW', title: 'Popular Treasury ETF sees record-s...', date: 'October 20, 2023 1:34 EDT', publisher: 'MarketWatch' },
        // { source: 'BN', title: 'Tech Stocks Rebound Amid Rate Hopes', date: 'October 19, 2023 11:00 EDT', publisher: 'Bloomberg News' }
    ]
};

let marketMoversData = []; // Stores the data after fetch
let currentMarketCategory = 'All'; // Tracks the currently active filter


// Define the mock data with a 'category' property
var mockMarketMoversData = [
    // { symbol: 'AAPL', name: 'Apple Inc.', price: 185.00, change: 0.015, percent: 1.5, category: 'Tech' },
 ];
/////////////////////////////basic local storage
/////////////////////////////basic local storage

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
      
var stockId = iisODSObj.stockId;
var stockFundId = iisODSObj.stockFundId;

var fundObjListStr = "";
var fundObjList = "";
var fundLinkId = 0;

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

                            } else {
                                trM2 = "TR_NN" + servObj.subtype;
                                trM2TR = servObj.subtype;
                                trM2St = "Cust NN" + servObj.subtype;

                            }
                        }
                        if (servObj.type == 8) { //TYPE_CUSTOM_DEV
                            if (trM1.length == 0) {
                                trM1 = "TR_NN" + servObj.subtype;
                                trM1TR = servObj.subtype;
                                trM1St = "Dev NN" + servObj.subtype;

                            } else {
                                trM2 = "TR_NN" + servObj.subtype;
                                trM2TR = servObj.subtype;
                                trM2St = "Dev NN" + servObj.subtype;
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
                    trM2TR = 91;
                    trM2St = "Dev NN" + 92;
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

            // myInitCommFunction();

            initMarketFun();

            // initMarketStockFun();

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

        // if ((STnameL.length > 18) || (custObj.id == 3)) {
        //     $("#stocktotalid").html(" Total number of Stocks = " + STnameL.length);
        //     document.getElementById("filter-tag").style.display = "";  //show              
        // } else {
        //     document.getElementById("filter-tag").style.display = "none";  //hide    
        // }
        $.ajax({
            url: iisurl + "/cust/" + custObj.username + "/acc/" + iisODSObj.accId + "/marketdata?symbols=" + stockPageList,
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
            success: function (resultList) {

                commOLStr = "";
                commObj = null;
                if (resultList !== "") {
                    commOLStr = JSON.stringify(resultList, null, '\t');
                    commObj = JSON.parse(commOLStr);
                }
                if (commObj != null) {
                    indicesList = commObj.market_snapshot.indices;
                    for (i = 0; i < indicesList.length; i++) {
                        indicesObj = indicesList[i]
                        // { symbol: 'DOW', value: 32959.70, change: -76.23, percent: -0.23 },                     
                        const indices = {
                            symbol: indicesObj.name,
                            value: indicesObj.price,
                            change: indicesObj.change,
                            percent: indicesObj.percent_change
                        };
                        mockDashboardData.indices.push(indices)
                    }
                    newsList = commObj.portfolio_news.articles
                    for (i = 0; i < newsList.length; i++) {
                        newsObj = newsList[i]                    
                        // { source: 'MW', title: 'Why T. Rowe Price\'s CIO thinks 10-y...', date: 'October 25, 2023 8:23 EDT', publisher: 'MarketWatch' },
                     
                        const news = {
                            source: newsObj.Source,
                            title: newsObj.Ticker + " " +  newsObj.Headline,
                            date: newsObj.DisplayDate,
                            publisher: newsObj.Source,
                            link: newsObj.Link // <-- ADD THIS LINE
                        };  
                        mockDashboardData.news.push(news)                      
                    }

                }

                initProfileData();

            }
        });


    }
}
               


function initProfileData() {
    mockDashboardData.favoriteStocks = stockPageList.split(',');    
    mockDashboardData.plan = Cur_Plan
    mockDashboardData.ready = true;
    switchHomeView(currentHomeView);
    initMarketStockFun();

}

let currentHomeView = 'market';

const backend = {
    getDashboardData: () => {
        const deferred = $.Deferred();
        let pollIntervalID = null;
        let checks = 0; // Counter to prevent infinite loops (optional, but recommended)
        const MAX_CHECKS = 80; // Max 20 seconds (200 * 100ms) before giving up
        // Start the polling interval
        pollIntervalID = setInterval(() => {
            checks++;

            // 1. CHECK FOR READY FLAG
            if (mockDashboardData.ready) {
                // Stop the loop
                clearInterval(pollIntervalID);                
                // Resolve the promise immediately
                deferred.resolve(mockDashboardData);
                $('#loading-overlay').addClass('hidden-overlay');
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
        //     $('#loading-overlay').addClass('hidden-overlay');
        //     deferred.resolve(mockDashboardData);
        // }, MOCK_API_DELAY);
        // return deferred.promise();
    },        

    getMarketMovers: () => {
        const deferred = $.Deferred();
        setTimeout(() => {
            marketMoversData = mockMarketMoversData;
            deferred.resolve(marketMoversData);
        }, MOCK_API_DELAY);
        return deferred.promise();
    }
};

function switchHomeView(view) {
    currentHomeView = view;
    const $homeContent = $('#home-content');
    $homeContent.empty(); // Clear content to ensure a fresh render
    renderHomeSubView($homeContent);
    
    $('.home-tab-button').removeClass('active text-gray-400').addClass('text-gray-200');
    $(`.home-tab-button[data-view="${view}"]`).addClass('active');
}

function refreshData() {
    const $refreshButton = $('#refresh-button');
    const $refreshIcon = $refreshButton.find('.refresh-icon');
    marketMoversData = [];
    
    // 1. Show spinning animation on the refresh button
    $refreshIcon.addClass('animate-spin');
    $refreshButton.prop('disabled', true);

    // 2. Clear current chart and show the chart spinner
    if (myCharttop != null) {
        myCharttop.destroy(); // Clear the old chart instance
        myCharttop = null;
    }
    $('#canvasTopId').hide();
    $('#chart-spinner').show(); // Ensure you have this spinner in your HTML

    setTimeout(() => {
        $refreshIcon.removeClass('animate-spin');
        $refreshButton.prop('disabled', false);
    }, MOCK_API_DELAY + 200);

    // Forcing a view switch reloads the content and triggers initMarketStockFun()
    switchHomeView(currentHomeView); 
}


function showLoading($container) {
    // In-content loading indicator
    return (`
        <div class="flex flex-col items-center justify-center h-full min-h-[100px] p-2">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-400 mb-2"></div>
            <p class="text-gray-400 text-xs">Loading your data...</p>
        </div>
    `);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatPercent(amount) {
    return (amount >= 0 ? '+' : '') + amount.toFixed(2) + '%';
}

function renderHomeSubView($container) {
    $container.empty();
    
    if (currentHomeView === 'market') {
        renderDashboardPage($container);
    } else if (currentHomeView === 'fundmgr') {         
        renderMarketPage($container);   
        // 3. INITIALIZE: Trigger click on the default or first button
        // This will run the handler above automatically
        // $container.find('.market-category-btn').first().trigger('click');  
        // filterAndRenderMovers(mockDashboardData.selCategory);         
    }
}

// Event listener for stock clicks in the Fund Mgr Snapshot view
$(document).on('click', '.fund-mgr-stock-item', function() {
    const symbol = $(this).data('symbol');
    const name = $(this).data('name');
    const flinkid = $(this).data('flinkid');        
    const curprice = $(this).data('curprice');
    const percent = $(this).data('percent');    

    openStockDetailOverlay(symbol, name, flinkid, curprice, percent);
});

// Function to open the overlay
function openStockDetailOverlay(symbol, name, flinkid, curprice, percent) {
const overlayHtml = `
        <div id="stock-detail-overlay" class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div class="bg-[#1c2128] w-full max-w-lg rounded-xl shadow-2xl border border-gray-700 overflow-hidden flex flex-col max-h-[90vh]">
                
                <!-- REDUCED: Padding to px-4 and heading size from text-2xl to text-lg -->
                <div class="px-4 py-4 border-b border-gray-700 flex justify-between items-center bg-[#2d333b]">
                    <div>
                        <h2 class="text-lg font-bold text-white">${symbol}</h2>
                        <p class="text-gray-400 text-xs">${name}</p>
                    </div>
                    <button id="close-stock-overlay" class="text-gray-400 hover:text-white text-3xl">&times;</button>
                </div>
                
                <!-- CHANGED: 'p-6' to 'py-6 px-0 text-sm' to remove horizontal spacing and reduce font size -->
                <div id="stock-detail-content" class="py-6 px-0 overflow-y-auto flex-grow text-sm text-gray-200">
                    <div class="flex justify-center items-center h-32">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                    </div>
                </div>
                
            </div>
        </div>
    `;

    $('body').append(overlayHtml);
    fetchStockActivityDetail(symbol, name, flinkid, curprice, percent);

    // Close event handlers
    $('#close-stock-overlay, #close-stock-overlay-btn').on('click', function() {
        $('#stock-detail-overlay').remove();
    });
}

// Function to fetch and render specific details (Mock implementation)
function fetchStockActivityDetail(symbol, name, flinkid, curprice, percent) {
    var percentSt ="";
    if (percent > 0) {
        percentSt = '<span class="text-green-500">' + percent.toFixed(2) + '%' + "</span>";
    } else {
        percentSt = "<font style= color:red>" + percent.toFixed(2) + '%' + "</font>";
    }
    var trNN = "TR_NN33";
    var urlSt = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/fundlink/" + flinkid + "/st/" + symbol + "/tr/" + trNN +"/tran";
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
            if (trNN === "TR_ACC") {
                buyOnly = 1;
            }
            var close = curprice;
    
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
                            perTranSt = '<span class="text-green-500">' + diffSt + ' (' + perTran.toFixed(1) + '%)' + '</span>';
                        } else {
                            perTranSt = "<font style= color:red>" + diffSt + ' (' + perTran.toFixed(1) + '%)' + "</font>";
                        }                                  
                        AveragePrice = tranObj.avgprice;                        
                        QuantityHeld = tranObj.share;
                        TranDate = tranObj.updatedatedisplay;
                        OpenPL = perTranSt;
                        MarketValue =  (tranObj.share * prevTranObj.avgprice) + diff
                        MarketValue = MarketValue.toFixed(0) 

                        var trNameChart = "TR_NN33";
                        //"/cust/{username}/acc/{accountid}/fundlink/{accfundid}/st/{stockidsymbol}/tr/{trname}/tran/history/chart")
                        var imageUrl = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/fundlink/" + flinkid + "/st/" + symbol + "/tr/" + trNameChart + "/tran/history/chart?month=3&t=" + new Date().getTime();

                        // In a real scenario, you would fetch data from: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/stock/" + symbol
                        const detailHtml = `
                                <div class="text-white space-y-4">                         
                                    <div class="space-y-2">
                                        <p class="text-gray-400 text-sm font-bold uppercase tracking-wider px-6">Opening Price</p>
                                        <div class="mx-6 bg-gray-900 p-3 rounded-xl border border-gray-600 flex justify-between items-center">
                                            <span class="text-gray-400">Delayed Close:</span>
                                            <span class="font-semibold">$${curprice.toFixed(2)} ${percentSt}</span>
                                        </div>   
                                    </div>                                        
                                    <div class="space-y-2">
                                        <p class="text-gray-400 text-sm font-bold uppercase tracking-wider px-6">Transaction Details</p>
                                        
                                        <div class="mx-6 bg-gray-700/50 rounded-xl overflow-hidden border border-gray-600">
                                            <div class="flex justify-between p-3 border-b border-gray-600">
                                                <span class="text-gray-300">Stock</span>
                                                <span class="text-white-400 ">${symbol}</span>
                                            </div>
                                            <div class="flex justify-between p-1 ">
                                                <span class="text-gray-400">Type: </span>
                                                <span >${BSsignalStr}</span>
                                            </div>                                                       
                                            <div class="flex justify-between p-1 ">
                                                <span class="text-gray-400">Transaction: </span>
                                                <span >${TranDate}</span>
                                            </div>                   
                                            <div class="flex justify-between p-1 ">
                                                <span class="text-gray-400">Quantity Held:</span>
                                                <span >${QuantityHeld}</span>
                                            </div>
                                            <div class="flex justify-between p-1 ">
                                                <span class="text-gray-400">Average Price:</span>
                                                <span >$${AveragePrice}</span>
                                            </div>
                                            <div class="flex justify-between p-1 ">
                                                <span class="text-gray-400">Market Value:</span>
                                                <span >$${MarketValue}</span>
                                            </div>
                                            <div class="flex justify-between p-1 ">
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


                        $('#stock-detail-content').html(detailHtml);    

                    }
                }
            }

        }
    });

}

/**
 * Called when the stock chart image has finished downloading
 */
function handleImageLoad(imgElement) {
    // Hide the spinner
    $('#chart-img-spinner').addClass('hidden');
    // Show the image by removing the opacity-0 class (or setting opacity to 1)
    $(imgElement).removeClass('opacity-0').addClass('opacity-100');
}

function reload3Image(img) {
    setTimeout(function() {
        const currentSrc = img.src;
        // Append a timestamp to bypass cache and force reload
        img.src = currentSrc.split('&t=')[0] + '&t=' + new Date().getTime();
    }, 5000); // Retry after 5 seconds
}

// 1. Function to filter and re-render the list
function filterAndRenderMovers(category) {
    currentMarketCategory = category; // Update global state
    let filteredData;
    
    filteredData = marketMoversData.filter(mover => mover.category === category);
    var MarketT = "";
    if (category === "market1") {
        MarketT = mockDashboardData.market1Txt;
    } else if (category === "market2") {
        MarketT = mockDashboardData.market2Txt;
    } else if (category === "market3") {
        MarketT = mockDashboardData.market3Txt;
    } else if (category === "market4") {
        MarketT = mockDashboardData.market4Txt;
    }
    var comment = `
                <div class="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-700 -mx-3 px-3 rounded-md transition">
                    <div>
                    <p class="text-sm text-gray-200">${MarketT}</p>
                    </div>
                </div>
                `;

    const $listContainer = $('#market-movers-list');
    
    if (filteredData.length === 0) {
        
        $listContainer.html(comment + '<p class="text-gray-500">You can unlock this Fund Mgr feature from the config menu.</p>');

        // $listContainer.html('<p class="text-gray-500 text-center">No movers found for this category.</p>');
    } else{

        // Generate HTML for the filtered list
        const moversHtml = filteredData.map(stock => {
            var actionButton = `<button class="text-xs bg-sky-600 px-2 py-1 rounded-full font-bold" onclick="window.location.href='#'">Exit</button>`;
    
            if (stock.signal == 1){
                actionButton = `<button class="text-xs bg-green-600 px-2 py-1 rounded-full font-bold" onclick="window.location.href='#'">Buy</button>`;
            } else if (stock.signal == 2){
                actionButton = `<button class="text-xs bg-red-600 px-2 py-1 rounded-full font-bold" onclick="window.location.href='#'">Sell</button>`;
            }
            const gainClass = stock.percent >= 0 ? 'text-green-500' : 'text-red-500';
            // const actionButtonColor = stock.percent >= 0 ? 'bg-green-600' : 'bg-red-600';
            
            // // Fix: Use stock.symbol in the URL
            // const actionButton = `<button class="text-xs ${actionButtonColor} px-2 py-1 rounded-full font-bold" onclick="window.location.href='trade-buy.html?symbol=${stock.symbol}'">Buy</button>`;
            var curprice = stock.price;
            var percent = stock.percent;

            return `
                <div class="fund-mgr-stock-item flex items-center justify-between p-2 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 
                rounded-md cursor-pointer transition 
                data-dummyNotWorking="${stock.symbol}" 
                data-symbol="${stock.symbol}" 
                data-name="${stock.name}" 
                data-flinkid="${stock.flinkid}" 
                data-curprice="${curprice}" 
                data-percent="${percent}" >
                    <div class="flex-1">
                        <p class="text-sm font-semibold">${stock.symbol}</p>
                        <p class="text-xs text-gray-500">${stock.name}</p>
                    </div>
                    <div class="text-right mx-4">
                        <p class="text-sm font-bold">$${stock.price.toFixed(2)}</p>
                        <p class="text-xs ${gainClass}">${formatPercent(stock.percent)}</p>
                    </div>
                    ${actionButton}
                </div>
            `;
        }).join('');
        
        $listContainer.html(comment + moversHtml);
    }
    // Update active button styling
    $('.market-category-btn').removeClass('bg-sky-600').addClass('bg-gray-700');
    $(`.market-category-btn[data-category="${category}"]`).removeClass('bg-gray-700').addClass('bg-sky-600');
}
// 2. Modified renderMarketPage to include category buttons and event listener setup
// 2. Modified renderMarketPage to include category buttons and event listener setup
function renderMarketPage($container) {
    // Note: The HTML must be set first before binding events to the new elements.
    $container.html(`
        <div class="p-3">
            <h1 class="text-xl font-bold mb-4">Fund Mgr Portfolio</h1>
            
            <!-- Moved Discover Categories (now Discover Fund Mgr) above Stock Positions -->
            <div class="bg-gray-800 p-3 rounded-lg shadow-sm mb-4">
                <h2 class="text-base font-semibold text-gray-300 mb-2">Discover Fund Mgr</h2>
                <div id="category-buttons-container" class="grid grid-cols-3 gap-2 text-sm text-center">
                    <div class="market-category-btn bg-gray-700 p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="market1" data-categoryid="${mockDashboardData.market1FId}">${mockDashboardData.market1}</div>
                    <div class="market-category-btn bg-gray-700 p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="market2" data-categoryid="${mockDashboardData.market2FId}">${mockDashboardData.market2}</div>
                    <div class="market-category-btn bg-gray-700 p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="market3" data-categoryid="${mockDashboardData.market3FId}">${mockDashboardData.market3}</div>
                    <div class="market-category-btn bg-gray-700 p-2 rounded-md hover:bg-gray-600 transition cursor-pointer" data-category="market4" data-categoryid="${mockDashboardData.market4FId}">${mockDashboardData.market4}</div>
                </div>
            </div>

            <div class="bg-gray-800 p-3 rounded-lg shadow-sm">
                <h2 class="text-base font-semibold text-gray-300 mb-3">Stock Positions</h2>
                <div id="market-movers-list" class="space-y-3">
                    ${showLoading($('<div />'))}
                </div>
            </div>
            
            <!-- Educational & Informational Disclaimer -->
            <div class="p-3 mt-4 text-center border-t border-gray-800">
                <p class="text-xs text-gray-500 leading-relaxed italic">
                    For educational and informational purposes only. Past performance is not indicative of future results. This is not financial advice. Paper trading figures do not reflect real-market friction.
                </p>
            </div>                
        </div>
    `);
    
    // Attach the click handler to the parent container AFTER the HTML is injected.
    $container.off('click', '.market-category-btn').on('click', '.market-category-btn', function() {
        const selectedCategory = $(this).data('category'); 
        const selectedCategoryid = $(this).data('categoryid'); 
        mockDashboardData.selCategory = selectedCategory;
        mockDashboardData.selCategoryFId = selectedCategoryid; 
        filteredData = marketMoversData.filter(mover => mover.category === selectedCategory);
        if (filteredData.length == 0) {
            InitFundStock(mockDashboardData.selCategoryFId);
        }
        filterAndRenderMovers(selectedCategory);
    });

    // Initial data fetch and render (defaults to 'All')
    backend.getMarketMovers().done(data => {
        // Use the globally tracked category for initial render
        filterAndRenderMovers(currentMarketCategory);
    }).fail(() => {
        $('#market-movers-list').html('<p class="text-red-500 text-xs text-center">Failed to load market data.</p>');
    });
}

function InitFundStock(selCategoryFId) {
    fundLinkId = selCategoryFId;
    if (fundLinkId == 0) {
        return;
    }
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/fundlinkbest/" + fundLinkId + "/st",
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

        initFundTR(fundLinkId);
        return;
    }
}

function initFundTR(flinkid) {
//    $("#grtxt1").show(0);

    if (stockFundObjList.length == 0) {
        $("#mytrid").html("Error. Please refresh the Market page again....");
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

            var fclose = stockObjTmp.afstockInfo.fclose;
            var prevClose = stockObjTmp.prevClose;
            var change = (fclose - prevClose);
            var changeper = (100 * (fclose - prevClose)/prevClose);
            const newPosition = { 
                symbol: stockObjTmp.symbol, 
                name: stockObjTmp.stockname, 
                price: stockObjTmp.afstockInfo.fclose, 
                change: change, 
                percent: changeper, 
                signal: stockObjTmp.trsignal,
                category: mockDashboardData.selCategory,
                flinkid: flinkid
            };

            mockMarketMoversData.push(newPosition);     
            marketMoversData  = mockMarketMoversData  

        }
    }
    filterAndRenderMovers(mockDashboardData.selCategory);
}


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
                            accName = accObj.id + "-" + accData.ref.replaceAll("_", " ");
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
                htmlSt += '<h6 class="mb-0">Total: ' + perfBalPercent + '%</h6>';

                if (i == 0) {
                    $("#market1").html(htmlSt);
                    mockDashboardData.market1 = htmlSt;
                    mockDashboardData.market1FId = accObj.id;   
                    mockDashboardData.selCategory="market1"; // Set a default category
                    mockDashboardData.selFId = accObj.id;
                    mockDashboardData.market1Txt = accName + " " + accObj.service 

                } else if (i == 1) {
                    $("#market2").html(htmlSt);
                    mockDashboardData.market2 = htmlSt;
                    mockDashboardData.market2FId = accObj.id;                
                    mockDashboardData.market2Txt = accName + " " + accObj.service 
                } else if (i == 2) {
                    $("#market3").html(htmlSt);
                    mockDashboardData.market3 = htmlSt;
                    mockDashboardData.market3FId = accObj.id;                
                    mockDashboardData.market3Txt = accName + " " + accObj.service 
                } else if (i == 3) {
                    $("#market4").html(htmlSt);
                    mockDashboardData.market4 = htmlSt;
                    mockDashboardData.market4FId = accObj.id;                
                    mockDashboardData.market4Txt = accName + " " + accObj.service 
                    break;
                }
            }

        }
        //initialize market1 fund manager

        InitFundStock(mockDashboardData.selFId);
        
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
if (graphTopStname.length == 0) return;

    // Check if the canvas actually exists in the current DOM
    var canvas = document.getElementById("canvasTopId");
    if (!canvas) return;

    // If the chart exists but the canvas is new, destroy the old instance
    if (myCharttop != null) {
        myCharttop.destroy();
        myCharttop = null;
    }

    var graphObjTop = {
        type: "bar",
        data: {
            labels: graphTopStname.split(","),
            datasets: [{
                label: "Perf NN3(%)",
                data: graphTopStnn3Per.split(","),
                backgroundColor: "rgba(0, 156, 255, .7)"
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // Set legend text to white
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: 'white' // Set Y-axis labels to white
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' // Optional: light white grid lines
                    }
                },
                x: {
                    ticks: {
                        color: 'white' // Set X-axis labels to white
                    },
                    grid: {
                        display: false // Usually cleaner for bar charts
                    }
                }
            }
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
// Select the spinner and canvas elements
    const $spinner = $('#chart-spinner');
    const $canvas = $('#canvasTopId');

    if (myCharttop == null) {
        // Hide spinner and show canvas before rendering the new chart
        $spinner.hide();
        $canvas.show();
        
        ctx1top = $canvas.get(0).getContext("2d");
        // Note: Changed from 'myChartop' to 'myCharttop' to fix the global variable consistency
        myCharttop = new Chart(ctx1top, graphObjTop); 
    } else {
        $spinner.hide();
        $canvas.show();
        myCharttop.data = graphObjTop.data;
        myCharttop.update();
    }

}


function renderDashboardPage($container) {
    const favoritesHtml = mockDashboardData.favoriteStocks.map(stock => `
    <div class="bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-600 transition">
        <span class="text-sm font-semibold">${stock}</span>
    </div>
    `).join('');
    
    
    $container.html(`
        <div class="p-3">

            <div id="indices-ticker" class="grid grid-cols-3 gap-2 mb-4">
                
            </div>

            <div id="brokerage-summary" class="bg-gray-800 p-3 rounded-lg shadow-sm mb-4">
                <div class="card">
                    <div class="card-body">
                        <h6 class="mb-2">Top 10 Stock performance</h6>
                        <div class="relative flex justify-center items-center min-h-[150px]">
                            <div id="chart-spinner" class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
                            <canvas id="canvasTopId" style="display:none;"></canvas>
                        </div>
                    </div>
                </div>            
            </div>
            <div class="bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
                <h2 class="text-base font-semibold text-gray-300 mb-3">My Portfolio Stocks - ${mockDashboardData.plan}</h2>
                <div id="favorite-stocks" class="flex flex-wrap gap-2">
                    ${favoritesHtml}
                </div>
            </div>

            <div id="portfolio-news" class="bg-gray-800 p-3 rounded-lg shadow-sm">
                <h2 class="text-base font-semibold text-gray-300 mb-2">Portfolio News</h2>
                ${showLoading($('<div />'))}
            </div>
        </div>
    `);


    backend.getDashboardData().done(data => {
        const dayGainClass = data.dayGain >= 0 ? 'text-green-500' : 'text-red-500';
        $('.text-2xl.font-bold span').text(formatCurrency(data.totalAssets).replace('$', ''));
        $('.text-lg.font-bold').removeClass('text-green-500 text-red-500').addClass(dayGainClass).html(`${data.dayGain >= 0 ? '+' : ''} ${formatCurrency(data.dayGain)}`);
        const $dayGainDiv = $('.text-lg.font-bold').closest('div');
        $dayGainDiv.find('.text-xs.text-gray-400').text(`Day's Gain (${formatPercent(data.dayGainPercent)})`);

        const indicesHtml = data.indices.map(index => {
            const changeClass = index.change >= 0 ? 'text-green-500' : 'text-red-500';
            return `
                <div class="bg-gray-800 p-2 rounded-lg text-center border border-gray-700">
                    <p class="text-xs text-gray-400">${index.symbol}</p>
                    <p class="text-sm font-bold">${index.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</p>
                    <p class="text-xs ${changeClass}">${index.change >= 0 ? '+' : ''}${index.change.toFixed(2)} (${index.percent >= 0 ? '+' : ''}${index.percent.toFixed(2)}%)</p>
                </div>
            `;
        }).join('');
        $('#indices-ticker').html(indicesHtml);

        const newsHtml = data.news.map(item => `
            <div class="portfolio-news-item flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-700 -mx-3 px-3 rounded-md transition" 
                data-link="${item.link}">
                <div>
                    <p class="text-sm text-gray-200">${item.title}</p>
                    <p class="text-xs text-gray-500">${item.source} ${item.date} | ${item.publisher}</p>
                </div>
                <span class="text-gray-400 text-lg">&gt;</span>
            </div>
        `).join('');

        $('#portfolio-news').html(`
            <h2 class="text-base font-semibold text-gray-300 mb-2">Portfolio News</h2>
            ${newsHtml}
        `);

        displayTopStockPer();
    }).fail(() => {
        $container.find('#indices-ticker').after('<p class="text-red-500 p-3 text-sm text-center">Failed to load market data.</p>');
    });
}
// Event listener for portfolio news item clicks
$(document).on('click', '.portfolio-news-item', function() {
    const url = $(this).data('link');
    if (url) {
        window.open(url, '_blank'); // Opens the news source in a new browser tab
    }
});

$(document).ready(function() {
        renderHomePage();

        let pollIntervalID = null;
        let checks = 0; // Counter to prevent infinite loops (optional, but recommended)
        const MAX_CHECKS = 80; // Max 20 seconds (200 * 100ms) before giving up
        // Start the polling interval
        pollIntervalID = setInterval(() => {
            checks++;

            // 1. CHECK FOR READY FLAG
            if ((mockDashboardData.ready)) {                
                // Stop the loop
                clearInterval(pollIntervalID);                

                $('#loading-overlay').addClass('hidden-overlay');             
                return; 
            }

            // 2. CHECK FOR MAX TIMEOUT (Fallback)
            if (checks >= MAX_CHECKS) {
                 // Stop the loop
                clearInterval(pollIntervalID);               
                // Reject the promise if the data never became ready
                 $('#loading-overlay').addClass('hidden-overlay');

                // Hide the loading overlay after content is rendered
          
                return;                 
            }
        }, MOCK_API_DELAY);

    // Wait for the home page to render and trigger data loading
    // renderHomePage();
    // Use a longer delay (1000ms) to ensure the spinner is visibly displayed

    // setTimeout(() => {
    //     $('#loading-overlay').addClass('hidden-overlay');
    // }, 1000); // Increased from 300ms to 1000ms

    $('.nav-item').on('click', function() {
        const page = $(this).data('page');
        if (page !== 'aiaphome') {
            // This assumes other pages like dpositions, dconfig, dprofile exist
            window.location.href = page + '.html';
        }
    });
});

function renderHomePage() {
    $('#main-content').html(`
        <!-- New fixed header with tabs and refresh button -->
        <div id="home-page-header" class="flex justify-between items-center px-3 sticky top-0 bg-[#161b22] z-10 py-3 border-b border-gray-700">
            <div class="flex justify-start">
                <button class="home-tab-button text-xl font-bold active text-gray-200" data-view="market">Market</button>
                <button class="home-tab-button text-xl font-bold text-gray-200" data-view="fundmgr">Fund Mgr</button>
            </div>
            <button id="refresh-button" class="text-2xl text-sky-400 hover:text-sky-300 transition" aria-label="Refresh Data">
                <span class="refresh-icon">&#x21BB;</span>
            </button>
        </div>
        <!-- Content area -->
        <div id="home-content" class="min-h-full"></div>
    `);
    
    // Add event listeners for the tab buttons
    $('.home-tab-button').on('click', function() {
        const view = $(this).data('view');
        switchHomeView(view);
    });
    
    // Add event listener for refresh button
    $('#refresh-button').on('click', function() {
        refreshData();
    });
    
    switchHomeView(currentHomeView);
}