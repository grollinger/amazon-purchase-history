import {Order, Priced} from './types';

const CURRENCY_SYMBOL = {
    "EUR": "€",
    "USD": "$"
};

export function formatLedgerEntry(order: Order)
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