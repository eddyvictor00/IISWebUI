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

var accdevObj = null;
var accdevId = 0;
var admcust = "";

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
var trM1 = iisODSObj.trM1;
var trM1TR = iisODSObj.trM1TR;
var trM1St = iisODSObj.trM1St;
var trM2 = iisODSObj.trM2;
var trM2TR = iisODSObj.trM2TR;
var trM2St = iisODSObj.trM2St;

//////Goble variable
accId = iisODSObj.accId;
accfundId = iisODSObj.accfundId;
admcust = iisODSObj.admcust;
accdevId = iisODSObj.accdevId;
accObjListStr = iisDataObj.accObjListStr;
accObjList = "";

var yearRpt = 0;
yearRpt = iisODSObj.yearRpt;
var nameRpt = "";
nameRpt = iisODSObj.nameRpt;

var reportObj = null;

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

if (sysDevOp == true) {
    if (SubMenuId == 52) {
    }
}

if (nameRpt.length > 0) {
    generateReport();
}

$("#incomebtn").click(function () {

    nameRpt = "income";

    iisODSObj.nameRpt = nameRpt;
    iisODSObj.yearRpt = yearRpt;
    var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
    window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
    window.location.href = "aiiadmmgrAc.html";

});


$("#balancebtn").click(function () {
    nameRpt = "balance";
    iisODSObj.nameRpt = nameRpt;
    iisODSObj.yearRpt = yearRpt;
    var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
    window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
    window.location.href = "aiiadmmgrAc.html";
});

$("#depbtn").click(function () {
    nameRpt = "deprecation";
    iisODSObj.nameRpt = nameRpt;
    iisODSObj.yearRpt = yearRpt;
    var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
    window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
    window.location.href = "aiiadmmgrAc.html";
});

$("#nextbtn").click(function () {
    yearRpt = yearRpt + 1;
    iisODSObj.nameRpt = nameRpt;
    iisODSObj.yearRpt = yearRpt;
    var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
    window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
    window.location.href = "aiiadmmgrAc.html";
});

$("#prevbtn").click(function () {
    yearRpt = yearRpt - 1;
    iisODSObj.nameRpt = nameRpt;
    iisODSObj.yearRpt = yearRpt;
    var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
    window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
    window.location.href = "aiiadmmgrAc.html";
});

$("#yearendbtn").click(function () {

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id
                + "/accounting/yearend?year=" + yearRpt,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {

        var resultmsg = "Accounting year end process result: " + result;
        if (result == '1') {

        } else {
            resultmsg += "  - fail";
        }

        alert(resultmsg);
        window.location.href = "aiiadmmgrAc.html";
    }
});

$("#deletebtn").click(function () {

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id
                + "/accounting/removeaccounting?year=" + yearRpt,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {

        var resultmsg = "Accounting delete result: " + result;
        if (result == '1') {
            resultmsg += "  - success";
        } else {
            resultmsg += "  - fail";
        }
        alert(resultmsg);

        window.location.href = "aiiadmmgrAc.html";
    }
});


function generateReport() {
    $("#myid").html('<span class="blink">Processing</span>');
    
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id + "/accounting/report?year=" + yearRpt + "&namerpt=" + nameRpt,
        crossDomain: true,
        cache: false,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function () {
            window.location.href = "aiiend.html";
        },
        success: function (resultRptObj) {

            var reportObjStr = JSON.stringify(resultRptObj, null, '\t');

            displayReport(reportObjStr);

        }
    });
}

$("#btnIncomeDownloadCsv").click(function () {
    // 1. Determine the active report type (Check how your UI determines namerpt: balance, income, etc.)
    // If your code uses a global dropdown or variable, substitute it here. Defaulting to empty falls back to 'income'
    var currentReportType =  "income"; 
    var currentAccountName = (typeof name_st !== 'undefined') ? name_st : "";
    var targetYear = (typeof yearRpt !== 'undefined') ? yearRpt : 0;

    // 2. Build the targeted endpoint URL matching your controller structure
    var csvUrl = iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id 
               + "/accounting/summaryreport/csv?name=" + (currentAccountName) 
               + "&year=" + targetYear 
               + "&namerpt=" + (currentReportType);

    // 3. Trigger native browser file download handling binary data streaming securely
    // Using window.location.href or an ephemeral anchor prevents AJAX blob conversion complexities
    window.location.href = csvUrl;
});

