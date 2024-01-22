import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser } from '../common/user';

import { baseUrl } from './fetchBaseQuery.service';

const authAPI = createApi({
    reducerPath: 'auth',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        credentials: "include"
    }),

    tagTypes: ['auth'],
    endpoints: (builder) => ({
        register: builder.mutation<{ data: IUser }, void>({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['auth']
        }),
        login: builder.mutation<{ data: IUser }, void>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['auth']

        }),
        getToken: builder.query<{data:IUser}, void>({
            query: () => ({
                url: '/profile',
                method: 'GET',
                credentials: "include"
            }),
            providesTags: ['auth']
        }),
        logOut: builder.mutation<{data:IUser}, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'DELETE',
                credentials: "include"
            }),
            invalidatesTags: ['auth']
        }),
    })
});

export const { useRegisterMutation, useLoginMutation, useGetTokenQuery,useLogOutMutation } = authAPI;
export default authAPI;