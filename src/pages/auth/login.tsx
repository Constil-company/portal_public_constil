/* eslint-disable @typescript-eslint/no-explicit-any */
import './style.css';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { GoogleLogin } from '@react-oauth/google';
import logoImg from '../../assets/logo/CONSTIL.svg';
import Carousel from '../../components/carrocel/carrocel';
import Spinner from '../../components/spinner';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { loginWithEmailAndPassword, loginWithGoogle } from '../../services/auth-service';
import { setToken, setUser } from '../../redux/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

type LoginFormValues = {
  email: string;
  password: string;
};

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

const handleGoogleSignIn = async (credential: string) => {
  setIsLoading(true);
  try {
    const data = await loginWithGoogle(credential);
    
    // Save tokens for persistence across refreshes
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);

    dispatch(setToken(data.access_token));
    dispatch(setUser(data.user));

    toast.success('Google Login Successful!');
    navigate('/home');
  } catch (error: any) {
    toast.error(error.message || 'Google login failed');
  } finally {
    setIsLoading(false);
  }
};

  // ✅ Formik Config
  const { errors, touched, values, handleSubmit, handleChange, handleBlur } = useFormik<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const data = await loginWithEmailAndPassword(values.email, values.password);
        
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        dispatch(setToken(data.access_token));
        dispatch(setUser(data.user));
        
        toast.success(data.message || 'Login successful');
        navigate('/home');
      } catch (err: any) {
        toast.error(err.message || 'Login failed');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center ds-canvas-light min-h-screen p-4 md:p-0">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full">
        {/* Left Side — transactional light canvas */}
        <div className="flex flex-col items-center justify-center bg-surface-soft-light md:p-8 w-full relative">
          {/* ... */}
          <div className="w-full max-w-md md:w-full ds-surface-card-light p-6 md:p-8 shadow-none">
            <h1 className="text-2xl font-semibold mt-16 text-center text-ink">Login to your account</h1>
            <div className="w-full flex justify-center md:block md:absolute md:top-14 md:left-25 mb-8 md:mb-0 px-4 py-0">
              <img
                onClick={() => window.location.href = 'https://constil.com'}
                src={logoImg}
                alt="Logo"
                className="h-5 mx-4 mt-4 object-cover cursor-pointer"
              />
            </div>

            <div className="mt-4 mb-2 w-full">
              <GoogleLogin
                onSuccess={async (response) => {
                  if (response.credential) {
                    await handleGoogleSignIn(response.credential);
                  }
                }}
                onError={() => toast.error('Oops! Login with Google Failed')}
                auto_select={true}
                width="100%"
              />
            </div>

            {/* ✅ Email/Password Login */}
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-8 md:mt-16 w-full">
              {/* Email */}
              <div>
                <label htmlFor="email" className="uppercase mb-2 block">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="e-mail"
                  className="text-input-on-light"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.email && errors.email && <p className="text-[#f4777f] mt-1.5">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="uppercase mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="text-input-on-light pr-10"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
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

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn_auth text-white p-3 rounded w-full cursor-pointer flex items-center justify-center">
                {isLoading ? <Spinner /> : 'Sign In'}
              </button>

              {/* Links */}
              <p className="text-center">
                Don't have an account?{' '}
                <a href="/signup" className="text-link">
                  Sign up
                </a>
              </p>
              <a href="/forgotpassword" className="text-link text-center block">
                Forgot password
              </a>
            </form>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex img_backgrounds items-center justify-center text-white text-4xl font-bold w-full h-full relative p-2">
          <Carousel />
        </div>
      </div>
    </div>
  );
}
