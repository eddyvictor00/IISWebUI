///////////////////////////////////////////////////////////////////////////////////////
function bubbleSort(names) {
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < names.length - 1; i++) {
            // Compare adjacent names and swap if necessary
            if (names[i] > names[i + 1]) {
                let temp = names[i];
                names[i] = names[i + 1];
                names[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
}

var iisWebSM = "iisWebSM";
function mySubMenuReset() {
    var iisWebMObjStr = window.localStorage.getItem(iisWebSM);
    if (iisWebMObjStr.length > 0) {
        var iisWebObj = JSON.parse(iisWebMObjStr);
        var myMenuId = iisWebObj.myMenuId;
        if (myMenuId == -1) {
            myMenuId = 0;
        }
    } else {
        myMenuId = 0;
    }
    subMenu(myMenuId);
    updateSubMenu();
}

function getSubMenuId() {
    var iisWebMObjStr = window.localStorage.getItem(iisWebSM);
    if (iisWebMObjStr.length > 0) {
        var iisWebObj = JSON.parse(iisWebMObjStr);
        var myMenuId = iisWebObj.myMenuId;
        if (myMenuId == -1) {
            myMenuId = 1;
        }
        return myMenuId;
    }
    return -1;
}


function updateSubMenu() {

    var iisODSObjSession = "iisODSObjSession";
    var iisODSObjStr = window.localStorage.getItem(iisODSObjSession);
    var iisODSObj = JSON.parse(iisODSObjStr);
//////Goble variable
    var userN = iisODSObj.userN;
    var custT = iisODSObj.custT;
    var accId = iisODSObj.accId;
    var accfundId = iisODSObj.accfundId;
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
    var trM3 = iisODSObj.trM3;
    var trM3TR = iisODSObj.trM3TR;
    var trM3St = iisODSObj.trM3St;    
    var debug01 = iisODSObj.debug01;
    var debug02 = iisODSObj.debug02;
    var debug03 = iisODSObj.debug03;

//////Goble variable


    // update menu start

    if ((trM1.length > 0) || (debug01 == true)) {
        var htmlTr = "";
        var id = 13;
        htmlTr += '<a href="aiistocknn.html" onclick="return subMenu(' + id + ');" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> ' + trM1St + ' TR</a>';
        if (trM2.length > 0) {
            id = id + 1;
            htmlTr += '<a href="aiistocknn.html" onclick="return subMenu(' + id + ');" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> ' + trM2St + ' TR</a>';
        }
        if (trM3.length > 0) {
            id = id + 1;
            htmlTr += '<a href="aiistocknn.html" onclick="return subMenu(' + id + ');" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> ' + trM3St + ' TR</a>';
        }        
        id = 17;
        if (debug01 == true) {
            htmlTr += '<a href="aiistocknn.html" onclick="return subMenu(' + id + ');" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> TR_NN31 TR</a>';
            id = id + 1;
            htmlTr += '<a href="aiistocknn.html" onclick="return subMenu(' + id + ');" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> TR_NN32 TR</a>';
            id = id + 1;
            htmlTr += '<a href="aiistocknn.html" onclick="return subMenu(' + id + ');" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> TR_NN34 TR</a>';
//            id = id + 1;
//            htmlTr += '<a href="aiistocknn.html" onclick="return subMenu(' + id + ');" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> TR_NN6 TR</a>';
        }
        // adding NN1 NN2
        $("#trMenuId").html(htmlTr);
    }


    if (scribLStr.length > 0) {
        var scribList = scribLStr.split(",");
        if (scribList.length > 0) {
            bubbleSort(scribList);
            var htmlTr = "";
            for (i = 0; i < scribList.length; i++) {
                var id = 21 + i;
                htmlTr += '<a href="aiisubscription.html" onclick="return subMenu(' + id + ');" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> ' + scribList[i] + '</a>';
            }
        }
        $("#scrubMenuId").html(htmlTr);
    }
    if (accfundId > 0) {
        document.getElementById("sm-fundmgr").style.display = "";  //show        
    }

    if (sysDevOp == true) {
        document.getElementById("sm-admin").style.display = "";  //show 

        var htmlAdmin = "";
        if (custT == 99) {
            htmlAdmin += '<a href="aiiadmmgrstatus.html" onclick="return subMenu(50);" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> Status</a>';
            htmlAdmin += '<a href="aiiadmmgrcust.html" onclick="return subMenu(51);" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> Customer</a>';
            htmlAdmin += '<a href="aiiadmmgrAc.html" onclick="return subMenu(52);" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> Accounting</a>';
            htmlAdmin += '<a href="aiiadmmgr.html" onclick="return subMenu(53);" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> System</a>';
        } else if (custT == 82) {
            htmlAdmin += '<a href="aiiadmmgrAc.html" onclick="return subMenu(52);" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> Accounting</a>';
        } else if (custT == 84) {
            htmlAdmin += '<a href="aiiadmmgrcust.html" onclick="return subMenu(51);" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> Customer</a>';
            htmlAdmin += '<a href="aiiadmmgr.html" onclick="return subMenu(53);" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> System</a>';
        } else if (custT == 86) {
            htmlAdmin += '<a href="aiiadmmgrstatus.html" onclick="return subMenu(50);" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> Status</a>';
            htmlAdmin += '<a href="aiiadmmgrcust.html" onclick="return subMenu(51);" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> Customer</a>';
            htmlAdmin += '<a href="aiiadmmgr.html" onclick="return subMenu(53);" class="dropdown-item">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> System</a>';
        }
        $("#adminMenuId").html(htmlAdmin);
    }

    var htmluser = "";
    htmluser += '<h6 class="mb-0">' + userN + '</h6>';
    var userTN = 'User';
    if (accfundId > 0) {
        userTN = 'Fund User';
    }
    if (custT > 80) {
        userTN = 'Sys User';
    }
    htmluser += '<span>' + userTN + '</span>';
    $("#userinfoid").html(htmluser);
    $("#userNid").html(userN);

    // update menu end
}
var refName = "aiiaccount.html"

function refreshMyPage() {
    var iisWebMObjStr = window.localStorage.getItem(iisWebSM);
    if (iisWebMObjStr.length > 0) {
        var iisWebObj = JSON.parse(iisWebMObjStr);
        var myMenuId = iisWebObj.myMenuId;
        if (myMenuId == -1) {
            myMenuId = 0;
        }
    } else {
        myMenuId = 0;
    }
    var myId = myMenuId;
    updateSubMenuActive(myId);
    if (refName.length == "") {
        refName = "aiiaccount.html"
    }
    window.location.href = refName;

}
function clickSubMenuId(myId) {
    subMenu(myId)
}

function subMenu(myId) {
    var myMenuId = myId;
    var iisWebObj = {'myMenuId': myMenuId};
    window.localStorage.setItem(iisWebSM, JSON.stringify(iisWebObj));
    dispSubMenu(myId);
}


var active0 = "";
var active0102 = "";
var active1 = "";
var active2 = "";
var active3 = "";
var active4 = "";
var active1020 = "";
var active11 = "";
var active12 = "";
var active2030 = "";
var active20 = "";
var active3050 = "";
var active30 = "";
var active31 = "";
var active32 = "";
var active5060 = "";


function updateSubMenuActive(myId) {
    active0 = "";
    if (myId == 0) {
        refName = "aiiaccount.html"
        active0 = "active";
    }
    active0102 = "";
    active1 = "";
    active2 = "";
    active4 = "";
    if (myId == 1) {
        refName = "aiiupdate.html"
        active0102 = "active";
        active1 = "active";
    } else if (myId == 2) {
        refName = "aiibilling.html"
        active0102 = "active";
        active2 = "active";
    } else if (myId == 4) {
        refName = "aiiaccountperf.html"
        active0102 = "active";     
        active4 = "active";
    }
    active3 = "";
    if (myId == 3) {
        refName = "aiipriceplan.html";
        active3 = "active";
    }



    active1020 = "";
    active11 = "";
    active12 = "";
    if ((myId >= 10) && (myId < 20)) {
        active1020 = "active";
        if (myId == 11) {
            refName = "aiistock.html";
            active11 = "active";
        }
        if (myId == 12) {
            refName = "aiistocknn.html";
            active12 = "active";
        }
    }

    active2030 = "";
    active20 = "";
    if ((myId >= 20) && (myId < 30)) {
        refName = "aiisubscription.html";

        active2030 = "active";
        if (myId == 20) {
            active20 = "active";
        }

    }
    active3050 = "";
    active30 = "";
    active31 = "";
    active32 = "";
    active33 = "";
    if ((myId >= 130) && (myId < 150)) {
        refName = "aiifundmgr.html";

        active3050 = "active";
        if (myId == 130) {
            active30 = "active";
        }
        if (myId == 131) {
            active31 = "active";
        }
        if (myId == 132) {
            active32 = "active";
        }
        if (myId == 133) {
            active33 = "active";
        }
    }

    active5060 = "";
    if ((myId >= 50) && (myId < 60)) {
        refName = "aiiAdmmgr.html";
        active5060 = "active";
    }
}


function dispSubMenu(myId) {
//    if (true) {
//        return;
//    }
    updateSubMenuActive(myId);

    var htmlName = "";
    htmlName += '<a href="aiiaccount.html" onclick="return subMenu(0); class="nav-item nav-link ' + active0 + '" ><i class="fa fa-tachometer-alt me-2"></i>Dashboard</a>';
    htmlName += '<div class="nav-item dropdown">';
    htmlName += '<a href="#" class="nav-link dropdown-toggle ' + active0102 + '" data-bs-toggle="dropdown"><i class="fa fa-chart-pie fa-bank me-2"></i>Account</a>';
    htmlName += '<div class="dropdown-menu bg-transparent border-0">';
    htmlName += '<a href="aiiupdate.html" onclick="return subMenu(1);" class="dropdown-item ' + active1 + '">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> Profile</a>';
    htmlName += '<a href="aiibilling.html" onclick="return subMenu(2);" class="dropdown-item ' + active2 + '">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> Billing</a>';
//    htmlName += '<a href="aiiaccountpref.html" onclick="return subMenu(4);" class="dropdown-item ' + active4 + '">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> Performance</a>';
    htmlName += '</div>';
    htmlName += '</div>';
    htmlName += '<a href="aiipriceplan.html" onclick="return subMenu(3);" class="nav-item nav-link ' + active3 + '"><i class="fa fa-th me-2"></i>Price Plan</a>';
    htmlName += '<div class="nav-item dropdown">';
    htmlName += '<a href="#" class="nav-link dropdown-toggle ' + active1020 + '" data-bs-toggle="dropdown"><i class="fa fa-chart-line me-2"></i>Stock</a>';
    htmlName += '<div class="dropdown-menu bg-transparent border-0">';
    htmlName += '<a href="aiistock.html" onclick="return subMenu(11);" class="dropdown-item ' + active11 + '">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> TR Acc</a>';
    htmlName += '<a href="aiistocknn.html" onclick="return subMenu(12);" class="dropdown-item ' + active12 + ' ">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> AI_NN33 TR</a>';
    htmlName += '<span id="trMenuId" ></span>';
    htmlName += '</div>';
    htmlName += '</div>';
    htmlName += '<div class="nav-item dropdown">';
    htmlName += '<a href="#" class="nav-link dropdown-toggle ' + active2030 + '" data-bs-toggle="dropdown"><i class="fa fa-book me-2"></i>Feature</a>';
    htmlName += '<div class="dropdown-menu bg-transparent border-0">';
//    htmlName += '<a href="aiisubscription.html" onclick="return subMenu(20);" class="dropdown-item ' + active20 + '">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> Manage</a>';
    htmlName += '<span id="scrubMenuId" ></span>';
    htmlName += '</div>';
    htmlName += '</div>';
    htmlName += '<div class="nav-item dropdown" id="sm-fundmgr" style="display:none">';
    htmlName += '<a href="#" class="nav-link dropdown-toggle ' + active3050 + '" data-bs-toggle="dropdown"><i class="fa fa-cubes me-2"></i>Fund Mgr</a>';
    htmlName += '<div class="dropdown-menu bg-transparent border-0">';
//    htmlName += '<a href="aiifundmgr.html" onclick="return subMenu(130);" class="dropdown-item ' + active30 + '">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> Manage</a>';
    htmlName += '<a href="aiifundmgr.html" onclick="return subMenu(131);" class="dropdown-item ' + active31 + '">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> BLOG</a>';
    htmlName += '<a href="aiifundmgr.html" onclick="return subMenu(132);" class="dropdown-item ' + active32 + '">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> Fund TR</a>';
//    htmlName += '<a href="aiifundperf.html" onclick="return subMenu(133);" class="dropdown-item ' + active33 + '">&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right" ></i> FPerformance</a>';
    htmlName += '</div>';
    htmlName += '</div>';
    htmlName += '<div class="nav-item dropdown" id="sm-admin" style="display:none">';
    htmlName += '<a href="#" class="nav-link dropdown-toggle ' + active5060 + '" data-bs-toggle="dropdown"><i class="fa fa-laptop me-2"></i>Admin</a>';
    htmlName += '<div id="adminMenuId" class="dropdown-menu bg-transparent border-0">';
    htmlName += '</div>';
    htmlName += '</div>';

    $("#sm-main").html(htmlName); //clear the field

    return;
}


function updateShortCommFunction() {
    var iisODSObjSession = "iisODSObjSession";
    var iisODSObjStr = window.localStorage.getItem(iisODSObjSession);
    var iisODSObj = JSON.parse(iisODSObjStr);
    var commOLStr = iisODSObj.commOLStr;

    var commObjList = [];

    if (commOLStr.length > 0) {
        commObjList = JSON.parse(commOLStr);
        if (commObjList.length == 0) {
            commObjList = [];
        }
    }
    displayCommFunction(commObjList);
}

function displayCommFunction(commObjList) {
    if (commObjList == null) {
        commObjList = [];
    }
    var shortMsgCnt = 3;
    var htmlShortCom = "";

    var col1 = "";
    var col2 = "";
    var col3 = "";

    for (i = 0; i < commObjList.length; i++) {
        var commObj = commObjList[i];
        var commId = commObj.id;

        col1 = commObj.updatedatedisplay;

//                    col2 = commObj.id + ' ' + commObj.name + ' (' + custObj.id + ')';
        col2 = commObj.name + ' Acc (' + custObj.id + ')';

        col3 = commObj.data;


        var buysell = false;
        if (col3.indexOf("Sig:buy") != -1) {
            col3 = '<font style= color:green>' + col3 + '</font>';
            buysell = true;
        }
        if (col3.indexOf("Sig:sell") != -1) {
            col3 = '<font style= color:red>' + col3 + '</font>';
            buysell = true;
        }

        if (shortMsgCnt > 0) {
            if (buysell == true) {

                htmlShortCom += '<a href="#" class="dropdown-item">';
                htmlShortCom += '<h6 class="fw-normal mb-0">' + col1 + '</h6>';
                htmlShortCom += '<small>' + col3 + '</small>';
                htmlShortCom += '</a>';
                shortMsgCnt--;
            }
        }
    }
    var notifyhtml = "";
    if (commObjList.length > 0) {
        notifyhtml += '<i class="fa fa-bell  me-lg-2" ></i>';
    } else {
        notifyhtml += '<i class="fa fa-bell-slash  me-lg-2" ></i>';
    }
    notifyhtml += '<span class="d-none d-lg-inline-flex">Notification (' + commObjList.length + ')</span>';
    $("#notifyCnt").html(notifyhtml);

    $("#myShortcomm").html(htmlShortCom);
}
