import * as yup from "yup";

// Schema para um produto individual
const ProductSchema = yup.object({
  productId: yup.string().required("Product ID is required"),
  unitId: yup.string().required("Unit ID is required"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be greater than 0"),
  quantity: yup
    .number()
    .required("Quantity is required")
    .integer("Quantity must be an integer")
    .positive("Quantity must be greater than 0"),
  discount: yup.number().optional(),
  tax: yup.number().optional(),
});

// Schema principal do formulário
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

  products: yup.array().of(ProductSchema).required("At least one product is required"),

  templateId: yup.string().required("Template is required"),
});

export type InvoiceFormModel = yup.InferType<typeof InvoiceSchema>;