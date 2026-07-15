///////////////////////////////////////////////////////////////////////////////////////

var app = {

// Application Constructor
    initialize: function () {

        $(document).ready(function () {
        // Handle clicks on the custom JS dropdown items
            $('#customPlanList .dropdown-item').on('click', function (e) {
                e.preventDefault();
                
                // Get the selected text and value
                var selectedText = $(this).text();
                var selectedValue = $(this).data('value');

                // Update the button text to show what was selected
                $('#planDropdownButton').text(selectedText);

                // Update the hidden input value (matches your existing ID 'selectPricePlan')
                $('#selectPricePlan').val(selectedValue);
                
                // Optional: Trigger any existing change logic you had
                console.log("Plan selected: " + selectedValue);
            });
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

//////Goble variable
accId = iisODSObj.accId;
accfundId = iisODSObj.accfundId;
accdevId = iisODSObj.accdevId;
var ctabPlan = iisODSObj.ctabPlan;
accObjListStr = iisDataObj.accObjListStr;
accObjList = "";
if (accObjListStr.length > 0) {
    accObjList = JSON.parse(accObjListStr);
}

var tradingBotObjStr = "";
var tradingBotObj = "";
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
                                    // $("#nav-tradebot-tab").show();
                                    // $("#nav_bot_OANDA").show();
                                    tradingBotFlag = true;
                                    
                               } else  if (botSrvId == "51") {
                                    // $("#nav-tradebot-tab").show();
                                    // $("#nav_bot_LIME").show();
                                    tradingBotFlag = true;
                                    
                               } else  if (botSrvId == "52") {
                                    // $("#nav-tradebot-tab").show();
                                    // $("#nav_bot_ALPACA").show();
                                    tradingBotFlag = true;                               
                                }
                            }
                        }                        
                    }
                }

                if (tradingBotFlag == true) {
                    $("#nav-tradebot-tab").show();
                    myTradingBott();
                }                
            }
        }
    }
} catch (err) {
}

if (ctabPlan > 0) {
    iisODSObj.ctabPlan = 0;
    var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
    window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
    reInitMainAcc();
}

function reInitMainAcc() {
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
                    var accDataSt = accfundObj.portfolio;
                    var perfBalPercent = 0;
                    var perfBal = 0;
                    if (accDataSt != null) {
                        if (accDataSt != "") {
                            accDataSt = accDataSt.replaceAll('#', '"');
                            var accData = JSON.parse(accDataSt);
                            var accName = "fundMgr";
                            if ((accData.ref !== "") && (accData.ref !== undefined)) {
                                accName = accData.ref;
                            }
                            fundacchtml += "Fund Name: " + accName;
                            if (accData != null) {
                                    //name,cur%, 1mon%
                                    perfBalPercent = accData.curM_6;
                                    perfBal = perfBalPercent; // * N_FUN_ST * TRADING_AMOUNT / 100;
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

                        var servListSt = custObj.serL;
                        var servListSt = servListSt.replaceAll('#', '"');
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
                                    var date = new Date(servObj.st * 1000).toLocaleDateString("en-US");

                                    var name = servObj.cd; //date + " " + servObj.cd;
                                    if ((name.indexOf("BillPriceS") != -1) || (name.indexOf("BillMgr-") != -1)) {
                                        if (scribLStr.length > 0) {
                                            scribLStr += ",";
                                        }
                                        scribLStr += name;
                                    }
                                }

                            }   // servList loop
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

                        }

                    }
                }
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


        }
    });

}




var plan0 = 'Basic Price plan - $50 for max 2 stocks';
var plan1 = 'Standard Price plan - $100 for max 8 stocks';
var plan2 = 'Premium Price plan - $200 for max 20 stocks';
var plan3 = 'Professional Price Plan - $400 for max 40 stocks';
var plan4 = 'Enterprise Price Plan - $800 for max 80 stocks';
var plan9 = 'API Plan - Max 500 stocks';
var plan10 = 'SRV Plan - Max 0 stocks';
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

