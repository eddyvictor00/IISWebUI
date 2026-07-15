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

if (accObjListStr.length > 0) {
    accObjList = JSON.parse(accObjListStr);
}

var msgObjStr = "";


var emailObjListStr = "";
var emailObjList = null;
var sysObjListStr = "";
var sysObjList = null;
var contObjListStr = "";
var contObjList = null;
var splitObjListStr = "";
var splitObjList = null;
var stockObjListStr = "";
var stockObjList = null;
var newcustObjList = [];
var contcustObjList = [];
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
    if (SubMenuId == 53) {
        myInitFeatFunction();
        myInitOfferFunction();
        myInitEmailFunction();
        myInitSystemFunction();
        myInitContactFunction();
        myInitStSplitFunction();
        myInitStockErFunction();
    }


}

function myInitFeatFunction() {

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/uisys/" + custObj.id + "/featlist",
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

            var commObjListStr = "";
            var commObjList = "";
            if (resultCommObjList !== "") {
                if (resultCommObjList.length > 0) {
                    commObjListStr = JSON.stringify(resultCommObjList, null, '\t');
                    commObjList = JSON.parse(commObjListStr);
                }
            }
            if (commObjList.length == 0) {
                $("#featinfoid").html('No feature found....');
                return;
            }

            ////////    

            var col1 = ""
            var col2 = "";
            var col3 = "";
            var col4 = "";

            var primary = "primary";
            var secondary = "secondary";
            var htmlSt = "";
            htmlSt += '<ul class="list-group">';


            for (i = 0; i < commObjList.length; i++) {
                var itemColor = primary;
                if ((i % 2) == 0) {
                    itemColor = secondary;
                }
                var commObj = commObjList[i];
//
                col1 = commObj.cod;
                col2 = commObj.name;
                col3 = commObj.bprice;
                col4 = commObj.promo;
                var trStr = '<strong>' + col1 + ' </strong>&nbsp;&nbsp;(' + col3 + ") " + col2 + "<br>" + col4 + ''
                htmlSt += '<li class="list-group-item list-group-item-' + itemColor + '">' + i + ' ' + trStr + '</li>';

            }
            htmlSt += '</ul>';
            htmlSt += '<br>SessionId:' + custObj.username ;
            $("#featinfoid").html(htmlSt);


        }
    });

}

function myInitOfferFunction() {

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/0/billing/offer",
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

        success: function (resultOfferObjList) {

            offerObjListStr = "";
            offerObjList = "";
            if (resultOfferObjList !== "") {
                if (resultOfferObjList.length > 0) {
                    offerObjListStr = JSON.stringify(resultOfferObjList, null, '\t');
                    offerObjList = JSON.parse(offerObjListStr);
                }
            }
            if (offerObjList.length == 0) {
                $("#offerinfoid").html('No offer found....');
                return;
            }

            ////////

            var col1 = ""
            var col2 = "";
            var col3 = "";
            var col4 = "";

            var htmlCom = '';
            if (offerObjList != "") {
                $("#offerinfoid").html('<div class="col-md-12" ><p><strong>Offer List</strong></p></div>');
                for (i = 0; i < offerObjList.length; i++) {
                    var commObj = offerObjList[i];
//  
                    var id = commObj.id;
                    col1 = commObj.cod;
                    col2 = commObj.name;
                    col3 = commObj.bprice;
                    col4 = commObj.comment;
                    var tranSt = "";
                    tranSt += '<div class="col-md-12" >';
                    tranSt += '<small><strong>' + col1 + '</strong>&nbsp;&nbsp;(price: ' + col3 + ") " + col2 + "<br>Desc: " + col4 + '</small>';

                    tranSt += '<textarea class="form-control" id="comment' + id + '" rows="3 style="height: 100px"></textarea>';
                    tranSt += '<a href="" onclick="return myofferClick(' + id + ');"><br><small>Update Description</small></a><br><br>';

                    tranSt += '</div>';
                    htmlCom += tranSt;
                }
                $("#offerinfoid").html(htmlCom);
            }

        }
    });

}

function myofferClick(offerId) {

    if (offerObjList != "") {
        for (i = 0; i < offerObjList.length; i++) {
            var commObj = offerObjList[i];
            if (commObj.id == offerId) {

                var comment = $.trim($("#comment" + offerId).val());
                if (comment.length == 0) {
                    return;
                }
                $.ajax({
                    url: iisurl + "/cust/" + custObj.username + "/acc/0/billing/updateoffer?name=" + commObj.cod + "&desc=" + comment,
                    crossDomain: true,
                    cache: false,
                    timeout: INT_TIMOUT, //120 sec,
                    beforeSend: function () {
                        $("#loader").show();
                    },
                    error: function () {
                        window.location.href = "aiiend.html";
                    },
                    success: function (result) {
//                        myInitOfferFunction(); does not work need to clear cache
                        window.location.href = "aiiadmmgr.html";
                    }
                });

            }
        }
    }
}


