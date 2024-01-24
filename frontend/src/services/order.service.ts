import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IOder } from '../common/order';
import { baseUrl } from './fetchBaseQuery.service';

const orderAPI = createApi({
    reducerPath: 'order',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        credentials: "include"
    }),
    tagTypes: ['order'],
    endpoints: (builder) => ({
        getAllOrders: builder.query<{ data: { docs: IOder[] } }, void>({
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
        getOrderForMember: builder.query<{ data:{docs: IOder[] }}, void>({
            query: () => ({
                url: '/orderMember',
                method: 'GET',
            }),
            providesTags: ['order']
        }),
        searchInvoiceId: builder.mutation<{ data:{docs: IOder[] }},void>({
            query: (id) => ({
                url: '/orderMember/?_invoiceId='+id,
                method: 'GET',
            }),
            invalidatesTags: ['order']
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
            query: (arg: { _id: string, data: IOder }) => ({
                url: '/orders/' + arg._id,
                method: 'PATCH',
                body: arg.data
            }),
            invalidatesTags: ['order']
        }),
        filterOrderForMember: builder.mutation({
            query: (status) => ({
                url: '/orders-member/' + status,
                method: 'GET',

            }),
            invalidatesTags: ['order']
        }),
        confirmOrder: builder.mutation({
            query: (id) => ({
                url: '/orders-confirm/' + id,
                method: 'GET',

            }),
            invalidatesTags: ['order']
        }),
        findOneOrder: builder.mutation({
            query: (id) => ({
                url: '/order/' + id,
                method: 'GET',

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
    useUpdateOrderMutation,
    useFilterOrderForMemberMutation,
    useSearchInvoiceIdMutation,
    useConfirmOrderMutation,
    useFindOneOrderMutation
} = orderAPI;
export default orderAPI;