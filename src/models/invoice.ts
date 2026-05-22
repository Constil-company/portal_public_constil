/* eslint-disable no-constant-binary-expression */
import { InvoiceResponse } from "../api/invoices";

export enum InvoiceStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  INACTIVE = "INACTIVE",
}

export enum InvoiceKind {
  F = "F",
  E = "E",
}

export class InvoiceModel {
  id?: string;
  invoiceId: string;
  invoice_number?: string;
  invoice_date?: string;
  client: string | undefined;
  estimate_date?: string;
  estimate_number?: string;
  client_name?: string;
  due_date?: string;
  template_number?: number;
  total_amount?: number;
  serviceName: string;
  servicePrice: number;
  clientView: number;
  createdAt: string;
  kind: InvoiceKind;
  settled: boolean;
  status: InvoiceStatus;
  documentUrl?: string;
  clientId?: string;
  clientEmail?: string;

  constructor(
    invoiceId: string,
    serviceName: string,
    servicePrice: number,
    clientView: number,
    createdAt: string,
    kind: InvoiceKind,
    settled: boolean,
    status: InvoiceStatus,
    documentUrl?: string,
    clientId?: string,
    clientEmail?: string,
    id?: string,
    invoice_number?: string,
    due_date?: string,
    total_amount?: number,
    invoice_date?: string,
    estimate_date?: string,
    estimate_number?: string,
    template_number?: number,
    client_name?: string
  ) {
    this.invoiceId = invoiceId;
    this.serviceName = serviceName;
    this.servicePrice = servicePrice;
    this.clientView = clientView;
    this.createdAt = createdAt;
    this.kind = kind;
    this.settled = settled;
    this.status = status;
    this.documentUrl = documentUrl;
    this.clientId = clientId;
    this.clientEmail = clientEmail;
    this.id = id;
    this.invoice_number = invoice_number;
    this.due_date = due_date;
    this.total_amount = total_amount;
    this.invoice_date = invoice_date;
    this.estimate_date = estimate_date;
    this.estimate_number = estimate_number;
    this.template_number = template_number;
    this.client_name = client_name;
  }

  static fromResponse(response: InvoiceResponse): InvoiceModel {
    const r = response as any;
    const client_name = r.client_name || r.clients?.name || r.client?.name || "";
    
    const formatDate = (dateStr: any) => {
      if (!dateStr) return "";
      const s = String(dateStr);
      return s.includes("T") ? s.split("T")[0] : s;
    };

    // Robust total detection
    let rawTotal = 0;
    if (r.total !== undefined && r.total !== null) rawTotal = r.total;
    else if (r.total_amount !== undefined && r.total_amount !== null) rawTotal = r.total_amount;
    else if (r.amount !== undefined && r.amount !== null) rawTotal = r.amount;

    const clientId = r.client_id || r.clientId || r.client?.id || "";

    return new InvoiceModel(
      response.invoiceId || response.id || "",
      response.serviceName ?? "",
      response.servicePrice ?? 0,
      response.clientView ?? 0,
      response.createdAt ?? "",
      (response.kind as InvoiceKind) ?? InvoiceKind.F,
      response.settled ?? false,
      (response.status as InvoiceStatus) ?? InvoiceStatus.INACTIVE,
      response.documentUrl ?? "",
      clientId,
      response.clientEmail ?? "",
      response.id ?? "",
      response.invoice_number ?? "",
      formatDate(response.due_date || response.valid_until),
      Number(rawTotal),
      formatDate(response.invoice_date),
      formatDate(response.estimate_date),
      response.estimate_number ?? "",
      Number(response.template_number) ?? 0,
      client_name
    );
  }

  static fromListResponse(response: InvoiceResponse[]): InvoiceModel[] {
    return response.map((i) => InvoiceModel.fromResponse(i));
  }
}