$("#fundSubmit").click(function () {
    var symbol = document.getElementById("symbol").value;
    if (symbol.length == 0) {
        return;
    }

    $.ajax({
//        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/commsplit",
        url: iisurl + "/cust/" + custObj.username + "/acc/0/billing/getfundamental?symbol=" + symbol,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    function handleResult(result) {
        if (result != null) {
            if (result.length == 1) {
                var resultSt = result[0];
                resultSt = resultSt.replaceAll("<h2>", "<h4>");
                resultSt = resultSt.replaceAll("</h2>", "</h4>");
                resultSt = resultSt.replaceAll("<h1>", "<h3>");
                resultSt = resultSt.replaceAll("</h1>", "</h3>");
                $('#error-symbol').fadeIn().html(resultSt);

            }
        }

    }
});


$("#symbolSubmit").click(function () {
    var symbol = document.getElementById("symbol").value;
    if (symbol.length == 0) {
        return;
    }
    var comment = $.trim($("#message").val());
    if (comment.length == 0) {
        return;
    }

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/0/billing/updatefundamental?symbol=" + symbol,
        type: "POST",
        data: {input: comment},
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator

    function handleResult(result) {
        var msgObjStr = "";
        if (result === 1) {
            msgObjStr = 'Message saved successful.';
            msgObjStr = '<p  style="color:blue">' + msgObjStr + '</p>';

        } else {
            msgObjStr = "Save message error. Try again later...";
            msgObjStr = '<p  style="color:red">' + msgObjStr + '</p>';
        }
        $('#error-symbol').fadeIn().html(msgObjStr);
        return;
    }

});


function myInitEmailFunction() {
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/emailcomm",
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

            emailObjListStr = "";
            emailObjList = "";
            if (resultCommObjList !== "") {
                if (resultCommObjList.length > 0) {
                    emailObjListStr = JSON.stringify(resultCommObjList, null, '\t');
                    emailObjList = JSON.parse(emailObjListStr);
                }
            }
            if (emailObjList.length == 0) {
                $("#emailmsgid").html('No message found....');
                return;
            }
            ////////
            var tabId = 3;
            var col1 = ""
            var col2 = "";
            var col3 = "";
            var col4 = "";
            var primary = "primary";
            var secondary = "secondary";
            var htmlSt = "";
            var tranSt = "";

            $("#emailmsgid").html('<div class="col-md-12" ><p><strong>Email Message</strong></p></div>');
            htmlSt += '<ul class="list-group">';
            for (i = 0; i < emailObjList.length; i++) {
                var itemColor = primary;
                if ((i % 2) == 0) {
                    itemColor = secondary;
                }
                var commObj = emailObjList[i];
//
                col1 = commObj.updatedatedisplay;
                col2 = commObj.name + ' ' + commObj.accountid;
                col3 = commObj.id;
                col4 = commObj.data;

                tranSt = "";
                tranSt += '<small><strong>' + col1 + '</strong>&nbsp;&nbsp;(' + col3 + ") " + col2 + " Msg Info: " + col4 + '<br>' + '</small>';
                htmlSt += '<li class="list-group-item list-group-item-' + itemColor + '">' + i + ' ' + tranSt + '</li>';

            }

            tranSt = "";
            tranSt += '<input type="text" class="form-control" name="removemsg' + tabId + '" id="removemsg' + tabId + '" value="" placeholder="MsgId" >'
            tranSt += '<br><a  onclick="return myClearMsgFunction(' + tabId + ');">Clear All (' + emailObjList.length + ')</a>';
            htmlSt += '<li class="list-group-item list-group-item-info">' + tranSt + '</li>';

            htmlSt += '</ul>';

            var detail = "";

            detail += '<br><button type="button" onclick="return curFeatclickFun(' + tabId + ');"  class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#basicModal' + tabId + '">';
            detail += 'Remove Msg';
            detail += '</button>';
            detail += '<div class="modal fade" id="basicModal' + tabId + '" tabindex="-1">';
            detail += '<div class="modal-dialog">';
            detail += '<div class="modal-content">';
            detail += '<div class="modal-header">';
            detail += '<h5 class="modal-title">Remove Msg</h5>';
            detail += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
            detail += '</div>';
            detail += '<div class="modal-body">';
            detail += '<span id="' + tabId + 'curBodyId"></span>';
            detail += '</div>';
            detail += '<div class="modal-footer">';
            detail += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
            detail += '<button type="button" onclick="return curFeatsubmitFun(' + tabId + ');"  class="btn btn-primary">Save changes</button>';
            detail += '</div>';
            detail += '</div>';
            detail += '</div>';
            detail += '</div>';

            htmlSt += detail;
            $("#emailmsgid").html(htmlSt);

        }
    });
}


