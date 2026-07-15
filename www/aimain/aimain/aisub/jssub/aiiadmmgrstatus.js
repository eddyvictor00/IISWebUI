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

var SRVURL = iisurl;
if (iisurl_RENDER_SRV.length > 0) {
    SRVURL = iisurl_RENDER_SRV;
}

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

// update menu start

mySubMenuReset();

updateShortCommFunction();

if (sysDevOp == true) {
    initAdmStatus();
}

var lockObjListStr = "";
var serverListStr = "";
var serverStatusListStr = "";

function initAdmStatus() {
    $.ajax({
        url: SRVURL + "/remoteserverstatus",
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


    function handleResult(statusObjList) {

        serverStatusListStr = JSON.stringify(statusObjList, null, '\t');

        $.ajax({
            url: SRVURL + "/cust/" + custObj.username + "/uisys/" + custObj.id + "/lock",

            crossDomain: true,
            cache: false,
            beforeSend: function () {
                $("#loader").show();
            },
            error: function () {
                window.location.href = "aiiend.html";
            },
            success: function (lockObjList) {

                lockObjListStr = JSON.stringify(lockObjList, null, '\t');

                $.ajax({
                    url: SRVURL + "/remoteserver",

                    crossDomain: true,
                    cache: false,
                    success: function (serverList) {
                        serverListStr = JSON.stringify(serverList, null, '\t');
                                var primary = "primary";
                                var secondary = "secondary";
                                var htmlSt = "";
                                htmlSt += '<ul class="list-group">';
                                var trStr = "";

                                if (lockObjList.length > 0) {
                                    for (i = 0; i < lockObjList.length; i++) {
                                        var lockObj = lockObjList[i];
                                        if (lockObj.comment.indexOf("ProcessTimerCnt") != -1) {
                                            continue;
                                        }
                                        if (lockObj.lockname.indexOf("CLTSRV_IISWEB") != -1) {
                                            continue;
                                        }

                                        var itemColor = primary;
                                        if ((i % 2) == 0) {
                                            itemColor = secondary;
                                        }

                                        var trStr = lockObj.updated_at + '  ' + lockObj.lockname
                                        trStr += ' T:' + lockObj.type + ' ' + lockObj.comment;
                                        var len = lockObjList.length - i
                                        htmlSt += '<li class="list-group-item list-group-item-' + itemColor + '">' + len + ' ' + trStr + '</li>';

                                    }
                                } else {
                                    htmlSt += '<li class="list-group-item bg-transparent">No system lock msg....</li>';
                                }

                                for (i = 0; i < serverList.length; i++) {
                                    var srvObj = serverList[i];

                                    trStr = "";

                                    trStr += srvObj.lastServUpdateESTdate + '   ' + srvObj.serverName;
                                    trStr += '<br>Maintance:' + srvObj.sysMaintenance;
                                    trStr += '<br>processTimerCnt:' + srvObj.processTimerCnt;
                                    trStr += '<br>Total Stock:' + srvObj.totalStock + '   Total Acc:' + srvObj.totalAcc;
                                    trStr += '<br>Total Login:' + srvObj.totalLogin + '   Total Reg:' + srvObj.totalReg;
                                    trStr += '<br>Total DemoLogin:' + srvObj.totalDemoLogin + '   Total FailLogin:' + srvObj.totalFailLogin;
                                    htmlSt += '<li class="list-group-item list-group-item-success">' + trStr + '</li>';

                                    trStr = "";
                                    trStr += srvObj.timerMsg;
                                    trStr += '<br>RESTreq:' + srvObj.cntRESTrequest + '   Ex:' + srvObj.cntRESTexception;
                                    trStr += '<br>InterReq:' + srvObj.cntInterRequest + '   Ex:' + srvObj.cntInterException;
                                    trStr += '<br>cacheSize:' + srvObj.cacheSize;
                                    trStr += '<br>iisurl: ' + iisurlStr;
                                    trStr += '<br>SRVURL: ' + SRVURL;
                                    htmlSt += '<li class="list-group-item list-group-item-warning">' + trStr + '</li>';

                                }
                                trStr = "";
                                for (i = 0; i < statusObjList.length; i++) {
                                    var srvStatusSt = statusObjList[i];
                                    if (i > 0) {
                                        trStr += '<br>';
                                    }
                                    trStr += srvStatusSt;
                                }
                                htmlSt += '<li class="list-group-item list-group-item-success">' + trStr + '</li>';



                                htmlSt += '</ul>';
                                $("#statuslistid").html(htmlSt);
                                
//                        $.ajax({
//                            url: SRVURL + "/cust/" + custObj.username + "/uisys/" + custObj.id + "/remotetimer",
//
//                            crossDomain: true,
//                            cache: false,
//                            success: function (timer) {
//
//                            }
//                        });
                        return;
                    }
                });
                return;
            }
        });
    }


}