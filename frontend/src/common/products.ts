export interface IProduct {
    _id: string,
    name: string,
    price: number,
    images: [{
        url:string
    }],
    quantity: number,
    desc: string,
    outStanding: boolean,
    categoryId: {
        name: string
    },
    discount: number,
    isRate:boolean
}