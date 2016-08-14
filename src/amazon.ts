import { create as WebPage } from 'webpage';
import * as amazon_login from './login';



export function main() {
var page = WebPage();
var testindex = 0, loadInProgress = false;



page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.onLoadStarted = function() {
    loadInProgress = true;
    console.log("load started");
};

page.onLoadFinished = function() {
    loadInProgress = false;
    console.log("load finished");
};

var steps = [
    function() {
        console.log("Load Login Page");
        page.settings.userAgent =
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.6 Safari/537.11";
        page.open(
            "https://www.amazon.de/ap/signin/254-7475757-8063566?_encoding=UTF8&accountStatusPolicy=P1&openid.assoc_handle=deflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.de%2Fgp%2Fcss%2Forder-history%2F254-7475757-8063566%3Fie%3DUTF8%26*Version*%3D1%26*entries*%3D0&pageId=webcs-yourorder&showRmrMe=1");
    },
    function() {
        console.log("Enter Credentials");
        page.injectJs("credentials.js");
        page.injectJs("lib/jquery.js");
        page.evaluate(function() {
            console.log("User: " + document.amazon_user);
            $('#ap_email').val(document.amazon_user);
            $('#ap_password').val(document.amazon_pass);
        });
    },
    function() {
        console.log('login');
        page.evaluate(function() {
            console.log(document.title);
            $("input#signInSubmit").click();
        });
    },
    function() {
        console.log("Retrieve Orders");
        page.injectJs("lib/jquery.js");
        page.evaluate(function() {
            console.log(document.title);
            var container = $("#ordersContainer");

            var infos = container.find(".order");
            console.log(infos.length + " Orders found");

            var orders = [];

            infos.each(function(_, info) {
                console.log("Processing Order Info");
                var order: any = {};

                var left_col = $(info).find(".a-left-col");
                order.no = left_col.find(".value")[0].innerText;

                orders.push(order);
            });

            var json = JSON.stringify(orders, null, 4);
            console.log(json);
        });
    }
];

var interval = setInterval(function() {
    if (!loadInProgress && typeof steps[testindex] == "function") {
        console.log("step " + (testindex + 1));
        steps[testindex]();
        page.render("images/step" + (testindex + 1) + ".png");
        testindex++;
    }
    if (typeof steps[testindex] != "function") {
        phantom.exit();
    }
}, 50);
}