export interface CheckoutSession {
    planId: string;
    priceId: string;
    price: number;
    currency: string;
    interval: string;
    planName: string;
    sessionId?: string;
    id?: string;    
}