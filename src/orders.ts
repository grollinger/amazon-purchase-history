export interface Order {
    number: string;
    amount: string;
    date: string;
}

export function orders_from_page(page: WebPage): Order[] {
   return []; 
}