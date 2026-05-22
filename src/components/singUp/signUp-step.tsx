/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import { sendSignupOTP } from '../../services/auth-service';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/authSlice';

type OtpFormValues = {
  name: string;
  last_name: string;
  company_name: string;
  email: string;
  password: string;
  confirm_password: string;
};

export const SignUpStep = ({ setCurrentStep, startTimer }: any) => {
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const [isLoading, setIsLoading] = useState(false);

  const { errors, touched, values, handleSubmit, handleChange, handleBlur } = useFormik<OtpFormValues>({
    initialValues: {
      name: '',
      last_name: '',
      company_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('First Name is required'),
      last_name: Yup.string().required('Last Name is required'),
      company_name: Yup.string().required('Company Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await sendSignupOTP(values.email);
        
        // Store all details in Redux for phase 3 (registration)
        dispatch(setUser({
            email: values.email,
            password: values.password,
            name: values.name,
            last_name: values.last_name,
            full_name: `${values.name} ${values.last_name}`,
            company_name: values.company_name
        }));

        toast.success("Verification code sent to your email");
        setCurrentStep(2);
        startTimer();
      } catch (err: any) {
        toast.error(err.message || "Failed to send OTP");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <div className="google-login-button"></div>
      <form onSubmit={handleSubmit} className="login-form flex flex-col space-y-4 mt-5">
        <div className="input-group">
          <label htmlFor="email" className="uppercase mb-2">
            First Name
          </label>
          <input
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            id="name"
            placeholder="First Name"
            className="w-full p-3 rounded  borderInput border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none"
          />
          {touched.name && errors.name && <p className="text-[#f4777f] mt-1.5">{errors.name}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="last_name" className="uppercase mb-2">
            Last Name
          </label>
          <input
            value={values.last_name}
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            id="last_name"
            placeholder="Last Name"
            className="w-full p-3 rounded  borderInput border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none"
          />
          {touched.last_name && errors.last_name && <p className="text-[#f4777f] mt-1.5">{errors.last_name}</p>}
        </div>
        {/* <div className="input-group">
          <label htmlFor="coupon_code" className="uppercase mb-2">
            Coupon Code
          </label>
          <input
            value={values.coupon_code}
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            id="coupon_code"
            placeholder="Coupon Code"
            className="w-full p-3 rounded  borderInput border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none"
          />
        </div> */}
        <div className="input-group">
          <label htmlFor="email" className="uppercase mb-2">
            Company Name
          </label>
          <input
            value={values.company_name}
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            id="company_name"
            placeholder="Company Name"
            className="w-full p-3 rounded  borderInput border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none"
          />
          {touched.company_name && errors.company_name && (
            <p className="text-[#f4777f] mt-1.5">{errors.company_name}</p>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="email" className="uppercase mb-2">
            E-mail
          </label>
          <input
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            type="email"
            id="email"
            placeholder="e-mail"
            className="w-full p-3 rounded  borderInput border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none"
          />
          {touched.email && errors.email && <p className="text-[#f4777f] mt-1.5">{errors.email}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="password" className="uppercase mb-2">
            Password
          </label>
          <div className="relative">
            <input
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Password"
              className="w-full p-3 rounded borderInput border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none pr-10"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {touched.password && errors.password && <p className="text-[#f4777f] mt-1.5">{errors.password}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="confirm_password" className="uppercase mb-2">
            Confirm Password
          </label>

          <input
            value={values.confirm_password}
            onChange={handleChange}
            onBlur={handleBlur}
            type={showPassword ? 'text' : 'password'}
            id="confirm_password"
            placeholder="Confirm Password"
            className="w-full p-3 rounded borderInput border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none"
          />

          {touched.confirm_password && errors.confirm_password && (
            <p className="text-[#f4777f] mt-1.5">{errors.confirm_password}</p>
          )}
        </div>


        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`btn_auth text-white p-2 sm:p-2 md:p-3  rounded-md cursor-pointer flex items-center justify-center text-sm md::text-base w-full ${isLoading ? 'cursor-not-allowed opacity-50' : ''
              }`}>
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-2a6 6 0 00-12 0H4z"></path>
              </svg>
            ) : (
              'Next'
            )}
          </button>
        </div>
      </form>
    </>
  );
};
