import * as yup from 'yup';

export const ProductRegistrationSchema = yup.object({
  id: yup.string().optional(),
  reference: yup.string().optional(),
  name: yup.string().trim().required('Name is required').min(1, 'Name cannot be empty'),

  price: yup
    .number()
    .typeError('Price must be a number')
    .required('Price is required')
    .min(0, 'Price cannot be negative'),
  observation: yup.string().optional(),
  expiresAt: yup.string().optional(),
  createdAt: yup.string().optional(),
  unit: yup.string().optional(),
  taxes: yup
    .array()
    .of(yup.string().required('Tax value is required').min(1, 'Tax value cannot be empty'))
    .optional()
    .min(0, 'Taxes array cannot contain empty values'),
  discount: yup.number().optional(),
});
