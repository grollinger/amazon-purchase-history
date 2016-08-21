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