function myInitSystemFunction() {

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/comm",
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

            sysObjListStr = "";
            sysObjList = "";
            if (resultCommObjList !== "") {
                if (resultCommObjList.length > 0) {
                    sysObjListStr = JSON.stringify(resultCommObjList, null, '\t');
                    sysObjList = JSON.parse(sysObjListStr);
                }
            }
            if (sysObjList.length == 0) {
                $("#systemmsgid").html('No message found....');
                return;
            }
            ////////
            var tabId = 4;
            var col1 = ""
            var col2 = "";
            var col3 = "";
            var col4 = "";
            var primary = "primary";
            var secondary = "secondary";
            var htmlSt = "";
            var tranSt = "";

            $("#systemmsgid").html('<div class="col-md-12" ><p><strong>System Message</strong></p></div>');
            htmlSt += '<ul class="list-group">';
            for (i = 0; i < sysObjList.length; i++) {
                var commObj = sysObjList[i];
                if (commObj.name === "MSG_SPLIT") {
                    //ignore this message, Stock Split tab has this message
                    continue;
                }
                var itemColor = primary;
                if ((i % 2) == 0) {
                    itemColor = secondary;
                }

//
                col1 = commObj.updatedatedisplay;
                col2 = commObj.name + ' ' + commObj.accountid;
                col3 = commObj.id;
                col4 = commObj.data;

                tranSt = "";
                tranSt += '<small><strong>' + col1 + '</strong>&nbsp;&nbsp;(' + col3 + ") " + col2 + " Msg Info: " + col4 + '<br>' + '</small>';
                htmlSt += '<li class="list-group-item list-group-item-' + itemColor + '">' + i + ' ' + tranSt + '</li>';

            }

            tranSt = "";
            tranSt += '<input type="text" class="form-control" name="removemsg' + tabId + '" id="removemsg' + tabId + '" value="" placeholder="MsgId" >'
            tranSt += '<br><a onclick="return myClearMsgFunction(' + tabId + ');">Clear All (' + sysObjList.length + ')</a>';
            htmlSt += '<li class="list-group-item list-group-item-info">' + tranSt + '</li>';

            htmlSt += '</ul>';

            var detail = "";

            detail += '<br><button type="button" onclick="return curFeatclickFun(' + tabId + ');"  class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#basicModal' + tabId + '">';
            detail += 'Remove Msg';
            detail += '</button>';
            detail += '<div class="modal fade" id="basicModal' + tabId + '" tabindex="-1">';
            detail += '<div class="modal-dialog">';
            detail += '<div class="modal-content">';
            detail += '<div class="modal-header">';
            detail += '<h5 class="modal-title">Remove Msg</h5>';
            detail += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
            detail += '</div>';
            detail += '<div class="modal-body">';
            detail += '<span id="' + tabId + 'curBodyId"></span>';
            detail += '</div>';
            detail += '<div class="modal-footer">';
            detail += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
            detail += '<button type="button" onclick="return curFeatsubmitFun(' + tabId + ');"  class="btn btn-primary">Save changes</button>';
            detail += '</div>';
            detail += '</div>';
            detail += '</div>';
            detail += '</div>';

            htmlSt += detail;
            $("#systemmsgid").html(htmlSt);
        }
    });

}

function myInitContactFunction() {

    $.ajax({
        url: iisurl + "/cust/" + 0 + "/acc/" + 0 + "/fundlink/" + 0 + "/comm",
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function () {
            window.location.href = "aiiend.html";
        },
        success: function (resultCommObjList) {
            contObjListStr = "";
            contObjList = "";
            if (resultCommObjList !== "") {
                if (resultCommObjList.length > 0) {
                    contObjListStr = JSON.stringify(resultCommObjList, null, '\t');
                    contObjList = JSON.parse(contObjListStr);
                }
            }

            ////////

            newcustObjList = [];
            contcustObjList = [];

            for (i = 0; i < contObjList.length; i++) {
                var commObj = contObjList[i];
                if (commObj.refname === "CUS_") {
                    newcustObjList.push(commObj);
                } else {
                    contcustObjList.push(commObj);
                }
            }

            myInitContactFun();
            myInitNewCustFun();

        }
    });
}

function myInitContactFun() {
    if (contcustObjList.length == 0) {
        $("#contactmsgid").html('No message found....');
        return;
    }
    var tabId = 5;
    var col1 = ""
    var col2 = "";
    var col3 = "";
    var col4 = "";
    var primary = "primary";
    var secondary = "secondary";
    var htmlSt = "";
    var tranSt = "";


    $("#contactmsgid").html('<div class="col-md-12" ><p><strong>Contact Message</strong></p></div>');
    htmlSt += '<ul class="list-group">';



    for (i = 0; i < contcustObjList.length; i++) {
        var itemColor = primary;
        if ((i % 2) == 0) {
            itemColor = secondary;
        }
        var commObj = contcustObjList[i];
//

        col1 = commObj.updatedatel*1000;
        var d = new Date(col1);

        var date = [
            d.getFullYear(),
            ('0' + (d.getMonth() + 1)).slice(-2),
            ('0' + d.getDate()).slice(-2)
        ].join('-');

        col1 = date;
        col2 = "";
        col3 = commObj.id;
        col4 = commObj.msg;

        tranSt = "";
        tranSt += '<small><strong>' + col1 + '</strong>&nbsp;&nbsp;(' + col3 + ") " + col2 + " Msg Info: " + col4 + '<br>' + '</small>';
        htmlSt += '<li class="list-group-item list-group-item-' + itemColor + '">' + i + ' ' + tranSt + '</li>';

    }

    tranSt = "";
    tranSt += '<input type="text" class="form-control" name="removemsg' + tabId + '" id="removemsg' + tabId + '" value="" placeholder="MsgId" >'
    tranSt += '<br><a  onclick="return myClearMsgFunction(' + tabId + ');">Clear All (' + contcustObjList.length + ')</a>';
    htmlSt += '<li class="list-group-item list-group-item-info">' + tranSt + '</li>';

    htmlSt += '</ul>';

    var detail = "";

    detail += '<br><button type="button" onclick="return curFeatclickFun(' + tabId + ');"  class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#basicModal' + tabId + '">';
    detail += 'Remove Msg';
    detail += '</button>';
    detail += '<div class="modal fade" id="basicModal' + tabId + '" tabindex="-1">';
    detail += '<div class="modal-dialog">';
    detail += '<div class="modal-content">';
    detail += '<div class="modal-header">';
    detail += '<h5 class="modal-title">Remove Msg</h5>';
    detail += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
    detail += '</div>';
    detail += '<div class="modal-body">';
    detail += '<span id="' + tabId + 'curBodyId"></span>';
    detail += '</div>';
    detail += '<div class="modal-footer">';
    detail += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
    detail += '<button type="button" onclick="return curFeatsubmitFun(' + tabId + ');"  class="btn btn-primary">Save changes</button>';
    detail += '</div>';
    detail += '</div>';
    detail += '</div>';
    detail += '</div>';

    htmlSt += detail;
    $("#contactmsgid").html(htmlSt);

}


