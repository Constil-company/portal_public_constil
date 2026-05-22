/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { ClientModel } from '../../models/client';
import Spinner from '../spinner';
import './formnewclient.css';
import { useEditClientMutation } from '../../services/rtkapi/clientApi';
import { toast } from 'react-toastify';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface FormEditClienteModalProps {
  open: boolean;
  onClose: () => void;
  clientData?: ClientModel | null;
}

type FormValues = {
  name: string;
  address: string;
  email: string;
  phone: string;
  observation: string;
};

const FormEditClientModal = ({ open, onClose, clientData }: FormEditClienteModalProps) => {
  const [editClient, { isLoading }] = useEditClientMutation();

  const { errors, touched, values, resetForm, handleSubmit, handleChange, handleBlur } = useFormik<FormValues>({
    initialValues: {
      name: clientData?.name || '',
      address: clientData?.address || '',
      email: clientData?.email || '',
      phone: clientData?.phone || '',
      observation: clientData?.observation || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('name is required'),
      address: Yup.string().required('address is required'),
      email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      "Please enter a valid email address"
    ),
      phone: Yup.string().required('phone is required'),
    }),
    onSubmit: async (values) => {
      try {
        const body = {
          name: values.name,
          address: values.address,
          email: values.email,
          phone: values.phone,
          observation: values.observation,
        };
        const response = await editClient({ body, id: clientData?.id }).unwrap();
        resetForm();
        toast.success(response?.message);
        onClose();
      } catch (err: any) {
        toast.error(err?.data?.message);
      }
    },
  });

  return (
    <div
      className={`fixed inset-0 flex z-50 items-center justify-center transition-opacity ${open ? 'opacity-100 visible' : 'opacity-0 invisible'
        } p-4 sm:p-0`}
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="bg-white w-full sm:w-[700px] rounded-lg shadow-lg relative flex flex-col max-h-[90vh] sm:max-h-[calc(100vh-80px)] overflow-hidden sm:m-10">
        <div className="px-6 pt-6 pb-4 relative">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl cursor-pointer z-10"
            onClick={onClose}>
            ×
          </button>
          <div className="mb-0">
            <h2 className="text-xl font-bold mb-2">Edit client</h2>
            <p className="text-gray-600">Haven't added any records to clients yet?</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-4 sm:px-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700">Client Name</label>
                <input
                  className="w-full mt-1 sm:mt-2 px-3 py-2.5 sm:py-3 border border-gray-300 text-[13px] outline-none resize-none rounded-lg focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF]"
                  placeholder="Type the client first name"
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={(e) => {
                    // Remove any non-letter characters
                    const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    handleChange({
                      target: { name: 'name', value: lettersOnly },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  onBlur={handleBlur}
                />

                {touched.name && errors.name && <p className="text-[#f4777f] mt-1.5">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Address</label>
                <input
                  className="w-full mt-1 sm:mt-2 px-3 py-2.5 sm:py-3 border border-gray-300 text-[13px] outline-none resize-none rounded-lg focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF]"
                  placeholder="Type the client address"
                  type="text"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.address && errors.address && <p className="text-[#f4777f] mt-1.5">{errors.address}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Email</label>
                <input
                  className="w-full mt-1 sm:mt-2 px-3 py-2.5 sm:py-3 border border-gray-300 text-[13px] outline-none resize-none rounded-lg focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF]"
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.email && errors.email && <p className="text-[#f4777f] mt-1.5">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Phone</label>
                <div className="relative">
                  <PhoneInput
                    value={values.phone}
                    onChange={(phone) => {
                      handleChange({
                        target: { name: "phone", value: `+${phone}` },
                      } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    onBlur={() => handleBlur({ target: { name: "phone" } })}
                    inputClass="!w-full !text-[13px] !h-[46px] !border !border-gray-300 !rounded-lg !pl-12 !pr-3 !py-20 sm:!py-[12px] !outline-none !focus:ring-2 !focus:ring-[#9ED0FF] !focus:border-[#9ED0FF] !bg-white"
                    buttonClass="!border-none !bg-transparent !pl-3"
                    dropdownClass="!text-sm"
                    containerClass="!w-full !mt-1 sm:!mt-2"
                    placeholder="Enter phone number"
                    enableSearch
                  />
                </div>
                {touched.phone && errors.phone && (
                  <p className="text-[#f4777f] mt-1.5">{errors.phone}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase text-gray-700">Observations</label>
                <textarea
                  value={values.observation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="observation"
                  className="w-full mt-1 sm:mt-2 px-3 py-2.5 sm:py-3 border border-gray-300 text-[13px] outline-none resize-none rounded-lg focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF]"
                  placeholder="Observations"
                  rows={3}></textarea>

              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 pt-3 sm:pt-4 pb-4 sm:pb-6 border-t border-gray-200">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-5 sm:items-center">
              <button
                className="text-gray-500 hover:text-gray-700 text-sm w-full sm:w-auto mt-2 sm:mt-0 py-2 sm:py-0"
                type="button"
                onClick={onClose}>
                Back to the form
              </button>
              <button
                disabled={isLoading}
                type="submit"
                className={`bg-[#12153A] text-white rounded-full transition duration-300 flex items-center justify-center 
               w-full p-2.5 text-sm  sm:w-2xs sm:p-3 cursor-pointer`}>
                {isLoading ? <Spinner /> : 'Edit client'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormEditClientModal;
