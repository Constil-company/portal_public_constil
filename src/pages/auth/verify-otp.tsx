/* eslint-disable @typescript-eslint/no-unused-vars */
import './style.css';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  AuthPageLayout,
  AuthPageHeader,
  AUTH_INPUT_CLASS,
  AUTH_LABEL_CLASS,
} from './auth-layout';

export function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState('');

  interface FormEvent {
    preventDefault: () => void;
  }

  const handleFormSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/user-api/auth/verify-otp`,
        { email, otp },
        { headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY } }
      );
      navigate('/resetpassword', { state: { email, otp } });
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  return (
    <AuthPageLayout>
      <AuthPageHeader
        title="Verify OTP"
        subtitle="Enter the OTP sent to your email to continue."
      />

      <form onSubmit={handleFormSubmit} className="login-form flex flex-col gap-5 w-full">
        <div className="input-group">
          <label htmlFor="otp" className={AUTH_LABEL_CLASS}>
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className={AUTH_INPUT_CLASS}
          />
        </div>

        <button type="submit" className="btn_auth text-white p-3 rounded w-full cursor-pointer mt-1">
          Verify
        </button>

        <p className="text-center text-sm text-[#88939D]">
          Didn&apos;t receive OTP? Check your spam folder.
        </p>
      </form>

      <p className="text-center text-[#88939D] mt-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="underline hover:text-[#12153A] cursor-pointer"
        >
          Login here
        </button>
      </p>
    </AuthPageLayout>
  );
}