function myInitNewCustFun() {
    if (newcustObjList.length == 0) {
        $("#newcustmsgid").html('No message found....');
        return;
    }
    ////////
    var tabId = 7;
    var col1 = ""
    var col2 = "";
    var col3 = "";
    var col4 = "";
    var primary = "primary";
    var secondary = "secondary";
    var htmlSt = "";
    var tranSt = "";


    $("#newcustmsgid").html('<div class="col-md-12" ><p><strong>Contact Message</strong></p></div>');
    htmlSt += '<ul class="list-group">';

    for (i = 0; i < newcustObjList.length; i++) {
        var itemColor = primary;
        if ((i % 2) == 0) {
            itemColor = secondary;
        }
        var commObj = newcustObjList[i];
//

        col1 = commObj.updatedatel*1000;
        var d = new Date(col1);

        var date = [
            d.getFullYear(),
            ('0' + (d.getMonth() + 1)).slice(-2),
            ('0' + d.getDate()).slice(-2)
        ].join('-');

        col1 = date;
        col2 = "";
        col3 = commObj.id;
        col4 = commObj.msg;

        tranSt = "";
        tranSt += '<small><strong>' + col1 + '</strong>&nbsp;&nbsp;(' + col3 + ") " + col2 + " Msg Info: " + col4 + '<br>' + '</small>';
        htmlSt += '<li class="list-group-item list-group-item-' + itemColor + '">' + i + ' ' + tranSt + '</li>';

    }

    tranSt = "";
    tranSt += '<input type="text" class="form-control" name="removemsg' + tabId + '" id="removemsg' + tabId + '" value="" placeholder="MsgId" >'
    htmlSt += '<li class="list-group-item list-group-item-info">' + tranSt + '</li>';

    htmlSt += '</ul>';

    var detail = "";

    detail += '<br><button type="button" onclick="return curFeatclickFun(' + tabId + ');"  class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#basicModal' + tabId + '">';
    detail += 'Remove Msg';
    detail += '</button>';
    detail += '<div class="modal fade" id="basicModal' + tabId + '" tabindex="-1">';
    detail += '<div class="modal-dialog">';
    detail += '<div class="modal-content">';
    detail += '<div class="modal-header">';
    detail += '<h5 class="modal-title">Remove Msg</h5>';
    detail += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
    detail += '</div>';
    detail += '<div class="modal-body">';
    detail += '<span id="' + tabId + 'curBodyId"></span>';
    detail += '</div>';
    detail += '<div class="modal-footer">';
    detail += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
    detail += '<button type="button" onclick="return curFeatsubmitFun(' + tabId + ');"  class="btn btn-primary">Save changes</button>';
    detail += '</div>';
    detail += '</div>';
    detail += '</div>';
    detail += '</div>';

    htmlSt += detail;
    $("#newcustmsgid").html(htmlSt);

/////////////

}

function myInitStockErFunction() {

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/stockerror",
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
            stockObjListStr = "";
            stockObjList = "";
            if (resultCommObjList !== "") {
                if (resultCommObjList.length > 0) {
                    stockObjListStr = JSON.stringify(resultCommObjList, null, '\t');
                    stockObjList = JSON.parse(stockObjListStr);
                }
            }
            if (stockObjList.length == 0) {
                $("#stockmsgid").html('No message found....');
                return;
            }
            ////////
            var tabId = 9;
            var col1 = ""
            var col2 = "";
            var col3 = "";
            var col4 = "";
            var primary = "primary";
            var secondary = "secondary";
            var htmlSt = "";
            var tranSt = "";

            $("#stockmsgid").html('<div class="col-md-12" ><p><strong>Contact Message</strong></p></div>');
            htmlSt += '<ul class="list-group">';
            for (i = 0; i < stockObjList.length; i++) {
                var itemColor = primary;
                if ((i % 2) == 0) {
                    itemColor = secondary;
                }
                var commObj = stockObjList[i];
//
                if (commObj.substatus === 10) {
                    // continue;
                }
                col1 = commObj.updatedatel*1000;
                var d = new Date(col1);

                var date = [
                    d.getFullYear(),
                    ('0' + (d.getMonth() + 1)).slice(-2),
                    ('0' + d.getDate()).slice(-2)
                ].join('-');

                var substatus = "" + commObj.substatus;

                if (commObj.substatus === 2) {
                    substatus = "INITIAL-" + commObj.substatus;
                } else if (commObj.substatus === 10) {
                    substatus = "SPLIT-" + commObj.substatus;
                } else if (commObj.substatus === 11) {
                    substatus = "STOCK_ERROR-" + commObj.substatus;
                }

                col1 = date;
                col2 = "";
                col3 = commObj.id;
                col4 = commObj.symbol + " status=" + commObj.status + " substatus="
                        + substatus + " failedupdate=" + commObj.failedupdate;
                col4 += "<br>" + commObj.data;
                tranSt = "";
                tranSt += '<small><strong>' + col1 + '</strong>&nbsp;&nbsp;(' + col3 + ") " + col2 + " Msg Info: " + col4 + '<br>' + '</small>';
                htmlSt += '<li class="list-group-item list-group-item-' + itemColor + '">' + i + ' ' + tranSt + '</li>';

            }

            tranSt = "";
            tranSt += '<input type="text" class="form-control" name="removemsg' + tabId + '" id="removemsg' + tabId + '" value="" placeholder="symbol" >'
            htmlSt += '<li class="list-group-item list-group-item-info">' + tranSt + '</li>';

            htmlSt += '</ul>';

            var detail = "";

            detail += ' <button type="button" onclick="return clrerrorclickFun(' + tabId + ');"  class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#basicModalclrerror' + tabId + '">';
            detail += 'Clear Stock Error';
            detail += '</button>';
            detail += '<div class="modal fade" id="basicModalclrerror' + tabId + '" tabindex="-1">';
            detail += '<div class="modal-dialog">';
            detail += '<div class="modal-content">';
            detail += '<div class="modal-header">';
            detail += '<h5 class="modal-title">Clear Stock Error</h5>';
            detail += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
            detail += '</div>';
            detail += '<div class="modal-body">';
            detail += '<span id="' + tabId + 'clrerrorBodyId"></span>';

            detail += '</div>';
            detail += '<div class="modal-footer">';
            detail += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
            detail += '<button type="button" onclick="return clrerrorsubmitFun(' + tabId + ');"  class="btn btn-primary">Clear Stock Error</button>';
            detail += '</div>';
            detail += '</div>';
            detail += '</div>';
            detail += '</div>';


            htmlSt += detail;

            $("#stockmsgid").html(htmlSt);
        }
    });

}


