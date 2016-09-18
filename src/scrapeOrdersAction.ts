import * as Horseman from 'node-horseman';
import * as moment from 'moment';
import log = require('winston');

import {Order, OrderItem} from './types';
import {scrapeOrders, RawOrder} from './scrapeOrders';

function processOrders(orders: RawOrder[]): Order[] {
    for (let order of orders) {
        // Parse the date string into moment objects
        order.date = moment(order.date_string, 'DD. MMMM YYYY', 'de');
        //log.debug(`Date Parsed: ${order.date_string} => ${order.date}`);
        delete order.date_string;

        // Calculate shipping costs from the item prices
        let itemTotal = 0;
        for( let item of order.items) {
            if (item.price.currency != order.total.currency) {
                log.error("Different currency for item price and order total!");
            }

            itemTotal += item.price.amount * item.quantity;
        }
        order.shipping = {
            amount: order.total.amount - itemTotal,
            currency: order.total.currency
        };
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
