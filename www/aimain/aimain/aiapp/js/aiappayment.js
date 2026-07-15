const MOCK_API_DELAY = 500;

// Local storage session verification
var iisWebSession = "iisWebSession";
window.localStorage.setItem(iisWebSession, " ");

var iisMsgSession = "iisMsgSession";
window.localStorage.setItem(iisMsgSession, "");

var iisWebInitSession = "iisWebInitSession";
window.localStorage.setItem(iisWebInitSession, "");

var iisODSObjSession = "iisODSObjSession";
window.localStorage.setItem(iisODSObjSession, "");

var iisurlStr = iisurl;
console.log("iisurlStr: " + iisurlStr );

var iisWebObjStr = window.localStorage.getItem(iisWebSession);
if ((iisWebObjStr == null) || (iisWebObjStr.trim().length == 0)) {

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

                var iisWebObj = {'custObjStr': "", 'iisurlStr': iisurlStr, 'iisDataObjStr': ""};
                window.localStorage.setItem(iisWebSession, JSON.stringify(iisWebObj));                
            }
        }

    } catch (err) {
    }
    iisWebObjStr = window.localStorage.getItem(iisWebSession);

}
var iisWebObj = JSON.parse(iisWebObjStr);
var iisurl = iisWebObj.iisurlStr;

var custObjStr = iisWebObj.custObjStr;
if ((custObjStr == null) || (custObjStr.length == 0)) {
}
var custObj = "";


// Helper function to grab URL Query Parameters (?invoice_id=X&custom_id=Y)
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Extract parameters from the page URL
var currentInvoiceId = getUrlParameter('invoice_id'); 
var currentCustomId = getUrlParameter('custom_id');

var mockProfileData = {
    ready: false,
    billingready: false,   
    plan: "",
    payment: 0,
    billing: {
        currentCharge: 0.00,
        currentPlan: 0.00,
        otherservice: 0.00,               
        credit: 0.00,        
        discount: 0.00,
        paymentDate: '',
        paymentAmount: 0.00, 
        currentBalance: 0.00, 
        prevPaymentDate: '',
        prevPaymentAmount: 0.00,
        billID: 0,
        custID: 0,
        status: 0
    }
};

// Async Data Fetching Logic (polling for state verification)
const backend = {
    getBillingData: () => {
        const deferred = $.Deferred();
        let pollIntervalID = null;
        let checks = 0;
        const MAX_CHECKS = 80;

        pollIntervalID = setInterval(() => {
            checks++;
            if (mockProfileData.billingready) {
                clearInterval(pollIntervalID);                
                deferred.resolve(mockProfileData);
                return; 
            }
            if (checks >= MAX_CHECKS) {
                clearInterval(pollIntervalID);               
                deferred.reject({ error: "Timeout: Billing data never became ready." });
                return;
            }
        }, MOCK_API_DELAY);

        return deferred.promise();  
    }
};

function initBillingStatements() {
    // Sync metadata metrics
    var pp = "Basic Plan - 2 stocks";
    if (custObj.substatus === 10) pp = "Standard Plan - 8 stocks";
    else if (custObj.substatus === 20) pp = "Premium Plan - 20 stocks";
    else if (custObj.substatus === 40) pp = "Professional Plan - 40 stocks";
    else if (custObj.substatus === 80) pp = "Enterprise Plan - 80 stocks";
    else if (custObj.substatus === 160) pp = "Corporate Plan - 160 stocks";                        
    else if (custObj.substatus === 90) pp = "API Plan - 500 stocks";
    else if (custObj.substatus === 100) pp = "SRV Plan - 0 stocks";
    mockProfileData.plan = pp;
    mockProfileData.payment = 0;

    // Trigger API request via iisurl definitions
    myInitBillFunction();
}

