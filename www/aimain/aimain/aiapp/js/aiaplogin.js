const MOCK_API_DELAY = 500;
let isLoggedIn = false; // Initial state: not logged in

/////////////////////////////basic local storage
/////////////////////////////basic local storage

var iisWebSession = "iisWebSession";
window.localStorage.setItem(iisWebSession, " ");

var iisMsgSession = "iisMsgSession";
window.localStorage.setItem(iisMsgSession, "");

var iisWebInitSession = "iisWebInitSession";
window.localStorage.setItem(iisWebInitSession, "");

var iisODSObjSession = "iisODSObjSession";

var iisurlStr = iisurl;

var iisWebObj = {'myMenuId': 1}
var iisWebM = "iisWebM";
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

/////////////////////////////MLogin local storage
/////////////////////////////MLogin local storage
// var iisWebSession = "iisWebSession";

// var iisMsgSession = "iisMsgSession";

// var iisurlStr = iisurl;

// var iisWebInitSession = "iisWebInitSession";

// var iisODSObjSession = "iisODSObjSession";

// var iisWebInitObjStr = window.localStorage.getItem(iisWebInitSession);
// if (iisWebInitObjStr.length > 0) {
//     var iisWebInitObj = JSON.parse(iisWebInitObjStr);
//     var iisurlInitStr = iisWebInitObj.iisurlStr;
//     if (iisurlInitStr.length > 0) {
//         iisurlStr = iisurlInitStr;
//         iisurl = iisurlInitStr;
//     }
// }



