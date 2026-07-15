///////////////////////////////////////////////////////////////////////////////////////

var app = {

// Application Constructor
    initialize: function () {

        $(document).ready(function () {

        });
    }

};
app.initialize();
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
var admCmd = "";
var admParm = "";

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
accdevId = iisODSObj.accdevId;
//////Goble variable
accId = iisODSObj.accId;
accfundId = iisODSObj.accfundId;
admcust = iisODSObj.admcust;
admCmd = iisODSObj.admCmd;
admParm = iisODSObj.admParm;

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

var htmlModel = "";


var cuObj = "";
var accCuObj = null;

var STnameLStr = "";
var STnameL = "";
var STnameNum = 0;
var itemList = [];
var paginatedList;
var custPagenum = 1;
STnameLStr = iisODSObj.admLStr;
custPagenum = iisODSObj.admPagenum;
var STnumDisp = 10; // number of line for stockt
var pageSize = 10;
if (sysDevOp == true) {

    if ((admcust.length > 0) && (STnameLStr.length > 0)) {
        updateCurPage(STnameLStr);
        updateCustInfo(admcust);
    } else {
        admcust = "";
    }

    if (admcust.length == 0) {
        initAdmCustomer();
    }


}
// Function to paginate a list
// Number of items per page


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
    if (pageNumber <= 0) {
        pageNumber = 1;
    }
    var page = paginatedList[pageNumber - 1];
    var pageRet = "";
    if (page) {
        pageRet = page.join(", ");
    } else {
    }
    return pageRet;
}

function initAdmCustomer() {


    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id + "/custnlist?length=0",
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


    function handleResult(resultCustNList) {
        var CustNListStr = JSON.stringify(resultCustNList, null, '\t');
        if (CustNListStr.length == 0) {
            return;
        }
        updateCurPage(CustNListStr);
    }
}


function updateCurPage(CustNListStr) {
    STnameLStr = CustNListStr;
    if (STnameLStr !== "") {
        STnameL = JSON.parse(STnameLStr);
        STnameNum = STnameL.length;
        if (STnameNum <= pageSize) {
            stockPageList = STnameL.join(", ");
        } else {
            for (i = 0; i < STnameL.length; i++) {
                itemList.push(STnameL[i]);
            }
// Paginate the list
            paginatedList = paginateList(itemList, pageSize);
            if (custPagenum <= 0) {
                custPagenum = 1;
                stockPageList = displayPage(custPagenum);
            } else {
                if (custPagenum > paginatedList.length) {
                    custPagenum = paginatedList.length;
                }
                stockPageList = displayPage(custPagenum);
            }
            updateCurList(stockPageList);
        }
    }
}
function updateCurList(custNameListSt) {

    if (custNameListSt.length == 0) {
        htmlName = 'Current customer list is empty.';
        $("#custlistid").html(htmlName);
        return;
    }
    var custNameList = custNameListSt.split(",");
    var htmlName = '';
    htmlName += '<table class="table text-start align-middle table-bordered table-hover mb-0">';
    htmlName += '<thead>';
    htmlName += '<tr class="text-dark">';
    htmlName += '<th scope="col">Customer</th>';
    htmlName += '<th scope="col">Detail</th>';
    htmlName += '</tr>';
    htmlName += '</thead>';
    htmlName += '<tbody>';
    var col1 = "";
    for (i = 0; i < custNameList.length; i++) {
        col1 = custNameList[i];
        htmlName += '<tr>';
        htmlName += '<td>' + col1 + '</td>';
        htmlName += '<td><a class="btn btn-sm btn-primary" href="" onclick="return updateCustClick(\'' + col1 + '\');" >Detail</a></td>';
        htmlName += '</tr>';
    } // end of stock list
    htmlName += '</tbody>';
    htmlName += '</table>';
    //<!-- Basic Pagination -->
    if (STnameNum > pageSize) {
        htmlName += '<nav aria-label="Page navigation example">';
        htmlName += '<ul class="pagination">';
        htmlName += '<li onclick="return stPageCnt(-1);" class="page-item"><a class="page-link" href="#">Previous</a></li>';
        htmlName += '<li class="page-item"><a id="StPageNumId" class="page-link" href="#">' + custPagenum + '_of_' + paginatedList.length + '</a></li>';
        htmlName += '<li onclick="return stPageCnt(1);"  class="page-item"><a class="page-link" href="#">Next</a></li>';
        htmlName += '</ul>';
        htmlName += '</nav>';
    }
//<!-- End Basic Pagination -->

    $("#custlistid").html(htmlName);
}

