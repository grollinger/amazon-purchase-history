import * as Horseman from 'node-horseman';
import * as moment from 'moment';
import log = require('winston');

import {Order, OrderItem} from './types';
import {scrapeOrders, RawOrder} from './scrapeOrders';

function processOrders(orders: RawOrder[]): Order[] {
    // Parse the date string into moment objects
    for (var order of orders) {
        order.date = moment(order.date_string, 'DD. MMMM YYYY', 'de');
        //log.debug(`Date Parsed: ${order.date_string} => ${order.date}`);
        delete order.date_string;
    }
    return orders;
}

function scrapeOrdersAction() {
    let self: Horseman.HorsemanPage = this;

    return self
        .evaluate(scrapeOrders)
        .then(processOrders);
}

Horseman.registerAction('scrapeOrders', scrapeOrdersAction)