function initMainAcc(data) {
    /////////////////////////////account local storage
    // var iisWebSession = "iisWebSession";
    iisWebObjStr = window.localStorage.getItem(iisWebSession);
    iisWebObj = JSON.parse(iisWebObjStr);

    //var GOBLE_Filter = ["IUSB,ERX,ERY,FAS,FAZ,YINN,YANG,CHAU,TECL,TECS,HOU.TO,HOD.TO,SPXL,SPXS,DRN,DRV,WEBL,WEBS,DGP"];
    //var GOBLE_Filter = ["IUSB,ERX,FAS,YINN,TECL,HOU.TO,SPXL,DRN,WEBL,DGP"];
    var GOBLE_Filter = ["SPY,DIA,FAS,QQQ,DGP"];

    // var iisurlStr = iisWebObj.iisurlStr;
    // iisurl = iisurlStr;

    var custObjStr = iisWebObj.custObjStr;
    if ((custObjStr == null) || (custObjStr.length == 0)) {
        // window.location.href = "aiiend.html";
        return;
    }
    var custObj = JSON.parse(custObjStr);

    var iisDataObjStr = iisWebObj.iisDataObjStr;
    if ((iisDataObjStr == null) || (iisDataObjStr.length == 0)) {
        // window.location.href = "aiiend.html";
        return;
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

    var filterList = "";
    filterList = iisDataObj.filterList;
    if (filterList == undefined) {
        filterList = "";
    }
    var iisODSObjSession = "iisODSObjSession";
    var iisODSObjStr = window.localStorage.getItem(iisODSObjSession);
    if ((iisODSObjStr == null) || (iisODSObjStr.length == 0)) {
        // initialize ODS data
        // initialize ODS data
        const iisODSObj = {// operation data src
            custT: 0,
            accId: 0,
            accfundId: 0,
            stockId: 0,
            stockFundId: 0,
            stockFmgrId: 0,
            sysDevOp: false,
            accdevId: 0,
            admcust: '',
            admLStr: '',
            admPagenum: 0,
            admCmd: '',
            admParm: '',
            debug01: false,
            debug02: false,
            debug03: false,
            custChange: true,
            userN: '',
            trName: 'TR_ACC',
            STnameLStr: '',
            STPageNum: -1,
            ctabPlan: 0,
            ctabSt: 0,
            ctabStnn: 0,
            ctabfun: 0,
            trM1: '',
            trM1TR: 0,
            trM1St: '',

            trM2: '',
            trM2TR: 0,
            trM2St: '',
            scribLStr: '',
            trFilter: '',
            commOLStr: '',
            nameRpt: '',
            yearRpt: 0

        }
    //////Goble variable

        var defFilter = [];
        if ((custObj.id == 3) || (custObj.id == 1)) { // demo acc
            defFilter = GOBLE_Filter;
        }
        if (filterList.length === 0) {
            filterList = defFilter;
        }
        if (filterList.length > 0) {
            if (!Array.isArray(filterList)) {
                // If it's a string, wrap it in an array. 
                // If it's already something else, this still ensures it becomes an array.
                filterList = [filterList];
            }
        }
        iisODSObj.trFilter = filterList;

        var filterinput = "";
        if (filterList.length > 0) {
            filterinput = filterList.join(",");
        }
        // document.getElementById("filtersymid").setAttribute('value', filterinput);
        iisODSObj.custT = custObj.type;
        var userN = custObj.firstname;
        if (userN.length == 0) {
            var userNL = custObj.email.split("@");
            userN = userNL[0];
        }
        if (userN.length == 0) {
            userN = "Private";
        }
        iisODSObj.userN = userN;
        var iisODSObjStr = JSON.stringify(iisODSObj, null, '\t');
        window.localStorage.setItem(iisODSObjSession, iisODSObjStr);
    } else {
        var defFilter = [];
        if (custObj.id == 3) { // demo acc
            defFilter = GOBLE_Filter;
        }
        if (filterList.length === 0) {
            filterList = defFilter;
        }

        var filterinput = "";
        if (filterList.length > 0) {
            filterinput = filterList.join(",");
        }
        // document.getElementById("filtersymid").setAttribute('value', filterinput);
    }
    // initialize ODS data

    var iisODSObj = JSON.parse(iisODSObjStr);
    //////Goble variable
    var userN = iisODSObj.userN;
    var custT = iisODSObj.custT;
    var sysDevOp = iisODSObj.sysDevOp;
    var debug01 = iisODSObj.debug01;
    var debug02 = iisODSObj.debug02;
    var debug03 = iisODSObj.debug03;
    var custChange = iisODSObj.custChange;
    var scribLStr = iisODSObj.scribLStr;
    var trName = iisODSObj.trName;
    var trM1 = iisODSObj.trM1;
    var trM1TR = iisODSObj.trM1TR;
    var trM1St = iisODSObj.trM1St;
    var trM2 = iisODSObj.trM2;
    var trM2TR = iisODSObj.trM2TR;
    var trM2St = iisODSObj.trM2St;
    var commOLStr = iisODSObj.commOLStr;
    var stockIdOLStr = iisODSObj.stockIdOLStr;
    //////Goble variable


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
    data.firstName = custObj.firstname
    data.lastName = custObj.lastname
    data.email = custObj.email
    data.memberSince = custObj.startdate
}

// UPDATED: Added billing data
var mockProfileData = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    memberSince: '2022-03-15',
    accountType: 'Premium',
    portfolioValue: 4056.52,
    totalReturn: -40.11,
    totalReturnPercent: -1.03,
    riskTolerance: 'Medium',
    favoriteStocks: ['AAPL', 'TSLA', 'MSFT', 'NVDA'],
    recentActivity: [
        { type: 'BUY', symbol: 'AAPL', shares: 5, price: 182.50, date: '2023-10-25', time: '14:30' },
        { type: 'SELL', symbol: 'TSLA', shares: 2, price: 175.20, date: '2023-10-24', time: '11:15' },
        { type: 'BUY', symbol: 'MSFT', shares: 3, price: 405.80, date: '2023-10-23', time: '09:45' },
        { type: 'DIVIDEND', symbol: 'JPM', amount: 12.50, date: '2023-10-20', time: '08:00' }
    ],
    // NEW: Mock billing data
    billing: {
        currentCharge: 99.99,
        discount: 10.00,
        paymentDate: '2024-10-01',
        paymentAmount: 89.99, // Net charge paid
        currentBalance: 0.00 // Assuming full payment was made
    }
};

