import * as yup from "yup";

export const RegistrationSchema = yup.object({
  name: yup.string().required("This field should not be empty"),
  email: yup.string().required("This field should not be empty").email("Invalid email format"),
  password: yup.string().required("This field should not be empty"),
  // password: yup
  //   .string()
  //   .min(8, "Password value should have at least 8 character")
  //   .max(15, "Password value should not have more than 15 character")
  //   .matches(/[\W_]/, "Password value should have at least 1 special character")
  //   .matches(/\d/, "Password value should have at least 1 number")
  //   .matches(/^\S*$/, "Password should not have space character")
  //   .required("This field should not be empty"),
  phoneNumber: yup
    .string()
    .nullable()
    .notRequired()
    .when( {
      is: (value: string | null | undefined) => !!value,
      then: (schema) => schema.matches(/^(?:\+1\s?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/, "Invalid phone number format"),
    }),
  adress: yup.string().required("This field should not be empty"),
  state: yup.string().required("Required field"),
  city: yup.string().required("Required field"),
  country: yup.string().required("Required field"),
  zipCode: yup.string().required("Required field").matches(/^\d{5}(-\d{4})?$/, "Invalid zip code format"),
  taxNumber: yup.string().nullable().notRequired().when({
    is: (value: string | null | undefined) => !!value,
    then: (schema) => schema.matches(/^\d{2}-\d{7}$/, "Invalid EIN format. Must be XX-XXXXXXX"),
  }),
  webSite: yup.string().nullable().notRequired().when({
    is: (value: string | null | undefined) => !!value,
    then: (schema) => schema.url("Invalid URL format"),
  }),
  image: yup.mixed()
});

export type userRegistrationForm = yup.InferType<typeof RegistrationSchema>;