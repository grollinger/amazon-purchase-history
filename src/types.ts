import * as moment from 'moment'

export interface Priced
{
    price: number;
    currency: string;
}

export interface OrderItem extends Priced
{
    title: string;
    quantity: number;
}

export interface Order extends Priced {
    number: string;
    date: moment.Moment;
    items: OrderItem[];
}