const backend = {
    getProfileData: () => {
        const deferred = $.Deferred();
        setTimeout(() => {
            // Resolve with the current state of mockProfileData
            deferred.resolve(mockProfileData);
        }, MOCK_API_DELAY);
        return deferred.promise();
    },
    // Mock function to update profile data
    updateProfileData: (updates) => {
        const deferred = $.Deferred();
        setTimeout(() => {
            // Update global mock data properties
            mockProfileData.firstName = updates.firstName;
            mockProfileData.lastName = updates.lastName;
            
            if (updates.passwordChanged) {
                console.log("Mock: Password updated.");
            }
            deferred.resolve({ success: true, message: 'Profile updated successfully!' });
        }, MOCK_API_DELAY);
        return deferred.promise();
    }
};

// --- Utility Functions ---

function showMessage(message, type = 'error') {
    const bgColor = type === 'error' ? 'bg-red-600' : 'bg-green-600';
    const $messageBox = $(`
        <div id="custom-message" class="fixed top-2 right-2 ${bgColor} text-white p-3 rounded-lg shadow-xl z-50 transition-transform duration-300 transform translate-x-full">
            ${message}
        </div>
    `);
    
    // Remove any existing messages
    $('#custom-message').remove();
    $('body').append($messageBox);
    
    // Animate in
    setTimeout(() => {
        $messageBox.removeClass('translate-x-full');
    }, 10);

    // Animate out and remove
    setTimeout(() => {
        $messageBox.addClass('translate-x-full');
        $messageBox.on('transitionend', () => $messageBox.remove());
    }, 3000);
}

function showLoading() {
    // Spinner size reduced from h-8 w-8 to h-5 w-5 for a smaller visual footprint
    return (`
        <div class="flex flex-col items-center justify-center h-full min-h-[100px] p-2">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-400 mb-2"></div>
            <p class="text-gray-400 text-sm">Waiting for the data from the backend...</p>
        </div>
    `);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// --- Auth Functions ---

function handleLogin() {
    const email = $('#login-email').val();
    const password = $('#login-password').val();

    if (!email || !password) {
        showMessage('Please enter both email and password.');
        return;
    }
    txemail = email;
    txtpassword = password;
    $.ajax({
        url: iisurl + "/cust/login?email=" + txemail + "&pass=" + txtpassword,
        crossDomain: true,
        cache: false,
        timeout: INT_TIMOUT, //120 sec,
        error: function () {
            alert('Network failure. Please try again later.');
            // window.location.href = "aiiindex.html";
        },
        success: handleResult
    }); // use promises

    function handleResult(result) {
        var msgObjStr = '';
        if ((result === null) || (result === "")) {
            // window.location.href = "aiiindex.html";
            isLoggedIn = false;
            renderProfilePage(); // Triggers loading state
            showMessage('Login failed!', 'error');            
            return;e
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

                window.location.href = "aiapprofile.html";
                return;

            }
        }
        msgObjStr = "";
        msgObjStr = "Incorrect user email/password. Please try again.";
        if (webMsg.resultID == 2) {
            msgObjStr = "Account in processing. Please try again later. ";
        }
        if (webMsg.resultID == 1) {
            msgObjStr = "Account is disabled. ";
        }

        isLoggedIn = false;
        renderProfilePage(); // Triggers loading state
        showMessage(msgObjStr, 'error');            
        return;
        // if (msgObjStr.length > 0) {
        //     msgObjStr = '<p  style="color:red;">' + msgObjStr + '</p>';
        //     $('#tag-logging').fadeIn().html(msgObjStr);
        //     return;
        // }
    }
    // // Mock successful login
    // isLoggedIn = true;
    // renderProfilePage(); // Triggers loading state
    // showMessage('Login successful!', 'success');
}

function handleRegister() {
    const email = $('#login-email').val();
    const password = $('#login-password').val();

    if (!email || !password) {
        showMessage('Please fill in credentials to register.', 'error');
        return;
    }

    // Mock registration process
    isLoggedIn = true;
    renderProfilePage();
    showMessage('Mock Registration successful! Logging you in.', 'success');
}

function handleLogout() {
    isLoggedIn = false;
    renderProfilePage();
    showMessage('Logged out successfully.', 'success');
}

