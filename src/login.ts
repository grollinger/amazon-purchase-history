import * as fs from 'mz/fs';
import * as readline from 'mz/readline'
import * as Horseman from 'node-horseman'
import * as Promise from 'bluebird'
import { username, password } from './credentials';
import log = require('winston');



const COOKIE_JAR = "cookies.txt";
const CAPTCHA_SCREENSHOT = "captcha.png";
const LOGIN_URL = "https://www.amazon.de/gp/your-account/order-history/ref=oh_aui_menu_date?ie=UTF8&orderFilter=months-6"
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.6 Safari/537.11";

const SELECTOR_EMAIL = '#ap_email';
const SELECTOR_PASSW = '#ap_password';
const SELECTOR_REMEMBER = 'input[name="rememberMe"]';
const SELECTOR_SUBMIT = 'input#signInSubmit';
const SELECTOR_CAPTCHA = '#auth-captcha-guess';

function loginAmazonAction(username, password)
{
    log.debug("Logging into Amazon");
    let self: Horseman.HorsemanPage = this;

    function promptForCaptcha() 
    {
        log.debug("Prompting for CAPTCHA");
        
        let cli = readline.createInterface(process.stdin, process.stdout);
        return cli.question("What does the CAPTCHA say?")
            .finally(() => cli.close())
    }

    function solveCaptcha() 
    {
        log.debug("Solving CAPTCHA");
        return self
            .screenshot(CAPTCHA_SCREENSHOT)
            .then(promptForCaptcha)
            .then((captcha) => {
                return self
                    .value(SELECTOR_CAPTCHA, captcha)
            });
    }

    function submitLoginPage()
    {
        log.debug("Submitting login page");
        return self
            .value(SELECTOR_EMAIL, username)
            .value(SELECTOR_PASSW, password)
            .click(SELECTOR_REMEMBER)
            .click(SELECTOR_SUBMIT)
            .waitForNextPage();
    }

    return self
        .exists(SELECTOR_CAPTCHA)
        .then((has_captcha) => {
            log.debug("Page has a captcha? ", has_captcha);
            if(has_captcha) {
                return solveCaptcha();
            }
        })
        .exists(SELECTOR_EMAIL)
        .then((is_login_page) => {
            log.debug("Page is a login page? ", is_login_page);
            if(is_login_page)
            {
                return submitLoginPage();
            }
        });
}

Horseman.registerAction('loginAmazon', loginAmazonAction);

export function login_amazon()
{
    log.debug("Logging in to Amazon");

    let horseman = new Horseman({
        cookiesFile: COOKIE_JAR
    });

    horseman
        .userAgent(USER_AGENT)
        .open(LOGIN_URL)
        .loginAmazon(username, password)
        .close();

    log.debug("Done Logging in");
}