function stPageCnt(cnt) {
    var changeF = false;
    if (custPagenum <= 0) {
        custPagenum = 1;
    }
    if (cnt == -1) {
        if (custPagenum > 1) {
            custPagenum--;
            changeF = true;
        }
    } else if (cnt = 1) {
        if (custPagenum < paginatedList.length) {
            custPagenum++;
            changeF = true;
        }
    }
    if (changeF == true) {
        stockPageList = displayPage(custPagenum);
        $("#StPageNumId").html('<span class="blink">Processing</span>');
        updateCurList(stockPageList)
    }
}

// internal click call ajax need a form tag <form>
function updateCustClick(username) {
    username = username.trim();
    iisODSObj.admcust = username;
    iisODSObj.admLStr = STnameLStr;
    iisODSObj.admPagenum = custPagenum;
    var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
    window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
    window.location.href = "#";
}


function updateCustInfo(username) {

    accCuObj = null;
    if (accObjList.length == 0) {
        return;
    }
    for (i = 0; i < accObjList.length; i++) {
        var accObjTmp = accObjList[i];
        if (custObj.type == 84) {
            accCuObj = accObjTmp;
            break;
        }
        if (custObj.type == 86) {
            accCuObj = accObjTmp;
            break;
        }
        if (custObj.type == 99) {
            accCuObj = accObjTmp;
            break;
        }
        if (accObjTmp.type == 140) { //INT_ADMIN_ACCOUNT = 140;
            accCuObj = accObjTmp;
            break;
        }
    }
    if (accCuObj == null) {
        return;
    }
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id + "/custlist?name=" + username,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        success: handleResult
    }); // use promises

    function handleResult(result) {
        if (result != null) {
            var cuObjListStr = JSON.stringify(result, null, '\t');
            if (cuObjListStr.length == 0) {
                return;
            }
            if (cuObjListStr !== "") {
                var cuObjList = JSON.parse(cuObjListStr);
                var primary = "primary";
                var secondary = "secondary";
                var htmlSt = "";
                htmlSt += '<ul class="list-group">';
                var trStr = "";
                for (i = 0; i < cuObjList.length; i++) {
                    cuObj = cuObjList[i];
                    try {
                        var displayData = "";
                        var dataSt = cuObj.data;
                        if (dataSt != null) {
                            if (dataSt !== "") {
                                dataSt = dataSt.replaceAll('#', '"');
                                var detailObj = JSON.parse(dataSt);
                                if (detailObj != null) {
                                    if (detailObj.nPlan !== -1) {
                                        if (custObj.substatus != detailObj.nPlan) {
                                            var pp = "Basic Plan - Max 2 stocks";
                                            if (detailObj.nPlan == 0) {
                                                pp = "Basic Plan - Max 2 stocks";
                                            } else if (detailObj.nPlan == 10) {
                                                pp = "Standard Plan - Max 10 stocks";
                                            } else if (detailObj.nPlan == 20) {
                                                pp = "Premium Plan - Max 20 stocks";
                                            } else if (detailObj.nPlan == 40) {
                                                pp = "Professional Plan - Max 40 stocks";
                                            } else if (detailObj.nPlan == 80) {
                                                pp = "Enterprise Plan - Max 80 stocks";
                                            } else if (detailObj.nPlan == 160) {
                                                pp = "Corporate Plan - Max 160 stocks";                                                
                                            } else if (detailObj.nPlan == 90) {
                                                pp = "API Plan - Max 1000 stocks";
                                            } else if (detailObj.nPlan == 100) {
                                                pp = "SRV Plan - Max 0 stocks";
                                            }
                                            displayData += '<br>' + '*Pending to change* ' + pp;
                                            trStr += '<li class="list-group-item list-group-item-info">' + displayData + '</li>';
                                        }
                                    }

                                }

                                var servName = "";
                                var servListSt = cuObj.serL;
                                servListSt = servListSt.replaceAll('#', '"');
                                if (servListSt == ""){
                                    servListSt ="[]"
                                }
                                var servList = JSON.parse(servListSt);        

                                if (servList.length > 0) {
                                    for (i = 0; i < servList.length; i++) {
                                        var itemColor = primary;
                                        if ((i % 2) == 0) {
                                            itemColor = secondary;
                                        }
                                        var servObj = servList[i];
                                        var date = new Date(servObj.st * 1000).toLocaleDateString("en-US");
                                        servName = date + " - " + servObj.cd + " - " + servObj.na;
                                        if (servObj.cnt == -1) {
                                            servName += " (ended)";
                                        }
                                        trStr += '<li class="list-group-item list-group-item-' + itemColor + '">' + servName + '</li>';
                                    }

                                }

                            }
                        }
                    } catch (err) {

                    }

                    var custSt = ""
                    var status = cuObj.status;
                    var statusSt = "";
                    if (status == 0) {
                        statusSt = "0 - Open";
                    } else if (status == 1) {
                        statusSt = "1 - Disable";
                    } else if (status == 2) {
                        statusSt = "2 - Pending";
                    }
                    custSt += cuObj.startdate + '<br>' + cuObj.username
                            + '<br> First: ' + cuObj.firstname
                            + '&nbsp;&nbsp;&nbsp;Last: ' + cuObj.lastname
                            + '<br>email: ' + cuObj.email
                            + '<br>Type: ' + cuObj.type
                            + '&nbsp;&nbsp;&nbsp;Status: ' + statusSt
                            + '&nbsp;&nbsp;&nbsp;SubStatus: ' + cuObj.substatus

                            + '<br>Bill date: ' + cuObj.updatedatedisplay

                            + '<br>Balance:' + cuObj.balance
                            + '&nbsp;&nbsp;&nbsp;AmountDue:' + cuObj.payment
                            + '&nbsp;&nbsp;&nbsp;Discount:' + cuObj.dis
                            + '&nbsp;&nbsp;&nbsp;SrvCharge:' + cuObj.ser
                            + '&nbsp;&nbsp;&nbsp;Credit:' + cuObj.cr


                    htmlSt += '<li class="list-group-item list-group-item-info">' + custSt + '</li>';
                    htmlSt += '<li class="list-group-item list-group-item-info">' + trStr + '</li>';
                }
                htmlSt += '</ul>';
                $("#custInfoid").html(htmlSt);
            }

        }
    }
}



