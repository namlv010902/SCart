import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IProduct } from '../common/products';

const productAPI = createApi({
   reducerPath: 'products',
   baseQuery: fetchBaseQuery({
      baseUrl: 'http://localhost:8080/api',
      credentials: "include"
   }),
   tagTypes: ['products'],
   endpoints: (builder) => ({
      getAllProduct: builder.query<{ data: { docs: IProduct[] } }, void>({
         query: () => ({
            url: '/products',
            method: 'GET',
         }),
         providesTags: ['products']
      }),
      getNewProduct: builder.query<{ data: { docs: IProduct[] } }, void>({
         query: () => ({
            url: '/products/?_limit=8',
            method: 'GET',
         }),
         providesTags: ['products']
      }),
      getProductById: builder.query({
         query: (id) => ({
            url: '/products/' + id,
            method: 'GET',
         }),
         providesTags: ['products']
      }),
      getProductSale: builder.query<{ data: { docs: IProduct[] } }, void>({
         query: () => ({
            url: '/products/?_isSale=true&_limit=2',
            method: 'GET',
         }),
         providesTags: ['products']
      }),
      getRelatedProduct: builder.query({
         query: (id) => ({
            url: '/products/?_categoryId=' + id + '&_limit=4',
            method: 'GET',
         }),
         providesTags: ['products']
      }),
      getProductOutStanding: builder.query<{ data: { docs: IProduct[] } }, void>({
         query: () => ({
            url: '/products/?_outStanding=true&_limit=4',
            method: 'GET',
         }),
         providesTags: ['products']
      }),
      searchProduct: builder.mutation<any, string>({
         query: (value) => ({
            url: '/products/?_q=' + value,
            method: 'GET',
         }),
         invalidatesTags: ['products']
      }),
      sortProduct: builder.mutation<any, string>({
         query: (value) => ({
            url: '/products/?_sort=price&_order=' + value,
            method: 'GET',
         }),
         invalidatesTags: ['products']
      }),
      filterPrice: builder.mutation<any, void>({
         query: (value: any) => ({
            url: '/products/?_minPrice=' + value[0] + '&_maxPrice=' + value[1],
            method: 'GET',
         }),
         invalidatesTags: ['products']
      }),
      createProduct: builder.mutation<any, void>({
         query: (body) => ({
            url: '/products',
            method: 'POST',
            body
         }),
         invalidatesTags: ['products']
      }),
      updateProduct: builder.mutation({
         query: (arg: { _id: string, data: IProduct }) => ({
            url: '/products/' + arg._id,
            method: 'PATCH',
            body: arg.data
         }),
         invalidatesTags: ['products']
      }),
      removeProduct: builder.mutation({
         query: (id) => ({
            url: '/products/' + id,
            method: 'DELETE',

         }),
         invalidatesTags: ['products']
      }),
      getOneProduct: builder.mutation({
         query: (id) => ({
            url: '/products/' + id,
            method: 'GET',

         }),
         invalidatesTags: ['products']
      }),
   })
});

export const {
   useGetAllProductQuery,
   useGetProductByIdQuery,
   useGetRelatedProductQuery,
   useSearchProductMutation,
   useGetProductOutStandingQuery,
   useSortProductMutation,
   useFilterPriceMutation,
   useGetNewProductQuery,
   useGetProductSaleQuery,
   useCreateProductMutation,
   useRemoveProductMutation,
   useGetOneProductMutation,
   useUpdateProductMutation,
   
} = productAPI;
export default productAPI;