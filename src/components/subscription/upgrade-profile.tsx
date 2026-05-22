import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setSubscriptionOpen } from '../../redux/subscriptionSlice';
import SubscriptionModal from './subscription-modal';
// import { CheckoutSession } from '../../models/checkout';
// import CheckoutModal from './checkout-modal';

export default function UpgradeProfile() {
  const dispatch = useDispatch();
  const isSubscriptionOpen = useSelector((state: RootState) => state.subscription.isSubscriptionOpen);

  return (
    <>
      <button
        className="bg-[#12153A] hover:bg-[#1A1E50] text-white text-sm py-3 px-6 rounded-full cursor-pointer transition duration-300"
        onClick={() => dispatch(setSubscriptionOpen(true))}>
        Update Plan
      </button>

      {isSubscriptionOpen && (
        <SubscriptionModal open={isSubscriptionOpen} onClose={() => dispatch(setSubscriptionOpen(false))} />
      )}

      {/* {plan !== undefined && (
        <CheckoutModal session={plan} open={plan !== undefined} onClose={() => setPlan(undefined)} />
      )} */}
    </>
  );
}
