import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

type CheckoutProps = {
  clientSecret: string;
};
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;
const stripePromise = loadStripe(stripePublicKey, {});

const CheckoutPaymentStep = ({ clientSecret }: CheckoutProps) => {
  const options = { clientSecret };

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <div className="max-h-[650px] overflow-y-auto">
        <EmbeddedCheckout />
      </div>
    </EmbeddedCheckoutProvider>
  );
};

export default CheckoutPaymentStep;
