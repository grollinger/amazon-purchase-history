import {Order, Price} from './types';

const CURRENCY_SYMBOL = {
    "EUR": "€",
    "USD": "$"
};

export function formatLedgerEntry(order: Order)
{
    function formatPrice(p: Price)
    {
        let symbol = CURRENCY_SYMBOL[p.currency];
        let priceFixed = p.amount.toFixed(2);
        return `${priceFixed} ${symbol}`
    }

    let dateString = order.date.format("YYYY/MM/DD");

    let itemsString = "";
    for (var item of order.items) {
        let amountString = formatPrice(item.price);
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

    let shippingString = "";
    if (order.shipping.amount > 0) {
        let shippingValue = formatPrice(order.shipping);
        shippingString = `
    Expenses:Shipping Costs    ${shippingValue}`;
    }

    let totalString = formatPrice(order.total);
    let withdrawalString = `
    Assets:Checking     -${totalString}`

    return `${dateString} ! (${order.number}) Amazon; Imported` +
        itemsString + shippingString + withdrawalString;
}