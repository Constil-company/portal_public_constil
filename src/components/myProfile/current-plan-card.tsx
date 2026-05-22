import { useCancelSubscription } from "../../hooks/subscription/use-cancel-subscription";
import { useGetCurrentPlan } from "../../hooks/subscription/use-get-current-plan";
import { SkeletonLoader } from "../common/skeleton-loader";
import Spinner from "../spinner";

export const CurrentPlanCard = () => {
    const { data, isLoading, isError } = useGetCurrentPlan();
    const { cancel, isPending } = useCancelSubscription();

    return (
        isLoading ? (
            <div className="bg-white rounded-lg w-full">
                <SkeletonLoader lines={6} />
            </div>
        ) : (
            !isError &&
            <div className="flex flex-col border border-[#EBE9E9] rounded-[18px] py-5 px-6">
                <div className="flex items-center justify-between text-[13px] border-b border-[#EBE9E9] pb-4">
                    <span className="uppercase font-semibold text-[#12153A]">
                        SUBSCRIPTION
                    </span>
                </div>

                <span className="font-thin text-lg mt-6">
                    Plan: {data?.planName}
                </span>
                <p className="text-sm text-[#8A8A8A]">
                    Take your business to the next level with more features.
                </p>

                <div className="flex items-center justify-between mt-2">
                    <span className="text-lg text-[#0B6DFF]">
                        ${data?.price} / {data?.billingPeriod}
                    </span>

                    <div className="flex gap-4">
                        <button onClick={cancel} disabled={isPending} className="flex items-center gap-2 py-2 px-4 text-[#C95D5D] border border-[#C95D5D] rounded-[10px] hover:bg-[#C95D5D] hover:text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                            {isPending && <Spinner className="w-4 h-4" />}
                            Cancel
                        </button>

                        <button className="py-2 px-4 border border-[#EDEDED] rounded-[10px] hover:bg-[#EDEDED] cursor-pointer">
                            Upgrade Plan
                        </button>
                    </div>
                </div>
            </div>
        )
    );
}