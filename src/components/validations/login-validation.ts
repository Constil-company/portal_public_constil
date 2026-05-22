import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().required("This field should not be empty").email("Invalid email format"),
  password: yup
    .string()
    //.min(8, "Password value should have at least 8 character")
   // .max(15, "Password value should not have more than 15 character")
   // .matches(/[\W_]/, "Password value should have at least 1 special character") 
   // .matches(/\d/, "Password value should have at least 1 number") 
    //.matches(/^\S*$/, "Password should not have space character") 
    .required("This field should not be empty"),
});

export type userLoginForm = yup.InferType<typeof loginSchema>;
