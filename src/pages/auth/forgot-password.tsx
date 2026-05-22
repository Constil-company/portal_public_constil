/* eslint-disable @typescript-eslint/no-unused-vars */
import './style.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo/CONSTIL.svg';
import Carousel from '../../components/carrocel/carrocel';
import { toast } from 'react-toastify';
import axios from 'axios';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  // const [forgotPasswordApi] = useForgotPasswordApiMutation();

  interface FormEvent {
    preventDefault: () => void;
  }

  const handleFormSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const response = await axios.post(
          `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/user-api/forgot-password`, 
          { email },
          { headers: { 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY } }
      );
      if (response.status === 200) {
        toast.success('OTP sent successfully to your email.');  
      }
      navigate('/verify-otp', { state: { email } });
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#fafafa]">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
        <div className="flex flex-col items-center justify-center bg-[#fafafa] p-8  w-full loginSpace relative">
          <div className="absolute top-10 left-25">
            <img
              onClick={() => window.open('http://constil.com/')}
              src={logoImg}
              alt="Logo"
              className=" h-5 w-40  cursor-pointer"
            />
          </div>
          <div className="card w-100 items-center justify-center">
            <h1 className="text-3xl mb-4 text-[#12153A]">Forgot password?</h1>
            <p className="text-[#88939D]">Enter the email you use for the account and click Next</p>

            <form onSubmit={handleFormSubmit} className="login-form flex flex-col space-y-4 mt-16">
              <div className="input-group">
                <label htmlFor="email" className="uppercase mb-4">
                  ENTER YOUR EMAIL
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 rounded mt-2 borderInput border-gray-300 focus:border-[#9ED0FF] focus:ring-2 focus:ring-[#9ED0FF] outline-none"
                />
              </div>

              <button type="submit" className="btn_auth text-white p-3 rounded w-full cursor-pointer">
                Next
              </button>
              <p className="text-center text-[#88939D]">If you don’t receive the OTP, please check your spam folder</p>
              <p onClick={() => navigate('/')} className="text-center cursor-pointer underline text-[#88939D]">
                Login here{' '}
              </p>
            </form>
          </div>
        </div>

        <div className="hidden md:flex img_backgrounds items-center justify-center text-white text-4xl font-bold w-full h-full img_backgrouns relative p-2">
          <Carousel />
        </div>
      </div>
    </div>
  );
}
