import fs = require('fs');
import system = require('system');
import inject_jquery = require('./inject_jquery');
import { username, password } from './credentials'
import * as log from './log'

const COOKIE_JAR = "cookies.json"
const LOGIN_URL = "https://www.amazon.de/ap/signin/254-7475757-8063566?_encoding=UTF8&accountStatusPolicy=P1&openid.assoc_handle=deflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.de%2Fgp%2Fcss%2Forder-history%2F254-7475757-8063566%3Fie%3DUTF8%26*Version*%3D1%26*entries*%3D0&pageId=webcs-yourorder&showRmrMe=1"
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.6 Safari/537.11";

interface AmazonPage extends WebPage {
    onLoggedIn?: () => void;
}

export function login_amazon(page: WebPage)
{
    page.onConsoleMessage = log.debug;
    log.debug("Logging in to Amazon");

    page.settings.userAgent = USER_AGENT;

    inject_jquery(page);
    
    add_login_handlers(page);

    page.open(LOGIN_URL);
}

function add_login_handlers(page: WebPage)
{
    let existing_handler = page.onLoadFinished;

    page.onLoadFinished = (status) => {
        log.debug("Page load finished");
        if (existing_handler)
        {
            log.debug("Calling existing handler");
            setTimeout(existing_handler, 0 , status);
        }
        log.debug("Calling login handler");
        //page_loaded(page, status);
    };
}


function page_loaded(page: AmazonPage, status: string) {
    if (is_login_page(page))
    {
        log.debug("On Login Page");
        if(is_captcha_page(page)) {
            handle_captcha_page(page);
        }
        handle_login_page(page);
    } else {
        log.debug("On a non-login page");
        console.log(page.evaluate(function() {
            return document.title;
        }));
        phantom.exit();
    }
}

function is_login_page(page: WebPage) {
    return page.evaluate(function(){
        return $('#ap_email') != null;
    });       
}

function is_captcha_page(page: WebPage) {
    return page.evaluate(function(){
        return $('#auth-captcha-guess') != null;
    });       
}

function handle_captcha_page(page: WebPage) {
    let captcha = prompt_for_captcha();
    
    page.evaluate(function() {
        return $('#auth-captcha-guess').val(captcha);
    });
}

function handle_login_page(page: WebPage) {
    page.evaluate(function() {
        $('#ap_email').val(username);
        $('#ap_password').val(password);
        $('input#signInSubmit').click();
    });

}

function prompt_for_captcha() {
    system.stdout.writeLine('CaptchaCode: ');
    return system.stdin.readLine();
}