function loginclickFun() {
    var htmlhead = "";
    $("#rloginsubmit").attr("disabled", true);
    if (cuObj == "") {
        htmlhead += 'Please select a customer.';
        $("rloginBodyId").html(htmlhead);
        return;
    } else {
        var status = cuObj.status;
        if (status != 0) {
            htmlhead += 'Customer is not in open status.';
            $("#rloginBodyId").html(htmlhead);
            return;
        }
        var name = cuObj.firstname + cuObj.lastname;
        if (name.length == 0) {
            name = cuObj.username
        }        
        var html = "";
        html += 'Login in to ' + name;
        html += '<br>email: ' + cuObj.email;
        html += '<div class="row mb-3">';
        html += '<label for="desktopview" class="col-md-4 col-lg-3 col-form-label">Desktop view:</label>';
        html += '<div class="col-md-8 col-lg-9">';
        html += '<input name="desktopview" type="text" class="form-control" id="desktopview" value="1">';
        html += '</div>';
        html += '</div>';

        htmlhead += '<br><br>' + html
    }
    htmlModel = htmlhead;
    $("#rloginBodyId").html(htmlhead);

    $("#rloginsubmit").attr("disabled", false);
    return;

}

$("#rloginsubmit").click(function () {
    var msgObjStr = "";
    var txemail = cuObj.username;
    var txtpassword = cuObj.password;

    // STEP 1: Get the value FIRST before clearing the HTML
    var desktopElement = document.getElementById("desktopview");
    var rloginview = desktopElement ? desktopElement.value : "0"; 

    // STEP 2: Now it is safe to show the "Updating" message
    $("#rloginBodyId").html('<span class="blink">Updating....</span>');

    var customername = cuObj.username;
    // ... (Your balance check logic) ...

    $.ajax({
        url: iisurl + "/cust/login?email=" + txemail + "&pass=" + txtpassword,
        crossDomain: true,
        cache: false,
        success: handleResult
    });

    function handleResult(result) {
        var custObj = result.custObj;
        if (custObj != null) {
            var custObjStr = JSON.stringify(custObj, null, '\t');

            window.localStorage.setItem(iisODSObjSession, "");

            const iisDataObj = {
                accObjListStr: '',
                stockObjListStr: '',
                stockFundObjListStr: ''
            }
            var iisDataObjStr = JSON.stringify(iisDataObj, null, '\t');

            var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
            window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));

            var iisMsgSession = "iisMsgSession";
            window.localStorage.setItem(iisMsgSession, "");

            // STEP 3: Use the correct variable name (rloginview) 
            // and compare as a string or number
            if (rloginview == "1") { 
                window.location.href = "aiiaccount.html";
            } else {
                window.location.href = "aiapprofile.html";
            }
            return;
        } else {
            alert("Cannot access remote customer!");
            window.location.href = "#";
        }
    }
});


