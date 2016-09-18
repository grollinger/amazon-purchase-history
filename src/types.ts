import * as moment from 'moment'

export interface Price {
    amount: number;
    currency: string;
}

export interface OrderItem {
    price: Price;
    title: string;
    quantity: number;
}

export interface Order {
    number: string;
    total: Price;
    shipping: Price;
    date: moment.Moment;
    items: OrderItem[];
}