// update menu start
mySubMenuReset();
updateShortCommFunction();
myInitPlanFunction();
myInitCurFeat();
myInitOfferFeat();
myInitsubsFund();



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
                var date = new Date(servObj.st * 1000).toLocaleDateString("en-US");
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
//                if (col1.indexOf("BillMgr-") != -1) {
//                    continue;
//                }
                if (servObj.type == 20) {
                    col1 = " Code: -------";
                } else {
                    col1 = " Code: " + servObj.cd;
                }

                col2 = servObj.na;
                if ((servObj.type == 0) || (servObj.type == 1)) {
                    col2 = col2 + " (" + servObj.cnt + ")";
                }
                col3 = priceSt;
                if (servObj.cnt == -1) {
                    col4 += "<br><font style= color:blue>**Promotation completed</font>";
                }

                var removeFlag = false;
                if (servRemoveList != null) {
                    for (k = 0; k < servRemoveList.length; k++) {
                        var servReObj = servRemoveList[k];
                        if (servObj.cd == servReObj.cd) {
                            var msg = '<br>**Pending to remove in the next account payment due date.';
                            msg = '<p style="color:blue">' + msg + '</p>';
                            col4 += msg;
                            removeFlag = true;
                            break;

                        }
                    }
                }
///////button
                var detail = "";
                if (removeFlag == false) {

                    detail += '<br><button type="button" onclick="return curFeatclickFun(' + i + ',\'' + servObj.cd + '\');"  class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#basicModal' + idN + '">';
                    detail += 'Remove from My Plan';
                    detail += '</button>';
                    detail += '<div class="modal fade" id="basicModal' + idN + '" tabindex="-1">';
                    detail += '<div class="modal-dialog">';
                    detail += '<div class="modal-content">';
                    detail += '<div class="modal-header">';
                    detail += '<h5 class="modal-title">Remove Feature</h5>';
                    detail += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
                    detail += '</div>';
                    detail += '<div class="modal-body">';
                    detail += '<span id="' + i + 'curBodyId"></span>';
                    detail += '</div>';
                    detail += '<div class="modal-footer">';
                    detail += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
                    detail += '<button type="button" id="' + i + 'curFeatsubmit" onclick="return curFeatsubmitFun(' + i + ',\'' + servObj.cd + '\');"  class="btn btn-primary">Save changes</button>';
                    detail += '</div>';
                    detail += '</div>';
                    detail += '</div>';
                    detail += '</div>';

                } else {
                    detail += '<br><button type="button" onclick="return curCancelclickFun(' + i + ',\'' + servObj.cd + '\');"  class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#basicModal' + idN + '">';
                    detail += 'Restore removed feature';
                    detail += '</button>';
                    detail += '<div class="modal fade" id="basicModal' + idN + '" tabindex="-1">';
                    detail += '<div class="modal-dialog">';
                    detail += '<div class="modal-content">';
                    detail += '<div class="modal-header">';
                    detail += '<h5 class="modal-title">Restore removed feature</h5>';
                    detail += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
                    detail += '</div>';
                    detail += '<div class="modal-body">';
                    detail += '<span id="' + i + 'curCancelBodyId"></span>';
                    detail += '</div>';
                    detail += '<div class="modal-footer">';
                    detail += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
                    detail += '<button type="button" id="' + i + 'curCancelsubmit" onclick="return curCancelsubmitFun(' + i + ',\'' + servObj.cd + '\');"  class="btn btn-primary">Save changes</button>';
                    detail += '</div>';
                    detail += '</div>';
                    detail += '</div>';
                    detail += '</div>';
                }

                var tranSt = "";
                tranSt += '<table class="table table-borderless table-sm">';
                tranSt += '<tr>';
                tranSt += '<th width="20%">' + date + '</th>';
                tranSt += '<th width="20%">' + col1 + '</th>';
                tranSt += '<td width="20%">' + col3 + '</td>';
                tranSt += '</tr>';
                tranSt += '<tr>';
                tranSt += '<td colspan="3">' + col2 + '<br>' + col4 + '</td>';
                tranSt += '</tr>';
                tranSt += '</table>';
                htmlSt += '<div class="accordion-item">';
                htmlSt += '<h2 class="accordion-header" id="flush-heading' + idN + '">';
                htmlSt += '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse' + idN + '" aria-expanded="false" aria-controls="flush-collapse' + idN + '">';
                htmlSt += tranSt;
                htmlSt += '</button>';
                htmlSt += '</h2>';
                htmlSt += '<div id="flush-collapse' + idN + '" class="accordion-collapse collapse" aria-labelledby="flush-heading' + idN + '" data-bs-parent="#accordionFlushExample">';
                htmlSt += '<div class="accordion-body" >' + 'Description<br><span id="' + servObj.cd + 'Desc"></span><br>' + detail + '</div>';
                htmlSt += '</div>';
                htmlSt += '</div>'

            }
            htmlSt += '</div>'
            $("#mycurfeatid").html(htmlSt);

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

                    var detail = "";
                    detail += '<br><button type="button" onclick="return offFeatclickFun(' + i + ',\'' + commObj.cod + '\');"  class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#basicModal' + idN + '">';
                    detail += 'Add to My Plan';
                    detail += '</button>';
                    detail += '<div class="modal fade" id="basicModal' + idN + '" tabindex="-1">';
                    detail += '<div class="modal-dialog">';
                    detail += '<div class="modal-content">';
                    detail += '<div class="modal-header">';
                    detail += '<h5 class="modal-title">Add Feature</h5>';
                    detail += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
                    detail += '</div>';
                    detail += '<div class="modal-body">';
                    detail += '<span id="' + i + 'offBodyId"></span>';
                    detail += '</div>';
                    detail += '<div class="modal-footer">';
                    detail += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
                    detail += '<button type="button" id="' + i + 'offFeatsubmit" onclick="return offFeatsubmitFun(' + i + ',\'' + commObj.cod + '\');"  class="btn btn-primary">Save changes</button>';
                    detail += '</div>';
                    detail += '</div>';
                    detail += '</div>';
                    detail += '</div>';
                    var tranSt = "";
                    tranSt += '<table class="table table-borderless table-sm">';
                    tranSt += '<tr>';
                    tranSt += '<th width="20%">' + col1 + '</th>';
                    tranSt += '<td width="20%">' + col3 + '</td>';
                    tranSt += '</tr>';
                    tranSt += '<tr>';
                    tranSt += '<td colspan="2">' + col2 + '</td>';
                    tranSt += '</tr>';
                    tranSt += '</table>';
                    htmlSt += '<div class="accordion-item">';
                    htmlSt += '<h2 class="accordion-header" id="flush-heading' + idN + '">';
                    htmlSt += '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse' + idN + '" aria-expanded="false" aria-controls="flush-collapse' + idN + '">';
                    htmlSt += tranSt;
                    htmlSt += '</button>';
                    htmlSt += '</h2>';
                    htmlSt += '<div id="flush-collapse' + idN + '" class="accordion-collapse collapse" aria-labelledby="flush-heading' + idN + '" data-bs-parent="#accordionFlushOffer">';
                    htmlSt += '<div class="accordion-body">' + descSt + '<br>' + detail + '</div>';
                    htmlSt += '</div>';
                    htmlSt += '</div>'


                } // end of offer loop


                $("#myofferfeatid").html(htmlSt);
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
                                    if (accData != null) {
                                        //name,curRT%,All%,1mon%,3mon%,3mon%,
                                        perfAllBalPercent = accData.curM.toFixed(2);
                                        total = perfAllBalPercent;
                                    }                                                                     
                                }
                            } catch (err) {
                            }
                            
                            var totSt = total + "%";
                            var perN = total;
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
                        var billCd = "BillMgr-fund" + accObj.id;
                        col1 = billCd;
                        var price = 60;
                        var priceSt = Number(price).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                        col3 = priceSt;
                        col2 = 'Current Total: ' + totSt + ' - ' + accName;
                        col4 = msgSt;
                        var detail = "";
                        detail += '<br><button type="button" onclick="return subFeatclickFun(' + i + ',\'' + billCd + '\');"  class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#basicModal' + idN + '">';
                        detail += 'Add to My Plan';
                        detail += '</button>';
                        detail += '<div class="modal fade" id="basicModal' + idN + '" tabindex="-1">';
                        detail += '<div class="modal-dialog">';
                        detail += '<div class="modal-content">';
                        detail += '<div class="modal-header">';
                        detail += '<h5 class="modal-title">Add Feature</h5>';
                        detail += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
                        detail += '</div>';
                        detail += '<div class="modal-body">';
                        detail += '<span id="' + i + 'subBodyId"></span>';
                        detail += '</div>';
                        detail += '<div class="modal-footer">';
                        detail += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
                        detail += '<button type="button" id="' + i + 'subFeatsubmit" onclick="return subFeatsubmitFun(' + i + ',' + accObj.id + ',\'' + billCd + '\');"  class="btn btn-primary">Save changes</button>';
                        detail += '</div>';
                        detail += '</div>';
                        detail += '</div>';
                        detail += '</div>';
                        var tranSt = "";
                        tranSt += '<table class="table table-borderless table-sm">';
                        tranSt += '<tr>';
                        tranSt += '<th width="20%">' + col1 + '</th>';
                        tranSt += '<td width="20%">' + col3 + '</td>';
                        tranSt += '</tr>';
                        tranSt += '<tr>';
                        tranSt += '<td colspan="2">' + col2 + '</td>';
                        tranSt += '</tr>';
                        tranSt += '</table>';
                        htmlSt += '<div class="accordion-item">';
                        htmlSt += '<h2 class="accordion-header" id="flush-heading' + idN + '">';
                        htmlSt += '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse' + idN + '" aria-expanded="false" aria-controls="flush-collapse' + idN + '">';
                        htmlSt += tranSt;
                        htmlSt += '</button>';
                        htmlSt += '</h2>';
                        htmlSt += '<div id="flush-collapse' + idN + '" class="accordion-collapse collapse" aria-labelledby="flush-heading' + idN + '" data-bs-parent="#accordionFlushFund">';
                        htmlSt += '<div class="accordion-body">' + col4 + '<br>' + detail + '</div>';
                        htmlSt += '</div>';
                        htmlSt += '</div>'

                    } // end loop

                    if (htmlSt.length == 0) {
                        $("#myofferFundfeatid").html("No more feature available.");
                        return;
                    }
                    $("#myofferFundfeatid").html(htmlSt);
                }
            });
        }
    });

}


