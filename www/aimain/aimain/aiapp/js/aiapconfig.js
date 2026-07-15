const MOCK_API_DELAY = 500;
let isLoggedIn = false; // Initial state: not logged in

var profileData = {
    ready: false,
    offerReady: false,
    plan: 0,
    planPending: 0,
    planName: "",
    newPlan: 0,
    promoCode: ""
}

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
          
var featureActivity = [];

isLoggedIn = true;
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
                    profileData.plan = custObj.substatus;
                    profileData.planName = pp;

                    var dataSt = custObj.data;
                    try {
                        if (dataSt != null) {
                            if (dataSt !== "") {
                                dataSt = dataSt.replaceAll('#', '"');
                                var detailObj = JSON.parse(dataSt);
                                if (detailObj != null) {
                                    if (detailObj.nPlan !== -1) {
                                        if (custObj.substatus != detailObj.nPlan) {  
                                            profileData.planPending = detailObj.nPlan;
                                        }
                                    }
                                }
                            }
                        }
                    } catch (err) {

                    }                                         
                    

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
            accObjList = JSON.parse(accObjListStr);

            for (i = 0; i < accObjList.length; i++) {
                var accObjTmp = accObjList[i];
                if (accObjTmp.type == 110) { //INT_TRADING_ACCOUNT
                    accObj = accObjTmp;
                    accId = accObj.id;
                } else if (accObjTmp.type === INT_MUTUAL_FUND_ACCOUNT) { //INT_MUTUAL_FUND_ACCOUNT = 120;
                    accfundObj = accObjTmp;
                    accfundId = accfundObj.id;
                } else if (accObjTmp.type === INT_DEVOP_ACCOUNT) {
                    accdevObj = accObjTmp;
                    accdevId = accObjTmp.id;
                }
            }
            myInitCurFeat();
            myInitOfferFeat();
            myInitsubsFund();
        }
    });

}


function recordFeature(cd, name, fstatus, price, desc) {
    const newFeature = { 
        cd: cd,
        name: name, 
        fstatus: fstatus, 
        price: price, 
        desc: desc,
        chfstatus: fstatus, 
        readdstatus: false
    };

    featureActivity.push(newFeature);
}


var plan2 = 'Basic Price plan - $50 for max 2 stocks';
var plan8 = 'Standard Price plan - $100 for max 8 stocks';
var plan20 = 'Premium Price plan - $200 for max 20 stocks';
var plan40 = 'Deluxe Price Plan - $400 for max 40 stocks';
var plan80 = 'Deluxe2 Price Plan - $800 for max 80 stocks';
var plan500 = 'API Plan - Max 500 stocks';
var plan0 = 'SRV Plan - Max 0 stocks';



var fundBestObjListStr = "";
var fundBestObjList = "";
var fundObjListStr = "";
var fundObjList = "";

var servListCurFeat = "";

function myInitCurFeat() {

    var fund = false;
    for (i = 0; i < accObjList.length; i++) {
        var accObj = accObjList[i];
        if (accObj.type === INT_MUTUAL_FUND_ACCOUNT) {
            fund = true;
        }
    }

    var htmlSt = "";
    htmlSt += '<div class="accordion accordion-flush" id="accordionFlushExample">';
    try {
        
        featureActivity=[];

        var servListSt = custObj.serL;
        servListSt = servListSt.replaceAll('#', '"');
        if (servListSt == ""){
            servListSt ="[]"
        }
        var servList = JSON.parse(servListSt);        
        servListCurFeat = servList;

        servListSt = custObj.deserL;
        servListSt = servListSt.replaceAll('#', '"');
        if (servListSt == ""){
            servListSt ="[]"
        }        
        var deservList = JSON.parse(servListSt);        
        servRemoveList = deservList;        
        
        if (servList.length == 0) {
            $("#mycurfeatid").html("No feature found.");
        }
        if (servList.length > 0) {

            for (i = 0; i < servList.length; i++) {
                var idN = "cur" + i;
                var col1 = ""
                var col2 = "";
                var col3 = "";
                var col4 = "";
                var servObj = servList[i];
                var date = new Date(servObj.st*1000).toLocaleDateString("en-US");
                var price = servObj.bPrice;
                if (price === undefined || price === null) {
                    price = 0;
                }
                var priceSt = Number(price).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                if (price < 0) {
                    var pl = -price / 100;
                    priceSt = "Plan X" + pl;
                }
                col1 = servObj.cd;

                if (servObj.type == 20) {
                    col1 = " -------";                
                } else {
                    col1 = servObj.cd;
                }

                col2 = servObj.na;
                if ((servObj.type == 0) || (servObj.type == 1)) {
                    col2 = col2 + " (" + servObj.cnt + ")";
                }
                col3 = priceSt;
                if (servObj.cnt == -1) {
                    col4 += "<br><font style= color:blue>**Promotation completed</font>";
                }
                if (servObj.type == 20) {
                    continue;
                }
                recordFeature(servObj.cd, col1, true, col3, col2);


                var removeFlag = false;
                if (servRemoveList != null) {
                    for (k = 0; k < servRemoveList.length; k++) {
                        var servReObj = servRemoveList[k];
                        if (servObj.cd == servReObj.cd) {                            
                            var msg = '<br><span style="color:lightblue">This feature will be removed in the next bill payment date.<span>';
                            // msg = '<p style="color:blue">' + msg + '</p>';
                            col4 += msg;
                            removeFlag = true;
                            for (m = 0; m < featureActivity.length; m++) {
                                feature = featureActivity[m];
                                if (feature.cd == servObj.cd) {
                                    feature.fstatus = false
                                    feature.chfstatus = false
                                    feature.desc += msg;
                                    feature.readdstatus = removeFlag;
                                    break;
                                }
                            }

                            break;

                        }
                    }
                }
            }
            // profileData.ready = true;

        }
    } catch (err) {
    }
}