function myInitBillFunction() {

    $.ajax({
        url: iisurl + "/cust/" + currentCustomId + "/acc/0/billingstatement",
        crossDomain: true,
        cache: false,
        timeout: 120000,
        error: function () {
            showMessage('Network failure loading billing metrics.', 'error');
        },
        success: function (resultBillObjList) {
            if (resultBillObjList && resultBillObjList.length > 0) {
                var billObj = resultBillObjList[0]; // Fetch the most recent statement record
                mockProfileData.billing.billID = billObj.id;
                mockProfileData.billing.custID = billObj.customerid;
      
                var dataSt = billObj.data;
                if (dataSt != null && dataSt !== "") {
  
                    dataSt = dataSt.replaceAll('#', '"');
                    var detailObj = JSON.parse(dataSt);
                    if (detailObj != null) {

                        mockProfileData.billing.currentCharge = billObj.payment;
                        mockProfileData.billing.currentPlan = detailObj.curPaym || 0.00;
                        mockProfileData.billing.otherservice = detailObj.service || 0.00;
                        mockProfileData.billing.credit = detailObj.credit || 0.00;
                        mockProfileData.billing.discount = detailObj.disc || 0.00;
                        mockProfileData.billing.paymentDate = billObj.updatedatel ? new Date(billObj.updatedatel * 1000).toISOString() : new Date().toISOString();
                        mockProfileData.billing.currentBalance = billObj.balance || 0.00;
                        mockProfileData.billing.paymentAmount = billObj.status === 2 ? billObj.payment : 0.00;
                        mockProfileData.billing.status = billObj.status
                        mockProfileData.payment = billObj.payment;
                        
                    }
                }
            }
  
            mockProfileData.billingready = true;
            renderStatementsPage();
        }
    });
}

function renderStatementsPage() {
    $('#main-content').html(showLoading());
    backend.getBillingData().done(data => {
        $('#main-content').html(generateStatementsHtml(data));
        initPayPalSmartButtons();
    }).fail(() => {
        $('#main-content').html('<p class="text-red-500 text-center p-8">Failed to download billing logs.</p>');
    });
}