function myInitPlanFunction() {
    var ppNew = "";
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
    pp = '<strong>' + pp + '</strong>';

    var dataSt = custObj.data; //.portfolio;
    try {
        if (dataSt != null) {
            if (dataSt !== "") {
                dataSt = dataSt.replaceAll('#', '"');
                var detailObj = JSON.parse(dataSt);
                if (detailObj != null) {
                    if (detailObj.nPlan !== -1) {
                        if (custObj.substatus != detailObj.nPlan) {

                            if (detailObj.nPlan == 0) {
                                ppNew = plan0;
                            } else if (detailObj.nPlan == 10) {
                                ppNew = plan1;
                            } else if (detailObj.nPlan == 20) {
                                ppNew = plan2;
                            } else if (detailObj.nPlan == 40) {
                                ppNew = plan3;
                            } else if (detailObj.nPlan == 80) {
                                ppNew = plan4;
                            } else if (detailObj.nPlan == 90) {
                                ppNew = plan9;
                            } else if (detailObj.nPlan == 100) {
                                ppNew = plan10;
                            }
                            ppNew = ppNew + '<br>**Pending to change in the next account payment due date.';
                            ppNew = '<p style="color:blue">' + ppNew + '</p>';
                        }
                    }
                }
            }
        }
    } catch (err) {

    }


    var html = '';
    html += '<div class="row">';
    html += '<div class="col-lg-3 col-md-4 label ">First Name</div>';
    html += '<div class="col-lg-9 col-md-8">' + custObj.firstname + '</div>';
    html += '</div>';
    html += '<div class="row">';
    html += '<div class="col-lg-3 col-md-4 label">Last Name</div>';
    html += '<div class="col-lg-9 col-md-8">' + custObj.lastname + '</div>';
    html += '</div>';
    html += '<div class="row">';
    html += '<div class="col-lg-3 col-md-4 label">Current Plan</div>';
    html += '<div class="col-lg-9 col-md-8">' + pp + '</div>';
    html += '</div>';
    html += '<div class="row" id="planseldisable" style="display:">';
    html += '<div class="col-lg-3 col-md-4 label">New Plan</div>';
    html += '<div class="col-lg-9 col-md-8">' + ppNew + '</div>';
    html += '</div>';
    html += '<br>';
    html += '<div class="row">';
    html += '<div class="col-lg-3 col-md-4 label">Select New Plan<br><a href="aiiaccFAQ.html#detailplan">plan detail...</a></div>';
    html += '<div class="col-lg-9 col-md-8">';
    html += '<div class="relative">';

    html += '<div class="dropdown mb-3">';
        html += '<button class="btn btn-secondary dropdown-toggle w-100 text-start" type="button" id="planDropdownButton" data-bs-toggle="dropdown" aria-expanded="false">';
            html += 'Select a new price plan';
        html += '</button>';        
        html += '<ul class="dropdown-menu w-100" aria-labelledby="planDropdownButton" id="customPlanList">';
            html += '<li><a class="dropdown-item" href="#" data-value="-1">Select a new price plan</a></li>';        
            html += '<li><a class="dropdown-item" href="#" data-value="0">Basic Price plan - $50 (Max 2)</a></li>';
            html += '<li><a class="dropdown-item" href="#" data-value="10">Standard Price plan - $100 (Max 8)</a></li>';
            html += '<li><a class="dropdown-item" href="#" data-value="20">Premium Price plan - $200 (Max 20)</a></li>';
            html += '<li><a class="dropdown-item" href="#" data-value="40">Professional Price Plan - $400 (Max 40)</a></li>';
            html += '<li><a class="dropdown-item" href="#" data-value="80">Enterprise Price Plan - $800 (Max 80)</a></li>';
        html += '</ul>';
        html += '<input type="hidden" id="selectPricePlan" value="">';
    html += '</div>';     

    // if (custT == 30) {
    //     html += '<select id="pricemodel" class="form-select" disabled >';
    // } else {
    //     html += '<select id="pricemodel" class="form-select" >';
    // }
   
    // html += '<option value="-1" selected> Select a new price plan</option>';
    // html += '<option value="0" > ' + plan0 + '</option>';
    // html += '<option value="10" > ' + plan1 + '</option>';
    // html += '<option value="20" > ' + plan2 + '</option>';
    // html += '<option value="40" > ' + plan3 + '</option>';
    // html += '<option value="80" > ' + plan4 + '</option>';
    // html += '</select>';
    html += '</div>';
    html += '</div>';

    $("#mycurplanid").html(html);
    if (ppNew == ""){
        document.getElementById("planseldisable").style.display = "none"; //hide plan selectoin for api and fund mgr
    }
    // if ((custObj.type == 30) || (custObj.type == 20) || (custObj.type == 22) || sysDevOp == true) {
    //     document.getElementById("planseldisable").style.display = "none"; //hide plan selectoin for api and fund mgr
    // }

}

