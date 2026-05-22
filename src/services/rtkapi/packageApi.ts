import { createAPI } from '../../redux/createAPI';

const packageApi = createAPI.injectEndpoints({
  endpoints: (build) => ({
    getPackages: build.query({
      query: () => `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/user-api/packages`,
    }),
    checkSubscriptionStatus: build.query({
      query: () => `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/user-api/subscription`,
    }),
    packageBuy: build.mutation({
      query: (body) => {
        return {
          url: `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/user-api/create-checkout`,
          method: 'POST',
          body,
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPackagesQuery,
  usePackageBuyMutation,
  useLazyCheckSubscriptionStatusQuery,
} = packageApi;