function statusCclickFun() {
    var htmlhead = "";
    $("#statusCsubmit").attr("disabled", true);
    if (cuObj == "") {
        htmlhead += 'Please select a customer.';
        $("statusCBodyId").html(htmlhead);
        return;
    } else {

        var status = cuObj.status;
        var statusSt = "";
        if (status == 0) {
            statusSt = "0 - Open";
        } else if (status == 1) {
            statusSt = "1 - Disable";
        } else if (status == 2) {
            statusSt = "2 - Pending";
        }
        var html = "";
        html += '<div class="col-lg-9 col-md-8">';
        html += '<select id="statusCmodel" class="form-select" >';
        html += '<option value="-1" selected> Select a new Status</option>';
        html += '<option value="0" > 0 - Open</option>';
        html += '<option value="1" > 1 - Disable</option>';
        html += '<option value="2" > 2 - Pending</option>';
        html += '</select>';
        html += '</div>';

        htmlhead += 'Curent Status:' + statusSt
        htmlhead += '<br><br>' + html
    }
    htmlModel = htmlhead;
    $("#statusCBodyId").html(htmlhead);

    $("#statusCsubmit").attr("disabled", false);
    return;

}
$("#statusCsubmit").click(function () {

    var statusVal = $('#statusCmodel').val();

    if ((statusVal === "") || (statusVal == -1)) {
        var msgObjStr = 'No Status update';
        msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
        $("#statusCBodyId").html(msgObjStr);
        return;
    }

    var customername = cuObj.username;
    var subS = statusVal;
    $("#statusCBodyId").html('<span class="blink">Updating....</span>');
    //cust/{username}/uisys/{custid}/cust/{customername}/update?status=&payment=&balance="
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id + "/cust/" + customername
                + "/update?status=" + subS,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {
        var msgObjStr = '';
        // result 1 = good, 0 = error                

        if (result == '1') {
        } else {
            msgObjStr = "Status result fail: " + result;
            msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
            $("#statusCBodyId").html(msgObjStr);
            return;
        }

        window.location.href = "aiiadmmgrcust.html";
    }



});

