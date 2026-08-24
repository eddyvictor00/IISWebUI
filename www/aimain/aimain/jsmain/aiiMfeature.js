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

var garphsymbol = "";
var iisPerfObjSession = "iisPerfObjSession";
var iisPerfObjStr = window.localStorage.getItem(iisPerfObjSession);
var iisPerfObj = null;
if ((iisPerfObjStr == null) || (iisPerfObjStr.length == 0)) {

} else {
    iisPerfObj = JSON.parse(iisPerfObjStr);
}

//http://localhost:8081/cust/guest/acc/3/st/FAS
//http://localhost:8081/cust/guest/acc/3/st/FAS/tr/TR_NN91/perf
//http://localhost:8081/cust/guest/acc/3/st/FAS/tr/TR_NN91/tran/history/chart?month=6
//T:\Netbean\devaiiweb\www\aimain\img\fas-1.jpg

document.getElementById("perf").style.display = "none";  //hide    

function performPage(sym) {
    var stStr = "";
    if (sym === "fas") {
        document.getElementById("perf").style.display = "";  //show   
        stStr = "Direxion Financial Bull (FAS)";
        myInitPerf(sym);
    } else if (sym === "spxl") {
        document.getElementById("perf").style.display = "";  //show   
        stStr = "Direxion S&P500 Bull (SPXL)";
        myInitPerf(sym);
    } else if (sym === "webl") {
        document.getElementById("perf").style.display = "";  //show   
        stStr = "Dow Jones Internet Bull (WEBL)";
        myInitPerf(sym);
    } else if (sym === "erx") {
        document.getElementById("perf").style.display = "";  //show   
        stStr = "Direxion Energy Bull (ERX)";
        myInitPerf(sym);
    }
    $("#mytrid").html(stStr);
}


function myInitPerf(symbol) {

    var urlSt = iisurl + "/cust/0/acc/0/st/" + symbol + "/tr/TR_NN33/perf";

    $.ajax({
        url: urlSt,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        beforeSend: function () {
            $("#loader").show();
        },
        error: function () {
//            alert('Network failure. Please try again later.');
//            window.location.href = "aiiend.html";
        },
        success: function (resultPerfList) {
//            console.log(resultPerfList);

            if (resultPerfList != null) {
                if (resultPerfList.length === 0) {
                    return;
                }

                var PerfObj = resultPerfList[0];
                var trsignal = PerfObj.performData.trsignal;
                var perfStart = PerfObj.performData.fromdate;
                var perfEnd = PerfObj.updatedatedisplay;

                var netprofitSt = Number(PerfObj.grossprofit).toLocaleString('en-US', {style: 'currency', currency: 'USD'});

                var percent = 100 * (PerfObj.grossprofit) / TRADING_AMOUNT;
                var percentSt = "";
                if (percent > 100) {
                    percentSt = Number(percent.toFixed(0)).toLocaleString('en');
                } else {
                    percentSt = Number(percent.toFixed(2)).toLocaleString('en');
                }

                var tranSt = "";
                var title1 = "";
                var col1 = "";
                var title2 = "";
                var col2 = "";


                tranSt += '<table class="table table-striped table-sm">';
                tranSt += ' <thead>';
                tranSt += '<tr>';
                tranSt += '<th></th>';
                tranSt += '<td></td>';
                tranSt += '<th></th>';
                tranSt += '<td></td>';
                tranSt += '</tr>';
                tranSt += '</thead>';
                tranSt += '<tbody>';

                title1 = 'Date: ';
                col1 = perfEnd;
                title2 = 'From: ';
                col2 = perfStart;
                tranSt += '<tr>';
                tranSt += '<th width="20%">' + title1 + '</th>';
                tranSt += '<td width="30%">' + col1 + '</td>';
                tranSt += '<th width="20%">' + title2 + '</th>';
                tranSt += '<td width="30%">' + col2 + '</td>';
                tranSt += '</tr>';

                tranSt += '<tr>';
                tranSt += '<th></th>';
                tranSt += '<td></td>';
                tranSt += '<th></th>';
                tranSt += '<td></td>';
                tranSt += '</tr>';

                title1 = 'Profit: ';
                col1 = netprofitSt;
                title2 = 'Profit (%): ';
                col2 = percentSt + '%';
                tranSt += '<tr>';
                tranSt += '<th>' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';


                title1 = 'Rating: ';
                col1 = PerfObj.rating.toFixed(2);
                title2 = 'Num Trade: ';
                col2 = PerfObj.numtrade;
                tranSt += '<tr>';
                tranSt += '<th>' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                title1 = 'Num Win: ';
                col1 = PerfObj.performData.numwin;
                title2 = 'Num Loss: ';
                col2 = PerfObj.performData.numloss;
                tranSt += '<tr>';
                tranSt += '<th>' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                title1 = 'Max Win: ';
                col1 = PerfObj.performData.maxwin.toFixed(2);
                title2 = 'Max Loss: ';
                col2 = PerfObj.performData.maxloss.toFixed(2);
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                title1 = 'Avg Win: ';
                col1 = PerfObj.performData.avgwin.toFixed(2);
                title2 = 'Avg Loss: ';
                col2 = PerfObj.performData.avgloss.toFixed(2);
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                title1 = 'Total Buy: ';
                col1 = PerfObj.performData.totalbuyonly.toFixed(2);
                title2 = 'Total Sell: ';
                col2 = PerfObj.performData.totalsellonly.toFixed(2);
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                title1 = 'Hold Time: ';
                col1 = PerfObj.performData.holdtime;
                title2 = 'Max Hold Time: ';
                col2 = PerfObj.performData.maxholdtime;
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                var buyhold = PerfObj.performData.buyhold;   // profit of buy and hold
                var buyholdSt = Number(buyhold).toLocaleString('en-US', {style: 'currency', currency: 'USD'});

                percent = 100 * buyhold / TRADING_AMOUNT;
                if (percent > 100) {
                    percentSt = Number(percent.toFixed(0)).toLocaleString('en');
                } else {
                    percentSt = Number(percent.toFixed(2)).toLocaleString('en');
                }

                title1 = 'BH Profit: ';
                col1 = buyholdSt
                title2 = 'Buy Hold Per: ';
                col2 = percentSt + '%';
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                var reInvest = PerfObj.performData.reInvestProfit;   // 
                var reInvestSt = Number(reInvest).toLocaleString('en-US', {style: 'currency', currency: 'USD'});

                percent = 100 * reInvest / TRADING_AMOUNT;
                if (percent > 100) {
                    percentSt = Number(percent.toFixed(0)).toLocaleString('en');
                } else {
                    percentSt = Number(percent.toFixed(2)).toLocaleString('en');
                }

                title1 = 'Re Invest: ';
                col1 = reInvestSt
                title2 = 'Re Invest Per: ';
                col2 = percentSt + '%';
                tranSt += '<tr>';
                tranSt += '<th scope="row">' + title1 + '</th>';
                tranSt += '<td>' + col1 + '</td>';
                tranSt += '<th>' + title2 + '</th>';
                tranSt += '<td>' + col2 + '</td>';
                tranSt += '</tr>';

                tranSt += '</tbody>';
                tranSt += '</table>';
                tranSt += '</div> ';

                $("#trperformid").html(tranSt);
                window.location.href = "Mfeature.html#perf";
            }
        }
    });
    iniTRgraph(symbol);
}

