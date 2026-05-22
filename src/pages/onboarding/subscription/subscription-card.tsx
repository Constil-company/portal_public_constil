import { CheckCircle2Icon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { SubscriptionPlanDto } from '../../../api/subscription';
import { SubscriptionInterval } from '../../../enums/subscription-Interval';
import { useMemo } from 'react';
import { CheckoutSession } from '../../../models/checkout';

type SubscriptionCardProps = {
    plan: SubscriptionPlanDto;
    isAnual?: boolean;
    isCurrent?: boolean;
    onSelectedPlan?: (data: CheckoutSession) => void;
};

const SubscriptionCard = ({ plan, isAnual, isCurrent, onSelectedPlan }: SubscriptionCardProps) => {
    const selectedPrice = useMemo(() => {
        const interval = isAnual ? SubscriptionInterval.YEARLY : SubscriptionInterval.MONTHLY;
        const priceOption = plan.billingOptions?.find(price => price.interval === interval);
        return priceOption ?? plan.billingOptions?.[0];
    }, [plan, isAnual]);

    const handleSelectedPlan = () => {
        if (onSelectedPlan && selectedPrice) {
            onSelectedPlan({
                planId: plan.id!,
                priceId: selectedPrice.priceId!,
                price: selectedPrice.price!,
                currency: selectedPrice.currency!,
                interval: selectedPrice.interval!,
                planName: plan.name!,
                sessionId: "",
            });
        }
    };

    const isRecommended = plan.recommended;
    const cardStyles = twMerge(
        "flex flex-col w-full max-w-[340px] min-w-[260px] min-h-[500px] rounded-[28px] pb-8 overflow-hidden transition-all duration-300 border",
        isCurrent ? "border-[#448AFF]" : "border-transparent",
        isRecommended
            ? "bg-[#448AFF] border-[10px] mt-[-1.5%] border-[#A3C3FF] shadow-[0_8px_32px_0_rgba(68,138,255,0.15)] scale-105 relative z-10 pt-12 sm:border-[10px] border-[5px] sm:mt-[-1.5%] mt-0 sm:scale-105 scale-100 sm:pt-12 pt-8"
            : "bg-white pt-8",
    );

    const planNameStyles = twMerge(
        "text-lg font-bold mb-2 text-left sm:text-lg text-base",
        isRecommended ? "text-white" : "text-[#12153A]"
    );

    const priceRowStyles = "flex items-end mb-6";
    const priceStyles = twMerge(
        "text-4xl font-extrabold leading-none tracking-tight text-left sm:text-4xl text-3xl",
        isRecommended ? "text-white" : "text-[#12153A]"
    );
    const intervalStyles = twMerge(
        "text-lg font-medium ml-2 align-bottom text-left sm:text-lg text-base",
        isRecommended ? "text-[#E0E7FF]" : "text-[#B0B7C3]"
    );

    const featureRowStyles = "flex items-center py-2 last:border-b-0 border-b border-transparent";
    const featureIconStyles = twMerge(
        "h-4 w-4 mr-2 flex-shrink-0 sm:h-4 sm:w-4 h-3 w-3",
        "text-[#A3C3FF]"
    );
    const featureTextStyles = twMerge(
        "text-base sm:text-base text-sm",
        "text-[#283457]"
    );

    return (
        <div className={cardStyles}>
            {isRecommended && (
                <span className="absolute top-5 right-8 bg-[#EAF2FF] text-xs text-[#283457] py-1 rounded-full font-bold border-0 uppercase tracking-wide z-20 sm:text-xs text-[10px] sm:px-4 px-2">
                    Most Popular
                </span>
            )}
            <div className="relative  sm:px-8 px-4 pb-0">
                <div className={planNameStyles}>{plan.name}</div>
                <div className={priceRowStyles}>
                    <span className={priceStyles}>${selectedPrice?.price}</span>
                    <span className={intervalStyles}>/ {selectedPrice?.interval === SubscriptionInterval.MONTHLY ? "Month" : "Year"}</span>
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-0 w-full mb-10  sm:px-8 px-4 overflow-y-auto max-h-[320px] scrollbar-hide">
                {plan.features?.map((feature, index) => (
                    <div key={index} className={featureRowStyles}>
                        <CheckCircle2Icon className={featureIconStyles} />
                        <span className={featureTextStyles}>{feature}</span>
                    </div>
                ))}
            </div>
            <div className="sm:px-8 px-4 w-full mb-6">
                <button
                    onClick={() => handleSelectedPlan()}
                    className={`w-full text-md py-2 rounded-[12px] transition duration-200 cursor-pointer sm:text-md text-sm
                        ${isRecommended
                            ? 'bg-white text-[#448AFF] hover:bg-[#EAF2FF]'
                            : 'bg-[#448AFF] text-white hover:bg-[#3566c6]'}
                        border-none shadow-none`}
                >
                    Choose Plan
                </button>
            </div>
        </div>
    );
}

export default SubscriptionCard;