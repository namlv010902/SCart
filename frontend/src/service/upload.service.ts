import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { IUpload } from '../common/upload';
import { baseURL } from '../config/baseURL';
import { baseUrl } from './fetchBaseQuery.service';

const uploadAPI = createApi({
    reducerPath: 'upload',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        credentials: "include"
    }),

    tagTypes: ['upload'],
    endpoints: (builder) => ({
        upload: builder.mutation<{ data: IUpload }, void>({
            query: (body) => ({
                url: '/upload',
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['upload']
        }),
  
})
})

export const { useUploadMutation } = uploadAPI;
export default uploadAPI;