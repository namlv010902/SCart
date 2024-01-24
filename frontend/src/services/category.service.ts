import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ICategory } from '../common/category';

import { baseUrl } from './fetchBaseQuery.service';

const categoryAPI = createApi({
    reducerPath: 'categories',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        credentials: "include"
    }),
    tagTypes: ['categories'],
    endpoints: (builder) => ({
        getAllCategory: builder.query<{ data: { docs: ICategory[] } }, void>({
            query: () => ({
                url: '/categories',
                method: 'GET',
            }),
            providesTags: ['categories']
        }),
        getCategoryById: builder.mutation({
            query: (id) => ({
                url: '/categories/' + id,
                method: 'GET',
            }),
            invalidatesTags: ['categories']
        }),
        createCategory: builder.mutation({
            query: (body) => ({
                url: '/categories/',
                method: 'POST',
                body
            }),
            invalidatesTags: ['categories']
        }),
        updateCategory: builder.mutation({
            query: (arg: { _id: string, data: ICategory }) => ({
                url: '/categories/' + arg._id,
                method: 'PATCH',
                body: arg.data
            }),
            invalidatesTags: ['categories']
        }),
        removeCategory: builder.mutation({
            query: (id) => ({
                url: '/categories/' + id,
                method: 'DELETE',

            }),
            invalidatesTags: ['categories']
        })

    })
});

export const {
    useGetAllCategoryQuery,
    useGetCategoryByIdMutation,
    useCreateCategoryMutation,
    useRemoveCategoryMutation,
    useUpdateCategoryMutation

} = categoryAPI;
export default categoryAPI;