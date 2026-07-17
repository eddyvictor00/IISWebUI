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

var iisMsgSession = "iisMsgSession";

var iisurlStr = iisurl;

var iisWebInitSession = "iisWebInitSession";

var iisODSObjSession = "iisODSObjSession";

var iisWebInitObjStr = window.localStorage.getItem(iisWebInitSession);
if (iisWebInitObjStr.length > 0) {
    var iisWebInitObj = JSON.parse(iisWebInitObjStr);
    var iisurlInitStr = iisWebInitObj.iisurlStr;
    if (iisurlInitStr.length > 0) {
        iisurlStr = iisurlInitStr;
        iisurl = iisurlInitStr;
    }
}

myMenuReset();
myInitBanner();

var fundListStr = "";

var iisPerfObjSession = "iisPerfObjSession";
var iisPerfObjStr = window.localStorage.getItem(iisPerfObjSession);
var iisPerfObj = null;
if ((iisPerfObjStr == null) || (iisPerfObjStr.length == 0)) {

} else {
    iisPerfObj = JSON.parse(iisPerfObjStr);
    fundListStr = iisPerfObj.fundListStr;

}
if (fundListStr.length > 0) {
    updatePerfCnt();
} else {
    myInitPerflist();
}

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
            fundListStr = JSON.stringify(result, null, '\t');
            iisPerfObj.fundListStr = fundListStr;
            iisPerfObjStr = JSON.stringify(iisPerfObj, null, '\t');
            window.localStorage.setItem(iisPerfObjSession, iisPerfObjStr);
            updatePerfCnt();

        }

    }); // use promises

}


function displayPerf(fundTmp, name, perNum) {
    var colorTxt = "white";
    if (perNum == 1) {
    } else if (perNum == 2) {
        colorTxt = "warning";
    } else if (perNum == 3) {

    } else if (perNum == 4) {
        colorTxt = "warning";
    }

//        trAccPList.add(curMAccSt);                //    "2024-05-30 2025-01-09 TR_Acc Total: $2,579.67",
//        trAccPList.add(stock.getStockname());     //    "BetaPro Crude Oil Daily Bull ETF",
//        trAccPList.add("Stock List: " + symbol);  //    "Stock List: HOU.TO",
//        trAccPList.add(symbol);                   //    "HOU.TO",
//        trAccPList.add(curMSt); // 6 month        //    "42.99",
//        trAccPList.add(curM_1St);                 //    "-6.54",
//        trAccPList.add(curM_2St);                 //    "-9.01",
//        trAccPList.add(curM_3St);                 //    "-9.01",
//        trAccPList.add(curM_6St);                 //    "42.99",
//        trAccPList.add(curM_12St);                //    "119.14",
//        trAccPList.add(curM_24St);                //    "301.55"    
    var stockl = fundTmp[2];
    var per = fundTmp[4];  // half year month
    var per1 = fundTmp[5];  // Last 1 month                    
    var per2 = fundTmp[6];  // Last 2 month                    
    var per3 = fundTmp[7];  // Last 3 month                    
    var per6 = fundTmp[8];  // Last 6 month                        
    var per12 = fundTmp[9];  // Last 6 month                         
    var bal = per / 100 * 6000;


    var perfCnt = "";
    perfCnt = parseInt(per6);

    var htmlSt = ""
    htmlSt += '<div class="ps-3">';
    htmlSt += '<h5 class="text-' + colorTxt + '">' + name + perfCnt + '%</h5>';
    htmlSt += '<span class="text-' + colorTxt + '">';
    htmlSt += '<br>Last 3M: ' + per3 + '%';
    htmlSt += '<br>Last 6M: ' + per6 + '%';
    htmlSt += '<br>Last 12M: ' + per12 + '%';
    htmlSt += '</span>';

    htmlSt += '</div>';
    if (perNum == 1) {
        $("#perf1Cnt").html(perfCnt);
        $("#perf11Txt").html(htmlSt);
    } else if (perNum == 2) {
        $("#perf2Cnt").html(perfCnt);
        $("#perf12Txt").html(htmlSt);
    } else if (perNum == 3) {
        $("#perf3Cnt").html(perfCnt);
        $("#perf13Txt").html(htmlSt);
    } else if (perNum == 4) {
        $("#perf4Cnt").html(perfCnt);
        $("#perf14Txt").html(htmlSt);
    }

}