function myInitStSplitFunction() {

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/commsplit",
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
            splitObjListStr = "";
            splitObjList = "";
            if (resultCommObjList !== "") {
                if (resultCommObjList.length > 0) {
                    splitObjListStr = JSON.stringify(resultCommObjList, null, '\t');
                    splitObjList = JSON.parse(splitObjListStr);
                }
            }
            if (splitObjList.length == 0) {
                $("#splitmsgid").html('No message found....');
                return;
            }
            ////////
            var tabId = 6;
            var col1 = ""
            var col2 = "";
            var col3 = "";
            var col4 = "";
            var primary = "primary";
            var secondary = "secondary";
            var htmlSt = "";
            var tranSt = "";

            $("#splitmsgid").html('<div class="col-md-12" ><p><strong>Contact Message</strong></p></div>');
            htmlSt += '<ul class="list-group">';
            for (i = 0; i < splitObjList.length; i++) {
                var itemColor = primary;
                if ((i % 2) == 0) {
                    itemColor = secondary;
                }
                var commObj = splitObjList[i];
//

                col1 = commObj.updatedatel*1000;
                var d = new Date(col1);

                var date = [
                    d.getFullYear(),
                    ('0' + (d.getMonth() + 1)).slice(-2),
                    ('0' + d.getDate()).slice(-2)
                ].join('-');

                col1 = date;
                col2 = "";
                col3 = commObj.id;
                col4 = commObj.data;

                tranSt = "";
                tranSt += '<small><strong>' + col1 + '</strong>&nbsp;&nbsp;(' + col3 + ") " + col2 + " Msg Info: " + col4 + '<br>' + '</small>';
                htmlSt += '<li class="list-group-item list-group-item-' + itemColor + '">' + i + ' ' + tranSt + '</li>';

            }

            tranSt = "";
            tranSt += '<input type="text" class="form-control" name="removemsg' + tabId + '" id="removemsg' + tabId + '" value="" placeholder="MsgId" >'
            htmlSt += '<li class="list-group-item list-group-item-info">' + tranSt + '</li>';

            htmlSt += '</ul>';

            var detail = "";

            detail += '<br><button type="button" onclick="return curFeatclickFun(' + tabId + ');"  class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#basicModal' + tabId + '">';
            detail += 'Process Stock Split';
            detail += '</button>';
            detail += '<div class="modal fade" id="basicModal' + tabId + '" tabindex="-1">';
            detail += '<div class="modal-dialog">';
            detail += '<div class="modal-content">';
            detail += '<div class="modal-header">';
            detail += '<h5 class="modal-title">Process Stock Split</h5>';
            detail += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
            detail += '</div>';
            detail += '<div class="modal-body">';
            detail += '<span id="' + tabId + 'curBodyId"></span>';
            detail += '</div>';
            detail += '<div class="modal-footer">';
            detail += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
            detail += '<button type="button" onclick="return stocksplitsubmitFun(' + tabId + ');"  class="btn btn-primary">Process Stock Split</button>';
            detail += '</div>';
            detail += '</div>';
            detail += '</div>';
            detail += '</div>';

            htmlSt += detail;
            detail = "";

            detail += ' <button type="button" onclick="return clrsplitclickFun(' + tabId + ');"  class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#basicModalclrsplit' + tabId + '">';
            detail += 'Clear Stock Split';
            detail += '</button>';
            detail += '<div class="modal fade" id="basicModalclrsplit' + tabId + '" tabindex="-1">';
            detail += '<div class="modal-dialog">';
            detail += '<div class="modal-content">';
            detail += '<div class="modal-header">';
            detail += '<h5 class="modal-title">Clear Stock Split</h5>';
            detail += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
            detail += '</div>';
            detail += '<div class="modal-body">';
            detail += '<span id="' + tabId + 'clrsplitBodyId"></span>';

            detail += '</div>';
            detail += '<div class="modal-footer">';
            detail += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
            detail += '<button type="button" onclick="return clrsplitsubmitFun(' + tabId + ');"  class="btn btn-primary">Clear Stock Split</button>';
            detail += '</div>';
            detail += '</div>';
            detail += '</div>';
            detail += '</div>';

            htmlSt += detail;
            $("#splitmsgid").html(htmlSt);
        }
    });

}


