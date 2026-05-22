import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { cancelSubscription } from "../../services/api/subscriptions/subscriptions";

export function useCancelSubscription() {
    const { mutate, isPending, data } = useMutation({
        mutationFn: async () => await cancelSubscription(),
        onError: () => {
            toast.error("There was an unexpected error, please try again!");
        }
    });

    function cancel() {
        return mutate();
    }

    return {
        cancel,
        data,
        isPending
    };
}