import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IOder } from '../common/order';

const orderAPI = createApi({
    reducerPath: 'order',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
        credentials: "include"
    }),
    tagTypes: ['order'],
    endpoints: (builder) => ({
        getAllOrders: builder.query<{data:{docs:IOder[]}},void>({
            query: () => ({
                url: '/orders/',
                method: 'GET',
            }),
            providesTags: ['order']
        }),
        createOrder: builder.mutation<{ data: IOder }, void>({
            query: (body) => ({
                url: '/order',
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['order']
        }),
        getOrderForMember: builder.query<{ data: IOder[] }, void>({
            query: () => ({
                url: '/orderMember',
                method: 'GET',
            }),
            providesTags: ['order']
        }),
        detailOrder: builder.query({
            query: (id: string) => ({
                url: '/orders/' + id,
                method: 'GET',
            }),
            providesTags: ['order']
        }),

        cancelledOrder: builder.mutation({
            query: (id: string) => ({
                url: '/orders/' + id,
                method: 'DELETE',
            }),
            invalidatesTags: ['order']
        }),
        updateOrder: builder.mutation({
            query: (arg:{_id: string,data:IOder }) => ({
                url: '/orders/' + arg._id,
                method: 'PATCH',
                body:arg.data
            }),
            invalidatesTags: ['order']
        }),
    })
});

export const {
    useCreateOrderMutation,
    useGetOrderForMemberQuery,
    useDetailOrderQuery,
    useCancelledOrderMutation,
    useGetAllOrdersQuery,
    useUpdateOrderMutation
} = orderAPI;
export default orderAPI;