// Function to show loading spinner
function showLoadingSpinner() {
    $("#loadingSpinner").show();
}

// Function to hide loading spinner
function hideLoadingSpinner() {
    $("#loadingSpinner").hide();
}

// Refresh on button click
$("#refreshSpace3Btn").click(function () {
    showLoadingSpinner();
    var symbol = garphsymbol; //"FAS"
    var resultURL = iisurl + "/cust/0/acc/0/st/" + symbol +  "/tr/TR_NN33/tran/history/chart?month=3&t=" + new Date().getTime();
    $("#space3image").attr("src", resultURL);    
    // var resultURL = iisurl + "/cust/" + custObj.username + "/acc/" + accId + "/st/" + stockObj.symbol + "/tr/" + trName + "/tran/history/chart?month=6&t=" + new Date().getTime();
    // $("#space3image").attr("src", resultURL);
});


// Hide spinner when image loads
$("#space3image").on("load", function() {
    hideLoadingSpinner();
});

// Also hide spinner if image fails to load
$("#space3image").on("error", function() {
    hideLoadingSpinner();
    console.error("Failed to load chart image");
});

// Function to reload image on error (as in original code)
function reload3Image(img) {
    console.log("Image failed to load, attempting reload");
    var src = img.src;
    img.src = "";
    setTimeout(function() {
        img.src = src;
    }, 500);
}

function iniTRgraph(symbol) {
    garphsymbol = symbol;
    $("#refreshSpace3Btn").click();
}


// $("#refreshSpace6Btn").click(function (symbol) {
//     showLoadingSpinner();
//     var resultURL = iisurl + "/cust/0/acc/0/st/" + symbol +  "/tr/TR_NN33/tran/history/chart?month=6" + new Date().getTime();
//     $("#space3image").attr("src", resultURL);
// });

// function iniTRgraph(symbol) {
//     $("#refreshSpace6Btn").click(symbol);
// }


function reload6Image(pThis) {
    // To prevent this from being executed over and over
    pThis.onerror = null;

    // Refresh the src attribute, which should make the
    // browsers reload the iamge.
    pThis.src = pThis.src;
}