function handleConsentChange() {
    const isChecked = $('#disclaimer-check').is(':checked');
    const $loginButton = $('#login-button');
    const $registerButton = $('#register-button');

    if (isChecked) {
        $loginButton.removeClass('btn-disabled');
        $registerButton.removeClass('btn-disabled');
    } else {
        $loginButton.addClass('btn-disabled');
        $registerButton.addClass('btn-disabled');
    }
}

function attachLoginEvents() {
    // Attach real-time consent change listener
    $('#disclaimer-check').off('change').on('change', handleConsentChange);
    
    // Initial state check 
    handleConsentChange();

    // Attach Login/Register handlers
    $('#login-button').off('click').on('click', handleLogin);

    $('#register-button').off('click').on('click', handleRegister);
}

// --- Edit Profile Logic ---

function handleEditProfile() {
    // Renders the edit form
    $('#main-content').html(renderEditProfileForm());
    attachEditProfileEvents();
}

function handleCancelEdit() {
    // Re-render the main profile page
    renderProfilePage();
}

function attachEditProfileEvents() {
    $('#edit-profile-form').off('submit').on('submit', function(e) {
        e.preventDefault();
        handleSaveProfile();
    });
    $('#cancel-edit-button').off('click').on('click', handleCancelEdit);
    $('#cancel-edit-button-header').off('click').on('click', handleCancelEdit); // Also attach to header back button
}

