import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ICategory } from '../common/category';
import { IEvaluation } from '../common/evaluation';

const evaluationAPI = createApi({
    reducerPath: 'evaluation',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
        credentials: "include"
    }),
    tagTypes: ['evaluation'],
    endpoints: (builder) => ({
        getEvaluationByIdProduct: builder.query<{data:IEvaluation},void>({
            query: (id) => ({
                url: '/evaluationByIdProduct/'+id,
                method: 'GET',
            }),
            providesTags: ['evaluation']
        }),
        createEvaluation: builder.mutation({
            query: (body) => ({
                url: '/evaluation',
                method: 'POST',
                body
            }),
            invalidatesTags: ['evaluation']
        }),
    
        

    })
});

export const {
   useCreateEvaluationMutation,
   useGetEvaluationByIdProductQuery

} = evaluationAPI;
export default evaluationAPI;