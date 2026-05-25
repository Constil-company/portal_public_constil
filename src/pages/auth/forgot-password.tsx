/* eslint-disable @typescript-eslint/no-unused-vars */
import './style.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  AuthPageLayout,
  AuthPageHeader,
  AUTH_INPUT_CLASS,
  AUTH_LABEL_CLASS,
} from './auth-layout';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  interface FormEvent {
    preventDefault: () => void;
  }

  const handleFormSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/user-api/forgot-password`,
        { email },
        { headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY } }
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
    <AuthPageLayout>
      <AuthPageHeader
        title="Forgot password?"
        subtitle="Enter the email you use for your account and we'll send you a verification code."
      />

      <form onSubmit={handleFormSubmit} className="login-form flex flex-col gap-5 w-full">
        <div className="input-group">
          <label htmlFor="email" className={AUTH_LABEL_CLASS}>
            E-mail
          </label>
          <input
            type="email"
            id="email"
            placeholder="e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={AUTH_INPUT_CLASS}
          />
        </div>

        <button type="submit" className="btn_auth text-white p-3 rounded w-full cursor-pointer mt-1">
          Next
        </button>

        <p className="text-center text-sm text-[#88939D]">
          If you don&apos;t receive the OTP, please check your spam folder.
        </p>
      </form>

      <p className="text-center text-[#88939D] mt-6">
        Remember your password?{' '}
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