function substatusCclickFun() {
    var htmlhead = "";
    $("#substatusCsubmit").attr("disabled", true);
    if (cuObj == "") {
        htmlhead += 'Please select a customer.';
        $("statusCBodyId").html(htmlhead);
        return;
    } else {

        var status = cuObj.substatus;
        var statusSt = status;

        var html = "";
        html += '<div class="col-lg-9 col-md-8">';
        html += '<select id="substatusCmodel" class="form-select" >';
        html += '<option value="-1" selected> Select a new Status</option>';
        html += '<option value="0" > 0 Basic Plan - Max 2 stocks</option>';
        html += '<option value="10" > 10 Standard Plan - Max 8 stocks</option>';
        html += '<option value="20" > 20 Premium Plan - Max 20 stocks</option>';
        html += '<option value="40" > 40 Professional Plan - Max 40 stocks</option>';
        html += '<option value="80" > 80 Enterprise Plan - Max 80 stocks</option>';        
        html += '<option value="160" > 160 Corporate Plan - Max 160 stocks</option>';             
        html += '</select>';
        html += '</div>';

        htmlhead += 'Curent subStatus:' + statusSt
        htmlhead += '<br><br>' + html
    }
    htmlModel = htmlhead;
    $("#substatusCBodyId").html(htmlhead);

    $("#substatusCsubmit").attr("disabled", false);
    return;

}
$("#substatusCsubmit").click(function () {

    var statusVal = $('#substatusCmodel').val();

    if ((statusVal === "") || (statusVal == -1)) {
        var msgObjStr = 'No Status update';
        msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
        $("#statusCBodyId").html(msgObjStr);
        return;
    }

    var customername = cuObj.username;
    var subS = statusVal;
    $("#substatusCBodyId").html('<span class="blink">Updating....</span>');
    //cust/{username}/uisys/{custid}/cust/{customername}/update?status=&payment=&balance="
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id + "/cust/" + customername
                + "/update?substatus=" + subS,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {
        var msgObjStr = '';
        // result 1 = good, 0 = error                

        if (result == '1') {
        } else {
            msgObjStr = "Status result fail: " + result;
            msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
            $("#substatusCBodyId").html(msgObjStr);
            return;
        }

        window.location.href = "aiiadmmgrcust.html";
    }


});


function srvCclickFun() {
    var htmlhead = "";
    $("#srvCsubmit").attr("disabled", true);
    if (cuObj == "") {
        htmlhead += 'Please select a customer.';
        $("srvCBodyId").html(htmlhead);
        return;
    } else {
        var html = "";
        html += 'Clear customer service feature<br>';
        html += '<div class="row mb-3">';
        html += '<label for="payment" class="col-md-4 col-lg-3 col-form-label">Service Feature Name:</label>';
        html += '<div class="col-md-8 col-lg-9">';
        html += '<input name="ClSrvSt" type="text" class="form-control" id="ClSrvSt">';
        html += '</div>';
        html += '</div>';

        htmlhead += '<br><br>' + html
    }
    htmlModel = htmlhead;
    $("#srvCBodyId").html(htmlhead);

    $("#srvCsubmit").attr("disabled", false);
    return;

}
$("#srvCsubmit").click(function () {
    var msgObjStr = "";


    var feat = document.getElementById("ClSrvSt").value;
    if (feat === "") {
        msgObjStr = 'No update';
        msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
        $("#srvCBodyId").html(msgObjStr);
        return;
    }

    var customername = cuObj.username;
    ///cust/{username}/uisys/{custid}/cust/{customername}/removefeature?feat="
    $("#srvCBodyId").html('<span class="blink">Updating....</span>');
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id + "/cust/" + customername
                + "/removefeature?feat=" + feat,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {
        var msgObjStr = '';
        // result 1 = good, 0 = error                

        if (result == '1') {
        } else {
            msgObjStr = "Update result fail: " + result;
            msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
            $("#srvCBodyId").html(msgObjStr);
            return;
        }

        window.location.href = "aiiadmmgrcust.html";
    }


});


