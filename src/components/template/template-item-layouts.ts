/* eslint-disable @typescript-eslint/no-explicit-any */

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const formatMoney = (value: number) =>
  value.toLocaleString(undefined, { minimumFractionDigits: 2 });

export type ItemsLayoutType =
  | "stacked-area"
  | "stacked-box2"
  | "stacked-3"
  | "stacked-4"
  | "stacked-5"
  | "stacked-6"
  | "stacked-7"
  | "stacked-8"
  | "stacked-9"
  | "tailwind-grid"
  | "template5-card";

type ItemLabels = {
  item: string;
  qty: string;
  price: string;
  disc: string;
  tax: string;
  total: string;
};

const DEFAULT_LABELS: ItemLabels = {
  item: "Item / Description",
  qty: "Qty",
  price: "Price",
  disc: "Disc.",
  tax: "Tax",
  total: "Total",
};

const NINE_LABELS: ItemLabels = {
  item: "Item / Description",
  qty: "Qty/PCS",
  price: "Price",
  disc: "Disc.",
  tax: "Tax",
  total: "Total",
};

/** Tabela única com cabeçalho fixo — invoices & estimates (exceto tailwind-grid) */
export const CSS_ITEMS_TABLE = `
        .constil-items-table {
            width: 100% !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            margin: 0 !important;
        }
        .constil-items-table thead th {
            padding: 10px 8px !important;
            font-size: 9px !important;
            font-weight: 800 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.08em !important;
            color: #94a3b8 !important;
            background: #f8fafc !important;
            border-bottom: 2px solid #e2e8f0 !important;
            text-align: left !important;
            vertical-align: middle !important;
        }
        .constil-items-table thead th.col-qty,
        .constil-items-table thead th.col-disc,
        .constil-items-table thead th.col-tax {
            text-align: center !important;
            width: 9% !important;
        }
        .constil-items-table thead th.col-price {
            text-align: center !important;
            width: 13% !important;
        }
        .constil-items-table thead th.col-total {
            text-align: right !important;
            width: 14% !important;
        }
        .constil-items-table thead th.col-item {
            width: auto !important;
        }
        .constil-items-table tbody td {
            padding: 12px 8px !important;
            border-bottom: 1px solid #f1f5f9 !important;
            vertical-align: top !important;
            font-size: 12px !important;
            color: #0f172a !important;
            background: #fff !important;
        }
        .constil-items-table tbody td.col-qty,
        .constil-items-table tbody td.col-disc,
        .constil-items-table tbody td.col-tax {
            text-align: center !important;
            font-weight: 600 !important;
            color: #475569 !important;
        }
        .constil-items-table tbody td.col-price {
            text-align: center !important;
            font-weight: 600 !important;
        }
        .constil-items-table tbody td.col-total {
            text-align: right !important;
            font-weight: 700 !important;
            color: #0f172a !important;
        }
        .constil-items-table .item-name {
            font-size: 13px !important;
            font-weight: 700 !important;
            color: #0f172a !important;
            margin: 0 0 4px 0 !important;
        }
        .constil-items-table .item-desc {
            font-size: 11px !important;
            line-height: 1.45 !important;
            color: #64748b !important;
            margin: 0 !important;
        }
        .constil-items-table tr.invoice-item-row,
        .constil-items-table tr.constil-item-row {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }
`;

/** @deprecated Mantido para scripts; usar CSS_ITEMS_TABLE */
export const CSS_STACKED_ITEMS_AREA = CSS_ITEMS_TABLE;
export const CSS_STACKED_ITEMS_BOX2 = CSS_ITEMS_TABLE;
export const CSS_STACKED_ITEMS_3 = CSS_ITEMS_TABLE;
export const CSS_STACKED_ITEMS_4 = CSS_ITEMS_TABLE;
export const CSS_STACKED_ITEMS_5 = CSS_ITEMS_TABLE;
export const CSS_STACKED_ITEMS_6 = CSS_ITEMS_TABLE;
export const CSS_STACKED_ITEMS_7 = CSS_ITEMS_TABLE;
export const CSS_STACKED_ITEMS_8 = CSS_ITEMS_TABLE;
export const CSS_STACKED_ITEMS_9 = CSS_ITEMS_TABLE;
export const CSS_TEMPLATE5_ITEMS = CSS_ITEMS_TABLE;

export function buildStackedItemCss(): string {
  return CSS_ITEMS_TABLE;
}

export function detectItemsLayout(template: string): ItemsLayoutType {
  if (template.includes("items-9-list-area")) return "stacked-9";
  if (template.includes("items-8-body-list")) return "stacked-8";
  if (template.includes("items-7-content")) return "stacked-7";
  if (template.includes("items-6-box")) return "stacked-6";
  if (template.includes("items-5-list")) return "stacked-5";
  if (template.includes("items-4-body")) return "stacked-4";
  if (template.includes("items-3-grid")) return "stacked-3";
  if (template.includes("items-area-box-2")) return "stacked-box2";
  if (
    template.includes("item-desc-main") ||
    (template.includes("item-meta-grid") && template.includes("content-area"))
  ) {
    return "template5-card";
  }
  if (
    template.includes("grid-cols-12") &&
    (template.includes("col-span-4") || template.includes("Item Details")) &&
    (template.includes("space-y-1") ||
      template.includes("space-y-2") ||
      template.includes("space-y-4") ||
      template.includes("divide-y"))
  ) {
    return "tailwind-grid";
  }
  if (template.includes("items-area")) return "stacked-area";
  return "stacked-area";
}

