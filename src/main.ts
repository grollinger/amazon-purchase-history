require('any-promise/register/bluebird');
import * as Promise from 'bluebird';
import log = require('winston');
import './loginAmazon';
import './scrapeOrdersAction';
import {Order, Priced} from './types';
import * as Horseman from 'node-horseman';
import {username, password} from './credentials';
import {formatLedgerEntry} from './ledger';

log.level = "silly";

log.info("Amazon Purchase Importer");

const USER_AGENT =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.6 Safari/537.11";
const PURCHASE_HISTORY_URL =
    "https://www.amazon.de/gp/your-account/order-history/ref=oh_aui_menu_date?ie=UTF8&orderFilter=months-6" const COOKIE_JAR =
        "cookies.txt";



let horseman = new Horseman({cookiesFile: COOKIE_JAR});

let orders: Promise<Order[]> = horseman.userAgent(USER_AGENT)
    .open(PURCHASE_HISTORY_URL)
    .loginAmazon(username, password)
    .scrapeOrders()
    .finally(() => horseman.close());

orders
    .then((orders) => {
        for (var order of orders) {
            console.log(formatLedgerEntry(order));
        }
    });