$("#btnBalanceDownloadCsv").click(function () {
    // 1. Determine the active report type (Check how your UI determines namerpt: balance, income, etc.)
    // If your code uses a global dropdown or variable, substitute it here. Defaulting to empty falls back to 'income'
    var currentReportType =  "balance"; 
    var currentAccountName = (typeof name_st !== 'undefined') ? name_st : "";
    var targetYear = (typeof yearRpt !== 'undefined') ? yearRpt : 0;

    // 2. Build the targeted endpoint URL matching your controller structure
    var csvUrl = iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id 
               + "/accounting/summaryreport/csv?name=" + (currentAccountName) 
               + "&year=" + targetYear 
               + "&namerpt=" + (currentReportType);

    // 3. Trigger native browser file download handling binary data streaming securely
    // Using window.location.href or an ephemeral anchor prevents AJAX blob conversion complexities
    window.location.href = csvUrl;
});

$("#btnDeprecationDownloadCsv").click(function () {
    // 1. Determine the active report type (Check how your UI determines namerpt: balance, income, etc.)
    // If your code uses a global dropdown or variable, substitute it here. Defaulting to empty falls back to 'income'
    var currentReportType =  "deprecation"; 
    var currentAccountName = (typeof name_st !== 'undefined') ? name_st : "";
    var targetYear = (typeof yearRpt !== 'undefined') ? yearRpt : 0;

    // 2. Build the targeted endpoint URL matching your controller structure
    var csvUrl = iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id 
               + "/accounting/summaryreport/csv?name=" + (currentAccountName) 
               + "&year=" + targetYear 
               + "&namerpt=" + (currentReportType);

    // 3. Trigger native browser file download handling binary data streaming securely
    // Using window.location.href or an ephemeral anchor prevents AJAX blob conversion complexities
    window.location.href = csvUrl;
});


$("#btnIncomeDetailDownloadCsv").click(function () {
    // 1. Determine the active report type (Check how your UI determines namerpt: balance, income, etc.)
    // If your code uses a global dropdown or variable, substitute it here. Defaulting to empty falls back to 'income'
    var currentReportType =  "income"; 
    var currentAccountName = (typeof name_st !== 'undefined') ? name_st : "";
    var targetYear = (typeof yearRpt !== 'undefined') ? yearRpt : 0;

    // 2. Build the targeted endpoint URL matching your controller structure
    var csvUrl = iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id 
               + "/accounting/report/csv?name=" + (currentAccountName) 
               + "&year=" + targetYear 
               + "&namerpt=" + (currentReportType);

    // 3. Trigger native browser file download handling binary data streaming securely
    // Using window.location.href or an ephemeral anchor prevents AJAX blob conversion complexities
    window.location.href = csvUrl;
});

$("#btnBalanceDetailDownloadCsv").click(function () {
    // 1. Determine the active report type (Check how your UI determines namerpt: balance, income, etc.)
    // If your code uses a global dropdown or variable, substitute it here. Defaulting to empty falls back to 'income'
    var currentReportType =  "balance"; 
    var currentAccountName = (typeof name_st !== 'undefined') ? name_st : "";
    var targetYear = (typeof yearRpt !== 'undefined') ? yearRpt : 0;

    // 2. Build the targeted endpoint URL matching your controller structure
    var csvUrl = iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id 
               + "/accounting/report/csv?name=" + (currentAccountName) 
               + "&year=" + targetYear 
               + "&namerpt=" + (currentReportType);

    // 3. Trigger native browser file download handling binary data streaming securely
    // Using window.location.href or an ephemeral anchor prevents AJAX blob conversion complexities
    window.location.href = csvUrl;
});

$("#btnDeprecationDetailDownloadCsv").click(function () {
    // 1. Determine the active report type (Check how your UI determines namerpt: balance, income, etc.)
    // If your code uses a global dropdown or variable, substitute it here. Defaulting to empty falls back to 'income'
    var currentReportType =  "deprecation"; 
    var currentAccountName = (typeof name_st !== 'undefined') ? name_st : "";
    var targetYear = (typeof yearRpt !== 'undefined') ? yearRpt : 0;

    // 2. Build the targeted endpoint URL matching your controller structure
    var csvUrl = iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id 
               + "/accounting/report/csv?name=" + (currentAccountName) 
               + "&year=" + targetYear 
               + "&namerpt=" + (currentReportType);

    // 3. Trigger native browser file download handling binary data streaming securely
    // Using window.location.href or an ephemeral anchor prevents AJAX blob conversion complexities
    window.location.href = csvUrl;
});