function myClearMsgFunction(tabId) {

    var idListSt = "";
    var ObjList = null;
    if (tabId == 3) {
        ObjList = emailObjList;

    } else if (tabId == 4) {
        ObjList = [];
//        ObjList = sysObjList;
        for (i = 0; i < sysObjList.length; i++) {
            var commObj = sysObjList[i];
            if (commObj.name === "MSG_SPLIT") {
                //ignore this message, Stock Split tab has this message
                continue;
            }
            ObjList.push(commObj);
        }

    } else if (tabId == 5) {
        ObjList = contcustObjList;
    } else if (tabId == 6) {
    }
    if (ObjList == null) {
        return;
    }
    if (ObjList.length == 0) {
        return;
    }
    for (i = 0; i < ObjList.length; i++) {
        var commObj = ObjList[i];
        if (i > 0) {
            idListSt += ",";
        }
        idListSt += commObj.id;
    }
    document.getElementById("removemsg" + tabId).setAttribute('value', idListSt);
}

function curFeatclickFun(tabId) {
    var htmlhead = "";
    if (tabId == 6) {

        var msgId = document.getElementById("removemsg" + tabId).value;
        if (msgId.length == 0) {
            htmlhead += "Please endter the Message Id.";
            $("#" + tabId + "curBodyId").html(htmlhead);
            return;
        }
        htmlhead += "Process Stock Split: <br>" + msgId;
        htmlhead += "<br>Note: this operation will take some time.....";
        $("#" + tabId + "curBodyId").html(htmlhead);
        return;
    }
    var msgId = document.getElementById("removemsg" + tabId).value;
    if (msgId.length == 0) {
        htmlhead += "Please endter the Message Id.";
        $("#" + tabId + "curBodyId").html(htmlhead);
        return;
    }

    if (tabId == 3) {
    } else if (tabId == 4) {
    } else if (tabId == 5) {
    } else if (tabId == 6) {
    } else if (tabId == 7) {
//    } else if (tabId == 8) {
        htmlhead += "***Make sure you have saved the customer info before remove the message.<br>";
    }

    msgId = msgId.replaceAll(" ", "");
    msgId = msgId.replaceAll("(", "");
    msgId = msgId.replaceAll(")", "");
    htmlhead += "Remove Msg: <br>" + msgId;
    $("#" + tabId + "curBodyId").html(htmlhead);
}

function curFeatsubmitFun(tabId) {
    if (custObj.type == 84) {
        alert(" remove not allowed: ");
        return;
    }
    if (custObj.type == 86) {
        alert(" remove not allowed: ");
        return;
    }
    var delList = document.getElementById("removemsg" + tabId).value;

    delList = delList.replaceAll(" ", "");
    delList = delList.replaceAll("(", "");
    delList = delList.replaceAll(")", "");
    if (delList.length == 0) {
        return;
    }
    $("#" + tabId + "curBodyId").html('<span class="blink">Updating....</span>');
    if ((tabId == 3) || (tabId == 4)) {

        $.ajax({
            url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/comm/remove?idlist=" + delList,
            crossDomain: true,
            cache: false,
            success: handleResult
        }); // use promises

    } else if (tabId == 5) {
        $.ajax({
            url: iisurl + "/cust/" + custObj.username + "/acc/" + 0 + "/fundlink/" + 0 + "/comm/remove?idlist=" + delList,
            crossDomain: true,
            cache: false,
            success: handleResult
        }); // use promises
    } else if (tabId == 6) {
        return;

    } else if (tabId == 7) {
        $.ajax({
            url: iisurl + "/cust/" + custObj.username + "/acc/" + 0 + "/fundlink/" + 0 + "/comm/removeCU?idlist=" + delList,
            crossDomain: true,
            cache: false,
            success: handleResult
        }); // use promises

    } else if (tabId == 8) {
        $.ajax({
            url: iisurl + "/cust/" + custObj.username + "/sys/clearrcmd?id=" + delList,
            crossDomain: true,
            cache: false,
            success: handleResult
        }); // use promises        
    }


    function handleResult(result) {
        window.location.href = "aiiadmmgr.html";
    }
}

function stocksplitsubmitFun(tabId) {
    if (custObj.type == 84) {
        alert(" remove not allowed: ");
        return;
    }
    if (custObj.type == 86) {
        alert(" remove not allowed: ");
        return;
    }
    var comId = document.getElementById("removemsg" + tabId).value;
    if (comId.length == 0) {
        return;
    }

    if (tabId != 6) {
        return;
    }
    $("#" + tabId + "curBodyId").html('<span class="blink">Updating....</span>');
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/comm/stocksplit/" + comId,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    function handleResult(result) {
        window.location.href = "aiiadmmgr.html";
    }
}


function clrsplitclickFun(tabId) {
    var htmlhead = "";

    if (tabId == 3) {
    } else if (tabId == 4) {
    } else if (tabId == 5) {
    } else if (tabId == 6) {

        var msgId = document.getElementById("removemsg" + tabId).value;
        if (msgId.length == 0) {
            htmlhead += "Please endter the Message Id.";
            $("#" + tabId + "clrsplitBodyId").html(htmlhead);
            return;
        }
        htmlhead += "Process clear Stock Split: <br>" + msgId;
        htmlhead += "<br>Note: this operation will take some time.....";
        $("#" + tabId + "clrsplitBodyId").html(htmlhead);
        return;
    }
}