export function getItemsLayoutCss(layout: ItemsLayoutType): string {
  if (layout === "tailwind-grid") return "";
  return CSS_ITEMS_TABLE;
}

function buildTableHeader(labels: ItemLabels): string {
  return `
    <thead>
      <tr class="constil-items-header-row">
        <th class="col-item">${labels.item}</th>
        <th class="col-qty">${labels.qty}</th>
        <th class="col-price">${labels.price}</th>
        <th class="col-disc">${labels.disc}</th>
        <th class="col-tax">${labels.tax}</th>
        <th class="col-total">${labels.total}</th>
      </tr>
    </thead>`;
}

function buildTableRow(
  name: string,
  description: string,
  quantity: number,
  price: number,
  discountRate: number,
  taxRate: number,
  total: number
): string {
  return `
      <tr class="invoice-item-row constil-item-row">
        <td class="col-item">
          <p class="item-name">${escapeHtml(name)}</p>
          ${description ? `<p class="item-desc">${description}</p>` : ""}
        </td>
        <td class="col-qty">${quantity}</td>
        <td class="col-price">$${formatMoney(price)}</td>
        <td class="col-disc">${discountRate > 0 ? `${discountRate}%` : "—"}</td>
        <td class="col-tax">${taxRate > 0 ? `${taxRate}%` : "—"}</td>
        <td class="col-total">$${formatMoney(total)}</td>
      </tr>`;
}

function buildTailwindGridRow(
  name: string,
  description: string,
  quantity: number,
  price: number,
  discountRate: number,
  taxRate: number,
  total: number
): string {
  return `
      <div class="invoice-item-row grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 border-b border-slate-100 items-start" style="page-break-inside: avoid; break-inside: avoid;">
        <div class="col-span-4">
          <p class="text-sm font-semibold text-slate-900" style="margin:0 0 2px;">${escapeHtml(name)}</p>
          ${description ? `<p class="text-xs text-slate-500" style="margin:0;">${description}</p>` : ""}
        </div>
        <div class="col-span-1 text-center text-sm font-semibold text-slate-700">${quantity}</div>
        <div class="col-span-2 text-center text-sm font-semibold text-slate-700">$${formatMoney(price)}</div>
        <div class="col-span-1 text-center text-sm text-slate-600">${discountRate > 0 ? `${discountRate}%` : "—"}</div>
        <div class="col-span-1 text-center text-sm text-slate-600">${taxRate > 0 ? `${taxRate}%` : "—"}</div>
        <div class="col-span-3 text-right text-sm font-bold text-slate-900">$${formatMoney(total)}</div>
      </div>`;
}

function resolveItemFields(item: any) {
  const quantity = Number(item.quantity || 1);
  const price = parseFloat(item.price || item.unit_price || item.product?.price || "0");
  const discountRate =
    typeof item.discount === "number"
      ? item.discount
      : Array.isArray(item.discount)
        ? item.discount.reduce((s: number, d: any) => s + (parseFloat(d?.rate) || 0), 0)
        : (item.estimate_item_discounts || item.invoice_item_discounts || []).reduce(
            (s: number, d: any) => s + (d.discount?.rate || 0),
            0
          );
  const taxRate =
    typeof item.tax === "number"
      ? item.tax
      : Array.isArray(item.tax)
        ? item.tax.reduce((s: number, t: any) => s + (parseFloat(t?.rate) || 0), 0)
        : (item.estimate_item_taxes || item.invoice_item_taxes || []).reduce(
            (s: number, t: any) => s + (t.tax?.rate || 0),
            0
          );

  const subtotal = price * quantity;
  const discountAmount = (subtotal * discountRate) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const name =
    item.productName ||
    item.product?.name ||
    item.name ||
    item.item_title ||
    "Unnamed Item";
  const description = escapeHtml(item.description || "");

  return { quantity, price, discountRate, taxRate, total, name, description };
}

function generateItemsTable(items: any[], labels: ItemLabels): string {
  if (!items.length) {
    return `<table class="constil-items-table">${buildTableHeader(labels)}<tbody></tbody></table>`;
  }
  const rows = items
    .map((item) => {
      const f = resolveItemFields(item);
      return buildTableRow(
        f.name,
        f.description,
        f.quantity,
        f.price,
        f.discountRate,
        f.taxRate,
        f.total
      );
    })
    .join("");

  return `<table class="constil-items-table">${buildTableHeader(labels)}<tbody>${rows}</tbody></table>`;
}

export function generateItemsForLayout(
  items: any[] = [],
  layout: ItemsLayoutType
): string {
  if (layout === "tailwind-grid") {
    return items
      .map((item) => {
        const f = resolveItemFields(item);
        return buildTailwindGridRow(
          f.name,
          f.description,
          f.quantity,
          f.price,
          f.discountRate,
          f.taxRate,
          f.total
        );
      })
      .join("");
  }

  const labels = layout === "stacked-9" ? NINE_LABELS : DEFAULT_LABELS;
  return generateItemsTable(items, labels);
}
