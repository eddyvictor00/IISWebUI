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
$("#btn-loginDemo").click(function () {
    var txemail = "demo@demo.com";
    var txtpassword = "demo@demo.com";
    loginProce(txemail, txtpassword);
});


$("#btn-login").click(function () {
    var txemail = document.getElementById("txtusername").value;
    var txtpassword = document.getElementById("txtpassword").value;
    loginProce(txemail, txtpassword);

});

// Check if the consent checkbox is checked helper function
function isConsentGiven() {
    var isChecked = $("#chck-rememberme").is(":checked");
    if (!isChecked) {
        // Display an error message to the user
        $('#tag-logging').fadeIn().html('<p style="color:red;">You must agree to the terms and conditions to login.</p>');
        return false;
    }
    return true;
}

// 1. Updated Demo Login Button Handler
$("#btn-loginDemo").click(function () {
    
    var txemail = "demo@demo.com";
    var txtpassword = "demo@demo.com";
    loginProce(txemail, txtpassword);
});

// 2. Updated Standard Login Button Handler
$("#btn-login").click(function () {
    
    var txemail = document.getElementById("txtusername").value;
    var txtpassword = document.getElementById("txtpassword").value;
    loginProce(txemail, txtpassword);
});

// 3. Updated Form Submit Handler
$("#login-form").on("submit", function (event) {
    event.preventDefault();
    
    var txemail = document.getElementById("txtusername").value;
    var txtpassword = document.getElementById("txtpassword").value;
    loginProce(txemail, txtpassword);
});

// Trigger demo login when user presses "Go" / "Enter" on any focused input or form controls within the demo environment
// 4. Updated Mobile Keyboard "Go" / "Enter" Handler
$("#txtusername, #txtpassword").on("keypress", function (event) {
    if (event.which === 13 || event.keyCode === 13) {
        event.preventDefault();
        
        // Check if we are on the demo page layout
        if ($(this).attr('placeholder') === 'Demo Account' || $(this).is(':disabled')) {
            loginProce("demo@demo.com", "demo@demo.com");
        } else {
            var txemail = document.getElementById("txtusername").value;
            var txtpassword = document.getElementById("txtpassword").value;
            loginProce(txemail, txtpassword);
        }
    }
});


function loginProce(txemail, txtpassword) {
    $('#tag-reg').html('');
    $('#tag-logging').html('');
    if (!isConsentGiven()) return; // Block login if not checked

    if (txemail === "") {
        if (txtpassword === "") {
            $('#tag-logging').html('<p  style="color:red;">Please enter loing information...</p>');
            return;

        }
    }

    $('#tag-logging').html('<span class="blink">Logging in....</span>');

    // console.log (iisurl + "/cust/login?email=" + txemail + "&pass=" + txtpassword);
    // getting this demo@demo.com&pass=••••••••
    if (txtpassword === "••••••••") {
        return;
    }
    $.ajax({
        url: iisurl + "/cust/login?email=" + txemail + "&pass=" + txtpassword,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        error: function () {
            alert('Network failure. Please try again later.');
            window.location.href = "aiiindex.html";
        },
        success: handleResult
    }); // use promises

    // add cordova progress indicator https://www.npmjs.com/package/cordova-plugin-progress-indicator

    function handleResult(result) {
        var msgObjStr = '';
        if ((result === null) || (result === "")) {
            window.location.href = "aiiindex.html";
            return;
        }

        if (result.webMsg.resultID === 100) {
            msgObjStr = 'System is in maintenance. Please try again later. '
        }
        var version = result.webMsg.ver * 1;
        if (parseFloat(version) > (iis_ver)) {
            msgObjStr = 'Please upgrade to newer version v' + result.webMsg.ver;
        }

        if (msgObjStr.length > 0) {
            msgObjStr = '<p  style="color:red;">' + msgObjStr + '</p>';
            $('#tag-logging').fadeIn().html(msgObjStr);
            return;
        }
        var custObj = result.custObj;

        var custObjStr = JSON.stringify(custObj, null, '\t');

        window.localStorage.setItem(iisODSObjSession, "");

        const iisDataObj = {
            accObjListStr: '',
            stockObjListStr: '',
            stockFundObjListStr: '',
            filterList:''
        }
        var iisDataObjStr = JSON.stringify(iisDataObj, null, '\t');

        var iisWebObj = {'custObjStr': custObjStr, 'iisurlStr': iisurlStr, 'iisDataObjStr': iisDataObjStr};
        window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));

        var webMsg = result.webMsg;
        if (webMsg.resultID == 0) {
            if (custObj != null) {
                var iisMsgSession = "iisMsgSession";
                window.localStorage.setItem(iisMsgSession, "");
                if (custObj.firstname=="D"){
                    window.location.href = "aiapprofile.html"; //"aiaphome.html";
                    return;
                }
                if (custObj.type > 60){
                    window.location.href = "aiiaccount.html";
                    return;                    
                }
                const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
                // window.location.href = "aiapprofile.html";
                // return;

                if (isMobile) {
                    console.log("User is on a mobile device");
                    window.location.href = "aiapprofile.html";
                    return; 
                } else {
                    console.log("User is on a desktop");
                }                  
                window.location.href = "aiapprofile.html";
                // window.location.href = "aiiaccount.html";
                return;

            }
        }
        msgObjStr = "";
        msgObjStr = "Incorrect user email/password. Please try again.";
        if (webMsg.resultID == 2) {
            msgObjStr = "Account in processing. Please check your email and try again later. ";
        }
        if (webMsg.resultID == 1) {
            msgObjStr = "Account is disabled. ";
        }

        if (msgObjStr.length > 0) {
            msgObjStr = '<p  style="color:red;">' + msgObjStr + '</p>';
            $('#tag-logging').fadeIn().html(msgObjStr);
            return;
        }
    }
}