function clrsplitsubmitFun(tabId) {
    if (custObj.type == 84) {
        alert(" remove not allowed: ");
        return;
    }
    if (custObj.type == 86) {
        alert(" remove not allowed: ");
        return;
    }
    var comId = document.getElementById("removemsg" + tabId).value;
    if (comId.length == 0) {
        return;
    }

    if (tabId != 6) {
        return;
    }
    $("#" + tabId + "clrsplitBodyId").html('<span class="blink">Updating....</span>');
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/comm/stocksplit/" + comId + "?clear=1",
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    function handleResult(result) {
        window.location.href = "aiiadmmgr.html";
    }
}

function clrerrorclickFun(tabId) {
    var htmlhead = "";

    if (tabId == 3) {
    } else if (tabId == 4) {
    } else if (tabId == 5) {
    } else if (tabId == 9) {
        var symbol = ""
        var symbol = document.getElementById("removemsg" + tabId).value;

        if (symbol.length == 0) {
            htmlhead += "Please endter the symbol.";
            $("#" + tabId + "clrsplitBodyId").html(htmlhead);
            return;
        }
        symbol = symbol.toUpperCase();
        htmlhead += "Process clear Stock error: <br>" + symbol;
        $("#" + tabId + "clrerrorBodyId").html(htmlhead);
        return;
    }
}