function updatePerfCnt() {

//    var fundListStr = iisPerfObj.fundListStr;
    var fundList = JSON.parse(fundListStr);

    var fundTmp = "";
    fundTmp = fundList.bench1; //fund1;
    var dateSt = fundTmp[0];

    const myArray = dateSt.split(" ");
    var dateSt = myArray[0];
    var dateESt = myArray[1]
    var datefrom = " Starting from " + dateSt + " to " + dateESt;
    $("#datefrom").html(datefrom);

    var name = fundTmp[3];
    name = name.replace(".TO", "");
    name = name + ' - AIIweb';
    name = name + '<br>AI Acc Total: ';
    displayPerf(fundTmp, name, 1);

//////////////////////////////                                      


    fundTmp = fundList.bench3; //fund2;
    name = fundTmp[3];
    name = name.replace(".TO", "");
    name = name + ' - AIIweb';
    name = name + '<br>AI Acc Total: ';
    displayPerf(fundTmp, name, 3);

///////////////////////////                    

    fundTmp = fundList.bench2;
    name = fundTmp[3];
    name = name.replace(".TO", "");
    name = name + ' - ETF';
    name = name + '<br>Buy/Hold Total: ';
    displayPerf(fundTmp, name, 2);

///////////////////////////                    

    fundTmp = fundList.bench4;
    name = fundTmp[3];
    name = name.replace(".TO", "");
    name = name + ' - ETF';
    name = name + '<br>Buy/Hold Total: ';
    displayPerf(fundTmp, name, 4);

}


function allPerfListFunction() {
//    alert("allPerfListFunction");

    document.getElementById("tag-perf1").style.display = "";  //Display
    $.ajax({
        url: iisurl + "/cust/0/acc/0/allstockperflist",

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

                var htmlheadReply = "";
                $("#perfStList").html(htmlheadReply);
                if (commObjList.length < 1) {
                    return;
                }

                var dateSt = commObjList[0];
                try {
                    const myArray = dateSt.split(" ");
                    var dateSt = myArray[0];
                    var dateESt = myArray[1]
                    $("#datefrom1").html(" Starting from " + dateESt + " to " + dateSt);
                } catch (err) {
                }
                var htmlSt = "";
                htmlSt += '<table class="table table-striped table-sm">';

                htmlSt += '<tr>';
                htmlSt += '<td >';
                htmlSt += '<div style="color: darkblue">';
                htmlSt += '<Strong><small>Stock Name (percentage return %)</small></Strong>';
                htmlSt += '</div>';
                htmlSt += '</td>';
                htmlSt += '<td style="color: darkblue;text-align:right">';
                htmlSt += '<Strong><small>AI 3M %</small></Strong>';
                htmlSt += '</td>';
                htmlSt += '<td style="color: darkblue;text-align:right">';
                htmlSt += '<Strong><small>AI 6M %</small></Strong>';
                htmlSt += '</td>';
                htmlSt += '<td style="color: darkblue;text-align:right">';
                htmlSt += '<Strong><small>AI 12M %</small></Strong>';
                htmlSt += '</td>';

                htmlSt += '</tr>'
                for (i = 1; i < commObjList.length; i++) {

                    var commObjSt = commObjList[i];
                    const myArray = commObjSt.split(",");
                    htmlSt += '<tr>';
                    htmlSt += '<td >';
                    htmlSt += '<small>';
                    htmlSt += myArray[0] + " - " + myArray[1];
                    htmlSt += '</small>';
                    htmlSt += '</td>';
                    htmlSt += '<td style="text-align:right"><small>';
                    htmlSt += myArray[2];
                    htmlSt += '</small></td>';
                    htmlSt += '<td style="color: darkblue;text-align:right"><small>';
                    htmlSt += myArray[3];
                    htmlSt += '</small></td>';
                    htmlSt += '<td style="text-align:right"><small>';
                    htmlSt += myArray[4];
                    htmlSt += '</small></td>';

                    htmlSt += '</tr>'

                }
                htmlSt += "</table>";
                $("#perfStList").append(htmlSt);
                window.location.href = "Mperform.html#tag-perfList";

            }
        }
    }
    window.location.href = "Mperform.html#tag-perfList";

}