/////////////////////////////////

function myInitOfferFeat() {

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/0/billing/offer",
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function () {
            window.location.href = "iisend.html";
        },
        success: function (resultOfferObjList) {

            var offerObjListStr = "";
            var offerObjList = "";
            if (resultOfferObjList !== "") {
                if (resultOfferObjList.length > 0) {
                    offerObjListStr = JSON.stringify(resultOfferObjList, null, '\t');
                    offerObjList = JSON.parse(offerObjListStr);
                } else {
                    $("#myofferfeatid").html("No more feature available.");
                }
            }

            var custDSt = "";
            custDSt = custObj.serL; // custObj.data;
            if (offerObjList != "") {
                var htmlSt = "";
                for (i = 0; i < offerObjList.length; i++) {
                    var idN = "off" + i;
                    var col1 = ""
                    var col2 = ""
                    var col3 = "";
                    var col4 = "";
                    var commObj = offerObjList[i];
                    var id = commObj.id;
                    col1 = commObj.cod;
                    // if (col1.indexOf("BillCustTR-NN") != -1) {      cause it to faild to load???????
                    //     continue;
                    // }
                    if (col1.indexOf("BillCustTR-") != -1) {

                        var tmp = col1.replace("BillCustTR-", "");
                        tmp = "Dev" + tmp;
                        if (custDSt.indexOf(tmp) != -1) {
                            // check if already have this feature    
                            var descSt = commObj.name + '<br>' + commObj.comment;
                            descSt = getHtmlDesc(descSt);
                            var bodyId = tmp + 'Desc';
                            $("#" + bodyId).html(descSt);
                            continue;
                        }
                        if (custT == 30) {
                            continue;
                        }
                    }
                    if (custDSt.indexOf(col1) != -1) {
                        // check if already have this feature    
                        var descSt = commObj.name + '<br>' + commObj.comment;
                        descSt = getHtmlDesc(descSt);
                        var bodyId = commObj.cod + 'Desc';
                        $("#" + bodyId).html(descSt);
                        continue;
                    }

                    if (col1.indexOf("BillMgr-") != -1) {
                        continue;
                    }
                    col2 = commObj.name;
                    var price = commObj.bprice;
                    var priceSt = Number(price).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                    if (price < 0) {
                        var pl = -price / 100;
                        priceSt = "Plan X" + pl;
                    }
                    col3 = priceSt;
                    col4 = commObj.comment;
                    var tranSt = "";
                    var descSt = col4;
                    descSt = getHtmlDesc(descSt);
                    var found = false;
                    for (j = 0; j < featureActivity.length; j++) {
                        feature = featureActivity[j];
                        if (feature.cd == commObj.cod) {
                            found = true;
                            break;
                        }
                    }
                    if (found == false){
                        recordFeature(commObj.cod, col1, false, col3, col2);
                    }
                    

                } // end of offer loop
                profileData.offerReady = true;
                renderConfigPage();

            }

        }
    });
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
function myInitsubsFund() {

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/fundbestlist",
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function () {
            window.location.href = "aiiend.html";
        },
        success: function (resultFundBestObjList) {

            if (resultFundBestObjList !== "") {
                if (resultFundBestObjList.length > 0) {
                    fundBestObjListStr = JSON.stringify(resultFundBestObjList, null, '\t');
                }

            }

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

                    if (fundBestObjListStr != "") {
                        fundBestObjList = JSON.parse(fundBestObjListStr);
                    }
                    if (fundObjListStr != "") {
                        fundObjList = JSON.parse(fundObjListStr);
                    }

                    var fundEnableObjList = fundBestObjList;
/////////////////////////////////
                    var htmlSt = "";
                    for (i = 0; i < fundEnableObjList.length; i++) {
                        var idN = "col" + (100 + i);
                        var col1 = ""
                        var col2 = ""
                        var col3 = "";
                        var col4 = "";
                        var accObj = fundEnableObjList[i];
//                            console.log(accObj);

                        var subscribed = false;
                        for (j = 0; j < fundObjList.length; j++) {
                            var accfeatObj = fundObjList[j];
                            if (accfeatObj.accountname === accObj.accountname) {

                                subscribed = true;

                                var dataSt = accObj.service;
                                var msgSt = dataSt;

                                dataSt = dataSt.replaceAll("<br>", "");
                                dataSt = dataSt.replaceAll("\n", "");
                                var daList = dataSt.split(" -");
                                if (daList.length > 1) {
                                    var fieldList = daList[0].split(" ");
                                    var nameSt = "";
                                    msgSt = daList;
                                    var dateSt = "";
                                    if (fieldList.length >= 2) {
                                        dateSt = fieldList[0];
                                        nameSt = fieldList[1];
                                        if (fieldList.length >= 3) {
                                            nameSt += " " + fieldList[2];
                                        }
                                        msgSt = dateSt + " " + nameSt + "<br> " + daList[1];

                                        msgSt = getHtmlDesc(msgSt);
                                    }
                                } else {
                                    msgSt = getHtmlDesc(dataSt);
                                }

                                var cod = "BillMgr-fund" + accObj.id;
                                var bodyId = cod + 'Desc';
                                $("#" + bodyId).html(msgSt);

                                break;
                            }
                        }
                        if (subscribed === true) {
                            continue;
                        }
                        var accName = "fundMgr";
                        var accDataSt = accObj.data;
                        var perfBalPercent = 0;
                        var perfBal = 0;
                        try {
                            if (accDataSt != null) {
                                accDataSt = accDataSt.replaceAll('#', '"');
                                var accData = JSON.parse(accDataSt);
                                if (typeof accData.ref === "undefined") {
                                    ;
                                } else if (accData.ref !== "") {
                                    accName = accData.ref;
                                }
                            }
                        } catch (err) {
                        }

                        if (accObj.type === INT_MUTUAL_FUND_ACCOUNT) { //INT_MUTUAL_FUND_ACCOUNT = 120;
                            var accDataSt = accObj.data;

                            var perfAllBalPercent = 0;
                            var total = 0;
                            try {
                                if (accDataSt != null) {
                                    accDataSt = accDataSt.replaceAll('#', '"');
                                    var accData = JSON.parse(accDataSt);                                    
                                    var perfList = accData.perfL;
                                    if (accData != null) {
                      
                                        //name,cur%, 1mon%
                                            perfAllBalPercent = accData.curM_6;
                                            total = perfAllBalPercent; // * N_FUN_ST * TRADING_AMOUNT / 100;

                                    }
                                }
                            } catch (err) {
                            }
                            
                            var totSt = total + "%";
                            var perN = total.toFixed(2);
                            var totSt = "" + perN;
                            if (perN < 0) {
                                totSt = '<font style= color:red>' + totSt + '%</font>';
                            } else {
                                totSt = '<font style= color:green>' + totSt + '%</font>';
                            }


                            var dataSt = accObj.service;
                            var msgSt = dataSt;

                            dataSt = dataSt.replaceAll("<br>", "");
                            dataSt = dataSt.replaceAll("\n", "");
                            var daList = dataSt.split(" -");
                            if (daList.length > 1) {
                                var fieldList = daList[0].split(" ");
                                var nameSt = "";
                                msgSt = daList;
                                var dateSt = "";
                                if (fieldList.length >= 2) {
                                    dateSt = fieldList[0];
                                    nameSt = fieldList[1];
                                    if (fieldList.length >= 3) {
                                        nameSt += " " + fieldList[2];
                                    }
                                    msgSt = dateSt + " " + nameSt + "<br> " + daList[1];

                                    msgSt = getHtmlDesc(msgSt);
                                }
                            } else {
                                msgSt = getHtmlDesc(dataSt);
                            }

                        }
                        var billCd = "BillMgr-fund" + accObj.id
                        col1 = billCd;
                        var price = 60;
                        var priceSt = Number(price).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                        col3 = priceSt;
                        col2 = 'Current Total: ' + totSt + ' - ' + accName;
                        col4 = msgSt;

                        var found = false;
                        for (k = 0; k < featureActivity.length; k++) {
                            feature = featureActivity[k];
                            if (feature.cd == billCd) {
                                found = true;
                                break;
                            }
                        }
                        if (found == false){
                            recordFeature(billCd, billCd, false, col3, col2);
                        }

                    } // end loop
                    profileData.ready = true;
                    renderConfigPage();

                }
            });
        }
    });

}


