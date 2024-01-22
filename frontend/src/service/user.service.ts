import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser } from '../common/user';
import { baseURL } from '../config/baseURL';
import { baseUrl } from './fetchBaseQuery.service';

const userAPI = createApi({
    reducerPath: 'user',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        credentials:"include"
    }),
    tagTypes: ['user'],
    endpoints: (builder) => ({
        profile: builder.query<{data:IUser},void>({
            query: () => ({
                url: '/profile',
                method: 'GET',
                credentials:"include"
            }),
            providesTags: ['user']
        }),
        
    })
});

export const { useProfileQuery} = userAPI;
export default userAPI;