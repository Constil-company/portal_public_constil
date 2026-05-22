import { createAPI } from '../../redux/createAPI';

const clientApi = createAPI.injectEndpoints({
  endpoints: (build) => ({
    getClient: build.query({
      query: () => `/clients?is_deleted=eq.false&select=*&order=created_at.desc`,
      transformResponse: (response: any[]) => ({ data: response }),
      providesTags: ['Client'],
    }),
    getClientsPaginated: build.query<any, { from: number; size: number }>({
      query: ({ from, size }) => ({
         url: `/clients?is_deleted=eq.false&select=*&order=created_at.desc&offset=${from}&limit=${size}`,
         headers: { 'Prefer': 'count=exact' }
      }),
      transformResponse: (response: any[], meta: any) => {
         const contentRange = meta?.response?.headers.get('content-range');
         let totalItems = response?.length || 0;
         if (contentRange) {
            const parts = contentRange.split('/');
            if (parts.length > 1 && !isNaN(Number(parts[1]))) {
               totalItems = parseInt(parts[1], 10);
            }
         }
         return {
            data: response,
            pagination: { totalItems }
         };
      },
      providesTags: (result) => (result ? [{ type: 'Client', id: 'LIST' }] : [{ type: 'Client', id: 'LIST' }]),
    }),
    addClient: build.mutation({
      query: (body) => ({
        url: `/clients`,
        method: 'POST',
        body: body,
        headers: { 'Prefer': 'return=minimal' },
      }),
      invalidatesTags: ['Client'],
    }),
    editClient: build.mutation({
      query: ({ body, id }) => {
        return {
          url: `/clients?id=eq.${id}`,
          method: 'PATCH',
          body: body,
          headers: { 'Prefer': 'return=minimal' },
        };
      },
      invalidatesTags: ['Client'],
    }),
    deleteClient: build.mutation({
      query: ({ id }) => {
        const token = localStorage.getItem('access_token');
        let userIdFilter = '';
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userIdFilter = `&user_id=eq.${payload.sub}`;
          } catch (e) {
            console.error("Error decoding token for deleteClient", e);
          }
        }
        return {
          url: `/clients?id=eq.${id}${userIdFilter}`,
          method: 'PATCH',
          body: { is_deleted: true },
          headers: { 'Prefer': 'return=minimal' },
        };
      },
      invalidatesTags: ['Client'],
    }),
  }),
  overrideExisting: true,
});

export const { useGetClientQuery, useGetClientsPaginatedQuery, useAddClientMutation, useEditClientMutation, useDeleteClientMutation } = clientApi;

