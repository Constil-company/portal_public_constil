import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/api/user/user";

export function useGetUser() {
    const query = useQuery({
        queryKey: ["getUser"],
        queryFn: () => getCurrentUser(),
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