function clrerrorsubmitFun(tabId) {
    if (custObj.type == 84) {
        alert(" remove not allowed: ");
        return;
    }
    if (custObj.type == 86) {
        alert(" remove not allowed: ");
        return;
    }
    var symbol = ""
    var symbol = document.getElementById("removemsg" + tabId).value;
    if (symbol.length == 0) {
        return;
    }

    if (tabId != 9) {
        return;
    }
    symbol = symbol.toUpperCase();
    $("#" + tabId + "clrerrorBodyId").html('<span class="blink">Updating....</span>');
    $.ajax({
        url: iisurl + "/st/" + symbol + "/stockerrorclear",
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    function handleResult(result) {
        window.location.href = "aiiadmmgr.html";
    }
}

$("#RefCmdbtn").click(function () {
    $("#RCmdid").html('<span class="blink">Processing</span>');
    displayRcmd();
});

function displayRcmd() {
    $.ajax({
//        url: iisurl + "/cust/" + custObj.username + "/sys/rcmd",
        url: iisurl + "/cust/" + custObj.username + "/sys/rcmd?event=proc",
        crossDomain: true,
        cache: false,
        error: function () {
            alert('Network failure. Please try again later.');
            window.location.href = "aiiend.html";
        },
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(resultRcmdList) {
        var RcmdListStr = "";
        var RcmdObjList = "";
        if (resultRcmdList !== "") {
            if (resultRcmdList.length > 0) {
                RcmdListStr = JSON.stringify(resultRcmdList, null, '\t');
                RcmdObjList = JSON.parse(RcmdListStr);
            }
        }
        if (RcmdObjList.length == 0) {
            $("#RCmdid").html('No message found....');
            return;
        }
        var tabId = 8;
        var col1 = ""
        var col2 = "";
        var col3 = "";
        var col4 = "";
        var primary = "primary";
        var secondary = "secondary";
        var warning = "warning";
        var info = "info";
        var success = "success";
        var light = "light";

        var htmlSt = "";
        var tranSt = "";


        $("#RCmdid").html('<div class="col-md-12" ><p><strong>Rcmd Message</strong></p></div>');
        htmlSt += '<ul class="list-group">';
        var colourC = 0;
        for (i = 0; i < RcmdObjList.length; i++) {
            var itemColor = secondary;

            var commObj = RcmdObjList[i];
//
            if (commObj.refname === "CA_STATIC_") {
                continue;

            } else if (commObj.refname === "CNT_") {
                itemColor = warning;
                continue;   // ignore this
            } else if (commObj.refname === "COM_") {
                itemColor = success;
                if ((colourC % 2) == 0) {
                    itemColor = light;
                }
                colourC++;
            } else if (commObj.refname === "RTE") {
                itemColor = warning;
            } else if (commObj.refname === "SRV_CACHE") {
                itemColor = info;
                continue;   // ignore this
            } else {
                if (commObj.status == 0) {
                    itemColor = primary;
                } else {
                    itemColor = secondary;
                }

            }

            col1 = commObj.updatedatel*1000;
            var d = new Date(col1);

            var date = [
                d.getFullYear(),
                ('0' + (d.getMonth() + 1)).slice(-2),
                ('0' + d.getDate()).slice(-2)
            ].join('-');

            col1 = date;
            col2 = "";
            col3 = commObj.id;
            col4 = commObj.refname + " " + commObj.name; // commObj.msg;
            if ((commObj.refname === "COM_") || (commObj.refname === "CNT_") || (commObj.refname === "RTE")) {
                col4 = col4 + " " + commObj.msg;
            }
            tranSt = "";
            tranSt += '<small><strong>' + col1 + '</strong>&nbsp;&nbsp;(' + col3 + ") " + col2 + " Msg Info: " + col4 + '<br>' + '</small>';
            htmlSt += '<li class="list-group-item list-group-item-' + itemColor + '">' + i + ' ' + tranSt + '</li>';
        }

        tranSt = "";
        tranSt += '<input type="text" class="form-control" name="removemsg' + tabId + '" id="removemsg' + tabId + '" value="" placeholder="MsgId (clearall)" >'
        htmlSt += '<li class="list-group-item list-group-item-info">' + tranSt + '</li>';

        htmlSt += '</ul>';

        var detail = "";

        detail += '<br><button type="button" onclick="return curFeatclickFun(' + tabId + ');"  class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#basicModal' + tabId + '">';
        detail += 'Remove Msg';
        detail += '</button>';
        detail += '<div class="modal fade" id="basicModal' + tabId + '" tabindex="-1">';
        detail += '<div class="modal-dialog">';
        detail += '<div class="modal-content">';
        detail += '<div class="modal-header">';
        detail += '<h5 class="modal-title">Remove Msg</h5>';
        detail += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
        detail += '</div>';
        detail += '<div class="modal-body">';
        detail += '<span id="' + tabId + 'curBodyId"></span>';
        detail += '</div>';
        detail += '<div class="modal-footer">';
        detail += '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>';
        detail += '<button type="button" onclick="return curFeatsubmitFun(' + tabId + ');"  class="btn btn-primary">Save changes</button>';
        detail += '</div>';
        detail += '</div>';
        detail += '</div>';
        detail += '</div>';

        htmlSt += detail;
        $("#RCmdid").html(htmlSt);

/////////////

    }
}
$("#RCmdbtn").click(function () {
    $("#RCmdid").html('<span class="blink">Processing</span>');
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/0/comm/srvrcmd?cmd=rcmd",
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

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(resultRcmdList) {
        $("#RCmdid").html('');
        var RcmdListStr = "";

        displayRcmd();
/////////////
    }
});

$("#RLockbtn").click(function () {
    $("#RCmdid").html('<span class="blink">Processing</span>');
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/0/comm/srvrcmd?cmd=lock",
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(resultRcmdList) {
        $("#RCmdid").html('');
        var RcmdListStr = "";

        displayRcmd();
/////////////
    }
});



$("#StartTEsubmit").click(function () {
    var hr = document.getElementById("StartTEhr").value;
    if (hr === "") {
        hr = "1";
    }
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/0/comm/timerevent?cmd=start&parm=" + hr,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(resultRcmdList) {

        displayRcmd();
        var myModalEl = document.getElementById('StartTE');
        var modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();
/////////////
    }

});

$("#StopTEsubmit").click(function () {

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/acc/0/comm/timerevent?cmd=stop",
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator
    function handleResult(resultRcmdList) {

        displayRcmd();
        var myModalEl = document.getElementById('basicModalStopTE');
        var modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();
/////////////
    }

});

$("#CleanNNsubmit").click(function () {

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/sys/debugtest?cmd=ProcessTestInternet",
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    function handleResult(resultRcmdList) {
        if (resultRcmdList.length > 0) {
            var RcmdListStr = JSON.stringify(resultRcmdList, null, '\t');
            if (RcmdListStr.indexOf(" queued") == -1) {
                var htmlhead = RcmdListStr; //"This operation does not allowed when TimerEvent is running.";
                $("#CleanNNBodyId").html(htmlhead);
                return;
            }
        }
        displayRcmd();
        var myModalEl = document.getElementById('basicModalCleanNN');
        var modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();
/////////////
    }

});

$("#MaintMonthlysubmit").click(function () {

    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/sys/debugtest?cmd=processAllMaint",
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    function handleResult(resultRcmdList) {
        if (resultRcmdList.length > 0) {
            var RcmdListStr = JSON.stringify(resultRcmdList, null, '\t');
            if (RcmdListStr.indexOf(" queued") == -1) {
                var htmlhead = "This operation does not allowed when TimerEvent is running.";
                $("#MaintMonthlyBodyId").html(htmlhead);

                return;
            }
        }


        displayRcmd();
        var myModalEl = document.getElementById('basicModalMaintMonthly');
        var modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();
/////////////
    }

});
////////////////////////////////////////

$("#QuickCmdsubmit").click(function () {
    var cmdProcess = "";
    var qcmd = document.getElementById("qcmd").value;
    cmdProcess = qcmd;
    var incmd = document.getElementById("incmd").value;

    if (incmd !== "") {
        cmdProcess = incmd;
    }
    if (cmdProcess === "") {
        var htmlhead = "<font style= color:red><br>....Error: No Input Cmd....</font>";
        $("#QuickCmdMsgId").html(htmlhead);
        return;
    }
    $("#QuickCmdMsgId").html('<span class="blink">Updating....</span>');
    $.ajax({
        url: iisurl + "/cust/" + custObj.username + "/sys/debugtest?cmd=" + cmdProcess,
        crossDomain: true,
        cache: false,
        success: handleResult
    }); // use promises

    function handleResult(resultRcmdList) {
        $("#QuickCmdMsgId").html('');
        if (resultRcmdList !== "") {
            if (resultRcmdList.length > 0) {
                var RcmdListStr = JSON.stringify(resultRcmdList, null, '\t');
                if (RcmdListStr.indexOf(" queued") == -1) {
                    var htmlhead = "<font style= color:red><br>....Error: Cmd not queued....</font>";
                    $("#QuickCmdMsgId").html(htmlhead);

                    return;
                }
            }
        }

        displayRcmd();
        var myModalEl = document.getElementById('QuickCmd');
        var modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();
/////////////
    }

});


////////////////////////End/////////////////