function accAdjclickFun() {
    var htmlhead = "";
    $("#accAdjsubmit").attr("disabled", true);
    if (cuObj == "") {
        htmlhead += 'Please select a customer.';
        $("accAdjBodyId").html(htmlhead);
        return;
    } else {
        var html = "";
        html += 'Adjust Account Invoice Amount (due to correction)<br>';
        html += '<div class="row mb-3">';
        html += '<label for="payment" class="col-md-4 col-lg-3 col-form-label">Adjustment:</label>';
        html += '<div class="col-md-8 col-lg-9">';
        html += '<input name="adjustment" type="text" class="form-control" id="adjustment">';
        html += '</div>';
        html += '</div>';

        htmlhead += '<br><br>' + html
    }
    htmlModel = htmlhead;
    $("#accAdjBodyId").html(htmlhead);

    $("#accAdjsubmit").attr("disabled", false);
    return;

}
$("#accAdjsubmit").click(function () {
    var msgObjStr = "";

    if ((custObj.type == 82) || (custObj.type == 86)) {
        msgObjStr = 'Your account Type does not allow update';
        msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
        $("#accAdjBodyId").html(msgObjStr);
        return;
    }
    var accbalance = document.getElementById("adjustment").value;
    if (accbalance === "") {
        msgObjStr = 'No update';
        msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
        $("#accAdjBodyId").html(msgObjStr);
        return;

    }


    var customername = cuObj.username;
    var balance = accbalance;

    $("#accAdjBodyId").html('<span class="blink">Updating....</span>');
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id + "/cust/" + customername
                + "/update?balance=" + balance,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {
        var msgObjStr = '';
        // result 1 = good, 0 = error                

        if (result == '1') {
        } else {
            msgObjStr = "Update result fail: " + result;
            msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
            $("#accAdjBodyId").html(msgObjStr);
            return;
        }

        window.location.href = "aiiadmmgrcust.html";
    }


});



