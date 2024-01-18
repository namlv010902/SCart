import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IOder } from '../common/order';
import { ICart } from '../common/cart';

const cartAPI = createApi({
    reducerPath: 'cart',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
        credentials: "include"
    }),
    tagTypes: ['cart'],
    endpoints: (builder) => ({
        addToCart: builder.mutation<{ data: ICart }, void>({
            query: (body) => ({
                url: '/cart',
                method: 'POST',
                body: body,
                credentials: "include"
            }),
            invalidatesTags: ['cart']
        }),
        getCart: builder.query<{body:{data: ICart}  }, void>({
            query: () => ({
                url: '/cart',
                method: 'GET',
                credentials: "include"
            }),
            providesTags: ['cart']
        }),
        updateCart: builder.mutation<{ data: ICart }, void>({
            query: (body) => ({
                url: '/cart',
                method: 'PATCH',
                body,
                credentials: "include"
            }),
            invalidatesTags: ['cart']
        }),
        removeProductInCart: builder.mutation<{ data: ICart }, void>({
            query: (body) => ({
                url: '/cart',
                method: 'DELETE',
                body:body,
                credentials: "include"
            }),
            invalidatesTags: ['cart']
        }),

    })
});

export const { 
    useAddToCartMutation,
    useGetCartQuery,
    useUpdateCartMutation ,
    useRemoveProductInCartMutation
} = cartAPI;
export default cartAPI;