function displayReport(reportObjStr) {
    if (reportObjStr !== "") {
        reportObj = JSON.parse(reportObjStr);
        var entryList = reportObj.accTotalEntryBal;
        var beginDate = reportObj.begindisplay;
        var endDate = reportObj.enddisplay;
        var rangeSt = reportObj.name + ' - Rpt Year:' + yearRpt + ' Date:' + beginDate + ' to ' + ' ' + endDate;

        var htmlSt = "";
        htmlSt += '<table class="table table-sm">';
        htmlSt += '<thead>';

        htmlSt += '<tr>';
        htmlSt += '<td scope="row" colspan="5"><strong>' + rangeSt + '</strong></td>';
        htmlSt += '</tr>';


        htmlSt += '<tr>';
        htmlSt += '<th scope="col" style="width:20%">Date</th>';
        htmlSt += '<th scope="col" style="text-align: center;width:10%">Id</th>';
        htmlSt += '<th scope="col" style="text-align: left;width:30%">Name</th>';
        htmlSt += '<th scope="col" style="text-align: right">Expense</th>';
        htmlSt += '<th scope="col" style="text-align: right">Income</th>';
        htmlSt += '</tr>';
        htmlSt += '</thead>';
        htmlSt += '<tbody>';
        for (i = 0; i < entryList.length; i++) {
            var entryObj = entryList[i];

            if (entryObj.id == -1) {
                htmlSt += '<tr>';
                htmlSt += '<td scope="row" colspan="5"><strong>' + entryObj.name + '</strong></td>';

                htmlSt += '</tr>';
                continue;
            }
            var entryId = i + 1;
            if (i == 0) {
                // Cash account is confusing, Revert it
                var totStDebit = Number(entryObj.debit).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                var totStCredit = Number(entryObj.credit).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                if (entryObj.name === "cash") {
                    var tmp = totStCredit;
                    totStCredit = totStDebit;
                    totStDebit = tmp;
                }

                htmlSt += '<td scope="row" style="color: deepskyblue;width:20%"><strong>' + entryObj.dateSt + '</td>';
                htmlSt += '<td style="color: deepskyblue;text-align: center;width:10%">' + entryObj.id + '</td>';
                htmlSt += '<td onclick="return entryclickFun(\'' + entryObj.name + '\');" style="color: deepskyblue;text-align: left;width:30%">' + entryObj.name + '</td>';
                htmlSt += '<td style="color: deepskyblue;text-align: right">' + totStDebit + '</td>';
                htmlSt += '<td style="color: deepskyblue;text-align: right">' + totStCredit + '</td>';
                htmlSt += '</tr>';
                htmlSt += '<tr>';
                htmlSt += '<td scope="row" colspan="5"></td>';
                htmlSt += '</tr>';
                continue;
            }
            if (i + 1 === entryList.length) {
                htmlSt += '<tr>';
                htmlSt += '<td scope="row" colspan="5"></td>';
                htmlSt += '</tr>';
            }
            if (entryObj.name === "cash") {
                if (nameRpt === "balance") {
                    ;
                } else {
                    continue;
                }
            }
            htmlSt += '<tr>';
            htmlSt += '<td scope="row" style="width:20%"><strong>' + entryObj.dateSt + '</td>';
            htmlSt += '<td style="text-align: center;width:10%">' + entryObj.id + '</td>';
            if ((entryObj.name == "Total") || (entryObj.name == "common_share")) {
                htmlSt += '<td onclick="return entryclickFun(\'' + entryObj.name + '\');" style="text-align: left;width:30%"><small>' + entryObj.name + '</small></td>';

            } else {
                htmlSt += '<td onclick="return entryclickFun(\'' + entryObj.name + '\');" style="color: blue;text-align: left;width:30%"><small>' + entryObj.name + '</small></td>';
            }
            if (nameRpt === "balance") {
                var totSt = Number(entryObj.total).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                htmlSt += '<td></td>';
                htmlSt += '<td style="text-align: right">' + totSt + '</td>';

            } else {
                var totSt = Number(entryObj.debit).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                htmlSt += '<td style="text-align: right">' + totSt + '</td>';

                totSt = Number(entryObj.credit).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                htmlSt += '<td style="text-align: right">' + totSt + '</td>';
            }
            htmlSt += '</tr>';
        }

        htmlSt += '</tbody>';
        htmlSt += '</table>';

        $("#myid").html(htmlSt);

    }
}

