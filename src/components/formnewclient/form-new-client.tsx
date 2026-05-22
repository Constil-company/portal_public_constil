/* eslint-disable @typescript-eslint/no-explicit-any */

import Spinner from '../spinner';
import './formnewclient.css';
import { useAddClientMutation } from '../../services/rtkapi/clientApi';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { Backdrop, Box, Fade, IconButton, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface FormnewClienteModalProps {
  open: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'Only letters are allowed')
    .required('Client name is required'),
  address: Yup.string().required('Address is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  observation: Yup.string(),
});

const FormNewClienteModal = ({ open, onClose }: FormnewClienteModalProps) => {
  const [addClient, { isLoading }] = useAddClientMutation();

  const initialValues = {
    name: '',
    address: '',
    email: '',
    phone: '',
    observation: '',
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
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

      // 🔍 Check for duplicate client using Supabase REST API
      try {
        const checkUrl = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/clients?user_id=eq.${userId}&name=ilike.${encodeURIComponent(values.name.trim())}&select=id`;
        const checkRes = await fetch(checkUrl, {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY as string,
            'Authorization': `Bearer ${token}`
          }
        });
        const existingClients = await checkRes.json();
        if (existingClients && existingClients.length > 0) {
          toast.error("You already have a client with this name!");
          return; // Stop execution
        }
      } catch (error) {
        console.error("Duplicate client check failed", error);
      }

      const body = {
        user_id: userId,
        name: values.name,
        address: values.address,
        email: values.email,
        phone: values.phone,
        observation: values.observation,
      };

      const response = await addClient(body).unwrap();
      toast.success(response?.message || 'Client created successfully');

      resetForm();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.detail || err?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 400,
        style: { backgroundColor: 'rgba(0,0,0,0.6)' },
      }}>
      <Fade in={open}>
        <Box className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white w-full sm:max-w-[700px] rounded-lg shadow-lg max-h-[90vh] overflow-hidden flex flex-col relative">
            {/* Header */}
            <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-gray-200 relative">
              <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                <CloseIcon />
              </IconButton>

              <Typography variant="h6" className="font-bold">
                Create client
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Haven't added any records to clients yet?
              </Typography>
            </div>

            {/* Form */}
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ values, setFieldValue }) => (
                <Form className="flex flex-col flex-1">
                  <div className="px-4 sm:px-6 py-4 overflow-y-auto flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="text-xs font-semibold text-gray-700">Client Name</label>
                        <Field
                          name="name"
                          type="text"
                          className="w-full mt-2 px-3 py-2.5 border border-gray-300 rounded-lg"
                          placeholder="Type client name"
                        />
                        <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      {/* Address */}
                      <div>
                        <label className="text-xs font-semibold text-gray-700">Address</label>
                        <Field
                          name="address"
                          type="text"
                          className="w-full mt-2 px-3 py-2.5 border border-gray-300 rounded-lg"
                          placeholder="Client address"
                        />
                        <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-xs font-semibold text-gray-700">Email</label>
                        <Field
                          name="email"
                          type="email"
                          className="w-full mt-2 px-3 py-2.5 border border-gray-300 rounded-lg"
                          placeholder="Email"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="text-xs font-semibold text-gray-700">Phone</label>

                        <PhoneInput
                          country="us" 
                          onlyCountries={['us']} 
                          // disableDropdown
                          value={values.phone}
                          onChange={(phone) => setFieldValue('phone', phone)}
                          inputClass="!w-full !h-[46px] !text-sm !border !rounded-lg !border-gray-300 !pl-11 !pr-3"
                          buttonClass="!border !border-gray-300 !bg-white"
                          containerClass="!mt-2"
                        />

                        <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                      </div>

                      {/* Observation */}
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-gray-700">Observations</label>
                        <Field
                          as="textarea"
                          name="observation"
                          rows={3}
                          className="w-full mt-2 px-3 py-2.5 border border-gray-300 rounded-lg"
                          placeholder="Observations"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-4">
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm">
                      Back to the form
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#12153A] text-white rounded-full flex items-center justify-center px-6 py-2.5 text-sm">
                      {isLoading ? <Spinner /> : 'Create new client'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default FormNewClienteModal;
