import React, { useRef, useState } from 'react';
import { verifyEmail, sendSignupOTP } from '../../services/auth-service';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';

export function EmailVerificationStep({ timeLeft, isResendDisabled, startTimer, setCurrentStep }: any) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  // @ts-ignore
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const { values, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      otp: Array(6).fill(''),
    },
    validationSchema: Yup.object({
      otp: Yup.array().of(Yup.string().length(1, 'Only 1 digit').required('Required')).min(6, 'Enter full OTP'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const otpValue = values?.otp?.join('');
        await verifyEmail(user?.email, otpValue);
        
        toast.success("Email verified successfully");
        setCurrentStep(3);
      } catch (err: any) {
        toast.error(err.message || "Invalid or expired code");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleResendClick = async () => {
    try {
      await sendSignupOTP(user?.email);
      toast.success("Verification code resent");
      startTimer();
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    const newOtp = [...values.otp];
    newOtp[index] = value.slice(-1);
    setFieldValue('otp', newOtp);
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !values.otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <p className="text-center text-sm md:text-[14px] text-[#677582AD] mb-4">
          We've sent a 6-digit verification code to your email.
          <br />
          Please enter the code below to continue.
        </p>
        <div className="flex justify-center gap-2 mb-4 mt-[5%]">
          {values?.otp?.map((digit: string, index: number) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-10 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <p className="text-center text-sm md:text-base text-gray-600 mt-[10%]">Haven't received the code? </p>

        <p className="text-center text-sm md:text-base text-gray-600 md:mb-[30%] ">
          <button
            type="button"
            onClick={handleResendClick}
            disabled={isResendDisabled}
            className={`text-blue-500 ${isResendDisabled ? 'cursor-not-allowed opacity-50' : 'hover:underline'}`}>
            Resend it
          </button>
          -{' '}
          {Math.floor(timeLeft / 60)
            .toString()
            .padStart(2, '0')}
          :{('0' + (timeLeft % 60)).slice(-2)}
        </p>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`btn_auth text-white p-2 sm:p-2 md:p-3  rounded-md cursor-pointer flex items-center justify-center text-sm md::text-base w-full ${
              isLoading ? 'cursor-not-allowed opacity-50' : ''
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
              'Verify'
            )}
          </button>
        </div>
      </form>
    </>
  );
}
