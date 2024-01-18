import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { IUpload } from '../common/upload';

const uploadAPI = createApi({
    reducerPath: 'upload',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
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