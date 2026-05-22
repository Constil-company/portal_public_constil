/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import SubscriptionIcon from '../../assets/image/subscription-icon.png';
import { useGetSubscriptionStatus } from '../../hooks/subscription/use-get-status';
import { CheckPaymentStatusResponseStatusEnum } from '../../api/subscription';
import Spinner from '../../components/spinner';
import { Link } from 'react-router-dom';

export function SubscriptionStatus() {
  const { check, isPending, error } = useGetSubscriptionStatus();
  const [status, setStatus] = useState<CheckPaymentStatusResponseStatusEnum>();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
    check(sessionId as string).then((result) => {
      if (result) setStatus(result.status);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-8 pb-8">
      {isPending ? (
        <div className="flex flex-col items-center justify-center p-6 min-h-96">
          <Spinner className="text-[#F5777F] w-10 h-10" />
          <span className="text-[#12153A] mt-4">Loading subscription...</span>
        </div>
      ) : error || status !== 'complete' ? (
        <>
          <img src={SubscriptionIcon} alt="" width={250} draggable="false" className="pointer-events-none" />
          <h2 className="text-lg font-medium">Oops, something went wrong!</h2>
          <Link
            to={'/home'}
            className="flex justify-center mt-8 bg-[#12153A] hover:bg-[#1A1E50] text-white text-sm py-3 px-8 w-full max-w-[300px] rounded-full cursor-pointer transition duration-300">
            Back to home
          </Link>
        </>
      ) : (
        <>
          <img src={SubscriptionIcon} alt="" width={250} draggable="false" className="pointer-events-none" />
          <h2 className="text-lg font-medium">Congratulations!</h2>
          <p className="text-sm text-center text-[#74758A]">
            Your upgrade was successful, enjoy the best we have to offer
          </p>
          <Link
            to={'/user/subscriptions'}
            className="flex justify-center mt-8 bg-[#12153A] hover:bg-[#1A1E50] text-white text-sm py-3 px-8 w-full max-w-[300px] rounded-full cursor-pointer transition duration-300">
            Enjoy my plan
          </Link>
        </>
      )}
    </div>
  );
}

