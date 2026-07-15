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
var trM1 = iisODSObj.trM1;
var trM1TR = iisODSObj.trM1TR;
var trM1St = iisODSObj.trM1St;
var trM2 = iisODSObj.trM2;
var trM2TR = iisODSObj.trM2TR;
var trM2St = iisODSObj.trM2St;

//////Goble variable
accId = iisODSObj.accId;
accfundId = iisODSObj.accfundId;

accObjListStr = iisDataObj.accObjListStr;
accObjList = "";
if (accObjListStr.length > 0) {
    accObjList = JSON.parse(accObjListStr);
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

// update menu start
mySubMenuReset();

updateShortCommFunction();

myInitAccInfo();

myInitBillFunction();



function myInitAccInfo() {
    if (accObjList.length == 0) {
        return;
    }

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

            if ((custObj.substatus == 100) || (custObj.substatus == 20)) {
                myInitComm();
            }
        }

    }

}

function myInitComm() {

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/billing/commission",

        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(resultCommObjList) {
//        console.log(resultCommObjList);
        var commObjListStr = "";
        if (resultCommObjList !== "") {
            commObjListStr = JSON.stringify(resultCommObjList, null, '\t');
            var commObjList = JSON.parse(commObjListStr);
            if (commObjList !== "") {
                var detail = "";
                for (i = 0; i < commObjList.length; i++) {
                    var commObj = commObjList[i];
                    var commId = commObj.id;
                    var type = commObj.type;
                    var msgSt = commObj.msg.replaceAll("<br>", " ");
//                    msgSt = commId + " - " + type + " - " + msgSt;
                    var detailList = msgSt.split('|');
                    var dateList = detailList[0].split(" ");
                    var datailDisp = dateList[0] + "<br>";
                    for (k = 1; k < detailList.length; k++) {
                        datailDisp += ' : ' + detailList[k];
                    }
                    msgSt = datailDisp;
                    if (type === 99) {
                        msgSt = '<span style="color:green;width:20%">' + msgSt + '</span>';
                    } else if (type === 0) {
                        msgSt = '<span style="color:grey;width:20%">' + msgSt + '</span>';
                    } else if (type === 2) {
                        msgSt = '<span style="color:deeppink;width:20%">' + msgSt + '</span>';
                    } else {
                        msgSt = '<span style="color:blue;width:20%">' + msgSt + '</span>';
                    }
                    detail += msgSt + "<br>";
                }
                var htmlSt = "";
                var idN = "col1"

                detail = '<div><small>' + detail + '</small>' + '</div>';

                htmlSt += '<div class="accordion-item">';
                htmlSt += '<h2 class="accordion-header" id="flush-heading' + idN + '">';
                htmlSt += '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse' + idN + '" aria-expanded="false" aria-controls="flush-collapse' + idN + '">';
                htmlSt += "View my commission for the last 30 transactions";
                htmlSt += '</button>';
                htmlSt += '</h2>';
                htmlSt += '<div id="flush-collapse' + idN + '" class="accordion-collapse collapse" aria-labelledby="flush-heading' + idN + '" data-bs-parent="#accordionFlushExample">';
                htmlSt += '<div class="accordion-body">' + detail + '</div>';
                htmlSt += '</div>';
                htmlSt += '</div>'
                htmlSt += '<br><br>'
                $("#mycomisid").html(htmlSt);
            }
        }
    }

}


function myInitBillFunction() {
    // billing
//    console.log("myInitBillFunction");
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/billing",
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function () {
            window.location.href = "aiiend.html";
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
                                    var DiscSt = Number(detailObj.disc).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                                    currencyDSt = ' &nbsp;&nbsp;&nbsp;discount:' + DiscSt;
                                }
                                billD += '<br>Other service: ' + currencySt + ' &nbsp;&nbsp;&nbsp;credit: ' + currencyCSt + currencyDSt;
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

                detail = '<div><small>' + detail + '</small>' + '</div>';
                var expandedF = "false";
                var showF = "";
                var collapsedF = "collapsed";

                if (i == 0) {
                    expandedF = "true";
                    var showF = "show";
                    collapsedF = "";
                }
                htmlName += '<div class="accordion-item">';
                htmlName += '<h2 class="accordion-header" id="heading' + idN + '">';
                htmlName += '<button class="accordion-button ' + collapsedF + '" type="button" data-bs-toggle="collapse" ';
                htmlName += ' data-bs-target="#collapse' + idN + '" aria-expanded="' + expandedF + '"';
                htmlName += ' aria-controls="collapse' + idN + '">';
                htmlName += billN;
                htmlName += '</button>';
                htmlName += '</h2>';
                htmlName += '<div id="collapse' + idN + '" class="accordion-collapse collapse ' + showF + '"';
                htmlName += ' aria-labelledby="heading' + idN + '" data-bs-parent="#accordionExample">';
                htmlName += '<div class="accordion-body">';
                htmlName += detail;
                htmlName += '</div>';
                htmlName += '</div>';
                htmlName += '</div>';

            }
            htmlName += '</div>';
            // Dynamic context URL built using active customer profile and account identification context
            const downloadPdfUrl = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/billing/pdf?length=1";

            // Append or insert this block into your HTML output string:
            var htmlNamePdfBtn = `
            <div class="flex justify-between items-center border-b border-gray-700 pb-4 my-2">
                    <div>
                        <span class="text-xs text-gray-400">Invoice Reference</span>
                    </div>
                    <a href="${downloadPdfUrl}" 
                    target="_blank" 
                    style="background-color: #0ea5e9 !important; color: #0f172a !important;" 
                    class="flex items-center justify-center font-bold py-2.5 px-5 btn btn-sm btn-primary m-2 rounded shadow-md hover:opacity-90 transition duration-200 text-sm gap-2">
                        <span style="color: #0f172a !important;">📥</span> Download PDF Invoice
                    </a>
                </div>
            `;
            $("#mybillid").html(htmlNamePdfBtn + htmlName);
        }
    });

}


