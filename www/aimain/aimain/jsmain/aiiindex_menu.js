///////////////////////////////////////////////////////////////////////////////////////
var iisWebM = "iisWebM";

function myMenuReset() {
    var iisWebMObjStr = window.localStorage.getItem(iisWebM);
    if (iisWebMObjStr.length > 0) {
        var iisWebObj = JSON.parse(iisWebMObjStr);
        var myMenuId = iisWebObj.myMenuId;
        if (myMenuId == -1) {
            myMenuId = 1;
        }
        myMenu(myMenuId);
    }
}
function myMenu(myId) {
    var myMenuId = myId;
    var iisWebObj = {'myMenuId': myMenuId};
    window.localStorage.setItem(iisWebM, JSON.stringify(iisWebObj));

    var active1 = "";
    var active2 = "";
    var active3 = "";
    var active4 = "";
    var active5 = "";
    var active6 = "";
    var active7 = "";
    var active8 = "";
    var active9 = "";
    var active10 = "";
    var active4_7 = "";
    if (myId == 1) {
        active1 = "active";
    } else if (myId == 2) {
        active2 = "active";
    } else if (myId == 3) {
        active3 = "active";
    } else if (myId == 4) {
        active4_7 = "active";
        active4 = "active";
    } else if (myId == 5) {
        active4_7 = "active";
        active5 = "active";
    } else if (myId == 6) {
        active4_7 = "active";
        active6 = "active";
    } else if (myId == 7) {
        active4_7 = "active";
        active7 = "active";
    } else if (myId == 8) {
        active8 = "active";
    } else if (myId == 9) {
        active9 = "active";
    } else if (myId == 10) {
        active10 = "active";
    }

    var htmlName = '';

    htmlName += '<a href="aiiindex.html" onclick="return myMenu(1);" class="nav-item nav-link ' + active1 + '">Home</a>';
    htmlName += '<a href="aiiindex.html#about" onclick="return myMenu(2);" class="nav-item nav-link ' + active2 + '">About</a>';
    htmlName += '<a href="aiiindex.html#service" onclick="return myMenu(3);" class="nav-item nav-link ' + active3 + '">Services</a>';

    htmlName += '<div class="nav-item dropdown">';
    htmlName += '<a href="#" class="nav-link dropdown-toggle ' + active4_7 + '" data-bs-toggle="dropdown">Performance</a>';
    htmlName += '<div class="dropdown-menu border-light m-0">';
    htmlName += '<a href="Mfeature.html#feature" onclick="return myMenu(4);" class="dropdown-item ' + active4 + '">AI Feature</a>';
    htmlName += '<a href="Mperform.html" onclick="return myMenu(5);" class="dropdown-item ' + active5 + '">Performance</a>';
//    htmlName += '<a href="aiiindex.html#team" onclick="return myMenu(6);" class="dropdown-item ' + active6 + '">Team</a>';
    htmlName += '<a href="Mlogindemo.html#loginId" onclick="return myMenu(7);" class="dropdown-item ' + active7 + '">Demo Account</a>';
    htmlName += '</div>';
    htmlName += '</div>';
    htmlName += '<a href="Mlogin.html#pricing" onclick="return myMenu(8);" class="nav-item nav-link ' + active8 + '">Pricing</a>';
    htmlName += '<a href="Mlogin.html#loginId" onclick="return myMenu(9);" class="nav-item nav-link ' + active9 + '">Login</a>';
    htmlName += '<a href="aiiindex.html#contactUs" onclick="return myMenu(10);" class="nav-item nav-link ' + active10 + '">Contact</a>';
    $("#m-main").html(htmlName); //clear the field


    return;
}


// banner seems never used
function myInitBanner() {
    // No need, this is handel by server backend to check the client version
//    $.ajax({
//        url: iisurl + "/cust/0/acc/0/banner?ver=" + iis_ver,
//        crossDomain: true,
//        cache: false,
//        timeout: INT_TIMOUT, //120 sec,
//        error: function () {
//        },
//        success: function (result) {
//            if ((result === null) || (result === "")) {
//                return;
//            }
//            var resultListStr = JSON.stringify(result, null, '\t');
//            var resultList = JSON.parse(resultListStr);
//
//            if (resultList.length > 0) {
//                var version = "";
//                for (i = 0; i < resultList.length; i++) {
//                    if (i === 0) { // version num
//                        version = resultList[i];
//                        continue;
//                    }
//                    if (i === 1) { // alert message
//                        var alertMsg = resultList[i];
//                        if (alertMsg.length > 0) {
////                            alert(version + " " + alertMsg);
//                        }
//                        continue;
//                    }
//                }
//                $("#iisverid").html('(v' + version + ')');
//
//            }
//
//        }
//    }); // use promises

}
