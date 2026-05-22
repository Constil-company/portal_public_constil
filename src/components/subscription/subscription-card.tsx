/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CheckCircle2Icon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { SubscriptionPlanDto } from '../../api/subscription';
import { CheckoutSession } from '../../models/checkout';

type SubscriptionCardProps = {
  plan: SubscriptionPlanDto;
  isCurrent?: boolean;
  isSelected?: boolean;
  
  setCurrentPlan?: (data: CheckoutSession) => void;
};

const SubscriptionCard = ({ plan, isCurrent, isSelected, setCurrentPlan }: SubscriptionCardProps) => {
  function getPlanName(planId: any): string {
    switch (planId) {
      case 1:
        return 'FREE TRIAL';
      case 2:
        return 'BASIC';
      case 3:
        return 'PROFESSIONAL';
      case 4:
        return 'ENTERPRISE';
      default:
        return 'UNKNOWN PLAN';
    }
  }

  // @ts-ignore
  const billingOptions = plan?.billingOptions[0];

  return (
    <div
      className={twMerge(
        'flex flex-col items-center border rounded-lg pb-4 overflow-hidden transition-all duration-200 hover:shadow-md w-full sm:w-[260px]',
        isCurrent
          ? 'border-[#34A853] ring-2 ring-[#34A853]/50'
          : isSelected
          ? 'border-[#448AFF] ring-2 ring-[#448AFF]/50'
          : 'border-[#E0E0E0]'
      )}
    >
      {/* Header */}
      <div className="flex flex-col w-full gap-1 bg-[#12153A] p-3 relative">
        <span className="text-white uppercase">{getPlanName(plan?.name)}</span>
       

        <div className="relative ">
          <p>
            <span className="text-xl font-bold text-[#448AFF] uppercase">
              {billingOptions?.price} {billingOptions?.currency}
            </span>
            <span className="text-sm text-[#677582] ml-2">/ {billingOptions?.interval}</span>
          </p>
           
             <span className="text-white uppercase text-xs">{plan?.monthly_tokens}</span>

          {plan?.recommended && (
            <span className="absolute right-1 top-12 bg-[#448AFF] text-sm text-white px-3 py-1 rounded-lg">
              Most Popular
            </span>
          )}
        </div>

        {isCurrent && (
          <span className="absolute right-3 top-2 bg-[#34A853] text-xs text-white px-2 py-1 rounded">
            Active Plan
          </span>
        )}
      </div>

      {/* Features */}
      <div className="flex-1 flex flex-col gap-1 w-full max-h-[260px] max-w-[264px] mt-1 mb-4 overflow-y-auto">
        {plan?.features?.map((feature, index) => (
          <span key={index} className="flex items-center gap-1 w-full bg-[#F4F5F6] text-sm p-3">
            <CheckCircle2Icon className="text-[#34A853] h-[15px]" />- {feature}
          </span>
        ))}
      </div>

      <button
        type="button"
        // @ts-ignore
        onClick={() => setCurrentPlan && setCurrentPlan(plan)}
        disabled={isCurrent}
        className={twMerge(
          'w-[80%] text-white text-sm py-3 px-6 rounded-lg cursor-pointer transition duration-300',
          isCurrent
            ? 'bg-gray-400 cursor-not-allowed'
            : isSelected
            ? 'bg-[#448AFF] hover:bg-[#448AFF]/90'
            : 'bg-[#12153A] hover:bg-[#12153A]/80'
        )}
      >
        {isCurrent ? 'CURRENT PLAN' : isSelected ? 'SELECTED' : 'SELECT PLAN'}
      </button>
    </div>
  );
};



export default SubscriptionCard;
