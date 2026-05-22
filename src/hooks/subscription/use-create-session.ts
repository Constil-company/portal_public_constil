import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createSession } from "../../services/api/subscriptions/subscriptions";

export function useCreateSession() {
    const { mutateAsync, isPending, data } = useMutation({
        mutationFn: async (priceId: string) => await createSession(priceId),
        onError: () => {
            toast.error("There was an unexpected error, please try again!");
        }
    });

    function create(priceId: string) {
        return mutateAsync(priceId);
    }

    return {
        create,
        data,
        isPending
    };
}