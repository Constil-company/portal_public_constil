import './style.css';
import logoImg from '../../assets/logo/CONSTIL.svg';
import Carousel from '../../components/carrocel/carrocel';
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

const OTP_TIMER_DURATION = parseInt(import.meta.env.VITE_REACT_APP_OTP_TIMER_DURATION || '180', 10);

export function Singup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(OTP_TIMER_DURATION);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Google SignUp Handler
  const handleGoogleSignUp = async (credential: string) => {
    try {
      const response = await axios.post(
        'https://avppbvsxayehguepyjkb.supabase.co/functions/v1/user-api/auth/google',
        {
          id_token: credential,
        }
      );


      // ✅ tokens save
      if (response?.data?.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        dispatch(setToken(response.data.access_token));
        dispatch(setUser(response.data.user));
        toast.success("Google SignUp Successful!");
        navigate("/home");
      }
    } catch (err) {
      console.error("Google login failed", err);
      toast.error("Google SignUp Failed");
    }
  };

  // ⏱ OTP Timer
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

  console.log("Current Signup Step:", currentStep);

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-[#fafafa]">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
        <div className="flex flex-col items-center justify-center bg-[#fafafa] p-4 md:p-8 w-full loginSpace relative">

          <div className="card w-full max-w-md md:w-400 items-center justify-center mt-16 sm:mt-20 md:mt-0 px-6 py-8 md:px-8 md:py-10 border-gray-200 rounded-2xl bg-white border">
            <div className="">
              <img onClick={() => window.open('https://constil.com')} src={logoImg} alt="Logo" className="h-5 w-40  cursor-pointer sm:h-8 md:h-8 " />
            </div>
            {/* ✅ Heading */}
            <h1 className="text-2xl sm:text-2xl mt-6 md:text-3xl text-center mb-6 ">
              {currentStep === 1 && 'Create your account'}
              {currentStep === 2 && 'Verify your email address'}
              {currentStep === 3 && 'Set up your account'}
            </h1>

            {/* Stepper */}
            <div className="w-full flex justify-center mb-6">
              <Stepper
                list={[{ label: 'SignUp' }, { label: 'Verification' }, { label: 'Account' }]}
                activeStep={currentStep === 1 ? 0 : currentStep === 2 ? 1 : 2}
                className="text-xs sm:text-sm md:text-base space-x-1 sm:space-x-2 md:space-x-4 px-2"
              />
            </div>

            {/* Google SignUp - ✅ Only once */}
            {currentStep === 1 && (
              <div className="w-full mb-6">
                <GoogleLogin
                  onSuccess={async (response) => {
                    if (response.credential) await handleGoogleSignUp(response.credential);
                  }}
                  onError={() => toast.error('Oops! Google SignUp Failed')}
                  auto_select={false}
                  width="100%"
                />
              </div>
            )}

            {/* Step Views */}
            <div className="login-form flex flex-col space-y-3 sm:space-y-3 md:space-y-4 mt-4 sm:mt-6 md:mt-10 w-full">
              {currentStep === 1 && (
                <SignUpStep setCurrentStep={setCurrentStep} startTimer={startTimer} />
              )}
              {currentStep === 2 && (
                <EmailVerificationStep
                  timeLeft={timeLeft}
                  isResendDisabled={isResendDisabled}
                  startTimer={startTimer}
                  setCurrentStep={setCurrentStep}
                />
              )}
              {currentStep === 3 && <SingUpAccountStep />}

              <p className="text-center text-sm md:text-base">
                Have an account?{' '}
                <a href="/" className="text-blue-500">
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex img_backgrounds  text-white text-4xl font-bold w-full h-full img_backgrouns relative p-2">
          <Carousel />
        </div>
      </div>
    </div>
  );
}