function memAddclickFun() {
    var htmlhead = "";
    $("#memAddsubmit").attr("disabled", true);
    if (cuObj == "") {
        htmlhead += 'Please select a customer.';
        $("memAddBodyId").html(htmlhead);
        return;
    } else {
        var html = "";
        html += 'Clear customer service feature<br>';
        html += '<div class="row mb-3">';
        html += '<label for="payment" class="col-md-4 col-lg-3 col-form-label">Service Feature Name:</label>';
        html += '<div class="col-md-8 col-lg-9">';
        html += '<input name="addmemoTxt" type="text" class="form-control" id="addmemoTxt">';
        html += '</div>';
        html += '</div>';

        htmlhead += '<br><br>' + html
    }
    htmlModel = htmlhead;
    $("#memAddBodyId").html(htmlhead);

    $("#memAddsubmit").attr("disabled", false);
    return;

}
$("#memAddsubmit").click(function () {
    var msgObjStr = "";


    var memo = document.getElementById("addmemoTxt").value;
    if (memo === "") {
        msgObjStr = 'No update';
        msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
        $("#memAddBodyId").html(msgObjStr);
        return;
    }
    if (accCuObj == null) {
        return;
    }
    $("#memAddBodyId").html('<span class="blink">Updating....</span>');

    ///cust/{username}/acc/{accountid}/billing/addmemo?memo=
    $.ajax({
        url: iisurl + "/cust/" + cuObj.username + "/acc/" + accCuObj.id + "/billing/addmemo?memo=" + memo,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises
    //
    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {
        var msgObjStr = '';
        // result 1 = good, 0 = error                

        if (result == '1') {
        } else {
            msgObjStr = "Update result fail: " + result;
            msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
            $("#memAddBodyId").html(msgObjStr);
            return;
        }

        window.location.href = "aiiadmmgrcust.html";
    }


});

//////////////////////////////////
function userPAclickFun() {
    var htmlhead = "";
    $("#userPAsubmit").attr("disabled", true);
    if (cuObj == "") {
        htmlhead += 'Please select a customer.';
        $("userPABodyId").html(htmlhead);
        return;
    } else {
        var html = "";
        html += 'Account Invoice Amount<br>';
        html += '<div class="row mb-3">';
        html += '<label for="payment" class="col-md-4 col-lg-3 col-form-label">Payment:</label>';
        html += '<div class="col-md-8 col-lg-9">';
        html += '<input name="payment" type="text" class="form-control" id="payment">';
        html += '</div>';
        html += '</div>';

        htmlhead += '<br><br>' + html
    }
    htmlModel = htmlhead;
    $("#userPABodyId").html(htmlhead);

    $("#userPAsubmit").attr("disabled", false);
    return;

}
$("#userPAsubmit").click(function () {
    var msgObjStr = "";

    if ((custObj.type == 82) || (custObj.type == 86)) {
        msgObjStr = 'Your account Type does not allow update';
        msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
        $("#userPABodyId").html(msgObjStr);
        return;
    }
    var accpaid = document.getElementById("payment").value;
    if (accpaid === "") {
        msgObjStr = 'No update';
        msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
        $("#userPABodyId").html(msgObjStr);
        return;

    }

    if (accpaid < 0) {
        if (-accpaid > cuObj.balance) {
            msgObjStr = 'No Status update. Withdraw amount more than balance';
            msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
            $("#userPABodyId").html(msgObjStr);

            return;
        }
    }

    var customername = cuObj.username;
    var balance = accpaid;
    var reasonTx = "R_USER_PAYMENT";
    if (balance < 0) {
        reasonTx = "E_USER_WITHDRAWAL";
    }
    $("#userPABodyId").html('<span class="blink">Updating....</span>');

    //cust/{username}/uisys/{custid}/cust/{customername}/update?status=&payment=&balance="
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id + "/cust/" + customername
                + "/update?balance=" + balance + "&reason=" + reasonTx,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {
        var msgObjStr = '';
        // result 1 = good, 0 = error                

        if (result == '1') {
        } else {
            msgObjStr = "Update result fail: " + result;
            msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
            $("#userPABodyId").html(msgObjStr);
            return;
        }

        window.location.href = "aiiadmmgrcust.html";
    }


});


function userWDclickFun() {
    var htmlhead = "";
    $("#userWDsubmit").attr("disabled", true);
    if (cuObj == "") {
        htmlhead += 'Please select a customer.';
        $("userPABodyId").html(htmlhead);
        return;
    } else {
        var html = "";
        html += 'Account Invoice Amount<br>';
        html += '<div class="row mb-3">';
        html += '<label for="withdraw" class="col-md-4 col-lg-3 col-form-label">Withdraw:</label>';
        html += '<div class="col-md-8 col-lg-9">';
        html += '<input name="withdraw" type="text" class="form-control" id="withdraw">';
        html += '</div>';
        html += '</div>';

        htmlhead += '<br><br>' + html
    }
    htmlModel = htmlhead;
    $("#userWDBodyId").html(htmlhead);

    $("#userWDsubmit").attr("disabled", false);
    return;

}
$("#userWDsubmit").click(function () {
    var msgObjStr = "";

    if ((custObj.type == 82) || (custObj.type == 86)) {
        msgObjStr = 'Your account Type does not allow update';
        msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
        $("#userWDBodyId").html(msgObjStr);
        return;
    }
    var accdraw = document.getElementById("withdraw").value;

    if (accdraw === "") {
        msgObjStr = 'No update';
        msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
        $("#userWDBodyId").html(msgObjStr);
        return;

    }


    var customername = cuObj.username;
    if (accdraw > cuObj.balance) {
        msgObjStr = 'No Status update. Withdraw amount more than balance';
        msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
        $("#userWDBodyId").html(msgObjStr);

        return;
    }
    var balance = -accdraw;

    $("#userWDBodyId").html('<span class="blink">Updating....</span>');

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id + "/cust/" + customername
                + "/update?balance=" + balance + "&reason=E_USER_COMMISSION",
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {
        var msgObjStr = '';
        // result 1 = good, 0 = error                

        if (result == '1') {
        } else {
            msgObjStr = "Update result fail: " + result;
            msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
            $("#userWDBodyId").html(msgObjStr);
            return;
        }
        window.location.href = "aiiadmmgrcust.html";
    }

});



$("#billRsubmit").click(function () {
    var msgObjStr = "";

    if ((custObj.type == 82) || (custObj.type == 86)) {
        msgObjStr = 'Your account Type does not allow update';
        msgObjStr = htmlModel + '<br><p style="color:red">' + msgObjStr + '</p>'
        $("#billRBodyId").html(msgObjStr);
        return;
    }
    var customername = cuObj.username;
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id + "/cust/" + customername + "/billrun",
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {
        window.location.href = "aiiadmmgrcust.html";
    }

});

$("#memoGetsubmit").click(function () {
    var msgObjStr = "";

    if (accCuObj == null) {
        return;
    }

    $.ajax({
        url: iisurl + "/cust/" + cuObj.username + "/acc/" + accCuObj.id + "/billing/memo",
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises


    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(resultCommObjList) {
        var commObjListStr = "";
        if (resultCommObjList !== "") {
            commObjListStr = JSON.stringify(resultCommObjList, null, '\t');
            var commObjList = JSON.parse(commObjListStr);
            if (commObjList !== "") {
                var primary = "primary";
                var secondary = "secondary";
                var htmlSt = "";
                htmlSt += '<ul class="list-group">';
                var trStr = "";
                for (i = 0; i < commObjList.length; i++) {
                    var itemColor = primary;
                    if ((i % 2) == 0) {
                        itemColor = secondary;
                    }
                    var commObj = commObjList[i];
                    var commId = commObj.id;
                    var type = commObj.type;
                    var msgSt = commObj.msg.replaceAll("<br>", " ");
                    msgSt = commId + " - " + type + " - " + msgSt;
                    if (type === 99) {
                        msgSt = '<strong><span style="color:green">' + msgSt + '</span></strong>';
                    } else if (type === 0) {
                        msgSt = '<span style="color:grey">' + msgSt + '</span>';
                    } else if (type === 2) {
                        msgSt = '<span style="color:deeppink">' + msgSt + '</span>';
                    } else {
                        msgSt = '<span style="color:blue">' + msgSt + '</span>';

                    }
                    trStr += '<li class="list-group-item list-group-item-' + itemColor + '">' + msgSt + '</li>';

                }
                htmlSt += trStr;
                htmlSt += '</ul>';
                $("#custmemoid").html('<small>' + htmlSt + '</small>');
            }
        }
    }

});



$("#refreshui").click(function () {
    $("#refreshui").html('<span class="blink">Processing</span>');

    $.ajax({
        url: iisurl + "/cust/" + custObj.id + "/acc/" + accId + "/refreshUI",
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises


    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(result) {
        $("#refreshui").html('RefreshUI');
    }

});

$("#custNstclick").click(function () {
    var htmlhead = "";
    $("#custNsubmit").attr("disabled", true);

    var custNsymbol = document.getElementById("custNsymid").value;
    if (custNsymbol === "") {
        htmlhead += "Please add the customer name in the input field.";
        $("#custNBodyId").html(htmlhead);
        return;

    }

    var sym = custNsymbol.toUpperCase();
    var htmlhead = "Customer Name:" + sym;
    htmlModel = htmlhead;
    $("#custNBodyId").html(htmlhead);

    $("#custNsubmit").attr("disabled", false);

});

$("#custNsubmit").click(function () {
    var username = document.getElementById("custNsymid").value;
    if (username === "") {
        return;
    }
    username = username.trim();
    username = username.toUpperCase();

    updateCustClick(username);
    window.location.href = "aiiadmmgrcust.html";

//    var myModalEl = document.getElementById('custNModal');
//    var modal = bootstrap.Modal.getInstance(myModalEl)
//    modal.hide();

});

