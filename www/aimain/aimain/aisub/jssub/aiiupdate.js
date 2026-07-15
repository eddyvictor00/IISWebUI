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
accdevId = iisODSObj.accdevId;


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

var FundMgrTxtref = "";
var txtfirstname = "";
var txtlastname = "";
var txtemailaddress = "";
var txtref = "";

var txtpassword = "";

var newpassword = "";
var renewpassword = "";

// update menu start
mySubMenuReset();

updateShortCommFunction();

myInitUpdateFunction();


function myInitUpdateFunction() {

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
        pp = "API Plan - Max 600 stocks";
    } else if (custObj.substatus == 100) {
        pp = "SRV Plan - Max 0 stocks";
    }
    pp = '<strong>' + pp + '</strong>';


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
    html += '<div class="col-lg-3 col-md-4 label">Email</div>';
    var emailtxt = custObj.email;
    if (custChange == false) { // Demo
        emailtxt = "******";
    }
    html += '<div class="col-lg-9 col-md-8">' + emailtxt + '</div>';
    html += '</div>';

    html += '<div class="row">';
    html += '<div class="col-lg-3 col-md-4 label">Current Plan</div>';
    html += '<div class="col-lg-9 col-md-8">' + pp + '</div>';
    html += '</div>';

    $("#myoverviewid").html(html);

    document.getElementById("ufirstname").setAttribute('value', custObj.firstname);
    document.getElementById("ulastname").setAttribute('value', custObj.lastname);
    emailtxt = custObj.email
    if (custChange == false) { // Demo
        emailtxt = "******";
    }
    document.getElementById("uemail").setAttribute('value', emailtxt);

    if (accfundId > 0) {
        document.getElementById("funddisp-tag").style.display = "";  //show   
        var dataSt = custObj.data;
        try {
            if (dataSt != null) {
                if (dataSt !== "") {
                    dataSt = dataSt.replaceAll('#', '"');
                    var detailObj = JSON.parse(dataSt);
                    if (detailObj != null) {
                        if (detailObj.ref !== undefined) {
                            document.getElementById("txt-ref").setAttribute('value', detailObj.ref);
                            FundMgrTxtref = detailObj.ref;
                        }
                    }
                }
            }
        } catch (err) {
        }
    }
}


function profileCclickFun() {
    var htmlhead = "";
    $("#profileCsubmit").attr("disabled", true);

    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            htmlhead += "<br><br>This operation is not supported on demo accounts.";
            $("#profileCBodyId").html(htmlhead);
            return;
        }
    }

    var upd = "";
    txtfirstname = document.getElementById("ufirstname").value;
    if (custObj.firstname === txtfirstname) {
        txtfirstname = "";
    } else {
        upd += '<br>First: ' + txtfirstname;
    }
    txtlastname = document.getElementById("ulastname").value;
    if (custObj.lastname === txtlastname) {
        txtlastname = "";
    } else {
        upd += '<br>Last: ' + txtlastname;
    }
    txtemailaddress = document.getElementById("uemail").value;
    if (custObj.email === txtemailaddress) {
        txtemailaddress = "";
    } else {
        if (txtemailaddress === "******") {
            ;
        } else {
            upd += '<br>email: ' + txtemailaddress;
        }
    }
    txtref = document.getElementById("txt-ref").value;
    txtref = txtref.replaceAll(" ", "_");
    if (FundMgrTxtref === txtref) {
        txtref = "";
    } else {
        upd += '<br>FundMgr Name: ' + txtref;
    }


    if (upd.length > 0) {
        htmlhead += 'Update profile:' + upd;

    } else {
        htmlhead += 'No Update';
        $("#profileCBodyId").html(htmlhead);
        return;
    }

    htmlModel = htmlhead;
    $("#profileCBodyId").html(htmlhead);

    $("#profileCsubmit").attr("disabled", false);
    return;

}
$("#profileCsubmit").click(function () {
    if (txtemailaddress === "******") {
        txtemailaddress = "";
    }
    
    $("#profileCBodyId").html('<span class="blink">Updating....</span>');
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/custupdate?email=" + txtemailaddress
                + "&firstName=" + txtfirstname + "&lastName=" + txtlastname + "&refname=" + txtref,

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
            return;
        }

        custObj = result.custObj;
        if (custObj != null) {

//             update customer
            var custObjStr = JSON.stringify(custObj, null, '\t');
            var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
            window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));
            window.location.href = "aiiupdate.html";
        }
    }

});

function passCclickFun() {
    var htmlhead = "";
    $("#passCsubmit").attr("disabled", true);

    if (iisurl == iisurl_LOCAL) {
        ;
    } else {
        if ((custChange == false)) { // Demo
            htmlhead += "<br><br>This operation is not supported on demo accounts.";
            $("#passCBodyId").html(htmlhead);
            return;
        }
    }


    newpassword = document.getElementById("newpass").value;
    renewpassword = document.getElementById("retypepass").value;

    if ((newpassword !== renewpassword) || (newpassword.length == 0)) {
        htmlhead += 'No Update: mismatch password ';
        $("#passCBodyId").html(htmlhead);
        return;
    }

    htmlhead += 'Update new password.';

    htmlModel = htmlhead;
    $("#passCBodyId").html(htmlhead);

    $("#passCsubmit").attr("disabled", false);
    return;

}
$("#passCsubmit").click(function () {
    $("#passCBodyId").html('<span class="blink">Updating....</span>');
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/custupdate?pass=" + newpassword,

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
            $("#passCBodyId").html(msgObjStr);
            return;
        }

        custObj = result.custObj;
        if (custObj != null) {

//             update customer
            var custObjStr = JSON.stringify(custObj, null, '\t');
            var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
            window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));
            window.location.href = "aiiupdate.html";
        }
    }

}
);



