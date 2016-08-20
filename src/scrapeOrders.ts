import * as Horseman from 'node-horseman';
import * as moment from 'moment';

export interface Order {
    number: string;
    amount: string;
    date: string;
}

function scrapeOrdersAction() {
    let self: Horseman.HorsemanPage = this;

    return self
        .evaluate(function() {
            var orders = [];

            let container = $("#ordersContainer");
            var infos = container.find(".order");

            infos.each(function(_, info) {
                let left_col = $(info).find(".a-col-left");
                let left_fields = $(left_col).find(".a-column");
                let right_col = $(info).find(".a-col-right");

                let order_date = $(left_fields[0]).find(".value")[0].innerText;
                let order_amount =
                    $(left_fields[1]).find(".value")[0].innerText;
                let order_no = right_col.find(".value")[0].innerText;
                let order = {
                    number: order_no,
                    amount: order_amount,
                    date: order_date
                };
                orders.push(order);
            });

            return orders;
        })
        .then((orders) => {
            for (let order of orders) {
                order.date =
                    moment(order.date, 'dd. MMMM YYYY', 'de').toISOString();
            }

            return orders;
        })
}

Horseman.registerAction('scrapeOrders', scrapeOrdersAction)
