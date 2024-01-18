
interface IProductInCart {
    _id: string,
    name: string,
    price: number,
    quantity: number
}
export interface ICart {
    userId: any,
    products: IProductInCart[],
    totalPrice: number
}