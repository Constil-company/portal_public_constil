import * as yup from "yup";

export type InvoiceForm = {
    invoiceName: string;
    description?: string;
    clientName: string;
    serviceProduct: string;
    serviceProductDescription?: string;
    quantity: number;
    rate: number;
    taxes: { name: string; rate: number }[]; // Lista de impostos
    discounts: { name: string; rate: number }[]; // Lista de descontos
};

export const InvoiceSchema = yup.object({
    invoiceName: yup
        .string()
        .required("Invoice Name should not be empty")
        .max(100, "Invoice Name should not exceed 100 characters"),

    description: yup
        .string()
        .max(255, "Description should not exceed 255 characters")
        .optional(),

    clientName: yup
        .string()
        .required("Client Name should not be empty")
        .max(100, "Client Name should not exceed 100 characters"),

    serviceProduct: yup
        .string()
        .required("Service/Product should not be empty")
        .max(100, "Service/Product should not exceed 100 characters"),

    serviceProductDescription: yup
        .string()
        .max(255, "Service/Product Description should not exceed 255 characters")
        .optional(),

    quantity: yup
        .number()
        .required("Quantity should not be empty")
        .integer("Quantity must be an integer")
        .positive("Quantity must be greater than 0")
        .max(1000000, "Quantity must be less than 1,000,000"),

    rate: yup
        .number()
        .required("Rate should not be empty")
        .positive("Rate must be greater than 0")
        .max(100, "Rate must be less than 100"),

    // ✅ Validação de impostos (lista de objetos)
    taxes: yup
        .array()
        .of(
            yup.object({
                name: yup
                    .string()
                    .required("Tax name should not be empty")
                    .max(100, "Tax name should not exceed 100 characters"),
                rate: yup
                    .number()
                    .required("Tax rate should not be empty")
                    .positive("Tax rate must be greater than 0")
                    .max(100, "Tax rate must be less than 100"),
            })
        )
        .optional(),

    // ✅ Validação de descontos (lista de objetos)
    discounts: yup
        .array()
        .of(
            yup.object({
                name: yup
                    .string()
                    .required("Discount name should not be empty")
                    .max(100, "Discount name should not exceed 100 characters"),
                rate: yup
                    .number()
                    .required("Discount rate should not be empty")
                    .positive("Discount rate must be greater than 0")
                    .max(100, "Discount rate must be less than 100"),
            })
        )
        .optional(),
});
