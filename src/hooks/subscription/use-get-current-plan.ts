import { useQuery } from "@tanstack/react-query";
import { getCurrentPlan } from "../../services/api/subscriptions/subscriptions";

export function useGetCurrentPlan() {
    const query = useQuery({
        queryKey: ["getCurrentPlan"],
        queryFn: () => getCurrentPlan(),
        retry: false,
        refetchOnWindowFocus: false,
        refetchInterval: 15 * 60 * 1000,
    });

    const isLoading = (query.isLoading && !query.data && !query.isError);
    const isError = query.isError;
    
    return {
        data: query.data,
        isLoading,
        isError: isError,
    };
}