//////////////////////
var htmlModel = "";
var curFeatSrvCd = "";
$("#planstclick").click(function () {
    var htmlhead = "";
    $("#plansubmit").attr("disabled", true);


    var submitF = false;
    var plan = $('#selectPricePlan').val();
    if (plan != ""){
        if (plan != -1) {
            var planTxt = "Custom plan";
            if (plan == 0) {
                planTxt = plan0;
            } else if (plan == 10) {
                planTxt = plan1;
            } else if (plan == 20) {
                planTxt = plan2;
            } else if (plan == 40) {
                planTxt = plan3;
            } else if (plan == 80) {
                planTxt = plan4;
            }
            htmlhead += 'Change price plan:<br> ' + plan + ' - ' + planTxt;
            htmlhead += '<br>';
            // if (accfundId > 0) {
            //     htmlhead += "<br>This operation does not allowed for FundMgr account";
            //     $("#planBodyId").html(htmlhead);
            //     return;
            // }
            htmlModel = htmlhead;
            submitF = true;
        }
    }   

    var txtpromo = document.getElementById("txt-promo").value;
    if (txtpromo != "") {
        txtpromo = txtpromo.trim();
        txtpromo = txtpromo.replace('"', '');
        txtpromo = txtpromo.replace('"', '');
        htmlhead += '<br>';
        htmlhead += 'Update promo code:<br>' + txtpromo;
        submitF = true;
    }

    if (iisurl == iisurl_LOCAL) {
        ;
    } else {        
        if ((custChange == false)) { // Demo
            if (txtpromo.indexOf("Debug") == -1) {
                htmlhead = "This operation is not supported on demo accounts.";
                $("#planBodyId").html(htmlhead);
                return;
            }
        }
    }    
    if (submitF == true) {
        $("#plansubmit").attr("disabled", false);
        $("#planBodyId").html(htmlhead);
    } else {
        $("#planBodyId").html("Please select the price plan for update.");
    }



});
$("#plansubmit").click(function () {

    var submitF = false;
    var txtplan = "";
   var plan = $('#selectPricePlan').val();    
    // var plan = $('#pricemodel').val();
    if (plan != -1) {
        txtplan = plan;
        submitF = true;
    }
    var txtpromo = document.getElementById("txt-promo").value;
    if (txtpromo != "") {
        txtpromo = txtpromo.trim();
        txtpromo = txtpromo.replace('"', '');
        txtpromo = txtpromo.replace('"', '');
        submitF = true;
    }
    if (submitF == false) {
        return;
    }
    $("#planBodyId").html('<span class="blink">Updating....</span>');
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/custupdate?plan=" + txtplan + "&promo=" + txtpromo,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator

    function handleResult(result) {
//          SUCC = 1;  EXISTED = 2; FAIL =0;
        var webMsg = result.webMsg;
//        console.log(webMsg);
        var resultID = webMsg.resultID;
        var msgObjStr = '';
        // 0 - general fail, 1 - successful, 2 - email fail 3 - password
        if (resultID === 0) {
            msgObjStr = "Update failed. Please try again.";
        } else if (resultID === 1) {

        } else if (resultID === 4) {
            msgObjStr = "Update failed. Account is not allowed.";

        } else if (resultID === 10) {
            msgObjStr = "Update failed. Promotoion code is not allowed.";
        } else if (resultID === 12) {
            msgObjStr = "Update failed. Promotoion code is not allowed.";
        }


        if (resultID !== 1) {
            msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
            $("#planBodyId").html(msgObjStr);
            return;
        }

        custObj = result.custObj;
        if (custObj != null) {
            iisODSObj.ctabPlan = 1;
            var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
            window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
//             update customer
            var custObjStr = JSON.stringify(custObj, null, '\t');
            var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
            window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));
            window.location.href = "aiipriceplan.html";
        }

    }

}
);
///////////////


