
var iis_ver = 2.0; // need to match with CKey iis_ver
var iisurl_127 = "http://127.0.0.1:8080"; //https://iiswebsrv.herokuapp.com/";

var iisurl_VM = "http://192.168.68.52:5000";  
var iisurl_ORACLE = "http://40.233.87.254:8081";
var iisurl_ORACLE_JAVA = "http://132.145.102.207:8081";
var iisurl_RENDER = "https://iiswebapi.onrender.com";
var iisurl_LOCAL = "http://localhost:8081"; //"http://localhost:5000"; //"http://localhost:8081";
var iisurl = iisurl_LOCAL; //iisurl_LOCAL;  //iisurl_ORACLE; //iisurl_LOCAL; 


var android_app1 = false;
var android_app2 = false;

var iisurl_RENDER_SRV = "";

///// this is for android app section
//iisurl = iisurl_Back4App;
//var android_app1 = false;
//iisurl_RENDER_SRV = "https://iiswebclt1.onrender.com";
iisurl = iisurl_ORACLE;
android_app1 = true;
//iisurl_RENDER_SRV = "https://iiswebclt1.onrender.com";
///// this is for android app section
//
///// this is for android app section
//iisurl = iisurl_RENDER;
//var android_app2 = false;
//iisurl_RENDER_SRV = "https://iiswebclt1.onrender.com";
///// this is for android app section

/////////////////////////////
// local VM
//var iisurl_LOCAL = iisurl_VM; //"http://localhost:8081";
//var iisurl = iisurl_VM; //iisurl_LOCAL //iisurl_OP //iisurl_LOCAL 
//var android_app = false;
/////////////////////////////
var N_FUN_ST = 5;
////////////////////////////
var S_PENDING = -1; // no trade
var S_NEUTRAL = 0;
var SS_LONG_BUY = 11;
var S_LONG_BUY = 1;
var S_BUY = 1;
var SS_SHORT_SELL = 22;
var S_SHORT_SELL = 2;
var S_SELL = 2;
var S_STOPLOSS_BUY = 3; // stop loss buy
var S_STOPLOSS_SELL = 4; // stop loss sell
var S_EXIT_LONG = 5;
var S_EXIT_SHORT = 6;
var S_EXIT = 8;
var TRADING_AMOUNT = 6000;
var INT_MUTUAL_FUND_ACCOUNT = 120;
var INT_DEVOP_ACCOUNT = 140;
var INT_TIMOUT = 60 * 60 * 1000; //120 sec,

var recMsg = ["NN AI cannot find a good signal pattern. You should wait unit the pattern is found.",
    "NN AI is able to find a signal pattern. You can follow signal.",
    "NN AI finds a strong related signal pattern. You should follow the signal."];

