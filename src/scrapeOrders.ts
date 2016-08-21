import * as Horseman from 'node-horseman';
import * as moment from 'moment';

export interface OrderItem
{
    title: string;
    quantity: number;
    price: string;
}

export interface Order {
    number: string;
    amount: string;
    date: string;
    items: OrderItem[];
}

function scrapeOrders(): Order[]
{
    function parseOrderInfo(orderElement: Element): Order{
        let info = $(orderElement).find(".order-info")[0];

        let left_col = $(info).find(".a-col-left");
        let left_fields = $(left_col).find(".a-column");
        let right_col = $(info).find(".a-col-right");

        let order_date = $(left_fields[0]).find(".value")[0].innerText;
        let order_amount =
            $(left_fields[1]).find(".value")[0].innerText;
        let order_no = right_col.find(".value")[0].innerText;

        return {
            number: order_no,
            amount: order_amount,
            date: order_date,
            items: []
        };
    }

    function parseShipment(shipmentElement: Element): OrderItem[] {
        let items: OrderItem[] = [];

        let contentsTable = $(shipmentElement)
            .find(".a-fixed-right-grid-inner > .a-col-left");

        let itemLines = $(contentsTable)
            .find(".a-fixed-left-grid-inner");

        itemLines.each((_, line) => {
            let quantityElement = $(line).find(".item-view-qty");
            let quantity = 1;
            if(quantityElement.length) {
                quantity = Number(quantityElement[0].innerText);
            }

            let rightCol = $(line).find(".a-col-right")[0];
            let rows = $(rightCol).children(".a-row");
            let title = rows[0].innerText;
            let amount = rows[3].innerText;

            items.push(
                {
                    title: title,
                    price: amount,
                    quantity: quantity
                }
            );
        });

        return items;
    }

    function parseShipments(orderElement: Element): OrderItem[]
    {
        let items: OrderItem[] = [];

        let shipments = $(orderElement).find(".shipment");

        shipments.each((_, shipmentElement) => {
            let itemsInShipment = parseShipment(shipmentElement);
            items = items.concat(itemsInShipment);
        });

        return items;
    }

    function parseOrders(container: JQuery): Order[]
    {
        let orders: Order[] = [];

        var infos = container.find(".order");

        infos.each(function(_, order_element) {
            let order = parseOrderInfo(order_element);
            order.items = parseShipments(order_element);
            orders.push(order);
        });

        return orders;
    }

    let container = $("#ordersContainer");

    return parseOrders(container);
}

function parseDates(orders: Order[])
{
    for (let order of orders) {
        order.date =
            moment(order.date, 'dd. MMMM YYYY', 'de').toISOString();
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
