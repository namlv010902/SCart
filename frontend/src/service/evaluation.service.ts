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
        getAllEvaluation: builder.query<{data:{docs:IEvaluation[]}},void>({
            query: () => ({
                url: '/evaluation/',
                method: 'GET',
            }),
            providesTags: ['evaluation']
        }),
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
        updateReview: builder.mutation({
            query: (arg:{id:string,isReview:boolean}) => ({
                url: '/evaluation/'+arg.id,
                method: 'PATCH',
                body:{ isReview:arg.isReview}
            }),
            invalidatesTags: ['evaluation']
        }),
    
    })
});

export const {
   useCreateEvaluationMutation,
   useGetEvaluationByIdProductQuery,
   useGetAllEvaluationQuery,
   useUpdateReviewMutation

} = evaluationAPI;
export default evaluationAPI;