function entryclickFun(entryN) {

    if (entryN.length === 0) {
        return;
    }
    $("#myentryid").html('<span class="blink">Processing</span>');

    var name = entryN;
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id + "/accounting/report?name=" + name + "&year=" + yearRpt + "&namerpt=" + nameRpt,
        crossDomain: true,
        cache: false,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function () {
            window.location.href = "aiiend.html";
        },
        success: function (resultRptObj) {
            var entryObjStr = JSON.stringify(resultRptObj, null, '\t');

            if (entryObjStr !== "") {
                var entryObjList = JSON.parse(entryObjStr);
                var entryList = entryObjList.accEntryBal;

                var htmlSt = "";
                htmlSt += '<table class="table table-sm">';
                htmlSt += '<thead>';


                htmlSt += '<tr>';
                htmlSt += '<th scope="col" style="width:20%">Date</th>';
                htmlSt += '<th scope="col" style="text-align: center;width:10%">Id</th>';
                htmlSt += '<th scope="col" style="text-align: left;width:30%">Name</th>';
                htmlSt += '<th scope="col" style="text-align: right">Expense</th>';
                htmlSt += '<th scope="col" style="text-align: right">Income</th>';
                htmlSt += '</tr>';
                htmlSt += '</thead>';
                htmlSt += '<tbody>';


                var primary = "primary";
                var secondary = "secondary";
                for (i = 0; i < entryList.length; i++) {
                    var entryObj = entryList[i];

                    var itemColor = primary;
                    if ((i % 2) == 0) {
                        itemColor = secondary;
                    }
                    var totStDebit = Number(entryObj.debit).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                    var totStCredit = Number(entryObj.credit).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
                    // Cash account is confusing, Revert it
                    if (entryObj.name === "cash") {
                        var tmp = totStCredit;
                        totStCredit = totStDebit;
                        totStDebit = tmp;
                    }
                    htmlSt += '<tr class="table-' + itemColor + '">';
                    htmlSt += '<td scope="col" style="width:20%"><strong>' + entryObj.dateSt + '</td>';
                    htmlSt += '<td scope="col" style="text-align: center;width:10%">' + entryObj.id + '</td>';
                    htmlSt += '<td scope="col" style="text-align: left;width:30%"><small>' + entryObj.name + '</small></td>';
                    htmlSt += '<td scope="col" style="text-align: right">' + totStDebit + '</td>';
                    htmlSt += '<td scope="col" style="text-align: right">' + totStCredit + '</td>';
                    htmlSt += '</tr>';

                    htmlSt += '<tr class="table-' + itemColor + '">';
                    htmlSt += '<td scope="row" colspan="5"><small>' + entryObj.comment + '</small></td>';
                    htmlSt += '</tr>';

                }

                htmlSt += '</tbody>';
                htmlSt += '</table>';

                $("#myentryid").html(htmlSt);

            }
        }

    });
}


$("#revsubmit").click(function () {
    var revamount = document.getElementById("revamount").value;
    if (revamount === "") {
        window.location.href = "accountadmrp.html";
        return;
    }
    var comment = document.getElementById("revcomm").value;
    var balance = revamount;
    if (yearRpt !== 0) {
        if (confirm('Do you want to add transaction in year ' + yearRpt + '?')) {
            ;
        } else {
            return;
        }
    }
    ///cust/{username}/uisys/{custid}/accounting/update?payment=&balance=&reason=&comment=
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id
                + "/accounting/update?balance=" + balance + "&year=" + yearRpt + "&comment=" + comment,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {
        console.log(result);
        var resultmsg = "Accounting Update result: " + result;
        if (result == '1') {
            resultmsg += "  - success";
        } else {
            resultmsg += "  - fail";
        }
        alert(resultmsg);

        window.location.href = "aiiadmmgrAc.html";

    }
});


