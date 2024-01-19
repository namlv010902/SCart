export interface IEvaluation {
    _id:string
    customerName: string,
    rate: number,
    content: string,
    productId: string | {
        name: string
    },
    isReview:boolean,
    createdAt:string
}