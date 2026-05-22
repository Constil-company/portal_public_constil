import { Box} from "@mui/material";
// import CloseIcon from '@mui/icons-material/Close'; // Close icon is not in this part of the Figma
import { useNavigate } from "react-router-dom";
import SubscriptionCard from "./subscription-card";
import { useState } from "react";
import { useGetPlans } from "../../../hooks/subscription/use-get-plans";
import Spinner from "../../../components/spinner";
import { useCreateSession } from "../../../hooks/subscription/use-create-session";

import { CheckoutSession } from "../../../models/checkout";
import CheckoutModal from "../../../components/subscription/checkout-modal";

const SubscriptionPage = () => {
    const { data, isLoading } = useGetPlans();
    const { create } = useCreateSession();

    const [isAnual, setIsAnual] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<CheckoutSession | undefined>();
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const navigate = useNavigate();

    const handleSkip = () => {
        navigate('/home');
    }

    // Nova função: ao selecionar um plano, já cria a sessão
    const handleSelectedPlan = async (planData: CheckoutSession) => {
        setCurrentPlan(planData);
        const session = await create(planData.priceId);
        if (session?.clientSecret) {
            setCurrentPlan({
                ...planData,
                sessionId: session.clientSecret
            });
            setCheckoutOpen(true);
        }
    };

    return (
        <Box className="flex flex-col items-center py-16   px-4 bg-[#fafafa] min-h-screen ">
            <div className="w-full max-w-[950px] flex  items-center flex-col text-center mb-12">
                <h1 className="text-3xl font-bold text-[#12153A] mb-3">Choose Your Subscription Plan</h1>
                <p className="text-gray-500 text-lg">Select the plan that best fits your needs and unlock the full potential of the platform.</p>
                <div className="flex justify-center mt-6">
                    <div className="flex bg-[#cccc] rounded-full p-1 gap-2">
                        <button
                            className={`px-6 py-2 rounded-full text-base font-semibold transition-colors duration-200 ${!isAnual ? 'bg-white text-black' : 'text-[#12153A]'}`}
                            onClick={() => setIsAnual(false)}
                        >
                            Monthly
                        </button>
                        <button
                            className={`px-6 py-2 rounded-full text-base font-semibold transition-colors duration-200 ${isAnual ? 'bg-white text-black' : 'text-[#12153A]'}`}
                            onClick={() => setIsAnual(true)}
                        >
                            Yearly
                        </button>
                    </div>
                </div>
            </div>
            
            
            <div className="bg-white rounded-[32px] shadow-[0_8px_32px_0_rgba(44,62,80,0.08)] w-full max-w-[1200px] relative overflow-visible">
                <div className="flex flex-col">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-6 min-h-96">
                            <Spinner className="text-[#F5777F] w-10 h-10" />
                            <span className="text-[#12153A] mt-4">{isLoading ? 'Loading subscription plans...' : 'Processing your subscription...'}</span>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row justify-center gap-4 px-2 pb-6">
                            {data?.data?.map((plan: any) => (
                                <SubscriptionCard
                                    key={plan.id}
                                    plan={plan}
                                    isAnual={isAnual}
                                    isCurrent={currentPlan && currentPlan.planId === plan.id}
                                    onSelectedPlan={handleSelectedPlan}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="text-center mt-8 cursor-pointer" onClick={handleSkip}>
                <span className="text-sm text-gray-600">Not ready yet? </span>
                <span className="text-[#448AFF] text-sm">Skip this step</span>
            </div>
            <CheckoutModal
                session={currentPlan}
                open={checkoutOpen}
                onClose={() => setCheckoutOpen(false)}
            />
        </Box>
    );
}

export default SubscriptionPage;