/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../components/spinner';

const API_BASE = 'https://avppbvsxayehguepyjkb.supabase.co/functions/v1/user-api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const hasVerified = useRef(false);

  const accessToken = localStorage.getItem('access_token');
  const sessionId = searchParams.get('session_id');
  const flow = searchParams.get('flow');
  const isTrial = flow === 'trial';

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    if (!sessionId) {
      setStatus('error');
      setErrorMsg('No session ID found in URL.');
      return;
    }

    // Wait 2 seconds before first call to let Stripe session settle
    setTimeout(() => {
      verifyWithRetry(sessionId, 1);
    }, 2000);
  }, []);

  const verifyWithRetry = async (sid: string, attempt: number) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 3000;

    setStatus('verifying');
    try {
      const endpoint = isTrial ? '/verify-trial' : '/verify-payment';
      console.log(`📡 Attempt ${attempt}/${MAX_RETRIES}: Calling POST ${endpoint}`);

      const res = await axios.post(
        `${API_BASE}${endpoint}`,
        { session_id: sid },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      console.log('✅ Response:', JSON.stringify(res.data, null, 2));

      const data = res.data;
      const isSuccess =
        data.success === true ||
        data.subscription_active === true ||
        data.status === 'trial_activated' ||
        data.credits_added > 0 ||
        data.amount_paid > 0 ||
        (res.status === 200 && !data.error);

      if (isSuccess) {
        setStatus('success');
        setResult(data);
      } else if (attempt < MAX_RETRIES) {
        console.log(`⏳ Retrying in ${RETRY_DELAY / 1000}s...`);
        setTimeout(() => verifyWithRetry(sid, attempt + 1), RETRY_DELAY);
      } else {
        setStatus('error');
        setErrorMsg(data.error || data.message || 'Verification unsuccessful after retries.');
      }
    } catch (err: any) {
      console.error(`❌ Attempt ${attempt} error:`, err?.response?.data || err.message);

      if (attempt < MAX_RETRIES) {
        console.log(`⏳ Retrying in ${RETRY_DELAY / 1000}s...`);
        setTimeout(() => verifyWithRetry(sid, attempt + 1), RETRY_DELAY);
      } else {
        const apiError = err?.response?.data?.error;
        const httpStatus = err?.response?.status;
        let msg = 'Payment verification failed.';
        if (apiError) msg = apiError;
        else if (httpStatus === 401) msg = 'Session expired. Please log in again.';
        else if (httpStatus === 404) msg = 'Verify endpoint not found.';
        setStatus('error');
        setErrorMsg(msg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F4FF] to-[#E8EDFF] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center">
        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-6">
            <Spinner className="w-16 h-16 text-[#448AFF]" />
            <h2 className="text-2xl font-bold text-[#1A1F3D]">Verifying Your Payment...</h2>
            <p className="text-gray-500">Please wait while we confirm your subscription.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#1A1F3D]">Payment Successful!</h2>
            <p className="text-gray-500">Your subscription has been activated.</p>

            {result && (
              <div className="w-full mt-4 p-4 bg-gray-50 rounded-xl text-left space-y-2">
                {result.credits_added != null && result.credits_added > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Credits Added:</span>
                    <span className="font-bold text-[#1A1F3D]">{result.credits_added}</span>
                  </div>
                )}
                {result.amount_paid != null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amount Paid:</span>
                    <span className="font-bold text-green-600">${result.amount_paid} USD</span>
                  </div>
                )}
                {result.trial_end && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Trial Period Ends:</span>
                    <span className="font-bold text-blue-600">{new Date(result.trial_end).toLocaleDateString()}</span>
                  </div>
                )}
                {result.trial_days && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-bold text-blue-600">{result.trial_days} Days</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-bold text-[#448AFF]">
                    {result.status === 'trial_activated' ? 'Trial Activated ✓' : result.subscription_active ? 'Active ✓' : 'Success ✓'}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate('/home')}
              className="mt-4 bg-[#1A1F3D] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2A2F4D] transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#1A1F3D]">Payment Verification Issue</h2>
            <p className="text-gray-500 text-sm">{errorMsg}</p>

            {sessionId && (
              <div className="w-full mt-2 p-3 bg-gray-50 rounded-lg text-left">
                <p className="text-xs text-gray-400 break-all">Session: {sessionId}</p>
              </div>
            )}

            <div className="flex gap-3 mt-2">
              {sessionId && (
                <button
                  onClick={() => verifyWithRetry(sessionId, 1)}
                  className="bg-[#448AFF] text-white px-6 py-3 rounded-full font-bold hover:bg-[#336dcc] transition-all"
                >
                  Retry Verification
                </button>
              )}
              <button
                onClick={() => navigate('/home')}
                className="bg-[#1A1F3D] text-white px-6 py-3 rounded-full font-bold hover:bg-[#2A2F4D] transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
