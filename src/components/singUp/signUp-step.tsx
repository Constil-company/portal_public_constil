/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import { sendSignupOTP } from '../../services/auth-service';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/authSlice';
import { AUTH_INPUT_CLASS, AUTH_INPUT_ICON_CLASS, AUTH_LABEL_CLASS } from '../../pages/auth/auth-layout';

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

        dispatch(
          setUser({
            email: values.email,
            password: values.password,
            name: values.name,
            last_name: values.last_name,
            full_name: `${values.name} ${values.last_name}`,
            company_name: values.company_name,
          })
        );

        toast.success('Verification code sent to your email');
        setCurrentStep(2);
        startTimer();
      } catch (err: any) {
        toast.error(err.message || 'Failed to send OTP');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const errorClass = 'text-[#f4777f] text-xs mt-0.5';

  return (
    <form onSubmit={handleSubmit} className="login-form flex flex-col gap-2.5 w-full">
      <div className="grid grid-cols-2 gap-2.5">
        <div className="input-group">
          <label htmlFor="name" className={AUTH_LABEL_CLASS}>
            First Name
          </label>
          <input
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            id="name"
            name="name"
            placeholder="First Name"
            className={AUTH_INPUT_CLASS}
          />
          {touched.name && errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="last_name" className={AUTH_LABEL_CLASS}>
            Last Name
          </label>
          <input
            value={values.last_name}
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            id="last_name"
            name="last_name"
            placeholder="Last Name"
            className={AUTH_INPUT_CLASS}
          />
          {touched.last_name && errors.last_name && <p className={errorClass}>{errors.last_name}</p>}
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="company_name" className={AUTH_LABEL_CLASS}>
          Company Name
        </label>
        <input
          value={values.company_name}
          onChange={handleChange}
          onBlur={handleBlur}
          type="text"
          id="company_name"
          name="company_name"
          placeholder="Company Name"
          className={AUTH_INPUT_CLASS}
        />
        {touched.company_name && errors.company_name && <p className={errorClass}>{errors.company_name}</p>}
      </div>

      <div className="input-group">
        <label htmlFor="email" className={AUTH_LABEL_CLASS}>
          E-mail
        </label>
        <input
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          type="email"
          id="email"
          name="email"
          placeholder="e-mail"
          className={AUTH_INPUT_CLASS}
        />
        {touched.email && errors.email && <p className={errorClass}>{errors.email}</p>}
      </div>

      <div className="input-group">
        <label htmlFor="password" className={AUTH_LABEL_CLASS}>
          Password
        </label>
        <div className="relative">
          <input
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="Password"
            className={AUTH_INPUT_ICON_CLASS}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {touched.password && errors.password && <p className={errorClass}>{errors.password}</p>}
      </div>

      <div className="input-group">
        <label htmlFor="confirm_password" className={AUTH_LABEL_CLASS}>
          Confirm Password
        </label>
        <input
          value={values.confirm_password}
          onChange={handleChange}
          onBlur={handleBlur}
          type={showPassword ? 'text' : 'password'}
          id="confirm_password"
          name="confirm_password"
          placeholder="Confirm Password"
          className={AUTH_INPUT_CLASS}
        />
        {touched.confirm_password && errors.confirm_password && (
          <p className={errorClass}>{errors.confirm_password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`btn_auth text-white py-2 text-sm rounded w-full cursor-pointer flex items-center justify-center mt-0.5 ${
          isLoading ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-2a6 6 0 00-12 0H4z" />
          </svg>
        ) : (
          'Next'
        )}
      </button>
    </form>
  );
};