function handleSaveProfile() {
    const firstName = $('#edit-first-name').val().trim();
    const lastName = $('#edit-last-name').val().trim();
    const newPassword = $('#edit-new-password').val();
    const confirmPassword = $('#edit-confirm-password').val();

    if (!firstName || !lastName) {
        showMessage('First Name and Last Name cannot be empty.', 'error');
        return;
    }

    if (newPassword && newPassword.length < 6) {
        showMessage('New Password must be at least 6 characters.', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage('New Password and Confirm Password do not match.', 'error');
        return;
    }

    // Prepare updates payload
    const updates = { firstName, lastName, passwordChanged: false };
    if (newPassword) {
        updates.passwordChanged = true; 
    }

    // Visually show loading while waiting for mock API response
    $('#edit-profile-form-container').html(showLoading()); 

    backend.updateProfileData(updates).done((response) => {
        showMessage(response.message || 'Profile updated!', 'success');
        renderProfilePage(); // Re-render the updated profile
    }).fail(() => {
        showMessage('Failed to update profile.', 'error');
        renderProfilePage(); // Return to profile page on error
    });
}

// --- Account Statements Logic (NEW) ---

function handleAccountStatements() {
    $('#main-content').html(showLoading()); 
    
    // Re-use getProfileData to fetch the mock billing object
    backend.getProfileData().done(data => {
        $('#main-content').html(renderAccountStatementsHtml(data));
        // Attach back button event to return to the main profile view
        $('#back-to-profile').off('click').on('click', renderProfilePage);
    }).fail(() => {
        showMessage('Failed to load billing data.', 'error');
        renderProfilePage(); // Go back to profile on failure
    });
}

// Renders the billing statement view
function renderAccountStatementsHtml(data) {
    const { currentCharge, discount, paymentDate, paymentAmount, currentBalance } = data.billing;
    const netCharge = currentCharge - discount;

    return `
        <div class="p-4 sm:p-6 lg:p-8">
            <div class="flex items-center mb-6 border-b border-gray-700 pb-3">
                <!-- Back button using the left arrow symbol -->
                <button id="back-to-profile" class="text-sky-400 mr-4 text-3xl font-light leading-none hover:text-sky-300 transition-colors">&larr;</button>
                <h2 class="text-2xl font-bold text-white">Account Statements</h2>
            </div>
            
            <div class="bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
                <h3 class="text-xl font-semibold text-gray-300 mb-4">Standard Billing (Oct 2024)</h3>

                <div class="space-y-3 text-sm">
                    <!-- Current Charge -->
                    <div class="flex justify-between py-2 border-b border-gray-700">
                        <p class="text-gray-400">Current Subscription Charge</p>
                        <p class="font-semibold text-white">${formatCurrency(currentCharge)}</p>
                    </div>

                    <!-- Discount -->
                    <div class="flex justify-between py-2 border-b border-gray-700">
                        <p class="text-gray-400">Promotional Discount</p>
                        <p class="font-semibold text-green-500">(${formatCurrency(discount)})</p>
                    </div>

                    <!-- Net Due / Subtotal -->
                    <div class="flex justify-between py-2 border-b border-gray-600 font-bold">
                        <p class="text-gray-300">Net Amount Due</p>
                        <p class="text-white">${formatCurrency(netCharge)}</p>
                    </div>
                    
                    <!-- Payment -->
                    <div class="flex justify-between pt-2 pb-1">
                        <p class="text-gray-400">Last Payment Made (${formatDate(paymentDate)})</p>
                        <p class="font-semibold text-green-500">-${formatCurrency(paymentAmount)}</p>
                    </div>
                </div>

                <hr class="border-gray-700">

                <!-- Balance -->
                <div class="flex justify-between pt-2">
                    <p class="text-xl font-bold text-sky-400">Current Balance</p>
                    <p class="text-xl font-bold ${currentBalance === 0 ? 'text-green-500' : 'text-red-500'}">
                        ${formatCurrency(currentBalance)}
                    </p>
                </div>

            </div>

            <p class="text-xs text-gray-500 mt-6 text-center">
                This statement reflects your current month's charges and payment activity as of today.
            </p>
        </div>
    `;
}

// --- Page Rendering Functions ---

function renderLoginPage() {
    // Start with both buttons disabled by adding the btn-disabled class
    const loginButtonClasses = "w-full py-3 text-lg font-semibold bg-sky-600 hover:bg-sky-700 rounded-xl transition duration-200 shadow-lg shadow-sky-900/50 btn-disabled";
    const registerButtonClasses = "w-full py-3 text-lg font-semibold bg-gray-800 hover:bg-gray-700 rounded-xl transition duration-200 border border-gray-700 btn-disabled";

    return `
        <div class="flex flex-col items-center min-h-full text-center p-6">
            <div class="mb-8 mt-16">
                <div class="text-3xl font-bold text-white tracking-widest flex items-center justify-center">
                    <span class="w-2 h-2 rounded-full bg-sky-400 mr-1 block animate-pulse"></span>
                    <span class="w-2 h-2 rounded-full bg-sky-400 mr-2 block animate-pulse animation-delay-300"></span>
                    Stocks
                </div>
                <h1 class="text-5xl font-extrabold text-sky-400 my-2">AIIWeb</h1>
                <p class="text-gray-400 text-sm">On the go investing.</p>
                <div class="w-12 h-1 bg-sky-400 mx-auto mt-3 rounded-full"></div>
            </div>

            <div class="w-full max-w-sm space-y-4 mb-20">
                <input type="email" id="login-email" placeholder="Email Address" 
                    class="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500 text-white transition duration-200">
                <input type="password" id="login-password" placeholder="Password" 
                    class="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500 text-white transition duration-200">
                
                <div class="text-left pt-2">
                    <label class="inline-flex items-start cursor-pointer">
                        <!-- Checkbox is now h-5 w-5 for better touch target size -->
                        <input type="checkbox" id="disclaimer-check" class="form-checkbox h-5 w-5 mt-0.5 text-sky-500 bg-gray-800 border-gray-600 rounded-sm">
                        <p class="text-xs text-gray-400 ml-3 leading-snug">
                            I acknowledge that this application provides <strong>simulation and informational content</strong> only. It is <strong>not financial advice</strong>, and I understand that <strong">investing involves risk</strong>, including the possible loss of principal. I will consult a qualified financial professional before making any actual investment decisions.
                        </p>
                    </label>
                </div>

                <button id="login-button" class="${loginButtonClasses}">
                    Log In
                </button>
                <button id="register-button" class="${registerButtonClasses}">
                    New Register
                </button>

                <p class="text-sm text-gray-500 pt-3">
                    Forgot Password? (Mock)
                </p>
            </div>
        </div>
    `;
}

// Form for editing profile details
function renderEditProfileForm() {

    const { firstName, lastName, email } = mockProfileData;

    return `
        <div id="edit-profile-form-container" class="p-4 sm:p-6 lg:p-8">
            <div class="flex items-center mb-6 border-b border-gray-700 pb-3">
                <!-- Back button using the left arrow symbol -->
                <button id="cancel-edit-button-header" class="text-sky-400 mr-4 text-3xl font-light leading-none hover:text-sky-300 transition-colors">&larr;</button>
                <h2 class="text-2xl font-bold text-white">Edit Profile</h2>
            </div>
            <form id="edit-profile-form" class="space-y-6">
                
                <!-- First Name -->
                <div>
                    <label for="edit-first-name" class="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                    <input type="text" id="edit-first-name" value="${firstName}" required
                        class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-sky-500 focus:border-sky-500 text-white transition duration-200">
                </div>

                <!-- Last Name -->
                <div>
                    <label for="edit-last-name" class="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                    <input type="text" id="edit-last-name" value="${lastName}" required
                        class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-sky-500 focus:border-sky-500 text-white transition duration-200">
                </div>
                
                <!-- Email (Read-only for context) -->
                <div class="opacity-70">
                    <label for="edit-email" class="block text-sm font-medium text-gray-400 mb-1">Email (Cannot be changed)</label>
                    <input type="email" id="edit-email" value="${email}" disabled
                        class="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-500">
                </div>

                <hr class="border-gray-700">

                <p class="text-sm text-gray-500">Only fill in the fields below if you want to change your password (min 6 characters).</p>

                <!-- New Password -->
                <div>
                    <label for="edit-new-password" class="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                    <input type="password" id="edit-new-password" placeholder="Leave blank to keep current password"
                        class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-sky-500 focus:border-sky-500 text-white transition duration-200">
                </div>

                <!-- Confirm Password -->
                <div>
                    <label for="edit-confirm-password" class="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                    <input type="password" id="edit-confirm-password" placeholder="Retype new password"
                        class="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-sky-500 focus:border-sky-500 text-white transition duration-200">
                </div>

                <div class="flex space-x-4 pt-4">
                    <button type="button" id="cancel-edit-button" class="w-full py-3 text-lg font-semibold bg-gray-700 hover:bg-gray-600 rounded-xl transition duration-200">
                        Cancel
                    </button>
                    <button type="submit" class="w-full py-3 text-lg font-semibold bg-green-600 hover:bg-green-700 rounded-xl transition duration-200 shadow-lg shadow-green-900/50">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    `;
}

function generateProfileHtml(data) {
    const fullName = `${data.firstName} ${data.lastName}`; // Use new fields
    const initials = data.firstName.charAt(0) + data.lastName.charAt(0); // Use new fields
    
    const favoritesHtml = data.favoriteStocks.map(stock => `
        <div class="bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-600 transition">
            <span class="text-sm font-semibold">${stock}</span>
        </div>
    `).join('');

    const activityHtml = data.recentActivity.map(activity => {
        let activityText = '';
        let activityClass = 'text-gray-400';
        
        if (activity.type === 'BUY') {
            activityText = `Bought ${activity.shares} shares of ${activity.symbol} at ${formatCurrency(activity.price)}`;
            activityClass = 'text-green-500';
        } else if (activity.type === 'SELL') {
            activityText = `Sold ${activity.shares} shares of ${activity.symbol} at ${formatCurrency(activity.price)}`;
            activityClass = 'text-red-500';
        } else if (activity.type === 'DIVIDEND') {
            activityText = `Dividend from ${activity.symbol}: ${formatCurrency(activity.amount)}`;
            activityClass = 'text-sky-400';
        }

        return `
            <div class="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                <div>
                    <p class="text-sm ${activityClass}">${activityText}</p>
                    <p class="text-xs text-gray-500">${formatDate(activity.date)} at ${activity.time}</p>
                </div>
                <span class="text-gray-400 text-lg">&gt;</span>
            </div>
        `;
    }).join('');

    return `
        <div class="p-3">
            <div class="flex flex-col items-center mb-6">
                <div class="w-20 h-20 bg-sky-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                    ${initials}
                </div>
                <h1 class="text-xl font-bold">${fullName}</h1>
                <p class="text-gray-400 text-sm">${data.email}</p>
                <div class="mt-2 px-3 py-1 bg-sky-600 text-white text-xs rounded-full">
                    ${data.accountType} Member
                </div>
            </div>

            <div class="bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
                <h2 class="text-base font-semibold text-gray-300 mb-3">Account Summary</h2>
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p class="text-gray-400">Member Since</p>
                        <p class="font-semibold">${formatDate(data.memberSince)}</p>
                    </div>
                    <div>
                        <p class="text-gray-400">Risk Tolerance</p>
                        <p class="font-semibold">${data.riskTolerance}</p>
                    </div>
                    <div>
                        <p class="text-gray-400">Portfolio Value</p>
                        <p class="font-semibold">${formatCurrency(data.portfolioValue)}</p>
                    </div>
                    <div>
                        <p class="text-gray-400">Total Return</p>
                        <p class="font-semibold ${data.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}">
                            ${data.totalReturn >= 0 ? '+' : ''}${formatCurrency(data.totalReturn)}
                        </p>
                    </div>
                </div>
            </div>

            <div class="bg-gray-800 p-4 rounded-lg shadow-sm mb-4">
                <h2 class="text-base font-semibold text-gray-300 mb-3">Favorite Stocks</h2>
                <div id="favorite-stocks" class="flex flex-wrap gap-2">
                    ${favoritesHtml}
                </div>
            </div>

            <div class="bg-gray-800 p-4 rounded-lg shadow-sm">
                <div class="flex justify-between items-center mb-3">
                    <h2 class="text-base font-semibold text-gray-300">Recent Activity</h2>
                    <span class="text-sky-400 text-sm cursor-pointer">View All &gt;</span>
                </div>
                <div id="recent-activity" class="space-y-3">
                    ${activityHtml}
                </div>
            </div>

            <div class="mt-4">
                <div class="space-y-2 mb-4">
                    <!-- Edit Profile Button -->
                    <button id="edit-profile-button" class="w-full py-3 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition text-center">
                        Edit Profile
                    </button>
                    <!-- Account Statements Button (Handler attached below) -->
                    <button id="account-statements-button" class="w-full py-3 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition text-center">
                        Account Statements
                    </button>
                </div>
                
                <!-- Separated Destructive Action -->
                <div class="pt-4 border-t border-gray-700">
                    <button id="logout-button" class="w-full py-3 text-sm bg-red-600 hover:bg-red-700 rounded-lg transition text-center">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    `;
}

// The main rendering function, handles the conditional view
function renderProfilePage() {
    if (isLoggedIn) {
        // Show profile content
        $('#main-content').html(showLoading()); 
        backend.getProfileData().done(data => {
            initMainAcc(data);
            $('#main-content').html(generateProfileHtml(data));
            // Attach event handlers for the profile view
            $('#logout-button').off('click').on('click', handleLogout); 
            $('#edit-profile-button').off('click').on('click', handleEditProfile); 
            // NEW: Attach handler for Account Statements
            $('#account-statements-button').off('click').on('click', handleAccountStatements);
        }).fail(() => {
            $('#main-content').html('<p class="text-red-500 text-center p-8">Failed to load profile data.</p>');
        });
    } else {
        // Show login page
        $('#main-content').html(renderLoginPage());
        attachLoginEvents();
    }
}

$(document).ready(function() {
    $('.nav-item').on('click', function() {
        const page = $(this).data('page');
        // Check if the user is trying to navigate away while logged in (optional check, but good practice)
        if (isLoggedIn && page !== 'aiapprofile') { 
            // In a real app, this would use a router, but for a mock, we simulate navigation.
            // For this environment, we prevent navigation away from the single file.
            // If this were a multi-page app, we'd go to window.location.href = page + '.html';
            console.log(`Navigating to ${page}.html (Mocked)`);
        } else if (!isLoggedIn && page !== 'aiapprofile') {
            console.log(`Cannot navigate until logged in.`);
            showMessage('Please log in first.');
        }
        
        // Since this is the dprofile.html file, we just re-render the profile view 
         // Navigation handler (simulates page change)
        $('.nav-item').on('click', function() {
               const page = $(this).data('page');
               if (page !== 'dprofile') {
                   window.location.href = page + '.html';
               }
           });               
    });

    renderProfilePage();
});