import * as yup from 'yup';

const UNIVERSAL_PHONE_REGEX = /^(?:\+|00)?[1-9]\d{7,14}$/;
export const ProfileSchema = yup.object({
  companyName: yup.string().required('This field should not be empty'),
  // phone: yup
  //   .string()
  //   .nullable()
  //   .notRequired()
  //   .when({
  //     is: (value: string | null | undefined) => !!value,
  //     then: (schema) => schema.matches(/^(?:\+1\s?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/, "Invalid phone number format"),
  //   }),
  phone: yup.string().nullable().notRequired().matches(UNIVERSAL_PHONE_REGEX, {
    message: 'Invalid phone number format',
    excludeEmptyString: true,
  }),
  companyAddress: yup.string().required('This field should not be empty'),
  country: yup.string().required('Required field'),
  zipCode: yup
    .string()
    .required('Required field')
    .matches(/^\d{5}(-\d{4})?$/, 'Invalid zip code format'),
  companyTaxNumber: yup
    .string()
    .nullable()
    .notRequired()
    .when({
      is: (value: string | null | undefined) => !!value,
      then: (schema) => schema.matches(/^\d{2}-\d{7}$/, 'Invalid EIN format. Must be XX-XXXXXXX'),
    }),
  site: yup
    .string()
    .nullable()
    .notRequired()
    .when({
      is: (value: string | null | undefined) => !!value,
      then: (schema) => schema.url('Invalid URL format'),
    }),
});

export type userProfileForm = yup.InferType<typeof ProfileSchema>;
