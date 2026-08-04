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

var iisWebSession = "iisWebSession";
window.localStorage.setItem(iisWebSession, " ");

var iisMsgSession = "iisMsgSession";
window.localStorage.setItem(iisMsgSession, "");

var iisWebInitSession = "iisWebInitSession";
window.localStorage.setItem(iisWebInitSession, "");


var iisurlStr = iisurl;

var iisWebObj = {'myMenuId': 1}
window.localStorage.setItem(iisWebM, JSON.stringify(iisWebObj));

try {
    var initiisurl = "";

    var iisWebInitObjStr = window.localStorage.getItem(iisWebInitSession);
    if ((iisWebInitObjStr != null) && (iisWebInitObjStr.length > 0)) {
        var iisWebInitObj = JSON.parse(iisWebInitObjStr);
        var iisurlInitStr = iisWebInitObj.iisurlStr;
        if (iisurlInitStr.length > 0) {
            iisurlStr = iisurlInitStr;
            iisurl = iisurlInitStr;
            initiisurl = iisurlInitStr;
        }
    }

    if (android_app1 == true) { // for android app only
//        iisurl = iisurl_ORACLE;
        iisurlInitStr = iisurl;
        iisurlStr = iisurlInitStr;
        iisurl = iisurlInitStr;
        initiisurl = iisurlInitStr;
        var iisWebInit1Obj = {'iisurlStr': iisurlStr};
        window.localStorage.setItem(iisWebInitSession, JSON.stringify(iisWebInit1Obj));
    } else if (android_app2 == true) { // for android app only
//        iisurl = iisurl_RENDER;
        iisurlInitStr = iisurl;
        iisurlStr = iisurlInitStr;
        iisurl = iisurlInitStr;
        initiisurl = iisurlInitStr;
        var iisWebInit1Obj = {'iisurlStr': iisurlStr};
        window.localStorage.setItem(iisWebInitSession, JSON.stringify(iisWebInit1Obj));
    } else {
        if (initiisurl == "") {
            var initiisurl_data = document.getElementById("initIISURL_java").dataset.value;

            if ((initiisurl_data === undefined) || (initiisurl_data.length == 0)) {
                initiisurl_data = document.getElementById("initIISURL_python").dataset.value;

            }
            if ("{{ init_iisurl_python }}" == initiisurl_data) {
                initiisurl_data = ""
            }
            if ("{{ init_iisurl_java }}" == initiisurl_data) {
                initiisurl_data = ""
            }
            initiisurl = initiisurl_data

            // initiisurl = $('#myvar').text(); // $("#init_iisurl");
            if (initiisurl === undefined) {
                initiisurl = iisurl;

            } else if (initiisurl.length > 0) {
                iisurl = initiisurl;
            } else {
                initiisurl = iisurl;
            }
            initiisurl = iisurl;
            iisurlStr = iisurl;
            var iisWebInit1Obj = {'iisurlStr': iisurlStr};
            window.localStorage.setItem(iisWebInitSession, JSON.stringify(iisWebInit1Obj));
        }
    }

} catch (err) {
}

myMenuReset();
// get version
myInitBannerPerf();


var iisPerfObjSession = "iisPerfObjSession";

const iisPerfObjC = {// operation data src
    datefrom: '',
    fundListStr: ''
}

var iisPerfObjStr = JSON.stringify(iisPerfObjC, null, '\t');
window.localStorage.setItem(iisPerfObjSession, iisPerfObjStr);
var iisPerfObj = JSON.parse(iisPerfObjStr);



// banner seems never used
function myInitBannerPerf() {
    // No need, this is handel by server backend to check the client version
    $.ajax({
        url: iisurl + "/cust/0/acc/0/banner?ver=" + iis_ver,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        error: function () {
        },
        success: function (result) {
            if ((result === null) || (result === "")) {
                return;
            }
            var resultListStr = JSON.stringify(result, null, '\t');
            var resultList = JSON.parse(resultListStr);

            if (resultList.length > 0) {
                var version = "";
                for (i = 0; i < resultList.length; i++) {
                    if (i === 0) { // version num
                        version = resultList[i];
                        continue;
                    }
                    if (i === 1) { // alert message
                        var alertMsg = resultList[i];
                        if (alertMsg.length > 0) {
//                            alert(version + " " + alertMsg);
                        }
                        continue;
                    }
                }
                $("#iisverid").html('(v' + version + ')');
                myInitPerflist();
            }

        }
    }); // use promises

}


//var iisPerfObjStr = window.localStorage.getItem(iisPerfObjSession);
//var iisPerfObj = null;

//if ((iisPerfObjStr == null) || (iisPerfObjStr.length == 0)) {
//    const iisPerfObjC = {// operation data src
//        datefrom: '',
//        fundListStr: ''
//
//    }
//
//    iisPerfObjStr = JSON.stringify(iisPerfObjC, null, '\t');
//    window.localStorage.setItem(iisPerfObjSession, iisPerfObjStr);
//    iisPerfObj = JSON.parse(iisPerfObjStr);
////    myInitPerflist();
//} else {
//    iisPerfObj = JSON.parse(iisPerfObjStr);
//
//}



function myInitPerflist() {

    $.ajax({
        url: iisurl + "/cust/0/acc/0/fundbestperflist",
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        error: function () {
//            alert('Network failure. Please try again later.');
//            window.location.href = "aiiindex.html";
        },
        success: function (result) {

            if ((result === null) || (result === "")) {
                return;
            }
            //backend should be cached
            var fundListStr = JSON.stringify(result, null, '\t');

//            iisPerfObj.fundListStr = fundListStr;
//            iisPerfObj.datefrom = fundListStr;
//            iisPerfObjStr = JSON.stringify(iisPerfObj, null, '\t');
//            window.localStorage.setItem(iisPerfObjSession, iisPerfObjStr);
        }

    }); // use promises

}




$("#contactSubmit").click(function () {

    var comment = "|" + $.trim($("#name").val());
    comment += "|" + $.trim($("#mail").val());
    comment += "|" + $.trim($("#mobile").val());
    comment += "|" + $.trim($("#subject").val());
    comment += "|" + $.trim($("#message").val());
    if (comment !== "") {
        $.ajax({
            url: iisurl + "/cust/" + 0 + "/acc/" + 0 + "/fundlink/" + 0 + "/comm/add?type=0",
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

                $("#contactSubmit").attr("disabled", true);
            } else {
                msgObjStr = "Save message error. Try again later...";
                msgObjStr = '<p  style="color:red">' + msgObjStr + '</p>';
            }
            $('#error-contact').fadeIn().html(msgObjStr);
            return;
        }
    }




});

