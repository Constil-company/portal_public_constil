import * as yup from "yup";

export const DiscountSchema = yup.object({
    discountName: yup
        .string()
        .required("Discount Name should not be empty")
        .max(100, "Discount Name should not exceed 100 characters"),
    
    discountRate: yup
        .number()
        .required("Discount Rate should not be empty")
        .positive("Discount Rate must be greater than 0")
        .max(100, "Discount Rate must be less than 100"),
});