function curFeatclickFun(i, serverCd) {

    var htmlhead = "";
    curFeatSrvCd = serverCd;
    $("#" + i + "curFeatsubmit").attr("disabled", true);
    htmlhead += 'Feature will be removed at the end of next account billing due date.';
    var featDisplay = serverCd;
    if (featDisplay.indexOf("Debug") != -1) {
        featDisplay = "-------";
    }
    htmlhead += '<br>Remove feature:<br>' + featDisplay;


    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            htmlhead += "<br><br>This operation is not supported on demo accounts.";
            $("#" + i + "curBodyId").html(htmlhead);
            return;
        }
    }

    htmlModel = htmlhead;

    $("#" + i + "curBodyId").html(htmlhead);
    $("#" + i + "curFeatsubmit").attr("disabled", false);
    return;

}

function curFeatsubmitFun(i, serverCd) {
    var htmlhead = "";
    curFeatSrvCd = serverCd;
    var txtpromo = serverCd;
    if (txtpromo != "") {
        txtpromo = txtpromo.trim();
        txtpromo = txtpromo.replace('"', '');
        txtpromo = txtpromo.replace('"', '');
        txtpromo = "-" + txtpromo;
    }
//          SUCC = 1;  EXISTED = 2; FAIL =0;
    $("#" + i + "curBodyId").html('<span class="blink">Updating....</span>');
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/custupdate?promo=" + txtpromo,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator

    function handleResult(result) {
//          SUCC = 1;  EXISTED = 2; FAIL =0;
        var webMsg = result.webMsg;
//        console.log(webMsg);
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
            $("#" + i + "curBodyId").html(msgObjStr);
            return;
        }

        custObj = result.custObj;
        if (custObj != null) {
            iisODSObj.ctabPlan = 2;
            var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
            window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
            // update customer
            var custObjStr = JSON.stringify(custObj, null, '\t');
            var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
            window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));

            window.location.href = "aiipriceplan.html";
        }

    }

}