function generateStatementsHtml(data) {
    const { currentCharge, currentPlan, otherservice, credit, discount, paymentDate, paymentAmount, currentBalance } = data.billing;
    const showPayPalButton = (paymentAmount > currentBalance) ;
    return `
        <div class="p-4 sm:p-6 lg:p-8">
            <div class="bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
                <h3 class="text-xl font-semibold text-gray-300 mb-4">
                    <span class="mr-2">💳</span> Billing Overview (${paymentDate && paymentDate !== '' ? `${formatDate(paymentDate)}` : ''})
                </h3>
                <div class="space-y-3 text-sm">
                    <div class="flex justify-between py-2 border-b border-gray-700">
                        <p class="text-xl font-bold text-gray-300">Invoice Amount</p>
                        <p class="text-xl font-bold text-gray-300" >
                            ${formatCurrency(currentCharge)}
                        </p>                    
                    </div>                

                    <div class="flex justify-between py-2 border-b border-gray-700">
                        <p class="text-gray-400">Current Plan Rate (${data.plan})</p>
                        <p class="font-semibold text-white">${formatCurrency(currentPlan)}</p>
                    </div>
                    <div class="flex justify-between py-2 border-b border-gray-700">
                        <p class="text-gray-400">Other Service Fees</p>
                        <p class="font-semibold text-white">${formatCurrency(otherservice)}</p>
                    </div>
                    <div class="flex justify-between py-2 border-b border-gray-700">
                        <p class="text-gray-400">Credits Applied</p>
                        <p class="font-semibold text-green-500">(${formatCurrency(credit)})</p>
                    </div>
                    <div class="flex justify-between py-2 border-b border-gray-700">
                        <p class="text-gray-400">Applied Discount</p>
                        <p class="font-semibold text-green-500">(${formatCurrency(discount)})</p>
                    </div>
                </div>
                <hr class="border-gray-700">

                <div class="flex justify-between pt-2">
                    <p class="text-xl font-bold text-sky-300">Current Balance</p>
                    <p class="text-xl font-bold ${currentBalance >= 0 ? 'text-green-300' : 'text-red-300'}">
                        ${formatCurrency(currentBalance)}
                    </p>
                </div>
                ${showPayPalButton ? `
                    <div class="mt-6 pt-4 border-t border-gray-700">
                        <p class="text-xs text-grey-400 mb-3 text-center">Complete your outstanding dues securely via PayPal processing.</p>
                        <div id="paypal-button-container" class="w-full max-w-xs mx-auto"></div>                        
                        <p class="text-sm text-red-400 mb-3 text-center">Please allow a few moments for the transaction to update in our system before refreshing the page to view your updated balance.</p>
                    </div>
                ` : `
                    <div class="mt-4 p-3 bg-green-900/30 border border-green-800 rounded-lg text-center">
                        <p class="text-sm text-green-400 font-medium">✓ Account is fully paid. No active invoice outstanding.</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

function initPayPalSmartButtons() {
    $('#paypal-button-container').empty();
    if (typeof paypal !== 'undefined' && $('#paypal-button-container').length > 0) {
        
        var uniqueStamp = new Date().getTime().toString().slice(-6);
        var bill_id = currentInvoiceId + "-" + uniqueStamp;

        var cust_id = String(currentCustomId || "0").trim();
        var rawPayment = parseFloat(mockProfileData.payment || 0);
        var finalValueStr = isNaN(rawPayment) || rawPayment <= 0 ? "1.00" : rawPayment.toFixed(2);

        // DEBUG WATCHDOG: View your browser console to verify your values match
        console.log("=== PAYPAL SEND CONFIG PARAMETERS ===");
        console.log("Invoice ID : ", bill_id);
        console.log("Custom Cust ID : ", cust_id);
        console.log("Payment Amount     : ", finalValueStr);
        console.log("=====================================");

        paypal.Buttons({
            style: {
                layout: 'vertical',
                color:  'blue',
                shape:  'rect',
                label:  'paypal'
            },

            createOrder: function(data, actions) {
                return actions.order.create({
                    "intent": "CAPTURE",
                    "purchase_units": [
                        {
                            "reference_id": "default",
                            "invoice_id": bill_id, 
                            "custom_id": cust_id, 
                            "amount": {
                                "currency_code": "CAD",
                                "value": finalValueStr
                            }
                        }
                    ]
                });
            },
            onApprove: function(data, actions) {
                // Instantly capture the transaction on PayPal's cloud infrastructure
                return actions.order.capture().then(function(details) {
                    
                    // Inform the user immediately as the overlay shuts down
                    showMessage('Payment completed successfully!', 'success');
                    
                    // Refresh localized UI accounts/billing charts seamlessly 
                    // Wait 1 second (1000ms) for the success message to be readable before reloading
                    setTimeout(function() {
                        window.location.reload();
                    }, 5000);
                    
                    // Returns true to instantly close the PayPal popup screen cleanly
                    return true; 
                });
            },
            // the fetch is for debug only, 
            // need to remove for production. need to remove for production. need to remove for production
            // onApprove: function(data, actions) {
            //     return actions.order.capture().then(function(details) {
                    
            //         showMessage('Payment completed by ' + details.payer.name.given_name, 'success');
                    
            //         var cleanUrl = iisurl.endsWith('/') ? iisurl + 'api/v1/callback/ppwebhook' : iisurl + '/api/v1/callback/ppwebhook';

            //         // // Asynchronous background execution (allows instant window close)
            //          fetch(cleanUrl, {
            //             method: 'POST',
            //             headers: { 'Content-Type': 'application/json' },
            //             body: JSON.stringify({
            //                 event_type: "CHECKOUT.ORDER.APPROVED",
            //                 status: "APPROVED",
            //                 resource: {
            //                     status: "APPROVED",
            //                     purchase_units: [{
            //                         invoice_id: bill_id, 
            //                         custom_id: cust_id, 
            //                         amount: {
            //                             currency_code: "CAD",
            //                             value: finalValueStr
            //                         }
            //                     }]
            //                 }
            //             })
            //         }).catch(function(err) {
            //             console.error('Async tracking broadcast error:', err);
            //         });
            //         if (typeof initMainAcc === 'function') {
            //             initMainAcc(); 
            //         }
                    
            //         return true; 
            //     });
            // },
            // the fetch is for debug only, 
            // need to remove for production. need to remove for production. need to remove for production
            
            onError: function(err) {
                console.error('PayPal Core Exception Caught:', err);
                showMessage('An error occurred during checkout validation.', 'error');
            }
        }).render('#paypal-button-container');
    } else {
        console.error('PayPal SDK script is missing or has not loaded yet.');
    }
}


// --- Helper Utilities ---
function formatCurrency(val) { return Number(val).toLocaleString('en-US', { style: 'currency', currency: 'USD' }); }
function formatDate(dateStr) { return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
function showLoading() { return `<div class="flex flex-col items-center justify-center min-h-[200px]"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-400 mb-2"></div><p class="text-gray-400 text-sm">Loading Statement Data...</p></div>`; }

function showMessage(message, type = 'error') {
    const bgColor = type === 'error' ? 'bg-red-600' : 'bg-green-600';
    const $box = $(`<div class="fixed top-4 right-4 ${bgColor} text-white p-3 rounded-lg shadow-xl z-[200]">${message}</div>`);
    $('body').append($box);
    setTimeout(() => { $box.fadeOut(function() { $(this).remove(); }); }, 3000);
}

$(document).ready(function() {
    initBillingStatements();
    $('#refresh-button').on('click', () => { window.location.reload(); });
    $('#back-button').on('click', () => { window.location.href = "aiapprofile.html"; });
    $('.nav-item').on('click', function() { window.location.href = $(this).data('page') + ".html"; });
});