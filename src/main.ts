require('any-promise/register/bluebird');
import log = require('winston');
import './loginAmazon';
import './scrapeOrders';
import * as Horseman from 'node-horseman';
import {username, password} from './credentials';

log.level = "silly";

log.info("Amazon Purchase Importer");

const USER_AGENT =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.6 Safari/537.11";
const PURCHASE_HISTORY_URL =
    "https://www.amazon.de/gp/your-account/order-history/ref=oh_aui_menu_date?ie=UTF8&orderFilter=months-6" const COOKIE_JAR =
        "cookies.txt";

let horseman = new Horseman({cookiesFile: COOKIE_JAR});

horseman.userAgent(USER_AGENT)
    .open(PURCHASE_HISTORY_URL)
    .loginAmazon(username, password)
    .scrapeOrders()
    .then((orders) => { log.debug("Orders on page:", JSON.stringify(orders)); })
    .close();