function curCancelclickFun(i, serverCd) {

    var htmlhead = "";
    curFeatSrvCd = serverCd;
    $("#" + i + "curCancelsubmit").attr("disabled", true);
    htmlhead += 'Restore the removed feature';
    var featDisplay = serverCd;
    if (featDisplay.indexOf("Debug") != -1) {
        featDisplay = "-------";
    }
    htmlhead += '<br>Remove feature:<br>' + featDisplay;


    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            htmlhead += "<br><br>This operation is not supported on demo accounts.";
            $("#" + i + "curCancelBodyId").html(htmlhead);
            return;
        }
    }

    htmlModel = htmlhead;

    $("#" + i + "curCancelBodyId").html(htmlhead);
    $("#" + i + "curCancelsubmit").attr("disabled", false);
    return;

}

function curCancelsubmitFun(i, serverCd) {
    var htmlhead = "";
    curFeatSrvCd = serverCd;
    var txtpromo = serverCd;

//          SUCC = 1;  EXISTED = 2; FAIL =0;
    $("#" + i + "curCancelBodyId").html('<span class="blink">Updating....</span>');
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/custupdate?promo=" + txtpromo,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator

    function handleResult(result) {
//          SUCC = 1;  EXISTED = 2; FAIL =0;
        var webMsg = result.webMsg;
//        console.log(webMsg);
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
            $("#" + i + "curCancelBodyId").html(msgObjStr);
            return;
        }

        custObj = result.custObj;
        if (custObj != null) {
            iisODSObj.ctabPlan = 2;
            var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
            window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
            // update customer
            var custObjStr = JSON.stringify(custObj, null, '\t');
            var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
            window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));

            window.location.href = "aiipriceplan.html";
        }

    }

}


