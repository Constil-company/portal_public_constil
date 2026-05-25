import './style.css';
import Stepper from '../../components/stepper/stepper';
import { SignUpStep } from '../../components/singUp/signUp-step';
import { SingUpAccountStep } from '../../components/singUp/signUp-account-step';
import { EmailVerificationStep } from '../../components/singUp/email-verification-step';
import { GoogleLogin } from '@react-oauth/google';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken, setUser } from '../../redux/authSlice';
import axios from 'axios';
import { AuthPageLayout, AuthPageHeader, AuthDivider } from './auth-layout';

const OTP_TIMER_DURATION = parseInt(import.meta.env.VITE_REACT_APP_OTP_TIMER_DURATION || '180', 10);

const STEP_TITLES: Record<number, string> = {
  1: 'Create your account',
  2: 'Verify your email address',
  3: 'Set up your account',
};

const STEP_SUBTITLES: Record<number, string> = {
  1: 'Sign up with Google or your email.',
  2: 'Enter the code sent to your email.',
  3: 'Complete your profile to finish setup.',
};

export function Singup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(OTP_TIMER_DURATION);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSignUp = async (credential: string) => {
    try {
      const response = await axios.post(
        'https://avppbvsxayehguepyjkb.supabase.co/functions/v1/user-api/auth/google',
        { id_token: credential }
      );

      if (response?.data?.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        dispatch(setToken(response.data.access_token));
        dispatch(setUser(response.data.user));
        toast.success('Google SignUp Successful!');
        navigate('/home');
      }
    } catch (err) {
      console.error('Google login failed', err);
      toast.error('Google SignUp Failed');
    }
  };

  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      setIsResendDisabled(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isTimerActive]);

  const startTimer = () => {
    setTimeLeft(OTP_TIMER_DURATION);
    setIsTimerActive(true);
    setIsResendDisabled(true);
  };

  return (
    <AuthPageLayout compact>
      <AuthPageHeader compact title={STEP_TITLES[currentStep]} subtitle={STEP_SUBTITLES[currentStep]} />

      <div className="w-full flex justify-center mb-3">
        <Stepper
          list={[{ label: 'SignUp' }, { label: 'Verification' }, { label: 'Account' }]}
          activeStep={currentStep === 1 ? 0 : currentStep === 2 ? 1 : 2}
          compact
          className="px-1"
        />
      </div>

      {currentStep === 1 && (
        <>
          <div className="w-full [&>div]:!w-full [&>div]:!max-w-full [&_iframe]:!h-10">
            <GoogleLogin
              onSuccess={async (response) => {
                if (response.credential) await handleGoogleSignUp(response.credential);
              }}
              onError={() => toast.error('Oops! Google SignUp Failed')}
              auto_select={false}
              width="100%"
            />
          </div>
          <AuthDivider compact label="or continue with email" />
        </>
      )}

      <div className="login-form flex flex-col w-full">
        {currentStep === 1 && <SignUpStep setCurrentStep={setCurrentStep} startTimer={startTimer} />}
        {currentStep === 2 && (
          <EmailVerificationStep
            timeLeft={timeLeft}
            isResendDisabled={isResendDisabled}
            startTimer={startTimer}
            setCurrentStep={setCurrentStep}
          />
        )}
        {currentStep === 3 && <SingUpAccountStep />}
      </div>

      <p className="text-center text-xs text-[#88939D] mt-4">
        Have an account?{' '}
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
