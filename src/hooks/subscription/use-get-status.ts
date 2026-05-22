import { useMutation } from "@tanstack/react-query";
import { getStatus } from "../../services/api/subscriptions/subscriptions";

export function useGetSubscriptionStatus() {
    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: async (data: string) => await getStatus(data)
    });

    function check(data: string) {
        return mutateAsync(data);
    }

    return {
        check,
        isPending,
        error
    };
}