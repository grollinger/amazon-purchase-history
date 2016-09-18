import * as Horseman from 'node-horseman';
import * as moment from 'moment';
import log = require('winston');

import {Order, OrderItem} from './types';
import {scrapeOrders, RawOrder} from './scrapeOrders';

function parseDates(orders: RawOrder[]): Order[] {
    for (var order of orders) {
        order.date = moment(order.date_string, 'dd. MMMM YYYY', 'de');
        delete order.date_string;
    }
    return orders;
}

function scrapeOrdersAction() {
    let self: Horseman.HorsemanPage = this;

    return self
        .evaluate(scrapeOrders)
        .then(parseDates);
}

Horseman.registerAction('scrapeOrders', scrapeOrdersAction)