function offFeatclickFun(i, serverCd) {
    var htmlhead = "";
    curFeatSrvCd = serverCd;
    $("#" + i + "offFeatsubmit").attr("disabled", true);
    htmlhead += 'Add feature:<br>' + serverCd;

    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            htmlhead += "<br><br>This operation is not supported on demo accounts.";
            $("#" + i + "offBodyId").html(htmlhead);
            return;
        }
    }

    htmlModel = htmlhead;

    $("#" + i + "offBodyId").html(htmlhead);
    $("#" + i + "offFeatsubmit").attr("disabled", false);
    return;
}

function offFeatsubmitFun(i, serverCd) {
    var htmlhead = "";
    curFeatSrvCd = serverCd;
    var txtpromo = serverCd;
    $("#" + i + "offBodyId").html('<span class="blink">Updating....</span>');
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/custupdate?promo=" + txtpromo,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator

    function handleResult(result) {
//          SUCC = 1;  EXISTED = 2; FAIL =0;
        var webMsg = result.webMsg;
//        console.log(webMsg);
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
            $("#" + i + "offBodyId").html(msgObjStr);
            return;
        }

        custObj = result.custObj;
        if (custObj != null) {
            iisODSObj.ctabPlan = 3;
            var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
            window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
            // update customer
            var custObjStr = JSON.stringify(custObj, null, '\t');
            var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
            window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));

            window.location.href = "aiipriceplan.html";
        }

    }
    return;
}


function subFeatclickFun(i, serverCd) {
    var htmlhead = "";
    curFeatSrvCd = serverCd;
    $("#" + i + "subFeatsubmit").attr("disabled", true);
    htmlhead += 'Add feature:<br>' + serverCd;

    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            htmlhead += "<br><br>This operation is not supported on demo accounts.";
            $("#" + i + "subBodyId").html(htmlhead);
            return;
        }
    }

    htmlModel = htmlhead;

    $("#" + i + "subBodyId").html(htmlhead);
    $("#" + i + "subFeatsubmit").attr("disabled", false);
    return;

}

function subFeatsubmitFun(i, fundId, serverCd) {
    var htmlhead = "";
    curFeatSrvCd = serverCd;
    $("#" + i + "subBodyId").html('<span class="blink">Updating....</span>');
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/fundlink/" + fundId + "/add",
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        success: handleResult
    }); // use promises
    function handleResult(result) {
//          SUCC = 1;  EXISTED = 2; FAIL =0;
        var webMsg = result.webMsg;
//        console.log(webMsg);
        var resultID = webMsg.resultID;
        var msgObjStr = 'Update failed. Please try again.';
        if (resultID === 0) {
            msgObjStr = "Update failed. Please try again.";
        } else if (resultID === 1) {

        } else if (resultID === 10) {
            msgObjStr = "Update failed. Please try again.";
        }
        if (resultID !== 1) {
            msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
            $("#" + i + "subBodyId").html(msgObjStr);
            return;
        }
        custObj = result.custObj;
        if (custObj != null) {
            iisODSObj.ctabPlan = 4;
            var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
            window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
            // update customer
            var custObjStr = JSON.stringify(custObj, null, '\t');
            var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
            window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));

            window.location.href = "aiipriceplan.html";
        }
    }

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
            $("#bot_spinner_id").html('');
            $("#nav_bot_button").show(); 
                        
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
            window.location.href = "aiipriceplan.html";
        }
    });
}
////////////////////

