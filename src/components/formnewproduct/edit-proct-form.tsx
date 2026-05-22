/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';
import { useFormik } from 'formik';
import CloseIcon from '@mui/icons-material/Close';
import { Backdrop, Box, Fade, IconButton, Modal, Typography } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { ProductModel } from '../../models/produt';
import Spinner from '../spinner';
import './newproductform.css';
import { useEditProductMutation } from '../../services/rtkapi/productApi';
import { toast } from 'react-toastify';
// ..
interface FormNewProductModalProps {
  open: boolean;
  onClose: () => void;
  productData?: ProductModel | null;
}

type FormValues = {
  name: string;
  description: string;
  price: number;
};

const FormEditProductModal = ({ open, onClose, productData }: FormNewProductModalProps) => {
  const [editProduct, { isLoading }] = useEditProductMutation();

  const { errors, touched, values, resetForm, handleSubmit, handleChange, handleBlur } = useFormik<FormValues>({
    initialValues: {
      name: productData?.name || '',
      description: productData?.description || '',
      price: (productData as any)?.unit_price || productData?.price || 0,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required'),
      price: Yup.number().required('Price is required'),
    }),

    onSubmit: async (values) => {
      try {
        const body = {
          name: values.name,
          description: values.description,
          extra_info: values.description,
          unit_price: Number(values.price),
        };
        const response = await editProduct({ body, id: productData?.id }).unwrap();
        resetForm();
        toast.success(response?.message);
        onClose();
      } catch (err: any) {
        toast.error(err?.data?.detail || err?.data?.message);
      }
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
      }}>
      <Fade in={open}>
        <Box className="fixed inset-0 flex items-center justify-center p-4 sm:p-0">
          <form
            onSubmit={handleSubmit}
            className="bg-white text-black rounded-lg shadow-md w-full max-w-md relative flex flex-col max-h-[90vh] sm:max-h-[calc(100vh-64px)] sm:my-8 overflow-hidden p-0">
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 relative border-b border-gray-200">
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: '#12153A',
                  zIndex: 10,
                }}>
                <CloseIcon />
              </IconButton>
              <Typography
                variant="h6"
                gutterBottom
                className="text-[#12153A] font-bold text-base sm:text-lg md:text-xl">
                Edit Product
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom className="text-xs sm:text-sm">
                Haven't added any product records yet?
              </Typography>
            </div>

            <div className="px-4 sm:px-6 py-4 overflow-y-auto flex-1">
              <div className="mt-2 sm:mt-3 mb-3 sm:mb-4">
                <label className="text-[#12153A] mb-1 sm:mb-3 font-bold text-xs sm:text-[14px]">Product Name</label>{' '}
                <input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Describe the name of product"
                  className="w-full mt-1 sm:mt-2 px-3 py-2 sm:py-3 border border-gray-300 text-[13px] outline-none resize-none rounded-lg focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF]"
                />

                {touched.name && errors.name && <p className="text-[#f4777f] mt-1.5">{errors.name}</p>}
              </div>

              <div className="mt-2 sm:mt-3 mb-3 sm:mb-4">
                <label className="text-[#12153A] mb-1 sm:mb-3 font-bold text-xs sm:text-[14px]">Description</label>
                <input
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Describe the description"
                  className="w-full mt-1 sm:mt-2 px-3 py-2 sm:py-3 border border-gray-300 text-[13px] outline-none resize-none rounded-lg focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF]"
                />

              </div>

              <div className="mt-2 sm:mt-3 mb-3 sm:mb-4">
                <label className="text-[#12153A] mb-1 sm:mb-3 font-bold text-xs sm:text-[14px]">Price</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="1"
                  value={values.price}
                  placeholder="Type the price"
                  className="w-full mt-1 sm:mt-2 px-3 py-2 sm:py-3 border border-gray-300 text-[13px] outline-none resize-none rounded-lg focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF]"

                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || Number(value) >= 0) {
                      handleChange(e);
                    }
                  }}

                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}

                  onBlur={handleBlur}
                />

                {touched.price && errors.price && <p className="text-[#f4777f] mt-1.5">{errors.price}</p>}
              </div>
            </div>

            <div className="px-4 sm:px-6 pt-3 sm:pt-4 pb-4 sm:pb-6 border-t border-gray-200">
              <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center">
                <button
                  onClick={onClose}
                  className="cursor-pointer text-gray-600 hover:text-[#12153A] text-sm sm:text-base w-full sm:w-auto mt-2 sm:mt-0 py-2 sm:px-2">
                  Cancel
                </button>
                <button
                  disabled={isLoading}
                  type="submit"
                  className={`bg-[#12153A] text-white rounded-full transition duration-300 flex items-center justify-center 
                   w-full p-2.5 text-sm  sm:w-2xs sm:p-3 ${!isLoading ? 'hover:bg-[#1A1E50] cursor-pointer' : 'opacity-50 cursor-not-allowed'
                    }`}>
                  {isLoading ? <Spinner /> : 'Edit Product'}
                </button>
              </div>
            </div>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};

export default FormEditProductModal;
