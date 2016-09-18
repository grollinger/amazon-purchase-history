require('any-promise/register/bluebird');
import * as Promise from 'bluebird';
import log = require('winston');
import './loginAmazon';
import './scrapeOrders';
import {Order, Priced} from './types';
import * as Horseman from 'node-horseman';
import {username, password} from './credentials';

log.level = "silly";

log.info("Amazon Purchase Importer");

const USER_AGENT =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.6 Safari/537.11";
const PURCHASE_HISTORY_URL =
    "https://www.amazon.de/gp/your-account/order-history/ref=oh_aui_menu_date?ie=UTF8&orderFilter=months-6" const COOKIE_JAR =
        "cookies.txt";

const CURRENCY_SYMBOL = {
    "EUR": "€",
    "USD": "$"
};

let horseman = new Horseman({cookiesFile: COOKIE_JAR});

let orders: Promise<Order[]> = horseman.userAgent(USER_AGENT)
    .open(PURCHASE_HISTORY_URL)
    .loginAmazon(username, password)
    .scrapeOrders()
    .finally(() => horseman.close());

function formatLedgerEntry(order: Order)
{
    function formatAmount(p: Priced)
    {
        let symbol = CURRENCY_SYMBOL[p.currency];
        let priceFixed = p.price.toFixed(2);
        return `${priceFixed} ${symbol}`
    }

    let dateString = order.date.format("YYYY/MM/DD");

    let itemsString = "";
    for (var item of order.items) {
        let amountString = formatAmount(item);
        let valueString = "";
        if (item.quantity > 1) {
            valueString = `(${item.quantity} * ${amountString})`
        }
        else {
            valueString = `${amountString}`
        }

        let itemString = `
    Expenses:Imported    ${valueString}
    ; ${item.title}`
        itemsString = itemsString + itemString;
    }

    let totalString = formatAmount(order);
    let withdrawalString = `
    Assets:Checking     -${totalString}`

    return `${dateString} ! (${order.number}) Amazon; Imported` +
        itemsString + withdrawalString;
}

orders
    .then((orders) => {
        for (var order of orders) {
            console.log(formatLedgerEntry(order));
        }
    });