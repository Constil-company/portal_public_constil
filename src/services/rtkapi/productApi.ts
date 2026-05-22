import { createAPI } from '../../redux/createAPI';

const productApi = createAPI.injectEndpoints({
  endpoints: (build) => ({
    getProduct: build.query({
      query: ({ from = 0, size = 10 }: any = {}) => ({
         url: `/products?select=*&order=created_at.desc&offset=${from}&limit=${size}`,
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
      providesTags: ['Product'],
    }),
    addProduct: build.mutation({
      query: ({ body }) => {
        return {
          url: `/products`,
          method: 'POST',
          body,
          headers: { 'Prefer': 'return=minimal' },
        };
      },
      invalidatesTags: ['Product'],
    }),
    editProduct: build.mutation({
      query: ({ body, id }) => {
        return {
          url: `/products?id=eq.${id}`,
          method: 'PATCH',
          body,
          headers: { 'Prefer': 'return=minimal' },
        };
      },
      invalidatesTags: ['Product'],
    }),
    deleteProduct: build.mutation({
      query: ({ id }) => {
        return {
          url: `/products?id=eq.${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Product'],
    }),
    getProductById: build.query({
      query: (productId: string | number) =>
        `/products?id=eq.${productId}`,
      transformResponse: (response: any[]) => response[0], // Extract first element
      providesTags: ["Product"],
    }),

  }),
  overrideExisting: true,
});

export const { useGetProductQuery,   useGetProductByIdQuery, 
useAddProductMutation, useEditProductMutation, useDeleteProductMutation } =
  productApi;
