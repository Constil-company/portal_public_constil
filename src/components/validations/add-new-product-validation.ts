import * as yup from "yup";

export interface CreateProductRequest {
  name: string;
  description?: string;
  unit: string;
  price: number;
}

// Schema de validação com Yup
export const ProductSchema = yup.object({
  name: yup
    .string()
    .required("Product Name Should not be empty")
    .max(100, "Product Name should not exceed 100 characters"),

  description: yup.string().max(255, "Description should not exceed 255 characters").optional(),

  unit: yup.string().required("Unit Should not be empty"),

  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be greater than 0")
    .max(1000000, "Price must be less than 1,000,000"),
});
