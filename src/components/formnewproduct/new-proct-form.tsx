/* eslint-disable @typescript-eslint/no-explicit-any */
import CloseIcon from '@mui/icons-material/Close';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Backdrop, Box, Fade, IconButton, Modal, Typography } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../spinner';
import './newproductform.css';
import { useAddProductMutation } from '../../services/rtkapi/productApi';
import { toast } from 'react-toastify';

interface FormnewproductModalProps {
  open: boolean;
  onClose: () => void;
}

type FormValues = {
  name: string;
  description: string;
  price: string;
};

const FormNewProductModal = ({ open, onClose }: FormnewproductModalProps) => {
  const [addProduct, { isLoading }] = useAddProductMutation();

  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      description: '',
      price: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required'),
      price: Yup.number().required('Price is required'),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const token = localStorage.getItem("access_token") || "";
        let userId = "";
        try {
          if (token) {
             const payload = JSON.parse(atob(token.split('.')[1]));
             userId = payload.sub;
          }
        } catch (e) {
          console.error("Error decoding token", e);
        }

        // 🔍 Check for duplicate product using Supabase REST API
        try {
          const checkUrl = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/products?user_id=eq.${userId}&name=ilike.${encodeURIComponent(values.name.trim())}&select=id`;
          const checkRes = await fetch(checkUrl, {
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY as string,
              'Authorization': `Bearer ${token}`
            }
          });
          const existingProducts = await checkRes.json();
          if (existingProducts && existingProducts.length > 0) {
            toast.error("You already have a product with this name!");
            return; // Stop execution
          }
        } catch (error) {
          console.error("Duplicate check failed", error);
        }

        const body = {
          user_id: userId,
          name: values.name,
          description: values.description,
          extra_info: values.description,
          unit_price: Number(values.price),
        };

        const response = await addProduct({ body }).unwrap(); // ✅ abhi sahi
        toast.success(response?.message || 'Product created successfully');
        resetForm();
        onClose();
      } catch (err: any) {
        toast.error(err?.data?.detail || err?.data?.message || 'Failed to create product');
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
          {/* ✅ Formik ka handleSubmit directly lagao */}
          <form
            onSubmit={formik.handleSubmit}
            noValidate
            className="bg-white text-black rounded-lg shadow-md w-full max-w-md relative flex flex-col max-h-[90vh] sm:max-h-[calc(100vh-64px)] sm:my-8 overflow-hidden p-0">

            {/* Header */}
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
              <Typography variant="h6" gutterBottom className="text-[#12153A] font-bold text-base sm:text-lg md:text-xl">
                Create Product
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom className="text-xs sm:text-sm">
                Haven't added any product records yet?
              </Typography>
            </div>

            {/* Body */}
            <div className="px-4 sm:px-6 py-4 overflow-y-auto flex-1">
              <div className="mb-3">
                <label className="text-[#12153A] font-bold text-xs sm:text-sm">Product Name</label>
                <input
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Describe the name of product"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                />

                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="text-[#12153A] font-bold text-xs sm:text-sm">Description</label>
                <input
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Describe the product"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                />

              </div>

              <div className="mb-3">
                <label className="text-[#12153A] font-bold text-xs sm:text-sm">Price</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="1"
                  value={formik.values.price}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || Number(value) >= 0) {
                      formik.setFieldValue("price", value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  onBlur={formik.handleBlur}
                  placeholder="Type the price"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                />


                {formik.touched.price && formik.errors.price && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.price}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 pt-3 pb-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-600 hover:text-[#12153A] text-sm sm:text-base w-full sm:w-auto mt-2">
                  Cancel
                </button>
                <button
                  disabled={isLoading}
                  type="submit"
                  className="bg-[#12153A] text-white rounded-full px-4 py-2 w-full sm:w-auto">
                  {isLoading ? <Spinner /> : 'Create new product'}
                </button>
              </div>
            </div>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};

export default FormNewProductModal;