$("#chck-rememberme").click(function () {
    $("#btn-login").attr("disabled", !this.checked);
});


function regFunction(cmdId) {
    if (cmdId == 1) {
        document.getElementById("tag-login").style.display = "none";  //hide
        document.getElementById("tag-newreg").style.display = ""; //show   

    } else if (cmdId == 0) {
        document.getElementById("tag-login").style.display = "";  //hide
        document.getElementById("tag-newreg").style.display = "none"; //show  

    } else if (cmdId == 2) {
        document.getElementById("tag-login").style.display = "none";  //hide
        document.getElementById("tag-newreg").style.display = ""; //show         
    }
    $('#tag-loggin').html('')
    $('#tag-reg').html('')
    window.location.href = "Mlogin.html#loginId";
}

$("#btn-submitnewreg").click(function () {
    $('#tag-reg').html('');
    $('#tag-logging').html('');
    var msgObjStr = "";

    var txtfirstname = document.getElementById("txtregfirst").value;
    var txtlastname = document.getElementById("txtreglast").value;
    var txtemailaddress = document.getElementById("txtregemail").value;
    var txtpassword = document.getElementById("txtregpassword").value;
    var txtpasswordconfirm = document.getElementById("txtretypepassword").value;
    var pricemodelconfirm = document.getElementById("pricemodel").value;
    var txtpromo = document.getElementById("txtpromo").value;
    if (txtpromo != "") {
        txtpromo = txtpromo.trim();
        txtpromo = txtpromo.replace('"', '');
        txtpromo = txtpromo.replace('"', '');
    }
    if ((txtpassword !== txtpasswordconfirm) || (txtpassword.length < 5)) {
        msgObjStr += "Password does not match with confirmed password or less than 5 chars. Please try again.";
        msgObjStr = '<p  style="color:red;">' + msgObjStr + '</p>';
        $('#tag-reg').fadeIn().html(msgObjStr);
        return;

    }

    $('#tag-reg').html('<span class="blink">Processing....</span>');
    // Need (CKey.newRegFlag == true) for new reg
//          SUCC = 1;  EXISTED = 2; FAIL =0;
    $.ajax({
        url: iisurl + "/cust/" + "add" + "?email=" + txtemailaddress + "&pass=" + txtpassword + "&firstName=" + txtfirstname
                + "&lastName=" + txtlastname + "&plan=" + pricemodelconfirm + "&promo=" + txtpromo,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        error: function () {
            window.location.href = "aiiindex.html";
        },
        success: handleResult
    }); // use promises


    function handleResult(result) {
//          SUCC = 1;  EXISTED = 2; NOTOPEN = 3; FAIL =0;
        var webMsg = result.webMsg;

        var resultID = webMsg.resultID;
//        resultID = 3;
        if (resultID == 1) {
            $("#txtusername").val(txtemailaddress);
            $("#txtpassword").val(txtpassword);
            document.getElementById("tag-login").style.display = "";  //show
            document.getElementById("tag-newreg").style.display = "none"; //hide   
            window.location.href = "Mlogin.html#loginId";

            return;
        }
        msgObjStr = "Input Error. Please try again.";
        if (resultID == 2) {
            msgObjStr = "The customer account has already existed. Please try another user email.";
        }
        if (resultID == 3) {
            msgObjStr = "";

            msgObjStr += "We regret to inform you that new registrations are currently closed due to an overwhelming number of subscriptions in our system.";
            msgObjStr += "<br>Rest assured, you remain on our loyal customer list, and we will notify you promptly once new registrations reopen.";
            msgObjStr += '<br>In the meantime, please feel free to log in using a <a href="Mlogindemo.html#loginId">demo account..</a>';
            msgObjStr = '<p  style="color:deepskyblue;">' + msgObjStr + '</p>';
            $('#tag-reg').fadeIn().html(msgObjStr);
            return;
        }
        if (result.webMsg.resultID === 100) {
            msgObjStr = 'System is in maintenance. Please try again later. '
        }
        msgObjStr = '<p  style="color:red;">' + msgObjStr + '</p>';
        $('#tag-reg').fadeIn().html(msgObjStr);
        return;

    }
});

