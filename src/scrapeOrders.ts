import {Order, OrderItem, Price} from './types'

export interface RawOrder extends Order {
    date_string: string;
}

export function scrapeOrders(): RawOrder[]
{
    function parseLocalFloat(f: string) {
        let parts = f.split(/[,.]/);
        let decimal = parts.pop();
        let whole = parts.join();

        let neutralString = whole + '.' + decimal;
        return parseFloat(neutralString);
    }

    function parsePrice(price: string): Price {

        let parts = price.split(' ', 2);

        let currency = parts[0];
        let amount = parseLocalFloat(parts[1]);

        return {
            currency: currency,
            amount: amount
        };
    }

    function parseOrderInfo(orderElement: Element): RawOrder {
        let info = $(orderElement).find(".order-info")[0];

        let left_col = $(info).find(".a-col-left");
        let left_fields = $(left_col).find(".a-column");
        let right_col = $(info).find(".a-col-right");

        let order_date = $(left_fields[0]).find(".value")[0].innerText;
        let price = parsePrice(
            $(left_fields[1]).find(".value")[0].innerText
        );
        let order_no = right_col.find(".value")[0].innerText;

        return {
            number: order_no,
            total: price,
            shipping: null,
            date: null,
            date_string: order_date,
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

            let priceString = $(rightCol)
                .find(".a-color-price")[0]
                .innerText;
            let price = parsePrice(priceString);

            let rows = $(rightCol).children(".a-row");
            let title = rows[0].innerText;

            // if there are multiple items of this type, remove the title prefix
            if (quantity > 1) {
                let prefix = quantity + " von ";
                title = title.replace(prefix, "");
            }

            items.push(
                {
                    title: title,
                    price: price,
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

    function parseOrders(container: JQuery): RawOrder[]
    {
        let orders: RawOrder[] = [];

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