// Global configuration data stored in memory and localStorage
let configData = {
    darkMode: true,
    notifications: true,
    biometrics: false,
    autoSync: true,
    currency: 'USD',
    language: 'English',
    riskLevel: 'medium',
    twoFactorAuth: false
};

// Load configuration from localStorage
function loadConfig() {
    const savedConfig = localStorage.getItem('appConfig');
    if (savedConfig) {
        // Merge saved data with defaults to ensure all keys exist
        configData = { ...configData, ...JSON.parse(savedConfig) };
    }


}

// Save current configuration to localStorage
function saveConfig() {
    localStorage.setItem('appConfig', JSON.stringify(configData));
}

// Update a boolean (toggle) setting
function updateToggleSetting(setting, value) {
    configData[setting] = value;
    saveConfig();
    showToast(`Setting ${setting} ${value ? 'enabled' : 'disabled'}`);
}

// Display a transient toast notification
function showToast(message) {
    const toast = $(`
        <div class="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300 opacity-0">
            ${message}
        </div>
    `);
    
    $('body').append(toast);
    // Ensure toast is rendered before starting transition
    setTimeout(() => toast.css('opacity', '1'), 10); 
    
    // Hide and remove the toast after a delay
    setTimeout(() => {
        toast.css('opacity', '0');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Function to refresh the page when the icon is clicked
function refreshData() {
    // This is updated to perform a hard page refresh
    window.location.reload();
}

// Main function to render the configuration UI
function showFeatureHtml(idex) {
    const feature = featureActivity[idex]; //
    return (`
        <div class="flex justify-between items-center">
            <div>
                <p class="text-sm font-medium">${feature.name} ${feature.price}</p>
                <p class="text-xs text-gray-400">${feature.desc}</p>
            </div>
            <label class="toggle-switch">
                <input type="checkbox" 
                       class="feature-toggle-input" 
                       data-index="${idex}" 
                       ${feature.fstatus ? 'checked' : ''}>
                <span class="toggle-slider"></span>
            </label>
        </div>
    `);
}
function renderConfigPage() {
    var featureHtml ="";
    for (i = 0; i < featureActivity.length; i++) {
        feature = featureActivity[i];
        featureHtml += showFeatureHtml(i);
    }
    var pendingPlanMsg ="";
    if (profileData.planPending > 0) {
        var planN = profileData.planPending;
        var pp = "Basic Plan";
        if (planN == 0) {
            pp = "Basic Plan";
        } else if (planN == 10) {
            pp = "Standard Plan";
        } else if (planN == 20) {
            pp = "Premium Plan";
        } else if (planN == 40) {
            pp = "Professional Plan";
        } else if (planN == 80) {
            pp = "Enterprise Plan";
        } else if (planN == 90) {
            pp = "API Plan";
        } else if (planN == 100) {
            pp = "SRV Plan";
        }        
        pendingPlanMsg = '<span style="color:#0284c7;"> The new plan ('+pp+') will be changed in the next bill payment date.</span>'
    }
    // Title is now in the fixed header, so only content is rendered here.
    // Using px-3 for consistent horizontal padding.
    $('#main-content').html(`
        <div class="px-3 pt-2 pb-4"> 
            <div class="space-y-4">
                <!-- App Preferences Section -->
                <div class="bg-gray-800 p-4 rounded-lg shadow-sm">
                    <h2 class="text-base font-semibold text-gray-300 mb-4">Current Plan</h2>
                    
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <p class="text-sm font-medium">Your Plan</p>                   
                            <span id="plan-name" class="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">${profileData.planName}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <p class="text-sm font-medium">${pendingPlanMsg}</p>    
                        </div>                            
                        <div>
                            <p class="text-sm font-medium mb-2">Select New Plan</p>
                            <div class="relative">
                                <button id="custom-plan-dropdown" class="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg flex justify-between items-center p-2.5 transition focus:border-emerald-500">
                                    <span id="selected-plan-text">Select a new Price Plan</span>
                                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                                
                                <div id="plan-options-menu" class="hidden absolute z-50 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                    <div class="plan-option p-3 hover:bg-gray-800 cursor-pointer text-sm border-b border-gray-800" data-value="-1">Select a new Price Plan</div>
                                    <div class="plan-option p-3 hover:bg-gray-800 cursor-pointer text-sm border-b border-gray-800" data-value="0">Basic Plan - 2 stocks $50</div>
                                    <div class="plan-option p-3 hover:bg-gray-800 cursor-pointer text-sm border-b border-gray-800" data-value="10">Standard Plan - 8 stocks $100</div>                                    
                                    <div class="plan-option p-3 hover:bg-gray-800 cursor-pointer text-sm border-b border-gray-800" data-value="20">Premium Plan - 20 stocks $200</div>
                                    <div class="plan-option p-3 hover:bg-gray-800 cursor-pointer text-sm border-b border-gray-800" data-value="40">Professional Plan - 40 stocks $400</div>
                                    <div class="plan-option p-3 hover:bg-gray-800 cursor-pointer text-sm border-b border-gray-800" data-value="80">Enterprise Plan - 80 stocks $800</div>
                                </div>
                                
                                <input type="hidden" id="plan-select" value="0">
                            </div>
                        </div>

                        <div>
                            <p class="text-sm font-medium">Promotion Code</p>
                            <p class="text-xs text-gray-400"></p>                             
                            <input type="text" id="promo-code" placeholder="Enter code" 
                                class="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 transition uppercase">
                        </div>
                    </div>
    
                </div>

                <!-- Trading & Security Section -->
                <div class="bg-gray-800 p-4 rounded-lg shadow-sm">
                    <h2 class="text-base font-semibold text-gray-300 mb-3">Feature & Price plan</h2>
                    <div class="space-y-3">
                        ${featureHtml}

                        <div class="pt-2">
                            <p class="text-sm font-medium mb-2">Risk Level</p>
                            <!-- Risk Level Buttons -->
                            <div class="flex space-x-2">
                                <button class="risk-level-btn flex-1 py-2 px-3 text-xs rounded-md ${configData.riskLevel === 'low' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300'}" data-level="low">Low</button>
                                <button class="risk-level-btn flex-1 py-2 px-3 text-xs rounded-md ${configData.riskLevel === 'medium' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300'}" data-level="medium">Medium</button>
                                <button class="risk-level-btn flex-1 py-2 px-3 text-xs rounded-md ${configData.riskLevel === 'high' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300'}" data-level="high">High</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Account & Support Section 
                <div class="bg-gray-800 p-4 rounded-lg shadow-sm">
                    <h2 class="text-base font-semibold text-gray-300 mb-3">Account & Support</h2>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center py-2 border-b border-gray-700 cursor-pointer hover:bg-gray-700 -mx-3 px-3 rounded-md transition">
                            <span class="text-sm">Currency Settings</span>
                            <span class="text-gray-400 text-sm">${configData.currency} &gt;</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-700 cursor-pointer hover:bg-gray-700 -mx-3 px-3 rounded-md transition">
                            <span class="text-sm">Language</span>
                            <span class="text-gray-400 text-sm">${configData.language} &gt;</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-700 cursor-pointer hover:bg-gray-700 -mx-3 px-3 rounded-md transition">
                            <span class="text-sm">Help & Support</span>
                            <span class="text-gray-400">&gt;</span>
                        </div>
                        <div class="flex justify-between items-center py-2 cursor-pointer hover:bg-gray-700 -mx-3 px-3 rounded-md transition">
                            <span class="text-sm">About</span>
                            <span class="text-gray-400">&gt;</span>
                        </div>
                    </div>
                </div>
                -->
                <div class="mt-8 flex space-x-3 px-3">
                    <button class="clear-cache-btn flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors text-sm">
                        Clear & Reset
                    </button>       
                    <button id="save-config-btn" class="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg text-sm">
                        Save Changes
                    </button>

                </div>

                <div class="h-20"></div>
            </div>
        </div>
    `);

    // Attach event listeners to the toggles using jQuery for state management
    $('#darkModeToggle').on('change', function() {
        updateToggleSetting('darkMode', this.checked);
    });

    $('#notificationsToggle').on('change', function() {
        updateToggleSetting('notifications', this.checked);
    });

    $('#biometricsToggle').on('change', function() {
        updateToggleSetting('biometrics', this.checked);
    });

    $('#autoSyncToggle').on('change', function() {
        updateToggleSetting('autoSync', this.checked);
    });

    $('#twoFactorToggle').on('change', function() {
        updateToggleSetting('twoFactorAuth', this.checked);
    });

    // Attach event listeners to risk level buttons
    $('.risk-level-btn').on('click', function() {
        const level = $(this).data('level');
        updateRiskLevel(level);
    });

    // Attach event listener to clear cache button
    $('.clear-cache-btn').on('click', function() {
        showToast('Cache Cleared! (Simulated)');
    });
}

// Function to update the risk level button group
function updateRiskLevel(level) {
    configData.riskLevel = level;
    saveConfig();
    renderConfigPage(); // Re-render to update button styles
    showToast(`Risk level set to ${level}`);
}

function submitConfigurationChanges() {
    // if (custChange === false) { // just for testing Demo check   
    if (iisurl !== iisurl_LOCAL && custChange === false) { // Demo check          
        // We will perform a validation check upfront
        if (profileData.promoCode.indexOf("Debug") === -1) {
            let demoBlock = false;
            
            // Check if plan changed
            let newPlanNum = Number(profileData.newPlan);
            if ((newPlanNum >= 0 && profileData.newPlan != profileData.plan) || (newPlanNum >= 0 && profileData.planPending > 0)) {
                demoBlock = true;
            }
            
            // Check if features changed
            for (let i = 0; i < featureActivity.length; i++) {
                if (featureActivity[i].fstatus !== featureActivity[i].chfstatus) {
                    demoBlock = true;
                    break;
                }
            }
            
            if (demoBlock) {
                showToast('<span style="color:red">This operation is not supported on demo accounts.</span>');
                return;
            }
        }
    }

    // --- 1. BUILD QUERY PARAMETERS ---
    let queryParams = [];

    // Part A: Plan Evaluation
    let newPlanNum = Number(profileData.newPlan);
    let changePlan = false;
    if ((newPlanNum >= 0 && profileData.newPlan != profileData.plan) || (newPlanNum >= 0 && profileData.planPending > 0)) {
        changePlan = true;
        queryParams.push("plan=" + profileData.newPlan);
    }

    // Part B: Feature Toggles Evaluation (Constructing the combined promo CSV block)
    let featurePromos = [];
    for (let i = 0; i < featureActivity.length; i++) {
        let feature = featureActivity[i];
        if (feature.fstatus !== feature.chfstatus) {
            let promoItem = feature.cd;
            if (feature.fstatus === true && feature.chfstatus === false) {
                promoItem = "-" + promoItem; // prefix subtraction flag for active features being turned off
            }
            featurePromos.push(promoItem);
        }
    }

    // Part C: Finalize Promo Parameter (Merge text promo field input and toggled items list)
    let finalPromos = [];
    if (profileData.promoCode.length > 0) {
        finalPromos.push(profileData.promoCode);
    }
    if (featurePromos.length > 0) {
        finalPromos.push(featurePromos.join(","));
    }

    if (finalPromos.length > 0) {
        queryParams.push("promo=" + finalPromos.join(","));
    }

    // If absolutely nothing modified, stop early
    if (queryParams.length === 0) {
        return; 
    }

    // --- 2. EXECUTE THE UNIFIED AJAX CALL ---
    let url_Update = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/custupdate?" + queryParams.join("&");

    $.ajax({
        url: url_Update,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, // 120 sec
        success: function (result) {
            var webMsg = result.webMsg;
            var resultID = webMsg.resultID;
            var msgObjStr = '';

            if (resultID === 0) {
                msgObjStr = "Update failed. Please try again.";
            } else if (resultID === 10 || resultID === 12) {
                msgObjStr = "Update failed. Promotion code not allowed.";
            }

            if (resultID !== 1) {
                msgObjStr = '<span style="color:red">' + msgObjStr + '</span>';
                showToast(msgObjStr);
                return;
            }

            custObj = result.custObj;
            if (custObj != null) {
                iisODSObj.ctabPlan = 2;
                window.localStorage.setItem(iisODSObjSession, JSON.stringify(iisODSObj, null, '\t'));
                
                // Update workspace state storage
                var custObjStr = JSON.stringify(custObj, null, '\t');
                var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
                window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));

                showToast("Configuration saved successfully!");
                localStorage.removeItem('appConfig');
                location.reload();             
            }
        }
    });
}
// Initialize the app on document ready
$(document).ready(function() {
    loadConfig();
    
    // Add event listener for refresh button
    $('#refresh-button').on('click', function() {
        refreshData();
    });

    // Navigation handler (simulates page change)
    $('.nav-item').on('click', function() {
        const page = $(this).data('page');
        if (page !== 'aiapconfig') {
            window.location.href = page + '.html';
        }
    });

    // 1. Intercept the Save Button click to generate cart info dynamically
    $(document).on('click', '#save-config-btn', function() {
        let cartHtml = "";
        let totalAddedPrice = 0;
        let hasChanges = false;

        // --- PART A: CHECK PRICE PLAN CHANGE ---
        const selectedPlanVal = $('#plan-select').val(); 
        const selectedPlanText = $('#selected-plan-text').text(); 
        
        if (selectedPlanVal !== "-1" && selectedPlanVal !== "0" && selectedPlanVal != profileData.plan) { 
            hasChanges = true;
            let planPriceMatch = selectedPlanText.match(/\$(\d+)/);
            let planCost = planPriceMatch ? parseFloat(planPriceMatch[1]) : 0;
            totalAddedPrice += planCost;

            cartHtml += `
                <div class="flex justify-between items-start border-b border-gray-800 pb-1.5">
                    <div>
                        <p class="font-medium text-blue-400 text-xs">Plan Upgrade</p>
                        <p class="text-sm font-semibold text-white">${selectedPlanText.split(' - ')[0]}</p>
                    </div>
                    <span class="font-bold text-white">$${planCost.toFixed(2)}</span>
                </div>`;
        }

        // --- PART B: CHECK FEATURE ACTIONS ---
        for (let i = 0; i < featureActivity.length; i++) { 
            let feature = featureActivity[i]; 
            
            if (feature.fstatus !== feature.chfstatus) { 
                hasChanges = true;
                
                let numericPrice = parseFloat(feature.price.replace(/[^0-9.-]+/g, ""));
                if (isNaN(numericPrice)) numericPrice = 0;

                if (feature.readdstatus){
                    cartHtml += `
                        <div class="flex justify-between items-start border-b border-gray-800 pb-1.5">
                            <div>
                                <p class="font-medium text-emerald-400 text-xs">Keep Feature (Re-add)</p>
                                <p class="text-sm font-semibold text-white">${feature.name}</p>
                            </div>
                            <span class="font-bold text-gray-400">$0.00</span>
                        </div>`;
                } else if (feature.chfstatus === true) {
                    totalAddedPrice += numericPrice;
                    cartHtml += `
                        <div class="flex justify-between items-start border-b border-gray-800 pb-1.5">
                            <div>
                                <p class="font-medium text-sky-400 text-xs">Add Feature</p>
                                <p class="text-sm font-semibold text-white">${feature.name}</p>
                            </div>
                            <span class="font-bold text-emerald-400">+${feature.price}</span>
                        </div>`;
                } else if (feature.chfstatus === false) {
                    cartHtml += `
                        <div class="flex justify-between items-start border-b border-gray-800 pb-1.5">
                            <div>
                                <p class="font-medium text-red-400 text-xs">Remove Feature</p>
                                <p class="text-sm font-semibold text-white">${feature.name}</p>
                            </div>
                            <span class="font-semibold text-gray-500">Removed</span>
                        </div>`;
                }
            }
        }

        // --- NEW PART PART B.2: CHECK PROMOTION CODE ---
        const promoCodeVal = $('#promo-code').val().trim();
        if (promoCodeVal.length > 0) {
            hasChanges = true;
            cartHtml += `
                <div class="flex justify-between items-start border-b border-gray-800 pb-1.5 bg-sky-950/30 p-1 rounded">
                    <div>
                        <p class="font-medium text-amber-400 text-xs">Promotion Applied</p>
                        <p class="text-sm font-semibold text-white uppercase">${promoCodeVal}</p>
                    </div>
                    <span class="text-xs font-semibold text-amber-400 self-center">Code Active</span>
                </div>`;
        }

        // --- PART C: INJECT HTML & TOGGLE OVERLAY VIEW ---
        if (!hasChanges) {
            cartHtml = `<p class="text-gray-400 text-center py-4 text-xs">No variations or modifications detected.</p>`;
            $('#cart-total-price').text("$0.00").removeClass('text-emerald-400').addClass('text-gray-400');
        } else {
            $('#cart-total-price').text(`$${totalAddedPrice.toFixed(2)}`).removeClass('text-gray-400').addClass('text-emerald-400');
        }

        $('#cart-summary').html(cartHtml);
        $('#save-overlay').removeClass('hidden'); 
    });

    // 2. Handle the "Cancel" button in the overlay
    $('#cancel-save-btn').on('click', function() {
        $('#save-overlay').addClass('hidden');
    });

    // 3. Handle the "Confirm Save" button in the overlay
    $('#confirm-save-btn').on('click', function() {
        $('#save-overlay').addClass('hidden');
        const selectedPlan = $('#plan-select').val();
        // 2. Retrieve the text from the promotion code input
        const promoCode = $('#promo-code').val();  

        profileData.newPlan = selectedPlan;
        profileData.promoCode = promoCode;

        // Call the newly combined function here
        submitConfigurationChanges();
    });
    // Listener for Clear & Reset (using the class assigned above)
    $(document).on('click', '.clear-cache-btn', function() {
        // Your existing clear logic
        localStorage.removeItem('appConfig');
        location.reload(); 
    });
    // Simulating a delay for realistic data loading experience before showing content
        let pollIntervalID = null;
        let checks = 0; // Counter to prevent infinite loops (optional, but recommended)
        const MAX_CHECKS = 80; // Max 20 seconds (200 * 100ms) before giving up
        // Start the polling interval
        pollIntervalID = setInterval(() => {
            checks++;

            // 1. CHECK FOR READY FLAG
            if ((profileData.ready)) {                
                // Stop the loop
                clearInterval(pollIntervalID);                

                renderConfigPage();

                // Hide the loading overlay after content is rendered
                $('#loading-overlay').fadeOut(300, function() {
                    $(this).remove(); // Remove from DOM after fade out
                });                
                return; 
            }

            // 2. CHECK FOR MAX TIMEOUT (Fallback)
            if (checks >= MAX_CHECKS) {
                 // Stop the loop
                clearInterval(pollIntervalID);               
                // Reject the promise if the data never became ready
                renderConfigPage();

                // Hide the loading overlay after content is rendered
                $('#loading-overlay').fadeOut(300, function() {
                    $(this).remove(); // Remove from DOM after fade out
                });                
                return;                 
            }
        }, MOCK_API_DELAY);
        // Toggle Dropdown
        $(document).on('click', '#custom-plan-dropdown', function(e) {
            e.stopPropagation();
            $('#plan-options-menu').toggleClass('hidden');
        });

        // Handle Option Selection
        $(document).on('click', '.plan-option', function() {
            const val = $(this).data('value');
            const text = $(this).text();
            
            // Update the UI
            $('#selected-plan-text').text(text);
            $('#plan-select').val(val); // Updates hidden input for your submit logic
            
            // Close menu
            $('#plan-options-menu').addClass('hidden');
            
            // Visual feedback
            showToast(`Plan selected: ${text}`);
        });

        // Close dropdown if user clicks anywhere else
        $(document).on('click', function() {
            $('#plan-options-menu').addClass('hidden');
        });

});

function saveSetting() {
    // This remains largely the same, but now it is only called after confirmation
    const selectedPlan = $('#plan-select').val();
    // 2. Retrieve the text from the promotion code input
    const promoCode = $('#promo-code').val();  

    profileData.newPlan = selectedPlan;
    profileData.promoCode = promoCode;

    // Call the newly combined function here
    submitConfigurationChanges();

}

function updateFeatureToggleSetting(setting, value, index) {
    // Update the global config as before
    configData[setting] = value; 
    
    // Update the specific feature activity record using the passed index
    if (index !== undefined && featureActivity[index]) {
        featureActivity[index].chfstatus = value;
        // featureActivity[index].fstatus = value; // Update status to match current toggle
    }
    
    // saveConfig(); //
    showToast(`Setting ${featureActivity[index].name} ${value ? 'enabled' : 'disabled'}`);
    // showToast(`Setting updated for ${featureActivity[index].name}`); //
}

$(document).on('change', '.feature-toggle-input', function() {
    const index = $(this).data('index'); // Get the index from data-index attribute
    const isChecked = this.checked;
    
    // Pass the index to your update function
    updateFeatureToggleSetting('autoSync', isChecked, index); 
});