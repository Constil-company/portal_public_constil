export interface InvoiceData {
    from?: string;
    fromAddress?: string;
    billTo?: string;
    billToAddress?: string;
    shipTo?: string;
    shipToAddress?: string;
    amount: string;
    items: any[];
    user: any;
    terms?: string;
    invoiceNumber: string;
    invoiceDate: string;
    orderNumber?: string;
    expirationDate: string;
    logo?: string | null;
    signature?: string | null;
    estimateNumber?: string;
    templateId?: number;
    companyName?: string;
}
