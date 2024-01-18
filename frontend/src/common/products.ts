export interface IProduct {
    _id: string,
    name: string,
    price: number,
    image: string,
    quantity: number,
    desc: string,
    outStanding: boolean,
    categoryId: {
        name: string
    },
    discount: number,
    isRate:boolean
}