$("#exsubmit").click(function () {
    var examount = document.getElementById("examount").value;
    if (examount === "") {
        window.location.href = "accountadmrp.html";
        return;
    }
    var comment = document.getElementById("excomm").value;
    var rate = document.getElementById("exrate").value;
    if ((rate === "") || (rate === "50") || (rate === "100")) {
        ;
    } else {
        var resultmsg = "Accounting Update error: Only accept 100% or 50% ";
        alert(resultmsg);
        window.location.href = "accountadmrp.html";
        return;
    }
    var payment = examount;
    if (yearRpt !== 0) {
        if (confirm('Do you want to add transaction in year ' + yearRpt + '?')) {
            ;
        } else {
            return;
        }
    }
    ///cust/{username}/uisys/{custid}/accounting/update?payment=&balance=&reason=&comment=
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id
                + "/accounting/update?payment=" + payment + "&year=" + yearRpt + "&rate=" + rate + "&comment=" + comment,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {
        console.log(result);
        var resultmsg = "Accounting Update result: " + result;
        if (result == '1') {
            resultmsg += "  - success";
        } else {
            resultmsg += "  - fail";
        }
        alert(resultmsg);

        window.location.href = "aiiadmmgrAc.html";
    }
});

$("#depsubmit").click(function () {
    var depamount = document.getElementById("depamount").value;
    if (depamount === "") {
        return;
    }
    var deprate = document.getElementById("deprate").value;
    if ((deprate === "") || (deprate === "0") || (deprate === "100")) {

        alert("Need to enter deprecation rate.");
        return;
    }

    var comment = document.getElementById("depcomm").value;
    var payment = depamount;
    if (yearRpt !== 0) {
        if (confirm('Do you want to add transaction in year ' + yearRpt + '?')) {
            ;
        } else {
            return;
        }
    }
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id
                + "/accounting/deprecation?payment=" + payment + "&rate=" + deprate + "&comment=" + comment,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {
        console.log(result);
        var resultmsg = "Accounting Update result: " + result;
        if (result == '1') {
            resultmsg += "  - success";
        } else {
            resultmsg += "  - fail";
        }
        alert(resultmsg);
        window.location.href = "aiiadmmgrAc.html";

    }
});

//utility
$("#costsubmit").click(function () {
    var costamount = document.getElementById("costamount").value;
    if (costamount === "") {
        return;
    }
    var costyr = document.getElementById("costyr").value;

    var comment = document.getElementById("costcomm").value;
    var payment = costamount;
    if (yearRpt !== 0) {
        if (confirm('Do you want to add transaction in year ' + yearRpt + '?')) {
            ;
        } else {
            return;
        }
    }
    ///cust/{username}/uisys/{custid}/accounting/utility?payment=&curyear=&reason=&comment=
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id
                + "/accounting/utility?payment=" + payment + "&curyear=" + costyr + "&comment=" + comment,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {
        console.log(result);
        var resultmsg = "Accounting Update result: " + result;
        if (result == '1') {
            resultmsg += "  - success";
        } else {
            resultmsg += "  - fail";
        }
        alert(resultmsg);
        window.location.href = "aiiadmmgrAc.html";

    }
});

$("#taxsubmit").click(function () {
    var taxamount = document.getElementById("taxamount").value;
    if (taxamount === "") {
        return;
    }
    var comment = document.getElementById("taxcomm").value;

    var payment = taxamount;
    if (yearRpt !== 0) {
        if (confirm('Do you want to add transaction in year ' + yearRpt + '?')) {
            ;
        } else {
            return;
        }
    }
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id
                + "/accounting/tax?payment=" + payment + "&year=" + yearRpt + "&comment=" + comment,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {
        console.log(result);
        var resultmsg = "Accounting Update result: " + result;
        if (result == '1') {
            resultmsg += "  - success";
        } else {
            resultmsg += "  - fail";
        }
        alert(resultmsg);

        window.location.href = "aiiadmmgrAc.html";
    }
});


$("#casubmit").click(function () {
    var taxamount = document.getElementById("caamount").value;
    if (taxamount === "") {
        return;
    }
    var comment = document.getElementById("cacomm").value;

    var payment = taxamount;
    if (yearRpt !== 0) {
        if (confirm('Do you want to add transaction in year ' + yearRpt + '?')) {
            ;
        } else {
            return;
        }
    }
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id
                + "/accounting/cash?payment=" + payment + "&year=" + yearRpt + "&comment=" + comment,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {
        console.log(result);
        var resultmsg = "Accounting Update result: " + result;
        if (result == '1') {
            resultmsg += "  - success";
        } else {
            resultmsg += "  - fail";
        }
        alert(resultmsg);

        window.location.href = "aiiadmmgrAc.html";
    }
});

