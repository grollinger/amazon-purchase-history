import * as Horseman from 'node-horseman'

export interface Order {
    number: string;
    amount: string;
    date: string;
}

export function ordersFromPage(amazon: Horseman.Horseman): Order[] {
   return []; 
}

 function scrapeOrders() {
            console.log("Retrieve Orders");
            page.injectJs("lib/jquery.js");
            page.evaluate(function () {
                console.log(document.title);
                var container = $("#ordersContainer");
                var infos = container.find(".order");
                console.log(infos.length + " Orders found");
                var orders = [];
                infos.each(function (_, info) {
                    console.log("Processing Order Info");
                    var order = {};
                    var left_col = $(info).find(".a-left-col");
                    order.no = left_col.find(".value")[0].innerText;
                    orders.push(order);
                });
                var json = JSON.stringify(orders, null, 4);
                console.log(json);
            });
        }