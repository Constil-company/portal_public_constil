import { useQuery } from "@tanstack/react-query";
import { getBillingList } from "../../services/api/subscriptions/subscriptions";

export function useGetBillingList() {
    const query = useQuery({
        queryKey: ["getBillingList"],
        queryFn: () => getBillingList(),
        retry: false,
        refetchOnWindowFocus: false,
        refetchInterval: 15 * 60 * 1000,
    });

    const isLoading = (query.isLoading && !query.data && !query.isError);
    const isError = query.isError || query.data?.data?.length == 0;
    
    return {
        data: query.data,
        isLoading,
        isError: isError,
    };
}